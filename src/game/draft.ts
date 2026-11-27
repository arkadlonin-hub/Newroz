import type {
  Conditions,
  CountryRecord,
  Difficulty,
  GovernmentConfig,
  GovernmentId,
  Scenario,
  WorldConfig,
  WorldKind,
} from './types'
import type { WizardDraft } from './setup'
import { newDraft } from './setup'
import {
  baseConditions,
  COUNTRY_BY_CCA2,
  defaultIdentityForCountry,
  emptyFictionalIdentity,
  fictionalConditions,
} from '../data/countries'
import { defaultWorld } from '../data/worlds'
import { SCENARIO_BY_ID } from '../data/scenarios'
import { defaultGovernment, powerProfile } from '../data/governments'

export function governmentConfigFor(id: GovernmentId): GovernmentConfig {
  const base = defaultGovernment()
  if (id === 'custom') return { ...base, id }
  const powers = powerProfile({ ...base, id })
  return { ...base, id, ...powers }
}

export function mergeScenarioConditions(
  base: Conditions,
  scenario: Scenario | null,
): Conditions {
  if (!scenario?.conditions) return base
  return { ...base, ...scenario.conditions }
}

export function scenarioCountry(scenario: Scenario | null): CountryRecord | null {
  if (!scenario?.countryCode) return null
  return COUNTRY_BY_CCA2.get(scenario.countryCode) ?? null
}

export function conditionsForRecord(
  record: CountryRecord,
  difficulty: Difficulty,
  scenario: Scenario | null,
): Conditions {
  const base = baseConditions(record, difficulty)
  if (scenario?.countryCode === record.cca2) return mergeScenarioConditions(base, scenario)
  return base
}

function buildScenarioDraft(scenarioId: string): WizardDraft {
  const scenario = SCENARIO_BY_ID[scenarioId]
  if (!scenario) return newDraft(defaultWorld('real'))

  const kind: WorldKind = scenario.era === 'historical' ? 'historical' : 'modern'
  const world: WorldConfig = {
    ...defaultWorld(kind),
    kind,
    scenarioId: scenario.id,
    name: scenario.title,
    year: scenario.year,
    eraLabel: scenario.subtitle,
    difficulty: scenario.difficulty,
  }
  const draft = newDraft(world)
  const record = scenarioCountry(scenario)

  if (record) {
    const conditions = conditionsForRecord(record, scenario.difficulty, scenario)
    const identity = defaultIdentityForCountry(record)
    if (scenario.presets.identity) identity.identity = scenario.presets.identity
    identity.population = conditions.population
    draft.countryKind = 'real'
    draft.selectedCode = record.cca2
    draft.identity = identity
    draft.conditions = conditions
  }

  if (scenario.presets.identity) {
    draft.identity = { ...draft.identity, identity: scenario.presets.identity }
  }
  if (scenario.presets.government) {
    draft.government = governmentConfigFor(scenario.presets.government)
  }

  draft.scenarioId = scenario.id
  draft.world.scenarioId = scenario.id
  draft.quickTouched = false
  return draft
}

export function initialDraft(
  kind: WorldKind | null,
  scenarioId: string | null,
): WizardDraft {
  if (scenarioId && SCENARIO_BY_ID[scenarioId]) return buildScenarioDraft(scenarioId)

  const world = defaultWorld(kind ?? 'real')
  const draft = newDraft(world)
  if (world.kind === 'fictional') {
    const identity = emptyFictionalIdentity()
    const conditions = fictionalConditions(
      draft.conditions.population,
      draft.development,
      world.difficulty,
    )
    return {
      ...draft,
      countryKind: 'fictional',
      selectedCode: null,
      identity: { ...identity, population: conditions.population },
      conditions,
    }
  }
  return draft
}

