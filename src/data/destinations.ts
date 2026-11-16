import { useUiStore, type Locale } from '@/stores/ui.store'
import type { Destination, DestinationId } from '@/types'

interface LocalizedDestinationText {
  bodyName: string
  experienceName: string
  tagline: string
  description: string
  facility: {
    facilityName: string
    orbitProfile: string
    featureHighlight: string
  }
}

const DESTINATION_I18N: Readonly<
  Record<DestinationId, Record<Locale, LocalizedDestinationText>>
> = {
  'mercury-solar-frontier': {
    es: {
      bodyName: 'Mercurio',
      experienceName: 'Solar Frontier',
      tagline: 'Expedición de superficie bajo el Sol más intenso',
      description:
        'Expedición ficticia a la superficie craterizada de Mercurio con escudo térmico orbital y domos en el terminador.',
      facility: {
        facilityName: 'Helios Shield Relay & Terminator Outpost',
        orbitProfile: 'Órbita polar sincrónica · 240 km',
        featureHighlight: 'Escudo térmico multicapa + hábitats en cráteres del terminador',
      },
    },
    en: {
      bodyName: 'Mercury',
      experienceName: 'Solar Frontier',
      tagline: 'Surface expedition beneath the fiercest Sun',
      description:
        'Fictional expedition to Mercury’s cratered surface featuring an orbital thermal shield and terminator domes.',
      facility: {
        facilityName: 'Helios Shield Relay & Terminator Outpost',
        orbitProfile: 'Sun-synchronous polar orbit · 240 km',
        featureHighlight: 'Multi-layer thermal shield + crater habitats on the terminator',
      },
    },
    pt: {
      bodyName: 'Mercúrio',
      experienceName: 'Solar Frontier',
      tagline: 'Expedição de superfície sob o Sol mais intenso',
      description:
        'Expedição fictícia à superfície repleta de crateras de Mercúrio com escudo térmico orbital e domos no terminador.',
      facility: {
        facilityName: 'Helios Shield Relay & Terminator Outpost',
        orbitProfile: 'Órbita polar síncrona · 240 km',
        featureHighlight: 'Escudo térmico multicamadas + habitats em crateras do terminador',
      },
    },
  },
  'venus-cloud-haven': {
    es: {
      bodyName: 'Venus',
      experienceName: 'Cloud Haven',
      tagline: 'Estación flotante en las capas altas de la atmósfera',
      description:
        'Estación turística ficticia sobre las capas altas de la atmósfera de Venus, con vistas al manto nuboso en super-rotación.',
      facility: {
        facilityName: 'Cloud Haven Aerostat Complex',
        orbitProfile: 'Corredor estratosférico / orbital · 55–180 km',
        featureHighlight: 'Anillo aerostático de bronce y cúpula panorámica sobre las nubes',
      },
    },
    en: {
      bodyName: 'Venus',
      experienceName: 'Cloud Haven',
      tagline: 'Floating station in the upper atmospheric layers',
      description:
        'Fictional luxury station above Venus’s upper atmosphere overlooking the super-rotating golden cloud deck.',
      facility: {
        facilityName: 'Cloud Haven Aerostat Complex',
        orbitProfile: 'Stratospheric / orbital corridor · 55–180 km',
        featureHighlight: 'Bronze aerostat ring and panoramic dome above the clouds',
      },
    },
    pt: {
      bodyName: 'Vênus',
      experienceName: 'Cloud Haven',
      tagline: 'Estação flutuante nas camadas altas da atmosfera',
      description:
        'Estação turística fictícia sobre as camadas altas da atmosfera de Vênus, com vista para o manto de nuvens em super-rotação.',
      facility: {
        facilityName: 'Cloud Haven Aerostat Complex',
        orbitProfile: 'Corredor estratosférico / orbital · 55–180 km',
        featureHighlight: 'Anel aerostático de bronze e cúpula panorâmica sobre as nuvens',
      },
    },
  },
  'mars-red-frontier': {
    es: {
      bodyName: 'Marte',
      experienceName: 'Red Frontier',
      tagline: 'Colonia y expedición de superficie',
      description:
        'Colonia y expedición ficticias sobre el terreno rojizo de Marte, conectadas mediante terminal orbital de transferencia.',
      facility: {
        facilityName: 'Ares Orbital Hub & Marineris Biodomes',
        orbitProfile: 'Órbita areocéntrica baja · 380 km',
        featureHighlight: 'Terminal con anillo centrífugo + red de biodomos en superficie',
      },
    },
    en: {
      bodyName: 'Mars',
      experienceName: 'Red Frontier',
      tagline: 'Surface colony and planetary expedition',
      description:
        'Fictional colony and surface expedition across the rusty terrain of Mars, linked via an orbital transfer hub.',
      facility: {
        facilityName: 'Ares Orbital Hub & Marineris Biodomes',
        orbitProfile: 'Low areocentric orbit · 380 km',
        featureHighlight: 'Centrifuge orbital terminal + surface biodome network',
      },
    },
    pt: {
      bodyName: 'Marte',
      experienceName: 'Red Frontier',
      tagline: 'Colônia e expedição de superfície',
      description:
        'Colônia e expedição fictícias sobre o terreno avermelhado de Marte, conectadas por um terminal orbital de transferência.',
      facility: {
        facilityName: 'Ares Orbital Hub & Marineris Biodomes',
        orbitProfile: 'Órbita areocêntrica baixa · 380 km',
        featureHighlight: 'Terminal com anel centrífugo + rede de biodomos na superfície',
      },
    },
  },
  'jupiter-europa-station': {
    es: {
      bodyName: 'Júpiter',
      experienceName: 'Europa Orbital Station',
      tagline: 'Complejo orbital con vistas a las lunas galileanas',
      description:
        'Complejo ficticio en órbita exterior de Júpiter, con vistas directas a la corteza helada de Europa y la Gran Mancha Roja.',
      facility: {
        facilityName: 'Galileo Deep-Space Centrifuge Station',
        orbitProfile: 'Órbita joviana exterior (L1 Europa) · 670.900 km',
        featureHighlight: 'Doble anillo centrífugo + vista en primer plano de la luna Europa',
      },
    },
    en: {
      bodyName: 'Jupiter',
      experienceName: 'Europa Orbital Station',
      tagline: 'Orbital complex overlooking the Galilean moons',
      description:
        'Fictional deep-space complex in outer Jovian orbit with direct views of Europa’s fractured ice crust and the Great Red Spot.',
      facility: {
        facilityName: 'Galileo Deep-Space Centrifuge Station',
        orbitProfile: 'Outer Jovian orbit (Europa L1) · 670,900 km',
        featureHighlight: 'Dual centrifuge ring + close-up view of icy moon Europa',
      },
    },
    pt: {
      bodyName: 'Júpiter',
      experienceName: 'Europa Orbital Station',
      tagline: 'Complexo orbital com vista para as luas galileanas',
      description:
        'Complexo fictício na órbita externa de Júpiter, com vista direta para a crosta congelada de Europa e a Grande Mancha Vermelha.',
      facility: {
        facilityName: 'Galileo Deep-Space Centrifuge Station',
        orbitProfile: 'Órbita joviana externa (L1 Europa) · 670.900 km',
        featureHighlight: 'Duplo anel centrífugo + visão em primeiro plano da lua Europa',
      },
    },
  },
  'saturn-titan-station': {
    es: {
      bodyName: 'Saturno',
      experienceName: 'Titan Orbital Station',
      tagline: 'Complejo orbital con excursiones visuales a Titán',
      description:
        'Complejo ficticio en órbita exterior de Saturno, con vistas panorámicas a la atmósfera dorada de Titán y los anillos.',
      facility: {
        facilityName: 'Huygens Orbital Sanctuary',
        orbitProfile: 'Órbita saturniana exterior · 1.221.800 km',
        featureHighlight: 'Torre de observación + vista directa a la luna Titán y su bruma azul',
      },
    },
    en: {
      bodyName: 'Saturn',
      experienceName: 'Titan Orbital Station',
      tagline: 'Orbital complex with visual excursions toward Titan',
      description:
        'Fictional sanctuary in outer Saturnian orbit offering panoramic views of Titan’s golden atmosphere and Saturn’s rings.',
      facility: {
        facilityName: 'Huygens Orbital Sanctuary',
        orbitProfile: 'Outer Saturnian orbit · 1,221,800 km',
        featureHighlight: 'Observation spire + direct view of moon Titan and its blue haze',
      },
    },
    pt: {
      bodyName: 'Saturno',
      experienceName: 'Titan Orbital Station',
      tagline: 'Complexo orbital com excursões visuais para Titã',
      description:
        'Complexo fictício na órbita externa de Saturno, com vistas panorâmicas para a atmosfera dourada de Titã e os anéis.',
      facility: {
        facilityName: 'Huygens Orbital Sanctuary',
        orbitProfile: 'Órbita saturniana externa · 1.221.800 km',
        featureHighlight: 'Torre de observação + visão direta da lua Titã e sua névoa azul',
      },
    },
  },
  'saturn-ring-observation': {
    es: {
      bodyName: 'Saturno',
      experienceName: 'Ring Observation',
      tagline: 'Observación de los anillos desde una instalación orbital',
      description:
        'Observatorio orbital ficticio situado sobre el plano de los anillos de Saturno, frente a la División de Cassini.',
      facility: {
        facilityName: 'Cassini Division Conservatory',
        orbitProfile: 'Órbita inclinada sobre el plano de anillos · +42.000 km',
        featureHighlight: 'Cúpula cenital orientada hacia los anillos A/B y la División de Cassini',
      },
    },
    en: {
      bodyName: 'Saturn',
      experienceName: 'Ring Observation',
      tagline: 'Ring observation from a specialized orbital facility',
      description:
        'Fictional orbital conservatory positioned above Saturn’s ring plane directly overlooking the Cassini Division.',
      facility: {
        facilityName: 'Cassini Division Conservatory',
        orbitProfile: 'Inclined orbit above the ring plane · +42,000 km',
        featureHighlight: 'Nadir conservatory dome facing the A/B rings and Cassini Division',
      },
    },
    pt: {
      bodyName: 'Saturno',
      experienceName: 'Ring Observation',
      tagline: 'Observação dos anéis a partir de uma instalação orbital',
      description:
        'Observatório orbital fictício posicionado acima do plano dos anéis de Saturno, de frente para a Divisão de Cassini.',
      facility: {
        facilityName: 'Cassini Division Conservatory',
        orbitProfile: 'Órbita inclinada sobre o plano dos anéis · +42.000 km',
        featureHighlight: 'Cúpula voltada para os anéis A/B e a Divisão de Cassini',
      },
    },
  },
}

