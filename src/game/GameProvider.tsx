import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { GameNotification, GameState, SaveRecord, Settings } from './types'
import {
  DEFAULT_SETTINGS,
  clearActiveSave,
  deleteSave as deleteSaveRecord,
  getActiveSave,
  latestSave,
  loadSaves,
  loadSettings,
  persistSettings,
  renameSave as renameSaveRecord,
  saveGame,
  setActiveSave,
} from './storage'
import { formatGameDate, uid } from '../lib/format'
import { addDays } from '../lib/format'

interface GameContextValue {
  game: GameState | null
  saves: SaveRecord[]
  settings: Settings
  paused: boolean
  speed: 1 | 2 | 3
  hasSaves: boolean
  createGame: (state: GameState) => void
  loadSave: (id: string) => GameState | null
  continueLatest: () => GameState | null
  saveCurrent: (name: string, mode: 'update' | 'copy') => boolean
  removeSave: (id: string) => void
  renameSave: (id: string, name: string) => void
  exitGame: () => void
  setPaused: (value: boolean) => void
  setSpeed: (value: 1 | 2 | 3) => void
  addNotification: (kind: GameNotification['kind'], title: string, body: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  updateSettings: (patch: Partial<Settings>) => void
  refreshSaves: () => void
  simulationNote: string
}

const GameContext = createContext<GameContextValue | null>(null)

const SPEED_MS: Record<1 | 2 | 3, number> = { 1: 1800, 2: 800, 3: 320 }

const SIMULATION_NOTE =
  'محرك المحاكاة الكامل قيد التطوير. في المرحلة الأولى يتقدم الزمن فقط، وتُحفظ شروط البداية والهوية والنظام.'

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<GameState | null>(() => getActiveSave())
  const [saves, setSaves] = useState<SaveRecord[]>(() => loadSaves())
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [paused, setPausedState] = useState(true)
  const [speed, setSpeedState] = useState<1 | 2 | 3>(1)
  const gameRef = useRef<GameState | null>(game)
  const settingsRef = useRef(settings)
  const pausedRef = useRef(paused)
  const speedRef = useRef(speed)
  const startedRef = useRef(false)

  gameRef.current = game
  settingsRef.current = settings
  pausedRef.current = paused
  speedRef.current = speed

  const refreshSaves = useCallback(() => {
    setSaves(loadSaves())
  }, [])

  useEffect(() => {
    document.documentElement.dataset.textScale = settings.textScale
    document.documentElement.dataset.motion = settings.reducedMotion ? 'reduced' : 'full'
  }, [settings])