export function applyWorldKind(draft: WizardDraft, kind: WorldKind): WizardDraft {
  const base = defaultWorld(kind)
  const world: WorldConfig = {
    ...draft.world,
    ...base,
    kind,
    scenarioId: null,
    difficulty: draft.world.difficulty,
  }
  let next: WizardDraft = {
    ...draft,
    world,
    scenarioId: null,
    quickTouched: false,
  }

  if (kind === 'fictional' && draft.countryKind === 'real') {
    const conditions = fictionalConditions(
      draft.conditions.population,
      draft.development,
      world.difficulty,
    )
    next = {
      ...next,
      countryKind: 'fictional',
      selectedCode: null,
      identity: { ...emptyFictionalIdentity(), population: conditions.population },
      conditions,
    }
  } else if (kind !== 'fictional' && draft.countryKind === 'fictional') {
    next = {
      ...next,
      countryKind: 'real',
      selectedCode: null,
      identity: { ...emptyFictionalIdentity(), kind: 'real' },
    }
  }

  return next
}

export function applyScenario(draft: WizardDraft, scenarioId: string): WizardDraft {
  const scenario = SCENARIO_BY_ID[scenarioId]
  if (!scenario) return draft
  const scenarioDraft = buildScenarioDraft(scenarioId)
  const record = scenarioCountry(scenario)

  // Keep the player's existing country when the scenario leaves the choice open.
  if (!record) {
    return {
      ...scenarioDraft,
      countryKind: draft.countryKind,
      selectedCode: draft.selectedCode,
      identity: draft.selectedCode ? draft.identity : scenarioDraft.identity,
      conditions: draft.selectedCode ? draft.conditions : scenarioDraft.conditions,
      step: draft.step,
    }
  }

  return { ...scenarioDraft, step: draft.step }
}

export function applyDifficulty(draft: WizardDraft, difficulty: Difficulty): WizardDraft {
  const world = { ...draft.world, difficulty }
  if (draft.quickTouched) return { ...draft, world }

  const scenario = draft.scenarioId ? SCENARIO_BY_ID[draft.scenarioId] : null
  if (draft.selectedCode) {
    const record = COUNTRY_BY_CCA2.get(draft.selectedCode)
    if (record) {
      const conditions = conditionsForRecord(record, difficulty, scenario)
      return {
        ...draft,
        world,
        conditions,
        identity: { ...draft.identity, population: conditions.population },
      }
    }
  }

  if (draft.countryKind === 'fictional') {
    const conditions = fictionalConditions(
      draft.conditions.population,
      draft.development,
      difficulty,
    )
    return {
      ...draft,
      world,
      conditions,
      identity: { ...draft.identity, population: conditions.population },
    }
  }

  return { ...draft, world }
}

export function selectRealCountry(draft: WizardDraft, record: CountryRecord): WizardDraft {
  const scenario = draft.scenarioId ? SCENARIO_BY_ID[draft.scenarioId] : null
  const conditions = conditionsForRecord(record, draft.world.difficulty, scenario)
  const identity = defaultIdentityForCountry(record)
  if (scenario?.presets.identity) identity.identity = scenario.presets.identity
  identity.population = conditions.population

  return {
    ...draft,
    countryKind: 'real',
    selectedCode: record.cca2,
    identity,
    conditions,
    quickTouched: false,
  }
}

export function selectFictionalCountry(
  draft: WizardDraft,
  latlng?: [number, number],
): WizardDraft {
  const identity = {
    ...emptyFictionalIdentity(),
    ...draft.identity,
    kind: 'fictional' as const,
    cca2: null,
    ccn3: null,
    regionAr: 'عالم خيالي',
    latlng: latlng ?? draft.identity.latlng,
  }
  const conditions = fictionalConditions(
    draft.conditions.population,
    draft.development,
    draft.world.difficulty,
  )
  return {
    ...draft,
    countryKind: 'fictional',
    selectedCode: null,
    identity: { ...identity, population: conditions.population },
    conditions,
    quickTouched: false,
  }
}

export function setDevelopment(
  draft: WizardDraft,
  development: WizardDraft['development'],
): WizardDraft {
  if (draft.countryKind !== 'fictional') return { ...draft, development }
  const conditions = fictionalConditions(
    draft.conditions.population,
    development,
    draft.world.difficulty,
  )
  return {
    ...draft,
    development,
    conditions,
    identity: { ...draft.identity, population: conditions.population },
  }
}

export function setGovernment(draft: WizardDraft, id: GovernmentId): WizardDraft {
  const current = draft.government
  if (id === 'custom') {
    return { ...draft, government: { ...current, id } }
  }
  return { ...draft, government: governmentConfigFor(id) }
}
