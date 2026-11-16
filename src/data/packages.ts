import { useUiStore, type Locale } from '@/stores/ui.store'
import type { DestinationId, ExpeditionPackage, PackageTier } from '@/types'

interface LocalizedPackageText {
  tagline: string
  description: string
  lodging: string
  highlights: string[]
  services: string[]
  activities: string[]
}

interface PackageBlueprint {
  id: string
  tier: PackageTier
  tierLabel: 'Explorer' | 'Voyager' | 'Infinity'
  destinationId: DestinationId
  name: string
  priceUsd: number
  durationDays: number
  availableSeats: number
  i18n: Record<Locale, LocalizedPackageText>
}

const PACKAGE_BLUEPRINTS: readonly PackageBlueprint[] = [
  /* ================================================================ */
  /* 1. MERCURY — Solar Frontier                                      */
  /* ================================================================ */
  {
    id: 'mercury-explorer',
    tier: 'explorer',
    tierLabel: 'Explorer',
    destinationId: 'mercury-solar-frontier',
    name: 'Helios Recon',
    priceUsd: 24500,
    durationDays: 6,
    availableSeats: 12,
    i18n: {
      es: {
        tagline: 'Órbita polar tras el escudo térmico dorado',
        description:
          'Aproximación orbital protegida por el escudo multicapa Helios Relay, con observación filtrada de la corona solar y sobrevuelo rasante de la cuenca Caloris.',
        lodging: 'Cabina térmica blindada con visor espectroscópico en Helios Relay',
        highlights: [
          'Observación solar de alta resolución tras escudo multicapa',
          'Sobrevuelo orbital rasante sobre la cuenca Caloris',
          'Telemetría guiada por astrofísicos de misión',
        ],
        services: [
          'Entrenamiento de protección radiológica (2 días)',
          'Dosimetría activa y blindaje magnético personal',
          'Gastronomía orbital de hidratación avanzada',
        ],
        activities: [
          'Sesión de observación del amanecer doble de Mercurio',
          'Cartografía láser de cráteres polares en sombra perpetua',
        ],
      },
      en: {
        tagline: 'Polar orbit behind the golden thermal shield',
        description:
          'Orbital approach protected by the multi-layer Helios Relay heatshield, featuring filtered solar corona observation and a low-altitude pass over Caloris Basin.',
        lodging: 'Shielded thermal cabin with spectroscopic viewport aboard Helios Relay',
        highlights: [
          'High-resolution solar observation behind multi-layer shield',
          'Low-altitude orbital flyby over the Caloris Basin',
          'Live telemetry guided by mission astrophysicists',
        ],
        services: [
          'Radiation protection training (2 days)',
          'Active dosimetry and personal magnetic shielding',
          'Advanced-hydration orbital gastronomy',
        ],
        activities: [
          'Mercury double-sunrise observation session',
          'Laser mapping of permanently shadowed polar craters',
        ],
      },
      pt: {
        tagline: 'Órbita polar atrás do escudo térmico dourado',
        description:
          'Aproximação orbital protegida pelo escudo multicamadas Helios Relay, com observação filtrada da coroa solar e sobrevoo rasante da bacia Caloris.',
        lodging: 'Cabine térmica blindada com visor espectroscópico na Helios Relay',
        highlights: [
          'Observação solar de alta resolução atrás do escudo multicamadas',
          'Sobrevoo orbital rasante sobre a bacia Caloris',
          'Telemetria guiada por astrofísicos da missão',
        ],
        services: [
          'Treinamento de proteção radiológica (2 dias)',
          'Dosimetria ativa e blindagem magnética pessoal',
          'Gastronomia orbital de hidratação avançada',
        ],
        activities: [
          'Sessão de observação do nascer do sol duplo de Mercúrio',
          'Cartografia a laser de crateras polares em sombra perpétua',
        ],
      },
    },
  },
  {
    id: 'mercury-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'mercury-solar-frontier',
    name: 'Terminator Odyssey',
    priceUsd: 54000,
    durationDays: 10,
    availableSeats: 5,
    i18n: {
      es: {
        tagline: 'Descenso a los domos crepusculares del terminador',
        description:
          'Combina la estancia en la estación Helios Relay con un descenso en lanzadera blindada hasta el puesto avanzado del terminador, donde la temperatura es habitable.',
        lodging: 'Suite crepuscular en Helios Relay + módulo geodésico en cráter polar',
        highlights: [
          'Descenso en cápsula blindada al puesto del terminador',
          'Caminata guiada por el borde de hielo polar subsuperficial',
          'Acceso al laboratorio heliofísico de alta energía',
        ],
        services: [
          'Preparación integral de superficie (4 días)',
          'Traje térmico refrigerado de grado expedicionario',
          'Chef de misión y soporte médico dedicado',
        ],
        activities: [
          'Excursión en rover presurizado por la franja crepuscular',
          'Recolección simbólica de regolito rico en silicatos',
          'Cena panorámica frente al horizonte solar filtrado',
        ],
      },
      en: {
        tagline: 'Descent to the twilight domes on the terminator',
        description:
          'Combines a stay aboard Helios Relay with a shielded shuttle descent to the Terminator Outpost, where twilight temperatures remain habitable.',
        lodging: 'Twilight Suite on Helios Relay + geodesic pod in a polar crater',
        highlights: [
          'Shielded shuttle descent to the Terminator Outpost',
          'Guided walk along subsurface polar water-ice rims',
          'Access to the high-energy heliophysics laboratory',
        ],
        services: [
          'Comprehensive surface preparation (4 days)',
          'Liquid-cooled expedition-grade thermal spacesuit',
          'Mission chef and dedicated medical support',
        ],
        activities: [
          'Pressurized rover excursion across the twilight zone',
          'Symbolic silicate-rich regolith sampling',
          'Panoramic dinner facing the filtered solar horizon',
        ],
      },
      pt: {
        tagline: 'Descida aos domos crepusculares do terminador',
        description:
          'Combina a estadia na estação Helios Relay com uma descida em nave blindada até o posto avançado do terminador, onde a temperatura é habitável.',
        lodging: 'Suíte crepuscular na Helios Relay + módulo geodésico em cratera polar',
        highlights: [
          'Descida em cápsula blindada ao posto do terminador',
          'Caminhada guiada pela borda de gelo polar subsuperficial',
          'Acesso ao laboratório heliofísico de alta energia',
        ],
        services: [
          'Preparação integral de superfície (4 dias)',
          'Traje térmico refrigerado de grau expedicionário',
          'Chef de missão e suporte médico dedicado',
        ],
        activities: [
          'Excursão em rover pressurizado pela faixa crepuscular',
          'Coleta simbólica de regolito rico em silicatos',
          'Jantar panorâmico diante do horizonte solar filtrado',
        ],
      },
    },
  },
  {
    id: 'mercury-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'mercury-solar-frontier',
    name: 'Solar Crown Sovereign',
    priceUsd: 118000,
    durationDays: 14,
    availableSeats: 2,
    i18n: {
      es: {
        tagline: 'Residencia privada en el umbral del Sol',
        description:
          'Expedición privada a medida con cúpula de atenuación fotónica exclusiva, travesía privada en rover por cráteres vírgenes y enlace directo con el equipo científico.',
        lodging: 'Residencia privada Helios Crown con observatorio heliofísico propio',
        highlights: [
          'Cúpula privada con filtro fotónico adaptativo 8K',
          'Lanzadera y rover de superficie de uso exclusivo',
          'Itinerario científico y gastronómico 100 % a medida',
        ],
        services: [
          'Programa privado de aclimatación y transporte directo',
          'Concierge y médico aeroespacial exclusivos 24/7',
          'Menú degustación de autor y bodega presurizada',
        ],
        activities: [
          'Travesía privada al fondo de un cráter polar sin luz solar',
          'Sesión privada de astrofotografía coronal de rango dinámico',
          'Grabado conmemorativo en placa de tungsteno orbital',
        ],
      },
      en: {
        tagline: 'Private residence at the threshold of the Sun',
        description:
          'Bespoke private expedition featuring an exclusive photonic-attenuation dome, private rover traverse across pristine craters, and direct scientific liaison.',
        lodging: 'Helios Crown Private Residence with personal heliophysics observatory',
        highlights: [
          'Private dome with 8K adaptive photonic filter',
          'Exclusive-use landing shuttle and surface rover',
          '100% tailored scientific and culinary itinerary',
        ],
        services: [
          'Private acclimation program and direct transport',
          'Dedicated 24/7 concierge and aerospace physician',
          'Chef’s tasting menu and pressurized wine cellar',
        ],
        activities: [
          'Private traverse into a permanently dark polar crater floor',
          'High-dynamic-range coronal astrophotography session',
          'Commemorative engraving on an orbital tungsten plaque',
        ],
      },
      pt: {
        tagline: 'Residência privada no limiar do Sol',
        description:
          'Expedição privada sob medida com cúpula de atenuação fotônica exclusiva, travessia privada em rover por crateras intocadas e ligação direta com a equipe científica.',
        lodging: 'Residência privada Helios Crown com observatório heliofísico próprio',
        highlights: [
          'Cúpula privada com filtro fotônico adaptativo 8K',
          'Nave de pouso e rover de superfície de uso exclusivo',
          'Roteiro científico e gastronômico 100% personalizado',
        ],
        services: [
          'Programa privado de aclimatação e transporte direto',
          'Concierge e médico aeroespacial exclusivos 24/7',
          'Menu degustação autoral e adega pressurizada',
        ],
        activities: [
          'Travessia privada ao fundo de uma cratera polar sem luz solar',
          'Sessão privada de astrofotografia coronal de alto alcance dinâmico',
          'Gravação comemorativa em placa de tungstênio orbital',
        ],
      },
    },
  },

  /* ================================================================ */
  /* 2. VENUS — Cloud Haven                                           */
  /* ================================================================ */
  {
    id: 'venus-explorer',
    tier: 'explorer',
    tierLabel: 'Explorer',
    destinationId: 'venus-cloud-haven',
    name: 'Aerostat Discovery',
    priceUsd: 21000,
    durationDays: 7,
    availableSeats: 14,
    i18n: {
      es: {
        tagline: 'Navegando la super-rotación a 55 km de altitud',
        description:
          'Estancia en el anillo aerostático Cloud Haven, suspendido sobre las nubes altas donde la gravedad y la presión atmosférica son equivalentes a las de la Tierra.',
        lodging: 'Cabina exterior en el anillo de bronce de Cloud Haven con balcón acristalado',
        highlights: [
          'Gravedad natural de 0,9 g sin necesidad de centrífuga',
          'Vistas continuas al mar de nubes doradas en super-rotación',
          'Vuelta completa al planeta arrastrados por los vientos altos',
        ],
        services: [
          'Inducción rápida de vuelo aerostático (2 días)',
          'Acceso a las cubiertas botánicas e invernaderos solares',
          'Pensión completa con cocina fresca hidropónica',
        ],
        activities: [
          'Observación de relámpagos atmosféricos en el lado nocturno',
          'Recorrido técnico por los estabilizadores aerostáticos',
        ],
      },
      en: {
        tagline: 'Sailing the super-rotation at 55 km altitude',
        description:
          'Stay aboard the Cloud Haven aerostat ring, suspended above the upper cloud deck where gravity and atmospheric pressure mirror Earth’s.',
        lodging: 'Exterior cabin in Cloud Haven’s bronze ring with glass balcony',
        highlights: [
          'Natural 0.9 g gravity without artificial centrifuges',
          'Unbroken views of the super-rotating golden cloud sea',
          'Full planetary circumnavigation carried by upper-altitude winds',
        ],
        services: [
          'Fast-track aerostat flight induction (2 days)',
          'Access to botanical decks and solar greenhouses',
          'Full board featuring fresh hydroponic cuisine',
        ],
        activities: [
          'Night-side atmospheric lightning observation',
          'Technical tour of the buoyancy and aerostat stabilizers',
        ],
      },
      pt: {
        tagline: 'Navegando a super-rotação a 55 km de altitude',
        description:
          'Estadia no anel aerostático Cloud Haven, suspenso sobre as nuvens altas onde a gravidade e a pressão atmosférica são equivalentes às da Terra.',
        lodging: 'Cabine externa no anel de bronze da Cloud Haven com varanda envidraçada',
        highlights: [
          'Gravidade natural de 0,9 g sem necessidade de centrífuga',
          'Vistas contínuas para o mar de nuvens douradas em super-rotação',
          'Volta completa ao planeta levados pelos ventos superiores',
        ],
        services: [
          'Indução rápida de voo aerostático (2 dias)',
          'Acesso aos conveses botânicos e estufas solares',
          'Pensão completa com culinária fresca hidropônica',
        ],
        activities: [
          'Observação de relâmpagos atmosféricos no lado noturno',
          'Tour técnico pelos estabilizadores aerostáticos',
        ],
      },
    },
  },
  {
    id: 'venus-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'venus-cloud-haven',
    name: 'Sulfur Cloud Odyssey',
    priceUsd: 46500,
    durationDays: 11,
    availableSeats: 6,
    i18n: {
      es: {
        tagline: 'Vuelo en planeador estratosférico y cúpula cenital',
        description:
          'Experiencia extendida en Cloud Haven con excursiones en planeador presurizado entre las formaciones nubosas en V y acceso al salón cenital de observación.',
        lodging: 'Suite panorámica en el anillo superior con terraza presurizada',
        highlights: [
          'Vuelo en planeador atmosférico por las crestas nubosas',
          'Telemetría radar en vivo de los montes Maxwell bajo las nubes',
          'Spa termal y salón astronómico en la cúpula superior',
        ],
        services: [
          'Entrenamiento en simulador de vuelo venusiano (3 días)',
          'Asistente de expedición y sastrería de vuelo a medida',
          'Gastronomía de autor con maridaje botánico orbital',
        ],
        activities: [
          'Excursión guiada en planeador bimotor a 62 km de altitud',
          'Taller de cartografía radar de la superficie volcánica',
          'Cena durante la transición crepuscular ámbar-violeta',
        ],
      },
      en: {
        tagline: 'Stratospheric glider flight and zenith conservatory',
        description:
          'Extended Cloud Haven stay featuring pressurized glider excursions through chevron cloud waves and access to the zenith observation lounge.',
        lodging: 'Panoramic upper-ring suite with pressurized viewing terrace',
        highlights: [
          'Atmospheric glider flight skimming the golden cloud crests',
          'Live synthetic-aperture radar imaging of Maxwell Montes below',
          'Thermal spa and astronomical lounge in the zenith dome',
        ],
        services: [
          'Venusian flight-simulator training (3 days)',
          'Expedition assistant and bespoke flightwear tailoring',
          'Signature cuisine with orbital botanical pairings',
        ],
        activities: [
          'Guided twin-engine glider excursion at 62 km altitude',
          'Volcanic surface radar-mapping workshop',
          'Dinner during the amber-to-violet twilight transition',
        ],
      },
      pt: {
        tagline: 'Voo em planador estratosférico e cúpula zenital',
        description:
          'Experiência estendida na Cloud Haven com excursões em planador pressurizado entre as formações de nuvens em V e acesso ao salão zenital de observação.',
        lodging: 'Suíte panorâmica no anel superior com terraço pressurizado',
        highlights: [
          'Voo em planador atmosférico pelas cristas das nuvens',
          'Telemetria por radar ao vivo dos Montes Maxwell sob as nuvens',
          'Spa termal e salão astronômico na cúpula superior',
        ],
        services: [
          'Treinamento em simulador de voo venusiano (3 dias)',
          'Assistente de expedição e alfaiataria de voo sob medida',
          'Gastronomia autoral com harmonização botânica orbital',
        ],
        activities: [
          'Excursão guiada em planador bimotor a 62 km de altitude',
          'Oficina de cartografia por radar da superfície vulcânica',
          'Jantar durante a transição crepuscular âmbar-violeta',
        ],
      },
    },
  },
  {
    id: 'venus-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'venus-cloud-haven',
    name: 'Aphrodite Sovereign',
    priceUsd: 98000,
    durationDays: 15,
    availableSeats: 2,
    i18n: {
      es: {
        tagline: 'Pabellón flotante privado sobre el lucero del alba',
        description:
          'El máximo lujo interplanetario: un módulo aerostático privado acoplado a la corona de Cloud Haven con aeronave propia y descenso de sonda dedicada hacia las capas profundas.',
        lodging: 'Residencia privada Aphrodite de dos niveles con cúpula de 360°',
        highlights: [
          'Pabellón privado con jardín hidropónico y observatorio',
          'Aeronave estratosférica privada con piloto dedicado',
          'Lanzamiento de microsonda propia hacia la baja atmósfera',
        ],
        services: [
          'Traslado en cápsula ejecutiva de tránsito rápido',
          'Equipo médico, chef y concierge dedicados las 24 horas',
          'Programa de bienestar en gravedad natural venusiana',
        ],
        activities: [
          'Vuelo privado al amanecer sobre el vórtice polar sur',
          'Control directo de sonda descendente de imagen térmica',
          'Velada musical privada bajo el resplandor atmosférico',
        ],
      },
      en: {
        tagline: 'Private floating pavilion above the Morning Star',
        description:
          'Ultimate interplanetary luxury: a private two-deck aerostat pavilion docked to Cloud Haven’s crown, complete with a personal aircraft and deep-atmosphere probe deployment.',
        lodging: 'Two-level Aphrodite Private Residence with 360° glass cupola',
        highlights: [
          'Private pavilion with hydroponic garden and observatory',
          'Dedicated stratospheric aircraft and personal pilot',
          'Deployment of your own deep-atmosphere thermal micro-probe',
        ],
        services: [
          'Fast-transit executive capsule transfer',
          '24/7 dedicated physician, private chef, and concierge',
          'Full wellness program in natural Venusian gravity',
        ],
        activities: [
          'Private dawn flight above the south polar vortex',
          'Live control of a descending thermal-imaging probe',
          'Private musical soirée beneath the golden atmospheric glow',
        ],
      },
      pt: {
        tagline: 'Pavilhão flutuante privado sobre a Estrela d’Alva',
        description:
          'O máximo luxo interplanetário: um módulo aerostático privado acoplado à coroa da Cloud Haven com aeronave própria e lançamento de sonda dedicada às camadas profundas.',
        lodging: 'Residência privada Aphrodite de dois andares com cúpula de 360°',
        highlights: [
          'Pavilhão privado com jardim hidropônico e observatório',
          'Aeronave estratosférica privada com piloto dedicado',
          'Lançamento de microssonda própria rumo à baixa atmosfera',
        ],
        services: [
          'Traslado em cápsula executiva de trânsito rápido',
          'Equipe médica, chef e concierge dedicados 24 horas',
          'Programa de bem-estar em gravidade natural venusiana',
        ],
        activities: [
          'Voo privado ao amanhecer sobre o vórtice polar sul',
          'Controle direto de sonda descendente de imagem térmica',
          'Sarau musical privado sob o resplendor atmosférico',
        ],
      },
    },
  },

  /* ================================================================ */
  /* 3. MARS — Red Frontier                                           */
  /* ================================================================ */
  {
    id: 'mars-explorer',
    tier: 'explorer',
    tierLabel: 'Explorer',
    destinationId: 'mars-red-frontier',
    name: 'Marineris Trek',
    priceUsd: 28000,
    durationDays: 8,
    availableSeats: 16,
    i18n: {
      es: {
        tagline: 'Órbita baja y primeros pasos en los biodomos marcianos',
        description:
          'Llegada a la terminal orbital Ares Hub y descenso a los biodomos del borde de Valles Marineris para experimentar la gravedad marciana de 0,38 g.',
        lodging: 'Módulo habitacional en Marineris Base con ventanal hacia el cañón',
        highlights: [
          'Acoplamiento en Ares Orbital Hub y descenso en lanzadera',
          'Caminata guiada sobre regolito marciano en Valles Marineris',
          'Observación del atardecer azul característico de Marte',
        ],
        services: [
          'Entrenamiento de EVA marciana y baja gravedad (3 días)',
          'Traje ligero de superficie con soporte vital autónomo',
          'Alimentación completa elaborada en los biodomos agrícolas',
        ],
        activities: [
          'Paseo guiado a pie por el mirador norte de Valles Marineris',
          'Visita a los reactores de producción de agua e invernaderos',
        ],
      },
      en: {
        tagline: 'Low orbit and first footsteps around the Martian biodomes',
        description:
          'Dock at Ares Orbital Hub and descend by shuttle to the Valles Marineris rim biodomes to experience Mars’s 0.38 g gravity.',
        lodging: 'Habitat module at Marineris Base with canyon-facing viewport',
        highlights: [
          'Docking at Ares Orbital Hub and surface shuttle descent',
          'Guided surface walk on Martian regolith at Valles Marineris',
          'Observation of Mars’s signature blue Rayleigh sunset',
        ],
        services: [
          'Martian EVA and low-gravity training (3 days)',
          'Lightweight surface suit with autonomous life support',
          'Full board harvested from the agricultural biodomes',
        ],
        activities: [
          'Guided foot excursion along the north overlook of Valles Marineris',
          'Tour of the water-extraction reactors and pressurized greenhouses',
        ],
      },
      pt: {
        tagline: 'Órbita baixa e primeiros passos nos biodomos marcianos',
        description:
          'Chegada ao terminal orbital Ares Hub e descida aos biodomos na borda de Valles Marineris para experimentar a gravidade marciana de 0,38 g.',
        lodging: 'Módulo habitacional na Marineris Base com janela para o cânion',
        highlights: [
          'Acoplamento no Ares Orbital Hub e descida em nave de pouso',
          'Caminhada guiada sobre o regolito marciano em Valles Marineris',
          'Observação do pôr do sol azul característico de Marte',
        ],
        services: [
          'Treinamento de EVA marciana e baixa gravidade (3 dias)',
          'Traje leve de superfície com suporte vital autônomo',
          'Alimentação completa cultivada nos biodomos agrícolas',
        ],
        activities: [
          'Caminhada guiada pelo mirante norte de Valles Marineris',
          'Visita aos reatores de produção de água e estufas',
        ],
      },
    },
  },
  {
    id: 'mars-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'mars-red-frontier',
    name: 'Olympus Expedition',
    priceUsd: 62000,
    durationDays: 14,
    availableSeats: 6,
    i18n: {
      es: {
        tagline: 'Travesía en rover presurizado y vuelo suborbital a Olympus Mons',
        description:
          'Expedición de superficie de largo alcance combinando estancia en el anillo centrífugo de Ares Hub, los biodomos de Marineris y sobrevuelo de la caldera de Olympus Mons.',
        lodging: 'Suite dúplex en Marineris Biodome + cabina en rover de travesía',
        highlights: [
          'Vuelo suborbital sobre la caldera de Olympus Mons (21,9 km)',
          'Expedición nocturna de 48 h en rover presurizado de lujo',
          'Observación telescópica de Fobos y Deimos al cenit',
        ],
        services: [
          'Preparación avanzada de exploración planetaria (5 días)',
          'Guía geólogo planetario y médico de expedición',
          'Alta cocina marciana de kilómetro cero en cúpula agrícola',
        ],
        activities: [
          'Exploración de un tubo de lava volcánico presurizado',
          'Conducción asistida de rover por las dunas de Noctis Labyrinthus',
          'Cena bajo la cúpula transparente durante el paso de Fobos',
        ],
      },
      en: {
        tagline: 'Pressurized rover traverse and suborbital flight to Olympus Mons',
        description:
          'Long-range surface expedition combining Ares Hub’s centrifuge ring, the Marineris biodomes, and a suborbital hop over the summit caldera of Olympus Mons.',
        lodging: 'Duplex suite at Marineris Biodome + sleeper cabin aboard overland rover',
        highlights: [
          'Suborbital flight over the 21.9 km caldera of Olympus Mons',
          '48-hour overnight expedition aboard a luxury pressurized rover',
          'Telescopic observation of Phobos and Deimos at zenith',
        ],
        services: [
          'Advanced planetary exploration preparation (5 days)',
          'Planetary geologist guide and expedition physician',
          'Zero-kilometer Martian fine dining inside the agricultural dome',
        ],
        activities: [
          'Exploration of a pressurized volcanic lava tube',
          'Assisted rover driving across the dunes of Noctis Labyrinthus',
          'Dinner beneath the transparent dome during Phobos transit',
        ],
      },
      pt: {
        tagline: 'Travessia em rover pressurizado e voo suborbital ao Olympus Mons',
        description:
          'Expedição de superfície de longo alcance combinando estadia no anel centrífugo do Ares Hub, nos biodomos de Marineris e sobrevoo da caldeira do Olympus Mons.',
        lodging: 'Suíte duplex no Marineris Biodome + cabine em rover de travessia',
        highlights: [
          'Voo suborbital sobre a caldeira do Olympus Mons (21,9 km)',
          'Expedição noturna de 48 h em rover pressurizado de luxo',
          'Observação telescópica de Fobos e Deimos no zênite',
        ],
        services: [
          'Preparação avançada de exploração planetária (5 dias)',
          'Guia geólogo planetário e médico de expedição',
          'Alta gastronomia marciana na cúpula agrícola',
        ],
        activities: [
          'Exploração de um tubo de lava vulcânico pressurizado',
          'Condução assistida de rover pelas dunas de Noctis Labyrinthus',
          'Jantar sob a cúpula transparente durante a passagem de Fobos',
        ],
      },
    },
  },
  {
    id: 'mars-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'mars-red-frontier',
    name: 'Ares Founder Residency',
    priceUsd: 135000,
    durationDays: 21,
    availableSeats: 2,
    i18n: {
      es: {
        tagline: 'Domo privado en el acantilado de Marineris y expedición polar',
        description:
          'Residencia privada colgada sobre el abismo de Valles Marineris con lanzadera suborbital propia para visitar el casquete polar norte de hielo de agua.',
        lodging: 'Santuario privado Founder Dome en el risco de Coprates Chasma',
        highlights: [
          'Domo arquitectónico privado sobre un cañón de 7 km de caída',
          'Excursión privada en lanzadera al casquete polar norte',
          'Acceso irrestricto al anillo VIP de Ares Orbital Hub',
        ],
        services: [
          'Tránsito interplanetario en camarote de primera clase',
          'Tripulación de apoyo, chef y equipo EVA dedicados 24/7',
          'Equipamiento personalizado con emblema de misión propio',
        ],
        activities: [
          'Aterrizaje privado sobre los estratos de hielo de Planum Boreum',
          'Ruta privada en rover hacia cráteres de impacto inexplorados',
          'Cápsula del tiempo personal depositada en el archivo de la colonia',
        ],
      },
      en: {
        tagline: 'Private cliffside dome at Marineris and polar ice-cap landing',
        description:
          'Architectural private residence perched on the rim of Valles Marineris with a dedicated suborbital lander for visiting the northern water-ice cap.',
        lodging: 'Private Founder Dome sanctuary on the cliff of Coprates Chasma',
        highlights: [
          'Private architectural dome overlooking a 7 km canyon drop',
          'Private suborbital shuttle landing on the north polar cap',
          'Unrestricted access to the VIP ring of Ares Orbital Hub',
        ],
        services: [
          'First-class interplanetary stateroom transit',
          '24/7 dedicated support crew, private chef, and EVA team',
          'Custom-fitted surface gear bearing your personal mission patch',
        ],
        activities: [
          'Private landing on the layered ice cliffs of Planum Boreum',
          'Bespoke rover route to uncharted impact craters',
          'Personal time capsule archived in the Martian colony vault',
        ],
      },
      pt: {
        tagline: 'Domo privado no penhasco de Marineris e expedição polar',
        description:
          'Residência privada suspensa sobre o abismo de Valles Marineris com nave suborbital própria para visitar a calota polar norte de gelo de água.',
        lodging: 'Santuário privado Founder Dome no penhasco de Coprates Chasma',
        highlights: [
          'Domo arquitetônico privado sobre um cânion de 7 km de profundidade',
          'Excursão privada em nave suborbital até a calota polar norte',
          'Acesso irrestrito ao anel VIP do Ares Orbital Hub',
        ],
        services: [
          'Trânsito interplanetário em cabine de primeira classe',
          'Tripulação de apoio, chef e equipe EVA dedicados 24/7',
          'Equipamento personalizado com emblema de missão próprio',
        ],
        activities: [
          'Pouso privado sobre os estratos de gelo de Planum Boreum',
          'Rota privada em rover rumo a crateras de impacto inexploradas',
          'Cápsula do tempo pessoal depositada no arquivo da colônia',
        ],
      },
    },
  },

  /* ================================================================ */
  /* 4. JUPITER — Europa Orbital Station                              */
  /* ================================================================ */
  {
    id: 'jupiter-explorer',
    tier: 'explorer',
    tierLabel: 'Explorer',
    destinationId: 'jupiter-europa-station',
    name: 'Galileo Orbit',
    priceUsd: 38000,
    durationDays: 10,
    availableSeats: 10,
    i18n: {
      es: {
        tagline: 'Gravedad centrífuga frente a la Gran Mancha Roja y Europa',
        description:
          'Estancia en el anillo centrífugo principal de Galileo Station en órbita joviana exterior, con vistas directas a la corteza fracturada de Europa y las bandas de Júpiter.',
        lodging: 'Cabina orbital en el anillo centrífugo A con ventanal blindado',
        highlights: [
          'Gravedad artificial de 0,8 g en doble anillo centrífugo',
          'Vista frontal de la luna helada Europa y sus fracturas lineae',
          'Observación de auroras polares jovianas y tormentas ciclónicas',
        ],
        services: [
          'Blindaje electromagnético activo en toda la estación',
          'Entrenamiento de tránsito al espacio exterior (3 días)',
          'Pensión completa y acceso al mirador ecuatorial',
        ],
        activities: [
          'Sesión de observación del tránsito de Ío y sombra sobre Júpiter',
          'Conferencia inmersiva con oceanógrafos de la misión Europa',
        ],
      },
      en: {
        tagline: 'Centrifuge gravity facing the Great Red Spot and Europa',
        description:
          'Stay aboard Galileo Station’s main centrifuge ring in outer Jovian orbit, with direct views of Europa’s fractured ice shell and Jupiter’s cloud belts.',
        lodging: 'Orbital cabin in Centrifuge Ring A with radiation-shielded viewport',
        highlights: [
          '0.8 g artificial gravity across dual centrifuge rings',
          'Front-row view of icy moon Europa and its tectonic lineae',
          'Observation of Jovian polar auroras and cyclonic storms',
        ],
        services: [
          'Station-wide active electromagnetic shielding',
          'Outer-system transit training (3 days)',
          'Full board and access to the equatorial observation deck',
        ],
        activities: [
          'Observation of Io’s transit and shadow across Jupiter’s cloud tops',
          'Immersive briefing with Europa subsurface oceanographers',
        ],
      },
      pt: {
        tagline: 'Gravidade centrífuga diante da Grande Mancha Vermelha e Europa',
        description:
          'Estadia no anel centrífugo principal da Galileo Station na órbita externa de Júpiter, com vista direta para a crosta fraturada de Europa e as faixas de Júpiter.',
        lodging: 'Cabine orbital no anel centrífugo A com janela blindada',
        highlights: [
          'Gravidade artificial de 0,8 g em duplo anel centrífugo',
          'Vista frontal da lua gelada Europa e suas fraturas lineae',
          'Observação de auroras polares jovianas e tempestades ciclônicas',
        ],
        services: [
          'Blindagem eletromagnética ativa em toda a estação',
          'Treinamento de trânsito para o espaço profundo (3 dias)',
          'Pensão completa e acesso ao mirante equatorial',
        ],
        activities: [
          'Sessão de observação do trânsito de Io e sua sombra sobre Júpiter',
          'Palestra imersiva com oceanógrafos da missão Europa',
        ],
      },
    },
  },
  {
    id: 'jupiter-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'jupiter-europa-station',
    name: 'Europa Ice Horizon',
    priceUsd: 79000,
    durationDays: 15,
    availableSeats: 4,
    i18n: {
      es: {
        tagline: 'Sobrevuelo orbital bajo sobre los géiseres y grietas de Europa',
        description:
          'Incluye un crucero orbital en nave auxiliar blindada alrededor de Europa a baja altitud para observar de cerca sus crestas dobles de hielo y penachos criovolcánicos.',
        lodging: 'Suite de observación Galileo con cúpula orientada a Júpiter',
        highlights: [
          'Vuelo orbital rasante a 120 km sobre las grietas de Europa',
          'Espectroscopía en vivo del océano subsuperficial de Europa',
          'Acceso exclusivo al anillo centrífugo superior y laboratorio',
        ],
        services: [
          'Preparación avanzada de espacio profundo (5 días)',
          'Asistente científico personal y servicio de camarote 24 h',
          'Menú de alta gastronomía en restaurante rotatorio',
        ],
        activities: [
          'Crucero de 36 horas alrededor del hemisferio conducente de Europa',
          'Observación guiada de la actividad volcánica de Ío a distancia segura',
          'Taller de astrofotografía planetaria con telescopio orbital de 1,2 m',
        ],
      },
      en: {
        tagline: 'Low orbital flyby over Europa’s geysers and ice ridges',
        description:
          'Includes a low-altitude orbital cruise aboard a shielded auxiliary craft around Europa to inspect its double ice ridges and cryovolcanic plumes up close.',
        lodging: 'Galileo Observation Suite with Jupiter-facing cupola',
        highlights: [
          '120 km low-altitude orbital pass over Europa’s fractures',
          'Live mass-spectrometry of Europa’s subsurface ocean plumes',
          'Exclusive access to the upper centrifuge ring and science lab',
        ],
        services: [
          'Advanced deep-space preparation (5 days)',
          'Personal science liaison and 24-hour cabin service',
          'Fine dining menu in the rotating orbital restaurant',
        ],
        activities: [
          '36-hour orbital cruise around Europa’s leading hemisphere',
          'Guided remote observation of Io’s volcanic plumes',
          'Planetary astrophotography workshop using a 1.2 m orbital telescope',
        ],
      },
      pt: {
        tagline: 'Sobrevoo orbital baixo sobre os gêiseres e fendas de Europa',
        description:
          'Inclui um cruzeiro orbital em nave auxiliar blindada ao redor de Europa em baixa altitude para observar de perto suas cristas duplas de gelo e plumas criovulcânicas.',
        lodging: 'Suíte de observação Galileo com cúpula voltada para Júpiter',
        highlights: [
          'Voo orbital rasante a 120 km sobre as fendas de Europa',
          'Espectroscopia ao vivo do oceano subsuperficial de Europa',
          'Acesso exclusivo ao anel centrífugo superior e laboratório',
        ],
        services: [
          'Preparação avançada de espaço profundo (5 dias)',
          'Assistente científico pessoal e serviço de cabine 24 h',
          'Menu de alta gastronomia no restaurante rotatório',
        ],
        activities: [
          'Cruzeiro de 36 horas ao redor do hemisfério condutor de Europa',
          'Observação guiada da atividade vulcânica de Io a distância segura',
          'Oficina de astrofotografia planetária com telescópio orbital de 1,2 m',
        ],
      },
    },
  },
  {
    id: 'jupiter-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'jupiter-europa-station',
    name: 'Jovian Sanctuary',
    priceUsd: 168000,
    durationDays: 21,
    availableSeats: 2,
    i18n: {
      es: {
        tagline: 'Cúpula axial privada y tour por las lunas galileanas',
        description:
          'La experiencia definitiva en el sistema joviano: residencia axial privada y crucero dedicado por Europa, Ganímedes y Calisto con teleoperación de submarino criogénico.',
        lodging: 'Santuario axial privado con gravedad configurable y observatorio 360°',
        highlights: [
          'Crucero privado por el sistema galileano (Europa y Ganímedes)',
          'Teleoperación en directo de sonda hidrotermal bajo el hielo',
          'Paseo espacial EVA asistido en el exterior de la estación',
        ],
        services: [
          'Transporte interplanetario en suite de mando privada',
          'Tripulación científica, médica y gastronómica exclusiva',
          'Traje EVA de diseño personalizado con telemetría HUD',
        ],
        activities: [
          'EVA guiada con Júpiter y Europa ocupando todo el campo visual',
          'Inmersión remota con rover subacuático en el océano de Europa',
          'Cena privada bajo el resplandor de las auroras jovianas',
        ],
      },
      en: {
        tagline: 'Private axial cupola and Galilean moons grand tour',
        description:
          'The definitive Jovian experience: a private axial residence and dedicated cruise past Europa, Ganymede, and Callisto with live teleoperation of a sub-glacial rover.',
        lodging: 'Private Axial Sanctuary with configurable gravity and 360° observatory',
        highlights: [
          'Private cruise across the Galilean moons (Europa & Ganymede)',
          'Live teleoperation of a sub-ice hydrothermal probe',
          'Assisted spacewalk (EVA) outside the orbital station',
        ],
        services: [
          'Interplanetary transit in a private command suite',
          'Exclusive scientific, medical, and culinary crew',
          'Custom-tailored EVA spacesuit with integrated HUD telemetry',
        ],
        activities: [
          'Guided EVA with Jupiter and Europa filling the field of view',
          'Remote dive with an under-ice rover in Europa’s ocean',
          'Private dinner beneath the glow of Jovian polar auroras',
        ],
      },
      pt: {
        tagline: 'Cúpula axial privada e tour pelas luas galileanas',
        description:
          'A experiência definitiva no sistema joviano: residência axial privada e cruzeiro dedicado por Europa, Ganimedes e Calisto com teleoperação de submarino criogênico.',
        lodging: 'Santuário axial privado com gravidade configurável e observatório 360°',
        highlights: [
          'Cruzeiro privado pelo sistema galileano (Europa e Ganimedes)',
          'Teleoperação ao vivo de sonda hidrotermal sob o gelo',
          'Caminhada espacial EVA assistida no exterior da estação',
        ],
        services: [
          'Transporte interplanetário em suíte de comando privada',
          'Tripulação científica, médica e gastronômica exclusiva',
          'Traje EVA personalizado com telemetria HUD integrada',
        ],
        activities: [
          'EVA guiada com Júpiter e Europa ocupando todo o campo visual',
          'Imersão remota com rover subaquático no oceano de Europa',
          'Jantar privado sob o brilho das auroras jovianas',
        ],
      },
    },
  },

  /* ================================================================ */
  /* 5. SATURN — Titan Orbital Station                                */
  /* ================================================================ */
  {
    id: 'saturn-titan-explorer',
    tier: 'explorer',
    tierLabel: 'Explorer',
    destinationId: 'saturn-titan-station',
    name: 'Cronos Ring Cruise',
    priceUsd: 44000,
    durationDays: 12,
    availableSeats: 10,
    i18n: {
      es: {
        tagline: 'Santuario orbital frente a Titán y el sistema de anillos',
        description:
          'Alojamiento en Huygens Orbital Sanctuary, en órbita exterior de Saturno, con vistas simultáneas a la esfera anaranjada de Titán y la sombra de los anillos sobre el planeta.',
        lodging: 'Cabina panorámica en el anillo de bronce de Huygens Sanctuary',
        highlights: [
          'Vista combinada de Saturno, sus anillos y la luna Titán',
          'Observación de la bruma estratosférica azul de Titán',
          'Gravedad artificial confortable en el anillo habitacional',
        ],
        services: [
          'Programa de adaptación a travesías del sistema exterior (3 días)',
          'Acceso libre a la torre cenital de observación de Saturno',
          'Gastronomía completa y biblioteca astronómica Cassini-Huygens',
        ],
        activities: [
          'Seguimiento en directo del tránsito de Titán frente a Saturno',
          'Sesión de escucha de ecos de radar de los mares de metano',
        ],
      },
      en: {
        tagline: 'Orbital sanctuary facing Titan and the ring system',
        description:
          'Stay aboard Huygens Orbital Sanctuary in outer Saturnian orbit, enjoying simultaneous views of Titan’s orange globe and ring shadows across Saturn.',
        lodging: 'Panoramic cabin in the bronze habitat ring of Huygens Sanctuary',
        highlights: [
          'Combined vista of Saturn, its rings, and moon Titan',
          'Observation of Titan’s detached blue stratospheric haze',
          'Comfortable artificial gravity in the habitat ring',
        ],
        services: [
          'Outer-system voyage adaptation program (3 days)',
          'Open access to the zenith Saturn observation spire',
          'Full board and the Cassini-Huygens astronomical library',
        ],
        activities: [
          'Live tracking of Titan transiting across Saturn’s disk',
          'Acoustic session of radar echoes from Titan’s methane seas',
        ],
      },
      pt: {
        tagline: 'Santuário orbital diante de Titã e do sistema de anéis',
        description:
          'Hospedagem no Huygens Orbital Sanctuary, na órbita externa de Saturno, com vistas simultâneas para a esfera alaranjada de Titã e a sombra dos anéis sobre o planeta.',
        lodging: 'Cabine panorâmica no anel de bronze do Huygens Sanctuary',
        highlights: [
          'Vista combinada de Saturno, seus anéis e a lua Titã',
          'Observação da névoa estratosférica azul de Titã',
          'Gravidade artificial confortável no anel habitacional',
        ],
        services: [
          'Programa de adaptação a travessias do sistema externo (3 dias)',
          'Acesso livre à torre zenital de observação de Saturno',
          'Gastronomia completa e biblioteca astronômica Cassini-Huygens',
        ],
        activities: [
          'Acompanhamento ao vivo do trânsito de Titã diante de Saturno',
          'Sessão de escuta de ecos de radar dos mares de metano',
        ],
      },
    },
  },
  {
    id: 'saturn-titan-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'saturn-titan-station',
    name: 'Titan Hazes Voyage',
    priceUsd: 92000,
    durationDays: 18,
    availableSeats: 4,
    i18n: {
      es: {
        tagline: 'Aproximación orbital a Titán y sobrevuelo de Kraken Mare',
        description:
          'Desde Huygens Sanctuary, embarca en una nave orbital de enlace que desciende hasta la alta atmósfera de Titán para cartografiar por radar los lagos de hidrocarburos de Kraken Mare.',
        lodging: 'Suite Huygens de doble altura con mirador hacia Titán y Saturno',
        highlights: [
          'Vuelo de inserción orbital baja sobre la bruma azul de Titán',
          'Telemetría radar e infrarroja sobre Kraken Mare y Ligeia Mare',
          'Observación cercana de los géiseres de hielo de Encélado',
        ],
        services: [
          'Entrenamiento especializado de misión al sistema saturniano (5 días)',
          'Guía astrofísico dedicado y acceso al centro de control de sondas',
          'Menú degustación inspirado en la misión Cassini',
        ],
        activities: [
          'Sobrevuelo orbital rasante del vórtice polar de Titán',
          'Observación de los penachos criovolcánicos del polo sur de Encélado',
          'Velada en la cúpula superior bajo el arco luminoso de los anillos',
        ],
      },
      en: {
        tagline: 'Titan orbital approach and Kraken Mare radar flyby',
        description:
          'From Huygens Sanctuary, board a transfer craft that skims Titan’s upper atmosphere to radar-map the liquid hydrocarbon shorelines of Kraken Mare.',
        lodging: 'Double-height Huygens Suite overlooking both Titan and Saturn',
        highlights: [
          'Low-orbit insertion flight above Titan’s blue haze layer',
          'Live radar and infrared telemetry over Kraken Mare & Ligeia Mare',
          'Close-range observation of Enceladus’s south-polar ice geysers',
        ],
        services: [
          'Specialized Saturnian system mission training (5 days)',
          'Dedicated astrophysicist guide and probe control-room access',
          'Tasting menu inspired by the historic Cassini-Huygens mission',
        ],
        activities: [
          'Grazing orbital flyby over Titan’s polar vortex hood',
          'Observation of cryovolcanic plumes at Enceladus’s south pole',
          'Evening reception in the upper dome beneath the arch of the rings',
        ],
      },
      pt: {
        tagline: 'Aproximação orbital a Titã e sobrevoo do Kraken Mare',
        description:
          'A partir do Huygens Sanctuary, embarque em uma nave orbital de ligação que desce até a alta atmosfera de Titã para mapear por radar os lagos de hidrocarbonetos do Kraken Mare.',
        lodging: 'Suíte Huygens de pé-direito duplo com mirante para Titã e Saturno',
        highlights: [
          'Voo de inserção orbital baixa sobre a névoa azul de Titã',
          'Telemetria por radar e infravermelho sobre Kraken Mare e Ligeia Mare',
          'Observação próxima dos gêiseres de gelo de Encélado',
        ],
        services: [
          'Treinamento especializado de missão ao sistema saturniano (5 dias)',
          'Guia astrofísico dedicado e acesso ao centro de controle de sondas',
          'Menu degustação inspirado na missão Cassini',
        ],
        activities: [
          'Sobrevoo orbital rasante do vórtice polar de Titã',
          'Observação das plumas criovulcânicas do polo sul de Encélado',
          'Recepção na cúpula superior sob o arco luminoso dos anéis',
        ],
      },
    },
  },
  {
    id: 'saturn-titan-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'saturn-titan-station',
    name: 'Huygens Imperial',
    priceUsd: 195000,
    durationDays: 24,
    availableSeats: 2,
    i18n: {
      es: {
        tagline: 'Cúpula imperial privada y descenso de dron en Titán',
        description:
          'La cumbre de SOLARIS: suite imperial en la cúspide de Huygens Sanctuary y pilotaje remoto en primera persona de un cuadricóptero nuclear sobre las dunas y costas de Titán.',
        lodging: 'Residencia Imperial Huygens en la cúpula esférica superior',
        highlights: [
          'Cúpula esférica privada en el ápice de la estación orbital',
          'Pilotaje en vivo de dron atmosférico sobre las costas de Kraken Mare',
          'Crucero privado entre Titán, Encélado y el borde del anillo F',
        ],
        services: [
          'Camarote interplanetario privado de gran lujo ida y vuelta',
          'Concierge, chef, médico y director de vuelo exclusivos 24/7',
          'Edición impresa y digital de los datos científicos de tu misión',
        ],
        activities: [
          'Vuelo remoto de dron sobre ríos y mares de metano líquido en Titán',
          'Recolección orbital de cristales de hielo puro del anillo E',
          'Cena imperial con Saturno eclipsando el Sol tras los anillos',
        ],
      },
      en: {
        tagline: 'Private imperial cupola and live drone flight on Titan',
        description:
          'The pinnacle of SOLARIS: the imperial apex residence atop Huygens Sanctuary paired with first-person remote piloting of a nuclear rotorcraft over Titan’s dunes and seas.',
        lodging: 'Huygens Imperial Residence occupying the upper spherical cupola',
        highlights: [
          'Private spherical cupola at the apex of the orbital sanctuary',
          'Live first-person piloting of an atmospheric drone over Kraken Mare',
          'Private yacht cruise between Titan, Enceladus, and the F-ring edge',
        ],
        services: [
          'Ultra-luxury private interplanetary stateroom round-trip',
          'Exclusive 24/7 concierge, chef, physician, and flight director',
          'Bespoke bound edition of all scientific data from your mission',
        ],
        activities: [
          'Remote rotorcraft flight over liquid methane rivers and seas on Titan',
          'Orbital collection of pure water-ice crystals from the E ring',
          'Imperial banquet as Saturn eclipses the Sun behind its rings',
        ],
      },
      pt: {
        tagline: 'Cúpula imperial privada e voo de drone em Titã',
        description:
          'O ápice da SOLARIS: suíte imperial no topo do Huygens Sanctuary e pilotagem remota em primeira pessoa de um quadricóptero nuclear sobre as dunas e costas de Titã.',
        lodging: 'Residência Imperial Huygens na cúpula esférica superior',
        highlights: [
          'Cúpula esférica privada no ápice da estação orbital',
          'Pilotagem ao vivo de drone atmosférico sobre as costas do Kraken Mare',
          'Cruzeiro privado entre Titã, Encélado e a borda do anel F',
        ],
        services: [
          'Cabine interplanetária privada de alto luxo ida e volta',
          'Concierge, chef, médico e diretor de voo exclusivos 24/7',
          'Edição impressa e digital dos dados científicos da sua missão',
        ],
        activities: [
          'Voo remoto de drone sobre rios e mares de metano líquido em Titã',
          'Coleta orbital de cristais de gelo puro do anel E',
          'Jantar imperial com Saturno eclipsando o Sol atrás dos anéis',
        ],
      },
    },
  },

  /* ================================================================ */
  /* 6. SATURN — Ring Observation                                     */
  /* ================================================================ */
  {
    id: 'saturn-ring-explorer',
    tier: 'explorer',
    tierLabel: 'Explorer',
    destinationId: 'saturn-ring-observation',
    name: 'Cassini Gap Watch',
    priceUsd: 46000,
    durationDays: 11,
    availableSeats: 8,
    i18n: {
      es: {
        tagline: 'Suspendidos sobre el plano helado de los anillos A y B',
        description:
          'Estancia en el Cassini Division Conservatory, posicionado en una órbita inclinada que ofrece una perspectiva cenital ininterrumpida de los anillos de hielo de Saturno.',
        lodging: 'Cabina con suelo translúcido orientado hacia el plano de anillos',
        highlights: [
          'Vista cenital directa de los anillos A, B, C y la División de Cassini',
          'Observación de la sombra planetaria desplazándose sobre el hielo',
          'Espectáculo continuo de destellos solares en cristales de agua pura',
        ],
        services: [
          'Inducción orbital y óptica espacial (3 días)',
          'Visores polarimétricos y binoculares estabilizados en cabina',
          'Pensión completa en el salón acristalado inferior',
        ],
        activities: [
          'Observación de ondas de densidad espirales inducidas por lunas pastoras',
          'Fotografía de alta velocidad del paso de Pan y Dafnis por los surcos',
        ],
      },
      en: {
        tagline: 'Suspended above the icy expanse of the A and B rings',
        description:
          'Stay aboard the Cassini Division Conservatory in an inclined orbit providing an uninterrupted overhead vista of Saturn’s shimmering ice rings.',
        lodging: 'Cabin with translucent floor oriented toward the ring plane',
        highlights: [
          'Direct overhead view of the A, B, C rings and Cassini Division',
          'Watch Saturn’s planetary shadow sweep across the ice rings',
          'Continuous spectacle of sunlight glinting off pure water-ice crystals',
        ],
        services: [
          'Orbital and space-optics induction (3 days)',
          'In-cabin polarimetric viewers and stabilized binoculars',
          'Full board served in the lower glass conservatory lounge',
        ],
        activities: [
          'Observation of spiral density waves sculpted by shepherd moons',
          'High-speed photography of Pan and Daphnis clearing ring gaps',
        ],
      },
      pt: {
        tagline: 'Suspensos sobre o plano gelado dos anéis A e B',
        description:
          'Estadia no Cassini Division Conservatory, posicionado em uma órbita inclinada que oferece uma perspectiva superior ininterrupta dos anéis de gelo de Saturno.',
        lodging: 'Cabine com piso translúcido voltado para o plano dos anéis',
        highlights: [
          'Vista superior direta dos anéis A, B, C e da Divisão de Cassini',
          'Observação da sombra planetária movendo-se sobre o gelo',
          'Espetáculo contínuo de reflexos solares em cristais de água pura',
        ],
        services: [
          'Indução orbital e óptica espacial (3 dias)',
          'Visores polarimétricos e binóculos estabilizados na cabine',
          'Pensão completa no salão envidraçado inferior',
        ],
        activities: [
          'Observação de ondas de densidade espirais induzidas por luas pastoras',
          'Fotografia de alta velocidade da passagem de Pã e Dáfnis pelas fendas',
        ],
      },
    },
  },
  {
    id: 'saturn-ring-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'saturn-ring-observation',
    name: 'Ice Crystal Panorama',
    priceUsd: 96000,
    durationDays: 16,
    availableSeats: 4,
    i18n: {
      es: {
        tagline: 'Inmersión en cápsula de cristal junto al borde del anillo A',
        description:
          'Añade salidas en cápsula de observación esférica hasta pocos kilómetros por encima de la cortina de bloques de hielo del anillo A y la brecha de Encke.',
        lodging: 'Suite panorámica en el anillo dorado del observatorio con domo inferior',
        highlights: [
          'Salida en cápsula esférica sobre el borde exterior del anillo A',
          'Observación de las estructuras verticales ("propellers" y torres de hielo)',
          'Acceso privado a los espectrómetros láser del observatorio',
        ],
        services: [
          'Entrenamiento de vuelo en proximidad de anillos (4 días)',
          'Piloto especialista en dinámica orbital y guía astrónomo',
          'Alta gastronomía servida sobre el mirador nadir de cristal',
        ],
        activities: [
          'Vuelo estacionario sobre las torres de hielo de 2 km en el borde del anillo B',
          'Seguimiento cercano de las lunas pastoras Prometeo y Pandora',
          'Concierto acústico inmersivo con sonificación de ondas de los anillos',
        ],
      },
      en: {
        tagline: 'Glass-pod immersion alongside the outer edge of the A ring',
        description:
          'Adds spherical observation-pod sorties descending to within a few kilometers of the A-ring ice curtain and the Encke Gap.',
        lodging: 'Panoramic suite in the observatory’s golden ring with nadir dome',
        highlights: [
          'Spherical glass-pod excursion above the outer A-ring edge',
          'Observation of vertical ring structures ("propellers" and ice spires)',
          'Private access to the conservatory’s laser spectrometers',
        ],
        services: [
          'Ring-proximity flight training (4 days)',
          'Orbital-dynamics specialist pilot and astronomer guide',
          'Fine dining served atop the glass nadir overlook',
        ],
        activities: [
          'Station-keeping flight above the 2 km ice towers on the B-ring edge',
          'Close tracking of shepherd moons Prometheus and Pandora',
          'Immersive acoustic concert featuring ring-wave sonification',
        ],
      },
      pt: {
        tagline: 'Imersão em cápsula de cristal junto à borda do anel A',
        description:
          'Adiciona saídas em cápsula esférica de observação até poucos quilômetros acima da cortina de blocos de gelo do anel A e da fenda de Encke.',
        lodging: 'Suíte panorâmica no anel dourado do observatório com domo inferior',
        highlights: [
          'Saída em cápsula esférica sobre a borda externa do anel A',
          'Observação das estruturas verticais ("hélices" e torres de gelo)',
          'Acesso privado aos espectrômetros a laser do observatório',
        ],
        services: [
          'Treinamento de voo em proximidade de anéis (4 dias)',
          'Piloto especialista em dinâmica orbital e guia astrônomo',
          'Alta gastronomia servida sobre o mirante nadir de vidro',
        ],
        activities: [
          'Voo estacionário sobre as torres de gelo de 2 km na borda do anel B',
          'Acompanhamento próximo das luas pastoras Prometeu e Pandora',
          'Concerto acústico imersivo com sonificação das ondas dos anéis',
        ],
      },
    },
  },
  {
    id: 'saturn-ring-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'saturn-ring-observation',
    name: 'Division Zero Private',
    priceUsd: 210000,
    durationDays: 22,
    availableSeats: 2,
    i18n: {
      es: {
        tagline: 'Cúpula nadir exclusiva y cruce guiado de la División de Cassini',
        description:
          'La experiencia visual más extraordinaria del sistema solar: reserva del domo nadir completo y travesía en nave blindada cruzando el plano de los anillos por la División de Cassini.',
        lodging: 'Domo Nadir Imperial de uso exclusivo en la base del observatorio',
        highlights: [
          'Travesía controlada a través del plano de anillos por la División de Cassini',
          'Paseo espacial EVA suspendido sobre el océano blanco del anillo B',
          'Uso exclusivo del Domo Nadir durante toda la estancia',
        ],
        services: [
          'Transporte interplanetario directo y cápsula de observación dedicada',
          'Tripulación de élite, soporte EVA y hospitalidad privada 24/7',
          'Relicario con microcristal certificado recolectado en el halo exterior',
        ],
        activities: [
          'EVA privada en ingravidez con los anillos extendiéndose de horizonte a horizonte',
          'Cruce rasante entre los anillos A y B hacia el hemisferio sur de Saturno',
          'Banquete privado bajo la bóveda iluminada por el reflejo de los anillos',
        ],
      },
      en: {
        tagline: 'Exclusive nadir dome and guided crossing of the Cassini Division',
        description:
          'The most extraordinary visual experience in the solar system: exclusive reservation of the entire nadir dome and a shielded craft crossing through the ring plane via the Cassini Division.',
        lodging: 'Exclusive-use Imperial Nadir Dome at the base of the conservatory',
        highlights: [
          'Controlled crossing through the ring plane via the Cassini Division',
          'Private zero-g EVA suspended above the white expanse of the B ring',
          'Exclusive use of the Nadir Dome throughout your stay',
        ],
        services: [
          'Direct interplanetary transport and dedicated observation pod',
          '24/7 elite flight crew, EVA support, and private hospitality',
          'Reliquary containing a certified micro-crystal from the outer ring halo',
        ],
        activities: [
          'Private zero-g EVA with the rings stretching from horizon to horizon',
          'Grazing transit between the A and B rings into Saturn’s southern hemisphere',
          'Private banquet beneath a vault illuminated by ring-shine',
        ],
      },
      pt: {
        tagline: 'Cúpula nadir exclusiva e travessia guiada da Divisão de Cassini',
        description:
          'A experiência visual mais extraordinária do sistema solar: reserva de todo o domo nadir e travessia em nave blindada cruzando o plano dos anéis pela Divisão de Cassini.',
        lodging: 'Domo Nadir Imperial de uso exclusivo na base do observatório',
        highlights: [
          'Travessia controlada através do plano dos anéis pela Divisão de Cassini',
          'Caminhada espacial EVA suspensa sobre o oceano branco do anel B',
          'Uso exclusivo do Domo Nadir durante toda a estadia',
        ],
        services: [
          'Transporte interplanetário direto e cápsula de observação dedicada',
          'Tripulação de elite, suporte EVA e hospitalidade privada 24/7',
          'Relicário com microcristal certificado coletado no halo externo',
        ],
        activities: [
          'EVA privada em gravidade zero com os anéis de horizonte a horizonte',
          'Travessia rasante entre os anéis A e B rumo ao hemisfério sul de Saturno',
          'Banquete privado sob a abóbada iluminada pelo brilho dos anéis',
        ],
      },
    },
  },
]

