/**
 * HUD.jsx — APEX PROTOCOL Main Workout Screen
 *
 * Renders the full workout HUD:
 *  - Block + Day selector
 *  - Session focus label
 *  - Warmup display
 *  - Exercise cards (dynamically rendered from activeSession.exercises[])
 *  - Session notes
 *  - Log Session + Reset actions
 *
 * Data contract: spreadsheet/schema-spec.md
 * State: activeSession in DBProvider (db/index.jsx)
 * Plan data: useApexPlaybook → plan-phase1.json
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { db, useDB } from '../db/index.jsx'
import { getDay } from '../hooks/useApexPlaybook.js'
import ExerciseBlock from './ExerciseBlock.jsx'

// ─── Day selector options (7-day week) ───────────────────────────────────────
const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7]

// ─── Payload builders ────────────────────────────────────────────────────────
/**
 * buildApexPayload — constructs the apex_session envelope for a TRAINING day.
 *
 * sessionType is 'training' and is included in both meta and every row.
 * Existing one-row-per-set model is preserved exactly.
 */
function buildApexPayload(activeSession) {
    const { blockId, dayNumber, date, notes, exercises } = activeSession

    const sessionId = `${date}-${blockId}-d${dayNumber}-${Date.now()}`

    const rows = []

    for (const exercise of exercises) {
        for (const set of exercise.sets) {
            rows.push({
                date,
                block: blockId,
                day: dayNumber,
                sessionType: 'training',
                exercisePlanId: exercise.exerciseId,
                exerciseName: exercise.exerciseName,
                target: exercise.target,
                supersetLabel: exercise.supersetLabel ?? '',
                prescribedSets: exercise.prescribedSets,
                prescribedReps: exercise.prescribedReps,
                prescribedRpe: exercise.prescribedRpe,
                setNumber: set.setNumber,
                load: set.load !== '' ? Number(set.load) : '',
                repsCompleted: set.reps !== '' ? Number(set.reps) : '',
                rpeLogged: set.rpe !== '' ? Number(set.rpe) : '',
                notes
            })
        }
    }

    return {
        type: 'apex_session',
        version: '1',
        meta: {
            sessionId,
            date,
            blockId,
            dayNumber,
            sessionType: 'training',
            focus: activeSession.focus,
            notes
        },
        rows
    }
}

/**
 * buildRestPayload — constructs the apex_session envelope for a REST or RECOVERY day.
 *
 * Emits exactly ONE meta-only row with no exercise/set/load/reps data.
 * sessionType is 'rest' or 'recovery' as determined by the plan.
 */
function buildRestPayload(activeSession, sessionType) {
    const { blockId, dayNumber, date, notes } = activeSession
    const sessionId = `${date}-${blockId}-d${dayNumber}-${Date.now()}`

    return {
        type: 'apex_session',
        version: '1',
        meta: {
            sessionId,
            date,
            blockId,
            dayNumber,
            sessionType,            // 'rest' | 'recovery'
            focus: activeSession.focus ?? '',
            notes
        },
        rows: [
            {
                date,
                block: blockId,
                day: dayNumber,
                sessionType,
                exercisePlanId: null,
                exerciseName: null,
                target: null,
                supersetLabel: null,
                prescribedSets: null,
                prescribedReps: null,
                prescribedRpe: null,
                setNumber: null,
                load: null,
                repsCompleted: null,
                rpeLogged: null,
                notes
            }
        ]
    }
}

// ─── Scroll restoration Y ─────────────────────────────────────────────────────
let _savedScrollY = 0

