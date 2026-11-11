import type { DestinationId } from './destination'

export type PackageTier = 'explorer' | 'voyager' | 'infinity'

/**
 * Definición genérica de categoría (Explorer / Voyager / Infinity) usada por
 * las tarjetas de la FASE 1. Contenido de demostración.
 */
export interface TierDefinition {
  tier: PackageTier
  name: string
  tagline: string
  /** Precio "desde" ficticio en USD. */
  fromPriceUsd: number
  durationDays: number
  lodging: string
  highlights: string[]
  services: string[]
  activities: string[]
  /** Plazas simuladas. */
  demoSeats: number
}

/**
 * Paquete comercial. Todo el contenido es ficticio y de demostración
 * (precios, duración y disponibilidad).
 */
export interface ExpeditionPackage {
  id: string
  tier: PackageTier
  destinationId: DestinationId
  name: string
  /** Precio ficticio en USD. */
  priceUsd: number
  durationDays: number
  description: string
  lodging: string
  services: string[]
  activities: string[]
  /** Plazas simuladas disponibles. */
  availableSeats: number
}

