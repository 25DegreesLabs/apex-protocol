/**
 * MobilityBlock.jsx
 * Renders the 🔥 MOBILITY & INJURY PREP section.
 * Each slot shows exercise name, duration, cue, and a checkbox.
 */
export default function MobilityBlock({ slots, checked, onCheck }) {
    if (!slots || slots.length === 0) return null

    return (
        <div className="card">
            <div className="section-header amber">🔥 Mobility &amp; Injury Prep</div>
            {slots.map((slot, idx) => (
                <div
                    key={slot.key || idx}
                    className={`mob-row${checked[slot.slot] ? ' done' : ''}`}
                >
                    <div className="mob-row__info">
                        <div className="mob-row__name">
                            {slot.isHighAlert && <span className="badge badge-red" style={{ marginRight: 6 }}>🔴 HA</span>}
                            {slot.exercise}
                        </div>
                        {slot.duration && (
                            <div className="mob-row__meta">⏱ {slot.duration}</div>
                        )}
                        {slot.cue && (
                            <div className="mob-row__cue">💬 {slot.cue}</div>
                        )}
                    </div>
                    <input
                        type="checkbox"
                        checked={!!checked[slot.slot]}
                        onChange={e => onCheck(slot.slot, e.target.checked)}
                        aria-label={`${slot.exercise} done`}
                    />
                </div>
            ))}
        </div>
    )
}