const BASE_DESTINATIONS: readonly Omit<
  Destination,
  'name' | 'bodyName' | 'experienceName' | 'tagline' | 'description' | 'facility'
>[] = [
  {
    id: 'mercury-solar-frontier',
    bodyId: 'mercury',
    kind: 'planet',
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

function materializeDestination(
  base: (typeof BASE_DESTINATIONS)[number],
  locale: Locale,
): Destination {
  const loc = DESTINATION_I18N[base.id][locale]
  return {
    ...base,
    name: `${loc.bodyName} — ${loc.experienceName}`,
    bodyName: loc.bodyName,
    experienceName: loc.experienceName,
    tagline: loc.tagline,
    description: loc.description,
    facility: loc.facility,
  }
}

export const destinations: readonly Destination[] = BASE_DESTINATIONS.map((b) =>
  materializeDestination(b, 'es'),
)

export function getDestinations(locale?: Locale): readonly Destination[] {
  const loc = locale ?? useUiStore.getState().locale
  return BASE_DESTINATIONS.map((b) => materializeDestination(b, loc))
}

export function getDestination(id: DestinationId, locale?: Locale): Destination {
  const loc = locale ?? useUiStore.getState().locale
  const base = BASE_DESTINATIONS.find((b) => b.id === id) ?? BASE_DESTINATIONS[0]!
  return materializeDestination(base, loc)
}