  // Simulation clock: advances the in-game calendar only. Systems arrive in later stages.
  useEffect(() => {
    if (!game || paused) return
    const ms = SPEED_MS[speed]
    const timer = window.setInterval(() => {
      setGame((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          calendar: addDays(prev.calendar, 1),
          playSeconds: prev.playSeconds + ms / 1000,
          updatedAt: Date.now(),
        }
      })
    }, ms)
    return () => window.clearInterval(timer)
  }, [game?.id, paused, speed])

  // Keep an active session on disk so a refresh never loses the current game.
  useEffect(() => {
    if (!game) return
    const timer = window.setInterval(() => {
      if (gameRef.current) setActiveSave(gameRef.current)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [game?.id])

  // Autosave into the current slot (or a new autosave slot).
  useEffect(() => {
    if (!game || !settings.autosave) return
    const timer = window.setInterval(() => {
      const current = gameRef.current
      if (!current || pausedRef.current) return
      const result = saveGame(current, '', current.slotId)
      if (result) {
        setGame((prev) => (prev ? { ...prev, slotId: result.state.slotId } : prev))
        refreshSaves()
      }
    }, 60_000)
    return () => window.clearInterval(timer)
  }, [game?.id, settings.autosave, refreshSaves])

  const createGame = useCallback((state: GameState) => {
    setGame(state)
    setActiveSave(state)
    setPausedState(true)
    setSpeedState(1)
    startedRef.current = false
    refreshSaves()
  }, [refreshSaves])

  const loadSave = useCallback((id: string): GameState | null => {
    const record = loadSaves().find((r) => r.meta.id === id)
    if (!record) return null
    const clone: GameState = JSON.parse(JSON.stringify(record.state))
    setGame(clone)
    setActiveSave(clone)
    setPausedState(true)
    setSpeedState(1)
    setSaves(loadSaves())
    return clone
  }, [])

  const continueLatest = useCallback((): GameState | null => {
    const record = latestSave()
    if (!record) return null
    const clone: GameState = JSON.parse(JSON.stringify(record.state))
    setGame(clone)
    setActiveSave(clone)
    setPausedState(true)
    setSpeedState(1)
    setSaves(loadSaves())
    return clone
  }, [])

  const saveCurrent = useCallback(
    (name: string, mode: 'update' | 'copy'): boolean => {
      const current = gameRef.current
      if (!current) return false
      const slotId = mode === 'update' ? current.slotId : null
      const result = saveGame(current, name, slotId)
      if (!result) return false
      setGame(result.state)
      setActiveSave(result.state)
      setSaves(loadSaves())
      return true
    },
    [],
  )

  const removeSave = useCallback((id: string) => {
    deleteSaveRecord(id)
    setSaves(loadSaves())
    setGame((prev) => (prev && prev.slotId === id ? { ...prev, slotId: null } : prev))
  }, [])

  const renameSave = useCallback((id: string, name: string) => {
    renameSaveRecord(id, name)
    setSaves(loadSaves())
  }, [])

  const exitGame = useCallback(() => {
    const current = gameRef.current
    if (current) {
      const result = saveGame(
        current,
        '',
        current.slotId,
      )
      if (result) setActiveSave(result.state)
      else setActiveSave(current)
    }
    setPausedState(true)
    setGame(null)
    refreshSaves()
  }, [refreshSaves])

  const setPaused = useCallback((value: boolean) => {
    setPausedState(value)
    if (!value && !startedRef.current) {
      startedRef.current = true
      setGame((prev) => {
        if (!prev) return prev
        const note: GameNotification = {
          id: uid('note'),
          kind: 'system',
          title: 'انطلق الزمن',
          body: SIMULATION_NOTE,
          stamp: formatGameDate(prev.calendar),
          timestamp: Date.now(),
          read: false,
        }
        return { ...prev, notifications: [note, ...prev.notifications] }
      })
    }
    if (gameRef.current) setActiveSave(gameRef.current)
  }, [])

  const setSpeed = useCallback((value: 1 | 2 | 3) => setSpeedState(value), [])

  const addNotification = useCallback(
    (kind: GameNotification['kind'], title: string, body: string) => {
      setGame((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          notifications: [
            {
              id: uid('note'),
              kind,
              title,
              body,
              stamp: formatGameDate(prev.calendar),
              timestamp: Date.now(),
              read: false,
            },
            ...prev.notifications,
          ],
        }
      })
    },
    [],
  )

  const markAllNotificationsRead = useCallback(() => {
    setGame((prev) =>
      prev
        ? { ...prev, notifications: prev.notifications.map((n) => ({ ...n, read: true })) }
        : prev,
    )
  }, [])

  const clearNotifications = useCallback(() => {
    setGame((prev) => (prev ? { ...prev, notifications: [] } : prev))
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      persistSettings(next)
      return next
    })
  }, [])

  useEffect(() => {
    const onHide = () => {
      if (gameRef.current) setActiveSave(gameRef.current)
    }
    window.addEventListener('pagehide', onHide)
    return () => window.removeEventListener('pagehide', onHide)
  }, [])

  // Clear a dangling active state when the user explicitly resets everything.
  useEffect(() => {
    if (!game && saves.length === 0) clearActiveSave()
  }, [game, saves.length])

  const value: GameContextValue = {
    game,
    saves,
    settings,
    paused,
    speed,
    hasSaves: saves.length > 0,
    createGame,
    loadSave,
    continueLatest,
    saveCurrent,
    removeSave,
    renameSave,
    exitGame,
    setPaused,
    setSpeed,
    addNotification,
    markAllNotificationsRead,
    clearNotifications,
    updateSettings,
    refreshSaves,
    simulationNote: SIMULATION_NOTE,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}

export { DEFAULT_SETTINGS }
