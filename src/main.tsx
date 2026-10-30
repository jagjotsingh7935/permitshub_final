import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SiteProvider } from './site/SiteProvider'
import 'lenis/dist/lenis.css'
import './styles/styles.css'
import './styles/redesign.css'
import './styles/cinematic.css'
import './styles/evolution.css'
import './styles/sections.css'
import './styles/about.css'
import './styles/updates.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <App />
      </SiteProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
