import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LandingPage from './LandingPage.jsx'
import { LANDINGS } from './content/landings.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                {LANDINGS.map(({ slug }) => (
                    <Route key={slug} path={`/${slug}`} element={<LandingPage slug={slug} />} />
                ))}
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
