import type {
  Calendar,
  Conditions,
  CountryIdentity,
  Difficulty,
  GameState,
  GovernmentConfig,
  WorldConfig,
} from './types'
import { governmentDisplayName } from '../data/governments'
import { uid } from '../lib/format'
import { defaultWorld } from '../data/worlds'
import { emptyFictionalIdentity } from '../data/countries'

export interface WizardDraft {
  step: 1 | 2 | 3 | 4 | 5
  world: WorldConfig
  countryKind: 'real' | 'fictional'
  selectedCode: string | null
  identity: CountryIdentity
  government: GovernmentConfig
  conditionsMode: 'quick' | 'advanced'
  development: 'developing' | 'emerging' | 'advanced'
  conditions: Conditions
  scenarioId: string | null
  quickTouched: boolean
}

export function newDraft(world: WorldConfig = defaultWorld('real')): WizardDraft {
  return {
    step: 1,
    world,
    countryKind: 'real',
    selectedCode: null,
    identity: emptyFictionalIdentity(),
    government: {
      id: 'republic',
      customName: '',
      customDescription: '',
      centralization: 55,
      transparency: 60,
      militaryInfluence: 25,
    },
    conditionsMode: 'quick',
    development: 'emerging',
    conditions: {
      population: 6_000_000,
      treasury: 18,
      debtPct: 52,
      economy: 55,
      infrastructure: 54,
      education: 61,
      healthcare: 58,
      energy: 62,
      agriculture: 52,
      industry: 50,
      resources: 48,
      stability: 58,
      relations: 55,
    },
    scenarioId: world.scenarioId,
    quickTouched: false,
  }
}

export function calendarStart(year: number): Calendar {
  return { year, month: 1, day: 1 }
}

export function buildGameState(draft: WizardDraft): GameState {
  const now = Date.now()
  const id = uid('game')
  const identity: CountryIdentity = {
    ...draft.identity,
    population: draft.conditions.population,
  }
  const name = identity.nameAr.trim() || 'دولة بلا اسم'
  const govName = governmentDisplayName(draft.government)
  return {
    version: 1,
    id,
    slotId: null,
    createdAt: now,
    updatedAt: now,
    world: { ...draft.world },
    country: identity,
    government: { ...draft.government },
    conditions: { ...draft.conditions },
    calendar: calendarStart(draft.world.year),
    playSeconds: 0,
    scenarioId: draft.scenarioId,
    notifications: [
      {
        id: uid('note'),
        kind: 'system',
        title: `تأسست ${name}`,
        body: `العالم: ${draft.world.name} · السنة ${draft.world.year} · ${govName}. هذه هي المرحلة الأولى: الأساس فقط، والمحاكاة الكاملة تُبنى في المراحل القادمة.`,
        stamp: `1 يناير ${draft.world.year}`,
        timestamp: now,
        read: false,
      },
    ],
  }
}

export interface ValidationResult {
  ok: boolean
  message?: string
}

export function validateStep(step: number, draft: WizardDraft): ValidationResult {
  if (step === 1) {
    if (draft.world.kind === 'historical' && !draft.scenarioId) {
      return { ok: false, message: 'اختر سيناريو تاريخياً للمتابعة.' }
    }
    if (draft.world.kind === 'modern' && !draft.scenarioId) {
      return { ok: false, message: 'اختر سيناريو حديثاً للمتابعة.' }
    }
    if (!draft.world.name.trim()) {
      return { ok: false, message: 'أدخل اسماً للعالم.' }
    }
    return { ok: true }
  }
  if (step === 2) {
    if (draft.countryKind === 'real' && !draft.selectedCode) {
      return { ok: false, message: 'اختر دولة من الخريطة أو القائمة.' }
    }
    return { ok: true }
  }
  if (step === 3) {
    const id = draft.identity
    if (!id.nameAr.trim()) return { ok: false, message: 'أدخل اسم الدولة بالعربية.' }
    if (!id.nameIntl.trim()) return { ok: false, message: 'أدخل الاسم الدولي للدولة.' }
    if (!id.capitalAr.trim()) return { ok: false, message: 'أدخل اسم العاصمة.' }
    if (!id.languages.length) return { ok: false, message: 'اختر لغة وطنية واحدة على الأقل.' }
    if (!id.currencyName.trim()) return { ok: false, message: 'أدخل اسم العملة.' }
    if (!id.identity) return { ok: false, message: 'اختر الهوية الوطنية.' }
    if (id.identity === 'custom' && !id.identityCustom.trim()) {
      return { ok: false, message: 'اكتب وصف الهوية المخصصة.' }
    }
    return { ok: true }
  }
  if (step === 4) {
    if (!draft.government.id) return { ok: false, message: 'اختر نظام الحكم.' }
    if (draft.government.id === 'custom' && !draft.government.customName.trim()) {
      return { ok: false, message: 'أدخل اسماً للنظام المخصص.' }
    }
    return { ok: true }
  }
  if (step === 5) {
    const c = draft.conditions
    if (!Number.isFinite(c.population) || c.population < 1000) {
      return { ok: false, message: 'أدخل عدد سكان صالحاً (ألف نسمة على الأقل).' }
    }
    if (!Number.isFinite(c.treasury) || c.treasury < 0) {
      return { ok: false, message: 'أدخل قيمة خزينة صالحة.' }
    }
    return { ok: true }
  }
  return { ok: true }
}

export function makeGameId(): string {
  return uid('game')
}

export function difficultyLabel(d: Difficulty): string {
  return { easy: 'سهل', balanced: 'متوازن', realistic: 'واقعي', hard: 'صعب' }[d]
}
