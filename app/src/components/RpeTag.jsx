/**
 * RpeTag.jsx — Apex Protocol
 *
 * Renders an RPE value (e.g. "@ RPE 8") or a plain "RPE" column label,
 * both with a tappable ⓘ badge that shows a quick inline explanation.
 *
 * Props:
 *   value  — number | undefined  — if present, renders "@ RPE {value}"
 *   label  — bool                — if true, renders plain "RPE" text (for column headers)
 */
import { useState, useEffect, useRef } from 'react'

export default function RpeTag({ value, label }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    // Close when user taps outside
    useEffect(() => {
        if (!open) return
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        document.addEventListener('touchstart', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
            document.removeEventListener('touchstart', handleClick)
        }
    }, [open])

    const badge = (
        <span
            onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                color: 'var(--dim)',
                fontSize: '0.6rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginLeft: 4,
                verticalAlign: 'middle',
                flexShrink: 0,
                userSelect: 'none',
            }}
        >
            ?
        </span>
    )

    const popover = open && (
        <div style={{
            position: 'absolute',
            zIndex: 999,
            top: '100%',
            left: 0,
            marginTop: 6,
            width: 220,
            background: '#0f1a0f',
            border: '1px solid var(--primary)',
            borderRadius: 8,
            padding: '12px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            textAlign: 'left',
        }}>
            <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.8rem', letterSpacing: '0.06em', marginBottom: 8 }}>
                RPE — Rate of Perceived Exertion
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                    ['6', 'Very easy. Could go all day.'],
                    ['7', 'Moderate. Comfortable effort.'],
                    ['8', '2 reps left in the tank. ✓'],
                    ['9', '1 rep left. Hard.'],
                    ['10', 'Absolute max. Nothing left.'],
                ].map(([r, desc]) => (
                    <div key={r} style={{ display: 'flex', gap: 8, fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--warn)', fontWeight: '700', minWidth: 14 }}>{r}</span>
                        <span style={{ color: 'var(--dim)' }}>{desc}</span>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <span ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {label
                ? <span>RPE</span>
                : <span style={{ color: 'var(--warn)' }}>@ RPE {value}</span>
            }
            {badge}
            {popover}
        </span>
    )
}
