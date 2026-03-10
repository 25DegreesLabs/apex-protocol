/**
 * CooldownBlock.jsx
 * Renders the ❄️ COOLDOWN & STRETCH section.
 */
export default function CooldownBlock({ slots, checked, onCheck }) {
    if (!slots || slots.length === 0) return null

    return (
        <div className="card">
            <div className="section-header blue">❄️ Cooldown &amp; Stretch</div>
            {slots.map((slot, idx) => (
                <div
                    key={slot.key || idx}
                    className={`mob-row${checked[slot.slot] ? ' done' : ''}`}
                >
                    <div className="mob-row__info">
                        <div className="mob-row__name">{slot.exercise}</div>
                        {slot.duration && (
                            <div className="mob-row__meta">⏱ {slot.duration}</div>
                        )}
                        {slot.note && (
                            <div className="mob-row__cue">{slot.note}</div>
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
