import { useEffect, useState } from 'react'
import { MainMenu } from './screens/MainMenu'
import { WizardScreen } from './screens/wizard/WizardScreen'
import { GameScreen } from './screens/GameScreen'
import { ScenariosScreen } from './screens/ScenariosScreen'
import { SavesScreen } from './screens/SavesScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { useGame } from './game/GameProvider'
import { storageAvailableFlag } from './game/storage'
import type { WorldKind } from './game/types'

type Screen = 'menu' | 'wizard' | 'game' | 'scenarios' | 'saves' | 'settings'

export default function App() {
  const { game, loadSave, continueLatest } = useGame()
  const [screen, setScreen] = useState<Screen>('menu')
  const [seed, setSeed] = useState<WorldKind | null>(null)
  const [scenarioId, setScenarioId] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = 'rtl'
  }, [])

  const backToMenu = () => {
    setSeed(null)
    setScenarioId(null)
    setScreen('menu')
  }

  const startWizard = (kind: WorldKind | null = null) => {
    setSeed(kind)
    setScenarioId(null)
    setScreen('wizard')
  }

  const startScenario = (id: string) => {
    setScenarioId(id)
    setSeed(null)
    setScreen('wizard')
  }

  const continueGame = () => {
    if (continueLatest()) setScreen('game')
  }

  const loadGame = (id: string) => {
    if (loadSave(id)) setScreen('game')
  }

  if (screen === 'wizard') {
    return (
      <WizardScreen
        seed={seed}
        scenarioId={scenarioId}
        onExit={backToMenu}
        onStarted={() => setScreen('game')}
      />
    )
  }

  if (screen === 'game' && game) {
    return <GameScreen onExit={backToMenu} onSettings={() => setScreen('settings')} />
  }

  if (screen === 'scenarios') {
    return <ScenariosScreen onBack={backToMenu} onStart={startScenario} />
  }

  if (screen === 'saves') {
    return (
      <SavesScreen
        onBack={backToMenu}
        onLoad={loadGame}
        onNewGame={() => startWizard(null)}
        storageAvailable={storageAvailableFlag}
      />
    )
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        onBack={() => setScreen(game ? 'game' : 'menu')}
        onOpenSaves={() => setScreen('saves')}
      />
    )
  }

  return (
    <MainMenu
      onNewGame={startWizard}
      onContinue={continueGame}
      onSaves={() => setScreen('saves')}
      onScenarios={() => setScreen('scenarios')}
      onSettings={() => setScreen('settings')}
    />
  )
}