// ─── HUD component ────────────────────────────────────────────────────────────
export default function HUD() {
    const {
        appName, appSubtitle,
        currentBlock,
        activeSession,
        selectDay,
        updateSet,
        updateNotes,
        resetActiveSession,
        pendingSync,
        sessionCount,
        logSession
    } = useDB()

    const { blockId, dayNumber, focus, notes, exercises } = activeSession

    // ── Warmup display (read from plan, not session state) ────────────────────
    const dayPlan = getDay(blockId, dayNumber)
    const warmup = dayPlan?.warmup ?? []
    const dayType = dayPlan?.dayType ?? 'training'
    const isRest = dayType === 'rest'
    const isRecovery = dayType === 'recovery'
    const isRestDay = isRest || isRecovery  // kept for guard clauses below

    // ── Scroll restoration ────────────────────────────────────────────────────
    const scrollRef = useRef(_savedScrollY)

    useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    scrollRef.current = window.scrollY
                    _savedScrollY = window.scrollY
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useLayoutEffect(() => {
        if (_savedScrollY > 0) {
            window.scrollTo(0, _savedScrollY)
        }
    }, [])

    // ── Progress summary ──────────────────────────────────────────────────────
    const [progressSummary, setProgressSummary] = useState({ week: "Week 1 / 8", action: "Start on Day 1" })

    useEffect(() => {
        async function loadProgress() {
            try {
                const count = sessionCount[blockId] || 0
                if (count === 0) {
                    setProgressSummary({ week: "Week 1 / 8", action: "Start on Day 1" })
                    return
                }
                const weekNumber = Math.ceil(count / 4)
                const lastSession = await db.sessions.orderBy('id').reverse().limit(1).first()
                
                if (lastSession) {
                    let nextDay = lastSession.dayNumber + 1
                    if (nextDay > 7) nextDay = 1
                    
                    setProgressSummary({ week: `Week ${weekNumber} / 8`, action: `Next: Day ${nextDay}` })
                }
            } catch (err) {
                console.error(err)
            }
        }
        loadProgress()
    }, [blockId, sessionCount])

    // ── Sets completeness ─────────────────────────────────────────────────────
    let totalPlannedSets = 0
    let loggedSets = 0
    if (!isRestDay && exercises) {
        for (const ex of exercises) {
            totalPlannedSets += ex.prescribedSets || 0
            for (const set of ex.sets) {
                if (set.load !== '' || set.reps !== '' || set.rpe !== '') {
                    loggedSets += 1
                }
            }
        }
    }

    // ── Day change ────────────────────────────────────────────────────────────
    const handleDayChange = useCallback((newDay) => {
        selectDay(blockId, Number(newDay))
        _savedScrollY = 0
        window.scrollTo(0, 0)
    }, [blockId, selectDay])

    // ── Reset ─────────────────────────────────────────────────────────────────
    const handleReset = useCallback(() => {
        if (!confirm('Clear all inputs for this session? Day is kept.')) return
        resetActiveSession()
    }, [resetActiveSession])

    // ── Log ───────────────────────────────────────────────────────────────────
    const handleLog = useCallback(async () => {
        if (isRestDay) {
            // Rest/recovery days emit a single meta-only row
            const sessionType = dayType  // 'rest' | 'recovery'
            const payload = buildRestPayload(activeSession, sessionType)
            await logSession(payload)
            const label = sessionType === 'recovery' ? 'Recovery day' : 'Rest day'
            alert(`✅ ${label} logged!\nDay ${dayNumber} confirmed.`)
            return
        }

        const hasAnyData = exercises.some(ex =>
            ex.sets.some(s => s.load !== '' || s.reps !== '' || s.rpe !== '')
        )
        if (!hasAnyData && !notes.trim()) {
            alert('Nothing to log yet — fill in at least one set.')
            return
        }

        const payload = buildApexPayload(activeSession)
        await logSession(payload)
        alert(`✅ Session logged!\nDay ${dayNumber} — ${focus || blockId}\n${payload.rows.length} set(s) sent to Google Sheets.`)
    }, [activeSession, isRestDay, dayType, exercises, notes, focus, blockId, dayNumber, logSession])

    // ─── Group exercises by superset for display ──────────────────────────────
    // Exercises with the same non-null supersetLabel are shown as a group.
    // Standalone exercises (null/empty) render as individual cards.
    const renderExercises = () => {
        if (!exercises || exercises.length === 0) return null

        const rendered = []
        const seen = new Set()

        for (let i = 0; i < exercises.length; i++) {
            const ex = exercises[i]
            const label = ex.supersetLabel

            if (!label) {
                // Standalone exercise
                rendered.push(
                    <ExerciseBlock
                        key={ex.exerciseId}
                        exercise={ex}
                        onSetChange={updateSet}
                    />
                )
            } else {
                if (seen.has(label)) continue
                seen.add(label)

                // Collect all exercises sharing this supersetLabel
                const group = exercises.filter(e => e.supersetLabel === label)

                rendered.push(
                    <div key={`superset-${label}`} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <div style={{
                            background: 'rgba(99,179,237,0.08)',
                            borderLeft: '3px solid var(--primary)',
                            padding: '6px 14px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--primary)'
                        }}>
                            ⚡ Superset {label.replace(/\d/, '')} — Perform back-to-back
                        </div>
                        {group.map(groupEx => (
                            <ExerciseBlock
                                key={groupEx.exerciseId}
                                exercise={groupEx}
                                onSetChange={updateSet}
                            />
                        ))}
                    </div>
                )
            }
        }

        return rendered
    }

    return (
        <div className="app">
            {/* ── Header ──────────────────────────────────────────── */}
            <header className="page-header">
                <h1>🏋️ {appName}</h1>
                <div className="subtitle">{appSubtitle}</div>
            </header>

            <main className="content">
                {/* ── Day selector ────────────────────────────────── */}
                <div className="selector-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {/* Primary Control */}
                    <div className="selector-group">
                        <label style={{ color: 'var(--primary)' }}>Step 1 · Day</label>
                        <select 
                            value={dayNumber} 
                            onChange={e => handleDayChange(e.target.value)}
                            style={{
                                borderColor: 'var(--primary)',
                                background: 'rgba(0, 255, 102, 0.05)',
                                color: 'var(--text)',
                                fontWeight: 700,
                                boxShadow: '0 0 10px rgba(0, 255, 102, 0.05)'
                            }}
                        >
                            {DAY_OPTIONS.map(d => (
                                <option key={d} value={d}>Day {d}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Secondary Control */}
                    <div className="selector-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                            <label style={{ marginBottom: 0, color: 'var(--dim)' }}>Block</label>
                            <span style={{ fontSize: '0.6rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔒 Active</span>
                        </div>
                        <select 
                            value={blockId} 
                            disabled
                            style={{
                                borderColor: 'var(--divider)',
                                color: 'var(--dim)',
                                background: 'transparent',
                                opacity: 0.8
                            }}
                        >
                            <option value="phase1">Phase 1</option>
                        </select>
                    </div>

                    {/* ── Progress Summary ───────────────────────────── */}
                    <div style={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        marginTop: 4
                    }}>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--dim)',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}>
                            {progressSummary.week}
                        </span>
                        
                        <span style={{
                            background: 'rgba(0, 255, 102, 0.1)',
                            border: '1px solid var(--primary)',
                            color: 'var(--primary)',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                        }}>
                            ▶ {progressSummary.action}
                        </span>
                    </div>
                </div>

                {/* ── Focus label (training days only) ─────────────── */}
                {focus && !isRestDay && (
                    <div style={{
                        textAlign: 'center',
                        margin: '8px 0',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        letterSpacing: '0.5px'
                    }}>
                        🔥 {focus}
                    </div>
                )}

                {/* ── Descanso completo ─────────────────────────────── */}
                {isRest && (
                    <div className="card" style={{ padding: '20px 18px 22px 18px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 6, textAlign: 'center' }}>🛌</div>
                        <div style={{
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            textAlign: 'center',
                            marginBottom: 12,
                            color: 'var(--text)'
                        }}>
                            Rest Day
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'var(--dim)',
                            lineHeight: 1.6
                        }}>
                            <p style={{ margin: '0 0 8px 0' }}>
                                Recover right. That’s the work today.
                            </p>
                            <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div>→ Walk 20–30 min if the body wants it.</div>
                                <div>→ Stretch the muscles you hit.</div>
                                <div>→ Hydrate. Sleep hard.</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Recuperación activa ───────────────────────────── */}
                {isRecovery && (
                    <div className="card" style={{ padding: '20px 18px 22px 18px' }}>
                        <div style={{
                            fontWeight: 800,
                            fontSize: '1.2rem',
                            textAlign: 'center',
                            marginBottom: 16,
                            color: 'var(--text)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Move. Recover. Stay ready.
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: 'var(--text)',
                            lineHeight: 1.7,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                borderRadius: 8,
                                padding: '14px 16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            }}>
                                <div>🥾 Walk 45–60 min.</div>
                                <div>🏀 Play something. Basketball, swim, football, MMA.</div>
                                <div>🧘‍♂️ Do 20–30 min mobility.</div>
                                <div>🏃‍♂️ Easy run.</div>
                                <div>🧘‍♀️ Active meditation.</div>
                            </div>
                            <div style={{
                                fontSize: '0.85rem',
                                color: 'var(--dim)',
                                textAlign: 'center',
                                marginTop: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <div style={{ fontWeight: 700, color: 'var(--text)' }}>💧 Hydrate. 😴 Sleep hard. 🔄 Reset.</div>
                                <div style={{ fontStyle: 'italic', opacity: 0.8 }}>Goal: keep the body moving without draining it.</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Warmup ───────────────────────────────────────── */}
                {!isRestDay && warmup.length > 0 && (
                    <div className="card">
                        <div className="section-header blue">🌡️ Warm-Up</div>
                        <div style={{ padding: '8px 14px 14px 14px' }}>
                            {warmup.map((item, i) => (
                                <div key={i} style={{
                                    padding: '5px 0',
                                    borderBottom: i < warmup.length - 1 ? '1px solid var(--divider)' : 'none',
                                    fontSize: '0.88rem',
                                    color: 'var(--dim)'
                                }}>
                                    → {item}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Exercises ─────────────────────────────────────── */}
                {!isRestDay && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="section-header red">💪 Exercises</div>
                        {renderExercises()}
                    </div>
                )}

                {/* ── Session notes ─────────────────────────────────── */}
                {!isRestDay && (
                    <div className="card">
                        <div className="section-header amber">📝 Session Notes</div>
                        <div style={{ padding: '8px 14px 14px 14px' }}>
                            <textarea
                                placeholder="How did the session feel? Any PRs, injuries, adjustments…"
                                value={notes}
                                onChange={e => updateNotes(e.target.value)}
                                style={{
                                    width: '100%',
                                    minHeight: 80,
                                    background: 'var(--bg)',
                                    color: 'var(--text)',
                                    border: '1px solid var(--divider)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: 10,
                                    fontSize: '0.9rem',
                                    resize: 'vertical',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Pending sync indicator ───────────────────────── */}
                {pendingSync > 0 && (
                    <div className="sync-indicator">
                        ⏳ {pendingSync} session{pendingSync > 1 ? 's' : ''} pending sync to Google Sheets
                    </div>
                )}

                {/* ── Actions ──────────────────────────────────────── */}
                {isRestDay ? (
                    <div className="actions-bar">
                        <button className="btn-primary" onClick={handleLog}>
                            ✔ CONFIRM DAY DONE
                        </button>
                    </div>
                ) : (
                    <div className="actions-bar">
                        <div style={{
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            color: loggedSets >= totalPlannedSets && totalPlannedSets > 0 ? 'var(--green)' : 'var(--dim)',
                            marginBottom: 12,
                            fontWeight: 600,
                            letterSpacing: '0.02em'
                        }}>
                            {loggedSets} / {totalPlannedSets} sets completados
                        </div>
                        <button className="btn-primary" onClick={handleLog}>▶ LOG SESSION</button>
                        <button className="btn-secondary" onClick={handleReset}>↺ RESET HUD</button>
                    </div>
                )}
            </main>
        </div>
    )
}
