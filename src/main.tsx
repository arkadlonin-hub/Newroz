import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { GameProvider } from './game/GameProvider'
import { ToastProvider } from './components/ui/Toast'
import './styles/base.css'
import './styles/components.css'
import './styles/menu.css'
import './styles/wizard.css'
import './styles/game.css'
import './styles/pages.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </ToastProvider>
  </StrictMode>,
)