const TIER_ORDER: readonly PackageTier[] = ['explorer', 'voyager', 'infinity']

function materializePackage(bp: PackageBlueprint, locale: Locale): ExpeditionPackage {
  const loc = bp.i18n[locale]
  return {
    id: bp.id,
    tier: bp.tier,
    tierLabel: bp.tierLabel,
    destinationId: bp.destinationId,
    name: bp.name,
    priceUsd: bp.priceUsd,
    durationDays: bp.durationDays,
    availableSeats: bp.availableSeats,
    tagline: loc.tagline,
    description: loc.description,
    lodging: loc.lodging,
    highlights: loc.highlights,
    services: loc.services,
    activities: loc.activities,
  }
}

export const packages: readonly ExpeditionPackage[] = PACKAGE_BLUEPRINTS.map((bp) =>
  materializePackage(bp, 'es'),
)

export function getPackagesByDestination(
  destinationId: DestinationId,
  locale?: Locale,
): readonly ExpeditionPackage[] {
  const loc = locale ?? useUiStore.getState().locale
  return TIER_ORDER.map((tier) => getDestinationPackage(destinationId, tier, loc))
}

export function getDestinationPackage(
  destinationId: DestinationId,
  tier: PackageTier,
  locale?: Locale,
): ExpeditionPackage {
  const loc = locale ?? useUiStore.getState().locale
  const found =
    PACKAGE_BLUEPRINTS.find((p) => p.destinationId === destinationId && p.tier === tier) ??
    PACKAGE_BLUEPRINTS[0]!
  return materializePackage(found, loc)
}
