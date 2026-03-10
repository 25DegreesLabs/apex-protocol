/**
 * StrengthBlock.jsx
 * Renders the 💪 STRENGTH + PAP SUPERSETS section.
 * Dynamically renders 3 or 4 exercise cards depending on what the playbook has.
 * Each exercise has 4 set rows (load + reps) and a PAP checkbox row.
 */
import { useHistory } from '../hooks/useHistory.js'

function SetRow({ exIdx, setNum, sets, onSetChange, playbookKey }) {
    const key = `ex${exIdx + 1}-s${setNum}`
    const entry = sets[key] || {}
    const { lastKg, lastReps } = useHistory(playbookKey, setNum)

    return (
        <div className="str-set-row">
            <span className="str-set-label">Set {setNum}</span>
            <div>
                <input
                    type="number"
                    inputMode="decimal"
                    placeholder="kg"
                    min="0"
                    step="0.5"
                    value={entry.kg ?? ''}
                    onChange={e => onSetChange(key, 'kg', e.target.value)}
                    aria-label={`Exercise ${exIdx + 1} set ${setNum} weight in kg`}
                />
                {lastKg && (
                    <div className="history-badge">Last: {lastKg}kg</div>
                )}
            </div>
            <div>
                <input
                    type="number"
                    inputMode="numeric"
                    placeholder="reps"
                    min="0"
                    step="1"
                    value={entry.reps ?? ''}
                    onChange={e => onSetChange(key, 'reps', e.target.value)}
                    aria-label={`Exercise ${exIdx + 1} set ${setNum} reps`}
                />
                {lastReps && (
                    <div className="history-badge">Last: {lastReps}</div>
                )}
            </div>
        </div>
    )
}

function ExerciseCard({ slot, exIdx, sets, papChecked, onSetChange, onPapCheck }) {
    const numSets = slot.sets || 4

    return (
        <div className="str-card">
            <div className="str-card__header">
                <div>
                    <div className="str-card__name">{slot.label} {slot.exercise}</div>
                    {slot.targetReps && (
                        <div className="str-card__target">Target: {slot.targetReps} {slot.loadNote && `| ${slot.loadNote}`}</div>
                    )}
                    {slot.cue && (
                        <div className="str-card__cue">💡 {slot.cue}</div>
                    )}
                </div>
            </div>

            <div className="str-set-header">
                <span>Set</span>
                <span>Load (kg)</span>
                <span>Reps</span>
            </div>

            {Array.from({ length: numSets }, (_, i) => (
                <SetRow
                    key={i}
                    exIdx={exIdx}
                    setNum={i + 1}
                    sets={sets}
                    onSetChange={onSetChange}
                    playbookKey={slot.key}
                />
            ))}

            {slot.pap?.exercise && (
                <div className="pap-row">
                    <input
                        type="checkbox"
                        checked={!!papChecked[slot.slot]}
                        onChange={e => onPapCheck(slot.slot, e.target.checked)}
                        aria-label={`PAP ${slot.pap.exercise} done`}
                    />
                    <span className="pap-text">
                        ⚡ PAP: {slot.pap.exercise}
                        {slot.pap.sets && ` (${slot.pap.sets}×${slot.pap.reps})`}
                    </span>
                </div>
            )}
        </div>
    )
}

export default function StrengthBlock({ slots, sets, papChecked, onSetChange, onPapCheck }) {
    if (!slots || slots.length === 0) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="section-header red">💪 Strength + PAP Supersets</div>
            {slots.map((slot, idx) => (
                <ExerciseCard
                    key={slot.key || idx}
                    slot={slot}
                    exIdx={idx}
                    sets={sets}
                    papChecked={papChecked}
                    onSetChange={onSetChange}
                    onPapCheck={onPapCheck}
                />
            ))}
        </div>
    )
}
