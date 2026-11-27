export type ScreenName =
  | 'menu'
  | 'wizard'
  | 'game'
  | 'settings'
  | 'scenarios'
  | 'saves'

export type WorldKind = 'real' | 'fictional' | 'custom' | 'historical' | 'modern'
export type Difficulty = 'easy' | 'balanced' | 'realistic' | 'hard'
export type CountryKind = 'real' | 'fictional'

export interface WorldConfig {
  kind: WorldKind
  name: string
  year: number
  eraLabel: string
  techLevel: 'low' | 'medium' | 'high' | 'advanced'
  abundance: 'scarce' | 'balanced' | 'rich'
  climate: 'temperate' | 'arid' | 'tropical' | 'cold' | 'varied'
  difficulty: Difficulty
  scenarioId: string | null
  notes: string
}

export type GovernmentId =
  | 'republic'
  | 'presidential'
  | 'parliamentary'
  | 'constitutional_monarchy'
  | 'absolute_monarchy'
  | 'federal'
  | 'military'
  | 'dictatorship'
  | 'one_party'
  | 'technocratic'
  | 'custom'

export interface GovernmentConfig {
  id: GovernmentId
  customName: string
  customDescription: string
  centralization: number
  transparency: number
  militaryInfluence: number
}

export interface Conditions {
  population: number
  treasury: number
  debtPct: number
  economy: number
  infrastructure: number
  education: number
  healthcare: number
  energy: number
  agriculture: number
  industry: number
  resources: number
  stability: number
  relations: number
}

export type FlagPattern =
  | 'solid'
  | 'horizontal'
  | 'vertical'
  | 'triband'
  | 'canton'
  | 'diagonal'
  | 'chevron'

export type FlagSymbol =
  | 'none'
  | 'star'
  | 'crescent'
  | 'sun'
  | 'tree'
  | 'eagle'
  | 'lion'
  | 'wheat'
  | 'mountain'
  | 'star8'
  | 'flame'

export interface FlagDesign {
  preset: 'official' | 'custom'
  pattern: FlagPattern
  colors: [string, string, string]
  symbol: FlagSymbol
  symbolColor: string
}

export type EmblemShape = 'circle' | 'shield' | 'eight'
export type EmblemSymbol =
  | 'star'
  | 'crescent'
  | 'sun'
  | 'tree'
  | 'eagle'
  | 'lion'
  | 'wheat'
  | 'mountain'
  | 'ship'
  | 'crown'
export type EmblemMetal = 'bronze' | 'gold' | 'ivory' | 'emerald'

export interface EmblemDesign {
  shape: EmblemShape
  symbol: EmblemSymbol
  metal: EmblemMetal
}

export interface Language {
  code: string
  nameAr: string
}

export interface CountryIdentity {
  kind: CountryKind
  cca2: string | null
  ccn3: string | null
  nameAr: string
  nameIntl: string
  capitalAr: string
  capitalIntl: string
  languages: Language[]
  currencyName: string
  currencyCode: string
  currencySymbol: string
  identity: string
  identityCustom: string
  flag: FlagDesign
  emblem: EmblemDesign
  areaKm2: number
  latlng: [number, number]
  regionAr: string
  subregionAr: string
  population: number
}

export interface Calendar {
  year: number
  month: number
  day: number
}

export type NotificationKind = 'system' | 'world' | 'warning'

export interface GameNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  stamp: string
  timestamp: number
  read: boolean
}

export interface GameState {
  version: 1
  id: string
  slotId: string | null
  createdAt: number
  updatedAt: number
  world: WorldConfig
  country: CountryIdentity
  government: GovernmentConfig
  conditions: Conditions
  calendar: Calendar
  notifications: GameNotification[]
  playSeconds: number
  scenarioId: string | null
}

export interface SaveMeta {
  id: string
  name: string
  updatedAt: number
  createdAt: number
  countryName: string
  countryKind: CountryKind
  cca2: string | null
  flag: FlagDesign
  year: number
  month: number
  day: number
  governmentName: string
  worldName: string
  playSeconds: number
}

export interface SaveRecord {
  meta: SaveMeta
  state: GameState
}

export interface Settings {
  textScale: 'normal' | 'large' | 'xlarge'
  reducedMotion: boolean
  autosave: boolean
}

export interface Scenario {
  id: string
  title: string
  subtitle: string
  description: string
  era: 'historical' | 'modern'
  year: number
  countryCode: string | null
  tag: string
  accent: string
  difficulty: Difficulty
  conditions?: Partial<Conditions>
  presets: {
    identity?: string
    government?: GovernmentId
    guidance: string[]
  }
}

export interface CountryRecord {
  ccn3: string
  cca2: string
  cca3: string
  nameAr: string
  officialAr: string
  nameEn: string
  officialEn: string
  capitalAr: string
  capitalEn: string
  region: string
  regionAr: string
  subregion: string
  subregionAr: string
  languages: Language[]
  currency: { code: string; nameAr: string; nameEn: string; symbol: string }
  area: number
  population: number | null
  populationYear: number | null
  latlng: [number, number]
  borders: string[]
  independent: boolean
  unMember: boolean
  landlocked: boolean
  flag: string
  income: string
  incomeAr: string
  gdpPerCapita: number | null
  gdpYear: number | null
  debtPctGdp: number | null
  debtYear: number | null
  mapId: string
}
