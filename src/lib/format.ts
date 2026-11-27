import type { Calendar } from '../game/types'

const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

export function toDate(calendar: Calendar): Date {
  return new Date(Date.UTC(calendar.year, calendar.month - 1, calendar.day))
}

export function formatGameDate(calendar: Calendar, withWeekday = false): string {
  const d = toDate(calendar)
  if (withWeekday) {
    return new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(d)
  }
  return `${calendar.day} ${AR_MONTHS[calendar.month - 1]} ${calendar.year}`
}

export function formatShortDate(calendar: Calendar): string {
  return `${calendar.day} ${AR_MONTHS[calendar.month - 1]} ${calendar.year}`
}

export function addDays(calendar: Calendar, days: number): Calendar {
  const d = toDate(calendar)
  d.setUTCDate(d.getUTCDate() + days)
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
}

export function formatDecimal(n: number, digits = 1): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(n)
}

export function formatCompact(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000_000) return `${formatDecimal(n / 1_000_000_000_000, 2)} تريليون`
  if (abs >= 1_000_000_000) return `${formatDecimal(n / 1_000_000_000, 2)} مليار`
  if (abs >= 1_000_000) return `${formatDecimal(n / 1_000_000, 1)} مليون`
  if (abs >= 10_000) return `${formatDecimal(n / 1_000, 0)} ألف`
  return formatNumber(n)
}

export function formatPopulation(n: number): string {
  return `${formatCompact(n)} نسمة`
}

export function formatMoney(billions: number): string {
  if (billions >= 1_000) return `${formatDecimal(billions / 1_000, 2)} تريليون دولار`
  if (billions >= 1) return `${formatDecimal(billions, 1)} مليار دولار`
  return `${formatDecimal(billions * 1_000, 0)} مليون دولار`
}

export function formatMoneyShort(billions: number): string {
  if (billions >= 1_000) return `${formatDecimal(billions / 1_000, 1)} تريليون`
  if (billions >= 1) return `${formatDecimal(billions, 0)} مليار`
  return `${formatDecimal(billions * 1_000, 0)} مليون`
}

export function formatArea(km2: number): string {
  if (km2 >= 1_000_000) return `${formatDecimal(km2 / 1_000_000, 2)} مليون كم²`
  return `${formatNumber(Math.round(km2))} كم²`
}

export function formatPercent(n: number, digits = 0): string {
  return `${formatDecimal(n, digits)}%`
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins} د`
  const hours = Math.floor(mins / 60)
  const rest = mins % 60
  return `${hours} س ${rest} د`
}

export function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `منذ ${minutes} دقيقة`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  const days = Math.floor(hours / 24)
  if (days < 30) return `منذ ${days} يوم`
  return new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(timestamp))
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value))
}

export function uid(prefix = 'n'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
