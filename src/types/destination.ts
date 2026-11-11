export type DestinationId =
  | 'mercury-solar-frontier'
  | 'venus-cloud-haven'
  | 'mars-red-frontier'
  | 'jupiter-europa-station'
  | 'saturn-titan-station'
  | 'saturn-ring-observation'

export type CelestialBodyId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'

/** 'planet': experiencia de superficie/atmósfera. 'station': instalación orbital ficticia. */
export type DestinationKind = 'planet' | 'station'

/**
 * Datos científicos reales. Se mantienen separados de las posiciones visuales
 * de la escena, que usan una escala artística comprimida (plan §6).
 */
export interface ScientificData {
  /** Diámetro medio en km. */
  diameterKm: number
  /** Distancia media al Sol en millones de km. */
  distanceFromSunMkm: number
  /** Duración del día sideral en horas (negativo = rotación retrógrada). */
  rotationPeriodHours: number
  /** Periodo orbital en días terrestres. */
  orbitalPeriodDays: number
  /** Gravedad en superficie (m/s²). */
  gravityMs2: number
  /** Temperatura media aproximada en °C. */
  meanTemperatureC: number
}

export interface Destination {
  id: DestinationId
  /** Cuerpo celeste real al que pertenece el destino. */
  bodyId: Exclude<CelestialBodyId, 'sun' | 'earth'>
  kind: DestinationKind
  /** Nombre completo, p. ej. "Saturn — Ring Observation". */
  name: string
  /** Cuerpo, p. ej. "Saturn". */
  bodyName: string
  /** Experiencia, p. ej. "Ring Observation". */
  experienceName: string
  tagline: string
  description: string
  /** `true` si la instalación/experiencia es ficción (estaciones, colonias). */
  isFictional: boolean
  science: ScientificData
}

