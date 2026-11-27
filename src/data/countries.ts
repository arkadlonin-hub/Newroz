import raw from './countries.json'
import type { Conditions, CountryIdentity, CountryRecord, Difficulty, Language } from '../game/types'
import { DEFAULT_EMBLEM, DEFAULT_FLAG } from './identities'

export const COUNTRIES = raw as unknown as CountryRecord[]

const ARAB_LEAGUE = new Set([
  'DZA', 'BHR', 'COM', 'DJI', 'EGY', 'IRQ', 'JOR', 'KWT', 'LBN', 'LBY',
  'MRT', 'MAR', 'OMN', 'PSE', 'QAT', 'SAU', 'SOM', 'SDN', 'SYR', 'TUN',
  'ARE', 'YEM',
])

const SPECIAL_POPULATION: Record<string, number> = {
  TWN: 23_400_000,
  VAT: 800,
}

const SPECIAL_GDP: Record<string, number> = {
  TWN: 33_000,
  VAT: 20_000,
  PRK: 640,
  CUB: 9_500,
  ERI: 700,
  YEM: 650,
  SSD: 420,
}

export const SELECTABLE_COUNTRIES = COUNTRIES.filter(
  (c) => c.unMember || c.independent || c.cca2 === 'PS' || c.cca2 === 'TW',
)

export const COUNTRY_BY_CCA2 = new Map(COUNTRIES.map((c) => [c.cca2, c]))
export const COUNTRY_BY_CCA3 = new Map(COUNTRIES.map((c) => [c.cca3, c]))
export const COUNTRY_BY_CCN3 = new Map(COUNTRIES.map((c) => [c.ccn3, c]))

export function countryName(record: CountryRecord): string {
  return record.nameAr
}

export function isArabCountry(record: CountryRecord): boolean {
  return ARAB_LEAGUE.has(record.cca3)
}

export function recordPopulation(record: CountryRecord): number {
  return record.population ?? SPECIAL_POPULATION[record.cca3] ?? 1_000_000
}

export function recordGdpPerCapita(record: CountryRecord): number {
  if (record.gdpPerCapita) return record.gdpPerCapita
  if (SPECIAL_GDP[record.cca3]) return SPECIAL_GDP[record.cca3]
  if (record.income === 'HIC') return 38_000
  if (record.income === 'UMC') return 9_000
  if (record.income === 'LMC') return 2_600
  if (record.income === 'LIC') return 750
  return 4_500
}

const INCOME_INDICES: Record<string, number[]> = {
  HIC: [78, 76, 82, 84, 86, 48, 62, 52, 74, 74],
  UMC: [60, 60, 66, 64, 70, 58, 55, 60, 62, 62],
  LMC: [43, 42, 50, 46, 52, 58, 40, 52, 48, 48],
  LIC: [28, 25, 34, 30, 32, 55, 26, 44, 38, 40],
}

const DIFFICULTY_MODIFIERS: Record<
  Difficulty,
  { treasury: number; stability: number; relations: number; debt: number; indices: number }
> = {
  easy: { treasury: 1.4, stability: 9, relations: 6, debt: -10, indices: 6 },
  balanced: { treasury: 1, stability: 0, relations: 0, debt: 0, indices: 0 },
  realistic: { treasury: 0.85, stability: -5, relations: -4, debt: 9, indices: -5 },
  hard: { treasury: 0.65, stability: -12, relations: -10, debt: 18, indices: -11 },
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value))
}

export function baseConditions(record: CountryRecord, difficulty: Difficulty = 'balanced'): Conditions {
  const mod = DIFFICULTY_MODIFIERS[difficulty]
  const population = recordPopulation(record)
  const gdpPerCapita = recordGdpPerCapita(record)
  const gdpBillions = (population * gdpPerCapita) / 1_000_000_000
  const base = INCOME_INDICES[record.income] ?? INCOME_INDICES.UMC
  const defaultDebt =
    record.income === 'HIC' ? 76 : record.income === 'UMC' ? 58 : record.income === 'LMC' ? 52 : 44
  const debtPct = clamp((record.debtPctGdp ?? defaultDebt) + mod.debt, 2, 180)
  const hasResources =
    record.cca3 === 'SAU' || record.cca3 === 'IRQ' || record.cca3 === 'IRN' ||
    record.cca3 === 'RUS' || record.cca3 === 'NGA' || record.cca3 === 'VEN' ||
    record.cca3 === 'DZA' || record.cca3 === 'LBY' || record.cca3 === 'KAZ' ||
    record.cca3 === 'ARE' || record.cca3 === 'QAT' || record.cca3 === 'KWT' ||
    record.cca3 === 'NOR' || record.cca3 === 'AUS' || record.cca3 === 'CAN'
  const values = base.map((v, i) => clamp(Math.round(v + mod.indices + (hasResources && i === 7 ? 16 : 0)), 3, 98))
  return {
    population,
    treasury: Math.max(0.2, Math.round(gdpBillions * 0.18 * mod.treasury * 10) / 10),
    debtPct,
    economy: values[0],
    infrastructure: values[1],
    education: values[2],
    healthcare: values[3],
    energy: values[4],
    agriculture: values[5],
    industry: values[6],
    resources: values[7],
    stability: clamp(values[8] + mod.stability, 3, 98),
    relations: clamp(values[9] + mod.relations, 3, 98),
  }
}

