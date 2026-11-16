import type { DestinationId } from './destination'

export type PackageTier = 'explorer' | 'voyager' | 'infinity'

/**
 * Paquete comercial específico por destino (FASE 5).
 * Todo el contenido (precios, duraciones y plazas) es ficticio y de demostración.
 */
export interface ExpeditionPackage {
  id: string
  tier: PackageTier
  tierLabel: 'Explorer' | 'Voyager' | 'Infinity'
  destinationId: DestinationId
  name: string
  tagline: string
  /** Precio ficticio por persona en USD. */
  priceUsd: number
  /** Duración ficticia total de la misión en días. */
  durationDays: number
  description: string
  lodging: string
  highlights: string[]
  services: string[]
  activities: string[]
  /** Plazas simuladas disponibles. */
  availableSeats: number
}
