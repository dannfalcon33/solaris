import { useUiStore, type Locale } from '@/stores/ui.store'

const INT_FORMATTERS: Record<Locale, Intl.NumberFormat> = {
  es: new Intl.NumberFormat('es-ES'),
  en: new Intl.NumberFormat('en-US'),
  pt: new Intl.NumberFormat('pt-BR'),
}

const DEC_FORMATTERS: Record<Locale, Intl.NumberFormat> = {
  es: new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }),
  en: new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }),
  pt: new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }),
}

function resolveLocale(locale?: Locale): Locale {
  return locale ?? useUiStore.getState().locale
}

export const formatInt = (n: number, locale?: Locale) =>
  INT_FORMATTERS[resolveLocale(locale)].format(Math.round(n))

export const formatDecimal = (n: number, locale?: Locale) =>
  DEC_FORMATTERS[resolveLocale(locale)].format(n)

export function formatUsd(n: number, locale?: Locale): string {
  return `USD ${INT_FORMATTERS[resolveLocale(locale)].format(n)}`
}

const UNITS: Record<Locale, { days: string; years: string; hours: string }> = {
  es: { days: 'días terr.', years: 'años terr.', hours: 'h' },
  en: { days: 'Earth days', years: 'Earth yrs', hours: 'h' },
  pt: { days: 'dias terr.', years: 'anos terr.', hours: 'h' },
}

/** Duración del día sideral: horas o días según magnitud. */
export function formatRotation(
  hours: number,
  locale?: Locale,
): { value: string; unit: string; retrograde: boolean } {
  const loc = resolveLocale(locale)
  const abs = Math.abs(hours)
  const retrograde = hours < 0
  if (abs >= 100) {
    return { value: formatDecimal(abs / 24, loc), unit: UNITS[loc].days, retrograde }
  }
  return { value: formatDecimal(abs, loc), unit: UNITS[loc].hours, retrograde }
}

/** Periodo orbital: días o años terrestres. */
export function formatOrbit(days: number, locale?: Locale): { value: string; unit: string } {
  const loc = resolveLocale(locale)
  if (days >= 1000) {
    return { value: formatDecimal(days / 365.25, loc), unit: UNITS[loc].years }
  }
  return { value: formatDecimal(days, loc), unit: UNITS[loc].days }
}
