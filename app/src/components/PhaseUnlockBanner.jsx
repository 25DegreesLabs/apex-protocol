/**
 * PhaseUnlockBanner.jsx
 * Shown when the user has completed enough sessions to unlock the next phase.
 */
export default function PhaseUnlockBanner({ currentPhase, sessionsDone, threshold, onAdvance }) {
    return (
        <div className="phase-unlock-banner">
            <h3>🔓 Phase {currentPhase + 1} Unlocked!</h3>
            <p>
                You've completed {sessionsDone}/{threshold} S&amp;C sessions in Phase {currentPhase}.
            </p>
            <button onClick={onAdvance}>
                Advance to Phase {currentPhase + 1} →
            </button>
        </div>
    )
}
