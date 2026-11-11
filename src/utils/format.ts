const nf = new Intl.NumberFormat('es-ES')
const nf1 = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })

export const formatInt = (n: number) => nf.format(Math.round(n))
export const formatDecimal = (n: number) => nf1.format(n)

export function formatUsd(n: number): string {
  return `USD ${nf.format(n)}`
}

/** Duración del día sideral: horas o días según magnitud. */
export function formatRotation(hours: number): { value: string; unit: string; retrograde: boolean } {
  const abs = Math.abs(hours)
  const retrograde = hours < 0
  if (abs >= 100) return { value: formatDecimal(abs / 24), unit: 'días terr.', retrograde }
  return { value: formatDecimal(abs), unit: 'h', retrograde }
}

/** Periodo orbital: días o años terrestres. */
export function formatOrbit(days: number): { value: string; unit: string } {
  if (days >= 1000) return { value: formatDecimal(days / 365.25), unit: 'años terr.' }
  return { value: formatDecimal(days), unit: 'días terr.' }
}

