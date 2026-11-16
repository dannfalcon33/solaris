import type { DestinationId, ExpeditionPackage, PackageTier } from '@/types'

/**
 * Catálogo comercial completo por destino (FASE 5): 6 destinos × 3 categorías.
 * Todos los precios, duraciones y disponibilidades son FICTICIOS (demostración).
 */
export const packages: readonly ExpeditionPackage[] = [
  /* ================================================================ */
  /* 1. MERCURY — Solar Frontier                                      */
  /* ================================================================ */
  {
    id: 'mercury-explorer',
    tier: 'explorer',
    tierLabel: 'Explorer',
    destinationId: 'mercury-solar-frontier',
    name: 'Helios Recon',
    tagline: 'Órbita polar tras el escudo térmico dorado',
    priceUsd: 24500,
    durationDays: 6,
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
    availableSeats: 12,
  },
  {
    id: 'mercury-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'mercury-solar-frontier',
    name: 'Terminator Odyssey',
    tagline: 'Descenso a los domos crepusculares del terminador',
    priceUsd: 54000,
    durationDays: 10,
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
    availableSeats: 5,
  },
  {
    id: 'mercury-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'mercury-solar-frontier',
    name: 'Solar Crown Sovereign',
    tagline: 'Residencia privada en el umbral del Sol',
    priceUsd: 118000,
    durationDays: 14,
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
    availableSeats: 2,
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
    tagline: 'Navegando la super-rotación a 55 km de altitud',
    priceUsd: 21000,
    durationDays: 7,
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
    availableSeats: 14,
  },
  {
    id: 'venus-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'venus-cloud-haven',
    name: 'Sulfur Cloud Odyssey',
    tagline: 'Vuelo en planeador estratosférico y cúpula cenital',
    priceUsd: 46500,
    durationDays: 11,
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
    availableSeats: 6,
  },
  {
    id: 'venus-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'venus-cloud-haven',
    name: 'Aphrodite Sovereign',
    tagline: 'Pabellón flotante privado sobre el lucero del alba',
    priceUsd: 98000,
    durationDays: 15,
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
    availableSeats: 2,
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
    tagline: 'Órbita baja y primeros pasos en los biodomos marcianos',
    priceUsd: 28000,
    durationDays: 8,
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
    availableSeats: 16,
  },
  {
    id: 'mars-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'mars-red-frontier',
    name: 'Olympus Expedition',
    tagline: 'Travesía en rover presurizado y vuelo suborbital a Olympus Mons',
    priceUsd: 62000,
    durationDays: 14,
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
    availableSeats: 6,
  },
  {
    id: 'mars-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'mars-red-frontier',
    name: 'Ares Founder Residency',
    tagline: 'Domo privado en el acantilado de Marineris y expedición polar',
    priceUsd: 135000,
    durationDays: 21,
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
    availableSeats: 2,
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
    tagline: 'Gravedad centrífuga frente a la Gran Mancha Roja y Europa',
    priceUsd: 38000,
    durationDays: 10,
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
    availableSeats: 10,
  },
  {
    id: 'jupiter-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'jupiter-europa-station',
    name: 'Europa Ice Horizon',
    tagline: 'Sobrevuelo orbital bajo sobre los géiseres y grietas de Europa',
    priceUsd: 79000,
    durationDays: 15,
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
    availableSeats: 4,
  },
  {
    id: 'jupiter-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'jupiter-europa-station',
    name: 'Jovian Sanctuary',
    tagline: 'Cúpula axial privada y tour por las lunas galileanas',
    priceUsd: 168000,
    durationDays: 21,
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
    availableSeats: 2,
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
    tagline: 'Santuario orbital frente a Titán y el sistema de anillos',
    priceUsd: 44000,
    durationDays: 12,
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
    availableSeats: 10,
  },
  {
    id: 'saturn-titan-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'saturn-titan-station',
    name: 'Titan Hazes Voyage',
    tagline: 'Aproximación orbital a Titán y sobrevuelo de Kraken Mare',
    priceUsd: 92000,
    durationDays: 18,
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
    availableSeats: 4,
  },
  {
    id: 'saturn-titan-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'saturn-titan-station',
    name: 'Huygens Imperial',
    tagline: 'Cúpula imperial privada y descenso de dron en Titán',
    priceUsd: 195000,
    durationDays: 24,
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
    availableSeats: 2,
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
    tagline: 'Suspendidos sobre el plano helado de los anillos A y B',
    priceUsd: 46000,
    durationDays: 11,
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
    availableSeats: 8,
  },
  {
    id: 'saturn-ring-voyager',
    tier: 'voyager',
    tierLabel: 'Voyager',
    destinationId: 'saturn-ring-observation',
    name: 'Ice Crystal Panorama',
    tagline: 'Inmersión en cápsula de cristal junto al borde del anillo A',
    priceUsd: 96000,
    durationDays: 16,
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
    availableSeats: 4,
  },
  {
    id: 'saturn-ring-infinity',
    tier: 'infinity',
    tierLabel: 'Infinity',
    destinationId: 'saturn-ring-observation',
    name: 'Division Zero Private',
    tagline: 'Cúpula nadir exclusiva y cruce guiado de la División de Cassini',
    priceUsd: 210000,
    durationDays: 22,
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
    availableSeats: 2,
  },
]

const TIER_ORDER: readonly PackageTier[] = ['explorer', 'voyager', 'infinity']

export function getPackagesByDestination(
  destinationId: DestinationId,
): readonly ExpeditionPackage[] {
  return TIER_ORDER.map((tier) => getDestinationPackage(destinationId, tier))
}

export function getDestinationPackage(
  destinationId: DestinationId,
  tier: PackageTier,
): ExpeditionPackage {
  const found = packages.find(
    (p) => p.destinationId === destinationId && p.tier === tier,
  )
  return found ?? packages[0]!
}
