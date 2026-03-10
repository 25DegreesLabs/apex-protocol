/**
 * CompletenessBar.jsx
 * Animated completeness percentage display.
 */
export default function CompletenessBar({ pct }) {
    const clamped = Math.min(100, Math.max(0, pct || 0))
    const cls = clamped >= 80 ? 'high' : clamped >= 50 ? 'mid' : 'low'

    return (
        <div className="completeness-block">
            <div className="pct-label">Session Completeness</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span className={`pct ${cls}`}>{clamped.toFixed(1)}</span>
                <span className="text-label fw-bold" style={{ fontSize: '1.2rem' }}>%</span>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-bar__fill"
                    style={{
                        width: `${clamped}%`,
                        background: clamped >= 80 ? 'var(--green)' : clamped >= 50 ? 'var(--amber)' : 'var(--red)'
                    }}
                />
            </div>
        </div>
    )
}
