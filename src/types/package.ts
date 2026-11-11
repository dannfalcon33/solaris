import type { DestinationId } from './destination'

export type PackageTier = 'explorer' | 'voyager' | 'infinity'

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

