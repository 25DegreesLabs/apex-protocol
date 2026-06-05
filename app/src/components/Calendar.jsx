import { useState, useEffect } from 'react'
import { db } from '../db/index.jsx'

export default function Calendar() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadSessions = async () => {
            const data = await db.sessions.toArray()
            // Sort by most recent first
            data.sort((a, b) => b.id - a.id)
            setSessions(data)
            setLoading(false)
        }
        loadSessions()
    }, [])

    return (
        <div className="app">
            <header className="page-header">
                <h1>📅 Session Log</h1>
                <div className="subtitle">Workout History</div>
            </header>

            <main className="content" style={{ paddingBottom: 100 }}>
                {loading ? (
                    <div className="text-center text-dim mt-8">Loading history...</div>
                ) : sessions.length === 0 ? (
                    <div className="text-center text-dim mt-8">
                        <div style={{ fontSize: '2rem', marginBottom: 10 }}>📭</div>
                        No sessions logged yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {sessions.map(s => {
                            const dateStr = s.date || 'Unknown Date'
                            const displayDate = new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric'
                            })

                            const blockLabel = s.blockId
                                ? s.blockId.replace('phase', 'Phase ')
                                : 'Phase 1'

                            return (
                                <div key={s.id} className="card" style={{ padding: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <div>
                                            <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1.05rem' }}>{displayDate}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--label)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {blockLabel} • Day {s.dayNumber}
                                                {s.focus ? ` — ${s.focus}` : ''}
                                            </div>
                                        </div>
                                        <div className="badge badge-green">
                                            {s.rowCount != null ? `${s.rowCount} sets` : 'Logged'}
                                        </div>
                                    </div>

                                    {s.notes && (
                                        <div style={{ background: 'var(--bg)', padding: 10, borderRadius: 'var(--radius-sm)', marginTop: 8 }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--dim)', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                                                "{s.notes}"
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
