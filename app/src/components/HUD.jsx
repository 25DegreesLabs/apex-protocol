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

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useDB } from '../db/index.jsx'
import { getDay } from '../hooks/useApexPlaybook.js'
import ExerciseBlock from './ExerciseBlock.jsx'

// ─── Day selector options (7-day week) ───────────────────────────────────────
const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7]

// ─── Payload builder ──────────────────────────────────────────────────────────
/**
 * buildApexPayload — constructs the apex_session envelope ready for the webhook.
 *
 * Output conforms exactly to the Outbound Logging Payload Contract in schema-spec.md.
 * Each rows[] entry maps to one row in the WorkoutLog Google Sheet.
 *
 * WorkoutLog column mapping:
 *   Date            → meta.date
 *   Block           → meta.blockId
 *   Day             → meta.dayNumber
 *   ExercisePlanId  → exercise.exerciseId
 *   ExerciseName    → exercise.exerciseName
 *   Target          → exercise.target
 *   SupersetLabel   → exercise.supersetLabel
 *   PrescribedSets  → exercise.prescribedSets
 *   PrescribedReps  → exercise.prescribedReps
 *   PrescribedRpe   → exercise.prescribedRpe
 *   SetNumber       → set.setNumber
 *   Load (kg)       → set.load
 *   RepsCompleted   → set.reps
 *   RpeLogged       → set.rpe
 *   Notes           → meta.notes (repeated on each row)
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
            focus: activeSession.focus,
            notes
        },
        rows
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
        logSession
    } = useDB()

    const { blockId, dayNumber, focus, notes, exercises } = activeSession

    // ── Warmup display (read from plan, not session state) ────────────────────
    const dayPlan = getDay(blockId, dayNumber)
    const warmup = dayPlan?.warmup ?? []
    const isRestDay = !dayPlan || !Array.isArray(dayPlan.exercises) || dayPlan.exercises.length === 0

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
            alert('This is a rest day — nothing to log.')
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
    }, [activeSession, isRestDay, exercises, notes, focus, blockId, dayNumber, logSession])

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
                <div className="selector-row">
                    <div className="selector-group">
                        <label>Day</label>
                        <select value={dayNumber} onChange={e => handleDayChange(e.target.value)}>
                            {DAY_OPTIONS.map(d => (
                                <option key={d} value={d}>Day {d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="selector-group">
                        <label>Block</label>
                        <select value={blockId} disabled>
                            <option value="phase1">Phase 1</option>
                        </select>
                    </div>
                </div>

                {/* ── Focus label ──────────────────────────────────── */}
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

                {/* ── Rest day notice ──────────────────────────────── */}
                {isRestDay && (
                    <div className="card" style={{ textAlign: 'center', padding: 28 }}>
                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>😴</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>
                            {dayPlan?.focus ?? 'Rest Day'}
                        </div>
                        <div style={{ color: 'var(--dim)', fontSize: '0.85rem' }}>
                            No exercises scheduled. Take the recovery seriously.
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
                {!isRestDay && (
                    <div className="actions-bar">
                        <button className="btn-primary" onClick={handleLog}>▶ LOG SESSION</button>
                        <button className="btn-secondary" onClick={handleReset}>↺ RESET HUD</button>
                    </div>
                )}
            </main>
        </div>
    )
}
