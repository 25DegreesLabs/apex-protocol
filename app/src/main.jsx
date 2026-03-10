import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { DBProvider } from './db/index.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <DBProvider>
            <App />
        </DBProvider>
    </React.StrictMode>
)
