import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { init } from '@nammabus/shared'

init({
  baseUrl: import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
