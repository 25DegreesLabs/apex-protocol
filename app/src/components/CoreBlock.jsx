export default function CoreBlock({ sets, onSetChange }) {
    // 3 flexible rows
    return (
        <div className="card">
            <div className="section-header">⚙️ Core & Accessories (Optional)</div>
            <div style={{ padding: '0 14px 12px 14px', fontSize: '0.85rem', color: 'var(--dim)', fontStyle: 'italic' }}>
                If you have time, log your core or accessory work here. Does not affect Completeness %.
            </div>

            <div className="str-set-header" style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 2fr) 60px 60px', gap: 8, padding: '0 14px 8px 14px' }}>
                <span>Exercise</span>
                <span>Sets</span>
                <span>Reps</span>
            </div>

            <div style={{ padding: '0 14px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3].map(rowNum => {
                    const entry = sets[rowNum] || {}
                    return (
                        <div key={rowNum} style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 2fr) 60px 60px', gap: 8 }}>
                            <input
                                type="text"
                                placeholder="e.g. Hanging Leg Raises"
                                value={entry.ex || ''}
                                onChange={e => onSetChange(rowNum, 'ex', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="3"
                                min="0"
                                value={entry.sets || ''}
                                onChange={e => onSetChange(rowNum, 'sets', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="15"
                                min="0"
                                value={entry.reps || ''}
                                onChange={e => onSetChange(rowNum, 'reps', e.target.value)}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
