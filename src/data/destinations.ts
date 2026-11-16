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
      'Expedición ficticia a la superficie craterizada de Mercurio con escudo térmico orbital y domos en el terminador.',
    isFictional: true,
    facility: {
      facilityName: 'Helios Shield Relay & Terminator Outpost',
      orbitProfile: 'Órbita polar sincrónica · 240 km',
      featureHighlight: 'Escudo térmico multicapa + hábitats en cráteres del terminador',
    },
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
      'Estación turística ficticia sobre las capas altas de la atmósfera de Venus, con vistas al manto nuboso en super-rotación.',
    isFictional: true,
    facility: {
      facilityName: 'Cloud Haven Aerostat Complex',
      orbitProfile: 'Corredor estratosférico / orbital · 55–180 km',
      featureHighlight: 'Anillo aerostático de bronce y cúpula panorámica sobre las nubes',
    },
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
      'Colonia y expedición ficticias sobre el terreno rojizo de Marte, conectadas mediante terminal orbital de transferencia.',
    isFictional: true,
    facility: {
      facilityName: 'Ares Orbital Hub & Marineris Biodomes',
      orbitProfile: 'Órbita areocéntrica baja · 380 km',
      featureHighlight: 'Terminal con anillo centrífugo + red de biodomos en superficie',
    },
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
      'Complejo ficticio en órbita exterior de Júpiter, con vistas directas a la corteza helada de Europa y la Gran Mancha Roja.',
    isFictional: true,
    facility: {
      facilityName: 'Galileo Deep-Space Centrifuge Station',
      orbitProfile: 'Órbita joviana exterior (L1 Europa) · 670.900 km',
      featureHighlight: 'Doble anillo centrífugo + vista en primer plano de la luna Europa',
    },
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
      'Complejo ficticio en órbita exterior de Saturno, con vistas panorámicas a la atmósfera dorada de Titán y los anillos.',
    isFictional: true,
    facility: {
      facilityName: 'Huygens Orbital Sanctuary',
      orbitProfile: 'Órbita saturniana exterior · 1.221.800 km',
      featureHighlight: 'Torre de observación + vista directa a la luna Titán y su bruma azul',
    },
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
      'Observatorio orbital ficticio situado sobre el plano de los anillos de Saturno, frente a la División de Cassini.',
    isFictional: true,
    facility: {
      facilityName: 'Cassini Division Conservatory',
      orbitProfile: 'Órbita inclinada sobre el plano de anillos · +42.000 km',
      featureHighlight: 'Cúpula cenital orientada hacia los anillos A/B y la División de Cassini',
    },
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
