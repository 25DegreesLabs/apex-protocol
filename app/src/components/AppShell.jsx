import { useState } from 'react'
import HUD from './HUD.jsx'
import PlaybookViewer from './PlaybookViewer.jsx'
import BottomNav from './BottomNav.jsx'

export default function AppShell() {
    const [activeTab, setActiveTab] = useState('hud') // 'hud' or 'playbook'

    return (
        <div className="app-shell">
            {activeTab === 'hud' ? <HUD /> : <PlaybookViewer />}

            <BottomNav
                activeTab={activeTab}
                onChange={setActiveTab}
            />
        </div>
    )
}
