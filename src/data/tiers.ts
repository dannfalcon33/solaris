import type { TierDefinition } from '@/types'

/**
 * Categorías comerciales de demostración. Todos los precios, duraciones y
 * plazas son FICTICIOS. El catálogo por destino llega en la FASE 5.
 */
export const tiers: readonly TierDefinition[] = [
  {
    tier: 'explorer',
    name: 'Explorer',
    tagline: 'Tu primera expedición',
    fromPriceUsd: 18500,
    durationDays: 5,
    lodging: 'Cabina estándar con ventanal panorámico',
    highlights: ['Travesía guiada', 'Observación orbital', 'Kit de expedición'],
    services: ['Entrenamiento previo de 2 días', 'Soporte médico a bordo', 'Comidas liofilizadas gourmet'],
    activities: ['Sesión de observación guiada', 'Paseo virtual por la estación'],
    demoSeats: 14,
  },
  {
    tier: 'voyager',
    name: 'Voyager',
    tagline: 'Experiencia completa',
    fromPriceUsd: 42000,
    durationDays: 9,
    lodging: 'Suite con cúpula de observación privada',
    highlights: ['Excursiones extendidas', 'Chef a bordo', 'Acceso a laboratorios'],
    services: ['Entrenamiento previo de 4 días', 'Asistente personal de expedición', 'Menú de autor'],
    activities: ['Excursión con traje presurizado', 'Taller de astrofotografía', 'Cena con vista panorámica'],
    demoSeats: 6,
  },
  {
    tier: 'infinity',
    name: 'Infinity',
    tagline: 'Sin límites, a medida',
    fromPriceUsd: 95000,
    durationDays: 14,
    lodging: 'Residencia privada con observatorio propio',
    highlights: ['Itinerario personalizado', 'Cápsula privada', 'Concierge 24/7'],
    services: ['Programa de preparación completo', 'Equipo médico dedicado', 'Traslados prioritarios'],
    activities: ['Expedición exclusiva con guía científico', 'Sesión privada de observación', 'Recuerdo conmemorativo'],
    demoSeats: 2,
  },
]

export function getTier(id: TierDefinition['tier']): TierDefinition {
  return tiers.find((t) => t.tier === id) ?? tiers[0]!
}

