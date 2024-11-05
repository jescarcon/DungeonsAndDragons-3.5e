import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode> {/* StrictMode helps identify potential issues in React apps during development without affecting production builds. */}
    <App />
  </StrictMode>,
)
