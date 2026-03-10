export default function BottomNav({ activeTab, onChange }) {
    return (
        <nav className="bottom-nav">
            <button
                className={activeTab === 'hud' ? 'active' : ''}
                onClick={() => onChange('hud')}
            >
                <span className="bottom-nav__icon">⚔️</span>
                <span>HUD</span>
            </button>
            <button
                className={activeTab === 'playbook' ? 'active' : ''}
                onClick={() => onChange('playbook')}
            >
                <span className="bottom-nav__icon">📖</span>
                <span>Playbook</span>
            </button>
        </nav>
    )
}