export function fictionalConditions(
  population: number,
  development: 'developing' | 'emerging' | 'advanced',
  difficulty: Difficulty = 'balanced',
): Conditions {
  const mod = DIFFICULTY_MODIFIERS[difficulty]
  const income = development === 'advanced' ? 'HIC' : development === 'emerging' ? 'UMC' : 'LMC'
  const base = INCOME_INDICES[income]
  const gdpPerCapita = development === 'advanced' ? 42_000 : development === 'emerging' ? 11_000 : 3_200
  const gdpBillions = (population * gdpPerCapita) / 1_000_000_000
  const defaultDebt = development === 'advanced' ? 70 : development === 'emerging' ? 55 : 44
  const values = base.map((v) => clamp(Math.round(v + mod.indices), 3, 98))
  return {
    population,
    treasury: Math.max(0.05, Math.round(gdpBillions * 0.18 * mod.treasury * 10) / 10),
    debtPct: clamp(defaultDebt + mod.debt, 2, 180),
    economy: values[0],
    infrastructure: values[1],
    education: values[2],
    healthcare: values[3],
    energy: values[4],
    agriculture: values[5],
    industry: values[6],
    resources: values[7],
    stability: clamp(values[8] + mod.stability, 3, 98),
    relations: clamp(values[9] + mod.relations, 3, 98),
  }
}

export function defaultIdentityForCountry(record: CountryRecord): CountryIdentity {
  const identity = isArabCountry(record) ? 'arab' : regionIdentity(record)
  return {
    kind: 'real',
    cca2: record.cca2,
    ccn3: record.ccn3,
    nameAr: record.nameAr,
    nameIntl: record.nameEn,
    capitalAr: record.capitalAr,
    capitalIntl: record.capitalEn,
    languages: record.languages.length ? record.languages : [{ code: 'ara', nameAr: 'العربية' }],
    currencyName: record.currency.nameAr,
    currencyCode: record.currency.code,
    currencySymbol: record.currency.symbol,
    identity,
    identityCustom: '',
    flag: { ...DEFAULT_FLAG, preset: 'official' },
    emblem: { ...DEFAULT_EMBLEM },
    areaKm2: record.area,
    latlng: record.latlng,
    regionAr: record.regionAr,
    subregionAr: record.subregionAr,
    population: recordPopulation(record),
  }
}

function regionIdentity(record: CountryRecord): string {
  if (record.region === 'Africa') return 'african'
  if (record.region === 'Europe') return 'western'
  if (record.region === 'Americas') return 'plural'
  if (record.region === 'Asia') {
    if (record.subregion === 'Western Asia') return 'islamic'
    return 'asian'
  }
  return 'plural'
}

export function emptyFictionalIdentity(): CountryIdentity {
  return {
    kind: 'fictional',
    cca2: null,
    ccn3: null,
    nameAr: '',
    nameIntl: '',
    capitalAr: '',
    capitalIntl: '',
    languages: [{ code: 'ara', nameAr: 'العربية' }],
    currencyName: 'دينار',
    currencyCode: 'ND',
    currencySymbol: 'د',
    identity: 'plural',
    identityCustom: '',
    flag: { ...DEFAULT_FLAG },
    emblem: { ...DEFAULT_EMBLEM },
    areaKm2: 120_000,
    latlng: [25, 35],
    regionAr: 'عالم خيالي',
    subregionAr: '',
    population: 6_000_000,
  }
}

export function languageList(codes: string[]): Language[] {
  return codes.map((code) => ({ code, nameAr: code }))
}
