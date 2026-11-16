import { Vector3 } from 'three'
import type { CelestialBodyId, DestinationId } from '@/types'

export interface BodyVisualConfig {
  id: CelestialBodyId
  name: string
  /** Radio orbital artístico comprimido (unidades de escena). */
  orbitRadius: number
  /** Ángulo orbital fijo en el plano de la eclíptica (rad). */
  orbitAngle: number
  /** Radio visual de la esfera del cuerpo (unidades de escena). */
  visualRadius: number
  /** Oblicuidad / inclinación axial real (rad). */
  axialTiltRad: number
  /** Velocidad de rotación contemplativa en escena (rad/s). */
  rotationSpeed: number
  /** Color de acento para la línea orbital en vista del sistema solar. */
  orbitColor: string
}

const deg = (d: number) => (d * Math.PI) / 180

/**
 * Escala artística comprimida del sistema solar (plan §6 y §7.2B).
 * Los datos científicos reales se mantienen separados en `src/data/destinations.ts`.
 *
 * El ángulo de la Tierra (`atan2(-0.45, 0.85)`) se elige para que el vector
 * Tierra → Sol coincida con el ángulo de iluminación del hero aprobado en 2A.
 */
export const BODIES: Readonly<Record<CelestialBodyId, BodyVisualConfig>> = {
  sun: {
    id: 'sun',
    name: 'Sun',
    orbitRadius: 0,
    orbitAngle: 0,
    visualRadius: 4.4,
    axialTiltRad: deg(7.25),
    rotationSpeed: 0.004,
    orbitColor: '#ffb547',
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    orbitRadius: 12,
    orbitAngle: deg(28),
    visualRadius: 0.82,
    axialTiltRad: deg(0.03),
    rotationSpeed: 0.005,
    orbitColor: '#9aa5ad',
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    orbitRadius: 18.5,
    orbitAngle: deg(-72),
    visualRadius: 1.35,
    axialTiltRad: deg(177.36),
    rotationSpeed: -0.004,
    orbitColor: '#e6b979',
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    orbitRadius: 26.5,
    orbitAngle: Math.atan2(-0.45, 0.85),
    visualRadius: 1.5,
    axialTiltRad: deg(23.44),
    rotationSpeed: 0.01,
    orbitColor: '#00e5c3',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    orbitRadius: 36,
    orbitAngle: deg(15),
    visualRadius: 1.1,
    axialTiltRad: deg(25.19),
    rotationSpeed: 0.0095,
    orbitColor: '#d96b43',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    orbitRadius: 50,
    orbitAngle: deg(-18),
    visualRadius: 2.85,
    axialTiltRad: deg(3.13),
    rotationSpeed: 0.018,
    orbitColor: '#d8a97c',
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    orbitRadius: 68,
    orbitAngle: deg(52),
    visualRadius: 2.35,
    axialTiltRad: deg(26.73),
    rotationSpeed: 0.016,
    orbitColor: '#e2c992',
  },
}

export const PLANET_ORDER: readonly Exclude<CelestialBodyId, 'sun'>[] = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
]

/** Posición 3D de un cuerpo en el plano de la eclíptica (y = 0). */
export function getBodyPosition(id: CelestialBodyId): Vector3 {
  const b = BODIES[id]
  if (b.orbitRadius === 0) return new Vector3(0, 0, 0)
  return new Vector3(
    Math.cos(b.orbitAngle) * b.orbitRadius,
    0,
    Math.sin(b.orbitAngle) * b.orbitRadius,
  )
}

/**
 * Dirección unitaria desde un planeta hacia el Sol, con una ligera elevación
 * artística (+0.28 en Y relativo) para iluminar el hemisferio norte/superior
 * con el mismo dramatismo cinematográfico que la Tierra en 2A.
 */
export function getSunDirectionForBody(id: CelestialBodyId): Vector3 {
  if (id === 'sun') return new Vector3(0, 1, 0)
  const pos = getBodyPosition(id)
  const toSun = pos.clone().negate().normalize()
  toSun.y = 0.29
  return toSun.normalize()
}

export const DESTINATION_TO_BODY: Readonly<Record<DestinationId, Exclude<CelestialBodyId, 'sun' | 'earth'>>> = {
  'mercury-solar-frontier': 'mercury',
  'venus-cloud-haven': 'venus',
  'mars-red-frontier': 'mars',
  'jupiter-europa-station': 'jupiter',
  'saturn-titan-station': 'saturn',
  'saturn-ring-observation': 'saturn',
}

