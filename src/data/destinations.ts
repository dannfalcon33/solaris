import type { Destination, DestinationId } from '@/types'

/**
 * Catálogo de destinos de la primera versión.
 * Los datos científicos son reales; las estaciones y colonias son ficticias.
 */
export const destinations: readonly Destination[] = [
  {
    id: 'mercury-solar-frontier',
    bodyId: 'mercury',
    kind: 'planet',
    name: 'Mercury — Solar Frontier',
    bodyName: 'Mercury',
    experienceName: 'Solar Frontier',
    tagline: 'Expedición de superficie bajo el Sol más intenso',
    description:
      'Expedición ficticia a la superficie craterizada de Mercurio, el planeta más cercano al Sol.',
    isFictional: true,
    science: {
      diameterKm: 4879,
      distanceFromSunMkm: 57.9,
      rotationPeriodHours: 1407.6,
      orbitalPeriodDays: 88,
      gravityMs2: 3.7,
      meanTemperatureC: 167,
    },
  },
  {
    id: 'venus-cloud-haven',
    bodyId: 'venus',
    kind: 'station',
    name: 'Venus — Cloud Haven',
    bodyName: 'Venus',
    experienceName: 'Cloud Haven',
    tagline: 'Estación flotante en las capas altas de la atmósfera',
    description:
      'Estación turística ficticia suspendida en las capas altas de la atmósfera de Venus.',
    isFictional: true,
    science: {
      diameterKm: 12104,
      distanceFromSunMkm: 108.2,
      rotationPeriodHours: -5832.5,
      orbitalPeriodDays: 224.7,
      gravityMs2: 8.87,
      meanTemperatureC: 464,
    },
  },
  {
    id: 'mars-red-frontier',
    bodyId: 'mars',
    kind: 'planet',
    name: 'Mars — Red Frontier',
    bodyName: 'Mars',
    experienceName: 'Red Frontier',
    tagline: 'Colonia y expedición de superficie',
    description:
      'Colonia y expedición ficticias sobre el terreno rojizo de Marte, con instalaciones de turismo.',
    isFictional: true,
    science: {
      diameterKm: 6779,
      distanceFromSunMkm: 227.9,
      rotationPeriodHours: 24.6,
      orbitalPeriodDays: 687,
      gravityMs2: 3.71,
      meanTemperatureC: -63,
    },
  },
  {
    id: 'jupiter-europa-station',
    bodyId: 'jupiter',
    kind: 'station',
    name: 'Jupiter — Europa Orbital Station',
    bodyName: 'Jupiter',
    experienceName: 'Europa Orbital Station',
    tagline: 'Complejo orbital con vistas a las lunas galileanas',
    description:
      'Complejo ficticio en órbita de Júpiter, con vistas a sus lunas y a Europa.',
    isFictional: true,
    science: {
      diameterKm: 139820,
      distanceFromSunMkm: 778.5,
      rotationPeriodHours: 9.9,
      orbitalPeriodDays: 4331,
      gravityMs2: 24.79,
      meanTemperatureC: -108,
    },
  },
  {
    id: 'saturn-titan-station',
    bodyId: 'saturn',
    kind: 'station',
    name: 'Saturn — Titan Orbital Station',
    bodyName: 'Saturn',
    experienceName: 'Titan Orbital Station',
    tagline: 'Complejo orbital con excursiones visuales a Titán',
    description:
      'Complejo ficticio en órbita de Saturno, con excursiones visuales hacia Titán.',
    isFictional: true,
    science: {
      diameterKm: 116460,
      distanceFromSunMkm: 1434,
      rotationPeriodHours: 10.7,
      orbitalPeriodDays: 10747,
      gravityMs2: 10.44,
      meanTemperatureC: -139,
    },
  },
  {
    id: 'saturn-ring-observation',
    bodyId: 'saturn',
    kind: 'station',
    name: 'Saturn — Ring Observation',
    bodyName: 'Saturn',
    experienceName: 'Ring Observation',
    tagline: 'Observación de los anillos desde una instalación orbital',
    description:
      'Experiencia especializada de observación de los anillos de Saturno desde una instalación orbital ficticia.',
    isFictional: true,
    science: {
      diameterKm: 116460,
      distanceFromSunMkm: 1434,
      rotationPeriodHours: 10.7,
      orbitalPeriodDays: 10747,
      gravityMs2: 10.44,
      meanTemperatureC: -139,
    },
  },
]

export const destinationsById: Readonly<Record<DestinationId, Destination>> =
  Object.fromEntries(destinations.map((d) => [d.id, d])) as Record<
    DestinationId,
    Destination
  >

export function getDestination(id: DestinationId): Destination {
  return destinationsById[id]
}
