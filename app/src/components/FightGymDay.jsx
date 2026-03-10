/**
 * FightGymDay.jsx
 * Rendered when Day 2 or Day 4 is selected (fight gym days with no S&C programming).
 */
export default function FightGymDay({ day, notes, onNotesChange, bagRounds, onBagRoundsChange, onLog }) {
    return (
        <>
            <div className="fight-gym-banner">
                <div className="icon">🥊</div>
                <h2>Fight Gym Day</h2>
                <p>Day {day} is a Combat Session — no S&amp;C today.</p>
                <p style={{ marginTop: 4 }}>Log your rounds and notes below, then hit LOG SESSION.</p>
            </div>

            <div className="card">
                <div className="section-header red">🥊 Bag / Sparring</div>
                <div className="bag-rounds-row">
                    <label htmlFor="fight-rounds">Rounds completed:</label>
                    <input
                        id="fight-rounds"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="20"
                        placeholder="0"
                        value={bagRounds}
                        onChange={e => onBagRoundsChange(e.target.value)}
                    />
                </div>
                <div className="notes-section" style={{ borderTop: '1px solid var(--divider)' }}>
                    <label htmlFor="fight-notes">Session Notes</label>
                    <textarea
                        id="fight-notes"
                        placeholder="Sparring notes, coach feedback, anything that happened today..."
                        value={notes}
                        onChange={e => onNotesChange(e.target.value)}
                    />
                </div>
            </div>
        </>
    )
}
