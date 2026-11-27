import type { GameState, SaveMeta, SaveRecord, Settings } from './types'
import { governmentDisplayName } from '../data/governments'
import { formatGameDate, uid } from '../lib/format'

const SAVES_KEY = 'newroz.saves.v1'
const ACTIVE_KEY = 'newroz.active.v1'
const SETTINGS_KEY = 'newroz.settings.v1'
const MAX_SAVES = 24

function storageAvailable(): boolean {
  try {
    const key = '__newroz_test__'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export const storageAvailableFlag = storageAvailable()

function readJSON<T>(key: string, fallback: T): T {
  if (!storageAvailableFlag) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown): boolean {
  if (!storageAvailableFlag) return false
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const DEFAULT_SETTINGS: Settings = {
  textScale: 'normal',
  reducedMotion: false,
  autosave: true,
}

export function loadSettings(): Settings {
  const saved = readJSON<Partial<Settings>>(SETTINGS_KEY, {})
  return { ...DEFAULT_SETTINGS, ...saved }
}

export function persistSettings(settings: Settings): boolean {
  return writeJSON(SETTINGS_KEY, settings)
}

export function loadSaves(): SaveRecord[] {
  const raw = readJSON<SaveRecord[]>(SAVES_KEY, [])
  if (!Array.isArray(raw)) return []
  return raw
    .filter((r) => r && r.meta && r.state && r.state.version === 1)
    .sort((a, b) => b.meta.updatedAt - a.meta.updatedAt)
}

export function buildSaveMeta(state: GameState, name: string): SaveMeta {
  return {
    id: state.slotId ?? uid('save'),
    name,
    updatedAt: Date.now(),
    createdAt: state.createdAt,
    countryName: state.country.nameAr,
    countryKind: state.country.kind,
    cca2: state.country.cca2,
    flag: state.country.flag,
    year: state.calendar.year,
    month: state.calendar.month,
    day: state.calendar.day,
    governmentName: governmentDisplayName(state.government),
    worldName: state.world.name,
    playSeconds: state.playSeconds,
  }
}

export function saveGame(
  state: GameState,
  name: string,
  slotId?: string | null,
): { state: GameState; record: SaveRecord } | null {
  const saves = loadSaves()
  const targetId = slotId ?? state.slotId
  const now = Date.now()
  const existingIndex = saves.findIndex((s) => s.meta.id === targetId)
  const existing = existingIndex >= 0 ? saves[existingIndex] : null
  const nextState: GameState = {
    ...state,
    updatedAt: now,
    slotId: targetId ?? null,
  }
  const meta = buildSaveMeta(
    targetId ? { ...nextState, slotId: targetId } : nextState,
    name.trim() || existing?.meta.name || `${state.country.nameAr} — ${formatGameDate(state.calendar)}`,
  )
  if (targetId) meta.id = targetId
  else nextState.slotId = meta.id
  meta.updatedAt = now
  const record: SaveRecord = { meta, state: nextState }
  if (existingIndex >= 0) {
    meta.createdAt = saves[existingIndex].meta.createdAt
    saves[existingIndex] = record
  } else {
    saves.unshift(record)
  }
  saves.sort((a, b) => b.meta.updatedAt - a.meta.updatedAt)
  const trimmed = saves.slice(0, MAX_SAVES)
  if (!writeJSON(SAVES_KEY, trimmed)) return null
  setActiveSave(nextState)
  return { state: nextState, record }
}

export function deleteSave(id: string): boolean {
  const saves = loadSaves().filter((s) => s.meta.id !== id)
  return writeJSON(SAVES_KEY, saves)
}

export function renameSave(id: string, name: string): boolean {
  const saves = loadSaves()
  const record = saves.find((s) => s.meta.id === id)
  if (!record) return false
  record.meta.name = name.trim() || record.meta.name
  return writeJSON(SAVES_KEY, saves)
}

export function latestSave(): SaveRecord | null {
  return loadSaves()[0] ?? null
}

export function setActiveSave(state: GameState): boolean {
  return writeJSON(ACTIVE_KEY, state)
}

export function getActiveSave(): GameState | null {
  const state = readJSON<GameState | null>(ACTIVE_KEY, null)
  if (!state || state.version !== 1 || !state.country || !state.calendar) return null
  return state
}

export function clearActiveSave(): void {
  if (!storageAvailableFlag) return
  try {
    localStorage.removeItem(ACTIVE_KEY)
  } catch {
    // ignore
  }
}

export function clearAllData(): void {
  if (!storageAvailableFlag) return
  try {
    localStorage.removeItem(SAVES_KEY)
    localStorage.removeItem(ACTIVE_KEY)
    localStorage.removeItem(SETTINGS_KEY)
  } catch {
    // ignore
  }
}
