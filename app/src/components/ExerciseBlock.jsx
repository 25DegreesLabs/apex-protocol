/**
 * ExerciseBlock.jsx — Apex Protocol Exercise Card
 *
 * Renders a single exercise from the active session.
 * Shows exercise name, target, superset label, prescribed targets,
 * and one set row per set (load / reps / RPE inputs).
 *
 * Props:
 *   exercise   — the exercise object from activeSession.exercises[]
 *   onSetChange(exerciseId, setNumber, field, value) — callback from HUD
 */
import RpeTag from './RpeTag.jsx'

export default function ExerciseBlock({ exercise, onSetChange }) {
    const { exerciseId, exerciseName, target, supersetLabel, prescribedReps, prescribedRpe, quickNote, sets } = exercise


    const labelColor = supersetLabel
        ? 'var(--primary)'
        : 'var(--text)'

    return (
        <div className="str-card">
            {/* ── Exercise header ─────────────────────────────────── */}
            <div className="str-card__header">
                <div style={{ flex: 1 }}>
                    {supersetLabel && (
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(99,179,237,0.15)',
                            color: 'var(--primary)',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            letterSpacing: '0.08em',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            marginBottom: 4,
                            textTransform: 'uppercase'
                        }}>
                            {supersetLabel}
                        </div>
                    )}
                    <div className="str-card__name">{exerciseName}</div>
                    <div className="str-card__target" style={{ color: 'var(--dim)', fontSize: '0.78rem' }}>{target}</div>
                    {(prescribedReps || prescribedRpe) && (
                        <div className="str-card__target" style={{ marginTop: 2 }}>
                            {prescribedReps && <span>Target: {prescribedReps} reps</span>}
                            {prescribedRpe && <RpeTag value={prescribedRpe} />}
                        </div>
                    )}
                    {quickNote && (
                        <div className="str-card__cue">💡 {quickNote}</div>
                    )}
                </div>
            </div>

            {/* ── Set rows ─────────────────────────────────────────── */}
            <div className="str-set-header" style={{ gridTemplateColumns: '50px 1fr 1fr 80px' }}>
                <span>Set</span>
                <span>Load (kg)</span>
                <span>Reps</span>
                <RpeTag label />
            </div>

            {sets.map(set => (
                <div
                    key={set.setNumber}
                    className="str-set-row"
                    style={{ gridTemplateColumns: '50px 1fr 1fr 80px' }}
                >
                    <span className="str-set-label">Set {set.setNumber}</span>

                    <div>
                        <input
                            type="number"
                            inputMode="decimal"
                            placeholder="kg"
                            min="0"
                            step="0.5"
                            value={set.load}
                            onChange={e => onSetChange(exerciseId, set.setNumber, 'load', e.target.value)}
                            aria-label={`${exerciseName} set ${set.setNumber} load in kg`}
                        />
                    </div>

                    <div>
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="reps"
                            min="0"
                            step="1"
                            value={set.reps}
                            onChange={e => onSetChange(exerciseId, set.setNumber, 'reps', e.target.value)}
                            aria-label={`${exerciseName} set ${set.setNumber} reps`}
                        />
                    </div>

                    <div>
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="1–10"
                            min="1"
                            max="10"
                            step="0.5"
                            value={set.rpe}
                            onChange={e => onSetChange(exerciseId, set.setNumber, 'rpe', e.target.value)}
                            aria-label={`${exerciseName} set ${set.setNumber} RPE`}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
