import { useUiStore, type Locale } from '@/stores/ui.store'

export interface UiTranslations {
  loading: {
    ariaLabel: string
    statuses: readonly [string, string, string, string]
  }
  header: {
    navAria: string
    mobileNavAria: string
    home: string
    solarSystem: string
    packages: string
    bookCta: string
    bookDisabledHint: string
    openMenu: string
    closeMenu: string
    langAria: string
  }
  hero: {
    badge: string
    titleLine1: string
    titleLine2: string
    description: string
    cta: string
    subtitle: string
    telemetryAria: string
    altitude: string
    velocity: string
    orbit: string
    telemetryNote: string
    texturesCredit: string
  }
  hud: {
    sectionAriaPrefix: string
    orbitalStation: string
    planetaryExpedition: string
    fictionalFacilityBadge: string
    orbitalFacilityHeader: string
    realAstroDataHeader: string
    diameter: string
    distFromSun: string
    gravity: string
    day: string
    year: string
    meanTemp: string
    retrograde: string
    backToSolarSystem: string
    backToEarth: string
  }
  bar: {
    earthBtn: string
    inTransit: string
    openingOverview: string
    targetPrefix: string
    clickToTravel: string
    selectPrompt: string
    destinationsAria: string
  }
  commercial: {
    sectionAria: string
    catalogPrefix: string
    fictionalPrices: string
    collapsePackages: string
    expandPackages: string
    demoPerPerson: string
    daysSim: string
    seatsSim: string
    detailsBtn: string
    detailsAriaPrefix: string
    bookBtn: string
    bookAriaPrefix: string
    disclaimer: string
    compareCategoriesBtn: string
    bookCta: string
  }
  modal: {
    closeAria: string
    tabsAria: string
    tabDetails: string
    tabCompare: string
    tabBook: string
    demoNoticeStrong: string
    demoNoticeBody: string
    daysFictional: string
    perPersonFictional: string
    seatsSim: string
    assignedLodging: string
    destinationFacility: string
    includedServices: string
    expeditionActivities: string
    compare3CategoriesBtn: string
    closeBtn: string
    bookCta: string
    priceFictionalLine: (days: number, seats: number) => string
    lodgingHeader: string
    keyServicesHeader: string
    activitiesHeader: string
    choosePrefix: string
    backToDetailsBtn: string
    selectedPackageFor: string
    mainPassenger: string
    telemetryEmail: string
    travelersMax: (max: number) => string
    launchWindow: string
    departures: readonly [string, string, string, string]
    consentText: string
    estimatedTotal: (travelers: number, days: number) => string
    fictionalAmountNote: string
    confirmSimulatedBtn: string
    registeredBadge: string
    demoBookingFor: string
    missionLocator: string
    simulationBadge: string
    destAndFacility: string
    packageAndLodging: string
    windowAndDuration: string
    passengersCount: (days: number, travelers: number) => string
    simulatedTotalAmount: string
    demoNoChargeNote: string
    viewOtherPackagesBtn: string
    finishAndReturnBtn: string
    titleDone: string
    titleComparePrefix: string
    eyebrowDetailsSuffix: string
    eyebrowCompare: string
    eyebrowForm: string
    eyebrowDone: string
  }
  fallback: {
    ariaLabel: string
    contextLostTitle: string
    unsupportedTitle: string
    contextLostBody: string
    unsupportedBody: string
    retryBtn: string
  }
}

export const TRANSLATIONS: Readonly<Record<Locale, UiTranslations>> = {
  es: {
    loading: {
      ariaLabel: 'Cargando SOLARIS',
      statuses: [
        'Calibrando instrumentos',
        'Sincronizando órbitas',
        'Cargando cartografía estelar',
        'Preparando lanzamiento',
      ],
    },
    header: {
      navAria: 'Principal',
      mobileNavAria: 'Menú móvil',
      home: 'Inicio',
      solarSystem: 'Sistema solar',
      packages: 'Paquetes',
      bookCta: 'Book expedition',
      bookDisabledHint: 'Selecciona un destino para reservar',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      langAria: 'Seleccionar idioma',
    },
    hero: {
      badge: 'Expediciones espaciales · demo',
      titleLine1: 'El sistema solar',
      titleLine2: 'te está esperando',
      description:
        'Despega desde la Tierra, recorre el sistema solar y reserva una expedición a Mercurio, Venus, Marte, Júpiter o Saturno. Experiencia ficticia de demostración.',
      cta: 'Explore solar system',
      subtitle: '6 destinos · 5 mundos',
      telemetryAria: 'Telemetría orbital simulada',
      altitude: 'Altitud',
      velocity: 'Velocidad',
      orbit: 'Órbita',
      telemetryNote: 'Telemetría simulada · Texturas:',
      texturesCredit: 'Solar System Scope (CC BY 4.0)',
    },
    hud: {
      sectionAriaPrefix: 'Datos de',
      orbitalStation: 'Estación orbital',
      planetaryExpedition: 'Expedición planetaria',
      fictionalFacilityBadge: 'Instalación ficticia',
      orbitalFacilityHeader: 'Instalación orbital (ficción)',
      realAstroDataHeader: 'Datos astronómicos reales',
      diameter: 'Diámetro',
      distFromSun: 'Dist. al Sol',
      gravity: 'Gravedad',
      day: 'Día',
      year: 'Año',
      meanTemp: 'Temp. media',
      retrograde: 'retrógrado',
      backToSolarSystem: 'Volver al sistema solar',
      backToEarth: 'Regresar a la Tierra',
    },
    bar: {
      earthBtn: 'Tierra',
      inTransit: 'En tránsito',
      openingOverview: 'Abriendo vista general · Sistema Solar',
      targetLocked: 'Objetivo',
      targetPrefix: 'Objetivo',
      clickToTravel: 'clic para viajar',
      selectPrompt: 'Selecciona un planeta en 3D o un destino inferior',
      destinationsAria: 'Destinos',
    } as UiTranslations['bar'] & { targetLocked?: string },
    commercial: {
      sectionAria: 'Paquetes de expedición',
      catalogPrefix: 'Catálogo',
      fictionalPrices: 'Precios ficticios',
      collapsePackages: 'Contraer paquetes',
      expandPackages: 'Desplegar paquetes',
      demoPerPerson: 'Demo · /pers.',
      daysSim: 'días (sim.)',
      seatsSim: 'plazas (sim.)',
      detailsBtn: 'Detalles',
      detailsAriaPrefix: 'Ver detalles de',
      bookBtn: 'Reservar',
      bookAriaPrefix: 'Reservar',
      disclaimer:
        'Contenido de demostración. Precios, duraciones y disponibilidad son ficticios.',
      compareCategoriesBtn: 'Comparar categorías',
      bookCta: 'Book expedition',
    },
    modal: {
      closeAria: 'Cerrar',
      tabsAria: 'Secciones del catálogo',
      tabDetails: 'Detalles',
      tabCompare: 'Comparador (3)',
      tabBook: 'Book Expedition',
      demoNoticeStrong: 'Catálogo y reserva de demostración.',
      demoNoticeBody:
        'Precios, duraciones, fechas y disponibilidad son ficticios. No se procesa ningún pago real ni se almacena ningún dato personal.',
      daysFictional: 'días (ficticio)',
      perPersonFictional: '/ pers. · ficticio',
      seatsSim: 'plazas (sim.)',
      assignedLodging: 'Alojamiento asignado',
      destinationFacility: 'Instalación de destino (ficción)',
      includedServices: 'Servicios incluidos',
      expeditionActivities: 'Actividades de expedición',
      compare3CategoriesBtn: 'Comparar las 3 categorías',
      closeBtn: 'Cerrar',
      bookCta: 'Book expedition',
      priceFictionalLine: (days, seats) =>
        `Precio ficticio · ${days} días · ${seats} plazas`,
      lodgingHeader: 'Alojamiento',
      keyServicesHeader: 'Servicios clave',
      activitiesHeader: 'Actividades',
      choosePrefix: 'Elegir',
      backToDetailsBtn: 'Volver a detalles',
      selectedPackageFor: 'Paquete seleccionado para',
      mainPassenger: 'Pasajero principal',
      telemetryEmail: 'Correo de telemetría',
      travelersMax: (max) => `Viajeros (máx. ${max})`,
      launchWindow: 'Ventana de lanzamiento (ficticia)',
      departures: [
        'Ventana Alfa · Marzo 2031',
        'Ventana Beta · Junio 2031',
        'Ventana Gamma · Septiembre 2031',
        'Ventana Delta · Diciembre 2031',
      ],
      consentText:
        'Entiendo que esta solicitud es una demostración interactiva de portafolio con precios y disponibilidad ficticios.',
      estimatedTotal: (travelers, days) =>
        `Total estimado (${travelers} ${travelers === 1 ? 'viajero' : 'viajeros'} · ${days} días)`,
      fictionalAmountNote: 'Importe ficticio de demostración · sin cargo real',
      confirmSimulatedBtn: 'Confirmar reserva simulada',
      registeredBadge: 'Expedición registrada (modo simulación)',
      demoBookingFor: 'Reserva demostrativa a nombre de',
      missionLocator: 'Localizador de misión',
      simulationBadge: 'Simulación · Sin valor comercial',
      destAndFacility: 'Destino e instalación',
      packageAndLodging: 'Paquete y alojamiento',
      windowAndDuration: 'Ventana y duración ficticia',
      passengersCount: (days, travelers) =>
        `${days} días · ${travelers} ${travelers === 1 ? 'pasajero' : 'pasajeros'}`,
      simulatedTotalAmount: 'Importe total simulado',
      demoNoChargeNote: 'Demostración · sin cobro · sin datos almacenados',
      viewOtherPackagesBtn: 'Ver otros paquetes',
      finishAndReturnBtn: 'Finalizar y volver a la órbita',
      titleDone: 'Pase de embarque simulado emitido',
      titleComparePrefix: 'Comparador',
      eyebrowDetailsSuffix: 'Detalles del paquete',
      eyebrowCompare: 'Explorer vs Voyager vs Infinity',
      eyebrowForm: 'Solicitud de reserva demostrativa',
      eyebrowDone: 'Confirmación simulada',
    },
    fallback: {
      ariaLabel: 'Vista planetaria de compatibilidad 2D',
      contextLostTitle: 'Contexto WebGL interrumpido',
      unsupportedTitle: 'Modo de compatibilidad sin WebGL',
      contextLostBody:
        'El controlador gráfico reinició el contexto 3D. Puedes continuar navegando o reintentar el motor WebGL.',
      unsupportedBody:
        'Este navegador o dispositivo no tiene aceleración WebGL activa. Se muestra la vista 2.5D de respaldo.',
      retryBtn: 'Reintentar 3D',
    },
  },

  en: {
    loading: {
      ariaLabel: 'Loading SOLARIS',
      statuses: [
        'Calibrating instruments',
        'Synchronizing orbits',
        'Loading star cartography',
        'Preparing launch sequence',
      ],
    },
    header: {
      navAria: 'Main navigation',
      mobileNavAria: 'Mobile menu',
      home: 'Home',
      solarSystem: 'Solar system',
      packages: 'Packages',
      bookCta: 'Book expedition',
      bookDisabledHint: 'Select a destination to book',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      langAria: 'Select language',
    },
    hero: {
      badge: 'Space expeditions · demo',
      titleLine1: 'The solar system',
      titleLine2: 'is waiting for you',
      description:
        'Lift off from Earth, navigate the solar system, and book an expedition to Mercury, Venus, Mars, Jupiter, or Saturn. Fictional showcase experience.',
      cta: 'Explore solar system',
      subtitle: '6 destinations · 5 worlds',
      telemetryAria: 'Simulated orbital telemetry',
      altitude: 'Altitude',
      velocity: 'Velocity',
      orbit: 'Orbit',
      telemetryNote: 'Simulated telemetry · Textures:',
      texturesCredit: 'Solar System Scope (CC BY 4.0)',
    },
    hud: {
      sectionAriaPrefix: 'Data for',
      orbitalStation: 'Orbital station',
      planetaryExpedition: 'Planetary expedition',
      fictionalFacilityBadge: 'Fictional facility',
      orbitalFacilityHeader: 'Orbital facility (fiction)',
      realAstroDataHeader: 'Real astronomical data',
      diameter: 'Diameter',
      distFromSun: 'Dist. to Sun',
      gravity: 'Gravity',
      day: 'Day',
      year: 'Year',
      meanTemp: 'Mean temp.',
      retrograde: 'retrograde',
      backToSolarSystem: 'Back to solar system',
      backToEarth: 'Return to Earth',
    },
    bar: {
      earthBtn: 'Earth',
      inTransit: 'In transit',
      openingOverview: 'Opening overview · Solar System',
      targetPrefix: 'Target',
      clickToTravel: 'click to travel',
      selectPrompt: 'Select a 3D planet or a destination below',
      destinationsAria: 'Destinations',
    },
    commercial: {
      sectionAria: 'Expedition packages',
      catalogPrefix: 'Catalog',
      fictionalPrices: 'Fictional prices',
      collapsePackages: 'Collapse packages',
      expandPackages: 'Expand packages',
      demoPerPerson: 'Demo · /pers.',
      daysSim: 'days (sim.)',
      seatsSim: 'seats (sim.)',
      detailsBtn: 'Details',
      detailsAriaPrefix: 'View details for',
      bookBtn: 'Book',
      bookAriaPrefix: 'Book',
      disclaimer:
        'Demonstration content. Prices, durations, and availability are fictional.',
      compareCategoriesBtn: 'Compare tiers',
      bookCta: 'Book expedition',
    },
    modal: {
      closeAria: 'Close',
      tabsAria: 'Catalog sections',
      tabDetails: 'Details',
      tabCompare: 'Compare (3)',
      tabBook: 'Book Expedition',
      demoNoticeStrong: 'Demonstration catalog & booking.',
      demoNoticeBody:
        'Prices, durations, dates, and availability are fictional. No real payment is processed and no personal data is stored.',
      daysFictional: 'days (fictional)',
      perPersonFictional: '/ pers. · fictional',
      seatsSim: 'seats (sim.)',
      assignedLodging: 'Assigned lodging',
      destinationFacility: 'Destination facility (fiction)',
      includedServices: 'Included services',
      expeditionActivities: 'Expedition activities',
      compare3CategoriesBtn: 'Compare all 3 tiers',
      closeBtn: 'Close',
      bookCta: 'Book expedition',
      priceFictionalLine: (days, seats) =>
        `Fictional price · ${days} days · ${seats} seats`,
      lodgingHeader: 'Lodging',
      keyServicesHeader: 'Key services',
      activitiesHeader: 'Activities',
      choosePrefix: 'Select',
      backToDetailsBtn: 'Back to details',
      selectedPackageFor: 'Selected package for',
      mainPassenger: 'Primary passenger',
      telemetryEmail: 'Telemetry email',
      travelersMax: (max) => `Travelers (max. ${max})`,
      launchWindow: 'Launch window (fictional)',
      departures: [
        'Window Alpha · March 2031',
        'Window Beta · June 2031',
        'Window Gamma · September 2031',
        'Window Delta · December 2031',
      ],
      consentText:
        'I understand this request is an interactive portfolio demonstration with fictional prices and availability.',
      estimatedTotal: (travelers, days) =>
        `Estimated total (${travelers} ${travelers === 1 ? 'traveler' : 'travelers'} · ${days} days)`,
      fictionalAmountNote: 'Fictional demo amount · no real charge',
      confirmSimulatedBtn: 'Confirm simulated booking',
      registeredBadge: 'Expedition registered (simulation mode)',
      demoBookingFor: 'Demo reservation registered for',
      missionLocator: 'Mission locator',
      simulationBadge: 'Simulation · No commercial value',
      destAndFacility: 'Destination & facility',
      packageAndLodging: 'Package & lodging',
      windowAndDuration: 'Fictional window & duration',
      passengersCount: (days, travelers) =>
        `${days} days · ${travelers} ${travelers === 1 ? 'passenger' : 'passengers'}`,
      simulatedTotalAmount: 'Simulated total amount',
      demoNoChargeNote: 'Demonstration · no charge · no data stored',
      viewOtherPackagesBtn: 'View other packages',
      finishAndReturnBtn: 'Finish and return to orbit',
      titleDone: 'Simulated boarding pass issued',
      titleComparePrefix: 'Compare',
      eyebrowDetailsSuffix: 'Package details',
      eyebrowCompare: 'Explorer vs Voyager vs Infinity',
      eyebrowForm: 'Simulated booking request',
      eyebrowDone: 'Simulated confirmation',
    },
    fallback: {
      ariaLabel: '2D compatibility planetary view',
      contextLostTitle: 'WebGL context interrupted',
      unsupportedTitle: 'Compatibility mode without WebGL',
      contextLostBody:
        'The graphics driver reset the 3D context. You can continue browsing or retry the WebGL engine.',
      unsupportedBody:
        'This browser or device does not have active WebGL acceleration. Showing the 2.5D fallback view.',
      retryBtn: 'Retry 3D',
    },
  },

  pt: {
    loading: {
      ariaLabel: 'Carregando SOLARIS',
      statuses: [
        'Calibrando instrumentos',
        'Sincronizando órbitas',
        'Carregando cartografia estelar',
        'Preparando lançamento',
      ],
    },
    header: {
      navAria: 'Principal',
      mobileNavAria: 'Menu móvel',
      home: 'Início',
      solarSystem: 'Sistema solar',
      packages: 'Pacotes',
      bookCta: 'Book expedition',
      bookDisabledHint: 'Selecione um destino para reservar',
      openMenu: 'Abrir menu',
      closeMenu: 'Fechar menu',
      langAria: 'Selecionar idioma',
    },
    hero: {
      badge: 'Expedições espaciais · demo',
      titleLine1: 'O sistema solar',
      titleLine2: 'está esperando por você',
      description:
        'Decole da Terra, percorra o sistema solar e reserve uma expedição para Mercúrio, Vênus, Marte, Júpiter ou Saturno. Experiência fictícia de demonstração.',
      cta: 'Explore solar system',
      subtitle: '6 destinos · 5 mundos',
      telemetryAria: 'Telemetria orbital simulada',
      altitude: 'Altitude',
      velocity: 'Velocidade',
      orbit: 'Órbita',
      telemetryNote: 'Telemetria simulada · Texturas:',
      texturesCredit: 'Solar System Scope (CC BY 4.0)',
    },
    hud: {
      sectionAriaPrefix: 'Dados de',
      orbitalStation: 'Estação orbital',
      planetaryExpedition: 'Expedição planetária',
      fictionalFacilityBadge: 'Instalação fictícia',
      orbitalFacilityHeader: 'Instalação orbital (ficção)',
      realAstroDataHeader: 'Dados astronômicos reais',
      diameter: 'Diâmetro',
      distFromSun: 'Dist. ao Sol',
      gravity: 'Gravidade',
      day: 'Dia',
      year: 'Ano',
      meanTemp: 'Temp. média',
      retrograde: 'retrógrado',
      backToSolarSystem: 'Voltar ao sistema solar',
      backToEarth: 'Retornar à Terra',
    },
    bar: {
      earthBtn: 'Terra',
      inTransit: 'Em trânsito',
      openingOverview: 'Abrindo visão geral · Sistema Solar',
      targetPrefix: 'Alvo',
      clickToTravel: 'clique para viajar',
      selectPrompt: 'Selecione um planeta em 3D ou um destino abaixo',
      destinationsAria: 'Destinos',
    },
    commercial: {
      sectionAria: 'Pacotes de expedição',
      catalogPrefix: 'Catálogo',
      fictionalPrices: 'Preços fictícios',
      collapsePackages: 'Recolher pacotes',
      expandPackages: 'Expandir pacotes',
      demoPerPerson: 'Demo · /pess.',
      daysSim: 'dias (sim.)',
      seatsSim: 'vagas (sim.)',
      detailsBtn: 'Detalhes',
      detailsAriaPrefix: 'Ver detalhes de',
      bookBtn: 'Reservar',
      bookAriaPrefix: 'Reservar',
      disclaimer:
        'Conteúdo de demonstração. Preços, durações e disponibilidade são fictícios.',
      compareCategoriesBtn: 'Comparar categorias',
      bookCta: 'Book expedition',
    },
    modal: {
      closeAria: 'Fechar',
      tabsAria: 'Seções do catálogo',
      tabDetails: 'Detalhes',
      tabCompare: 'Comparador (3)',
      tabBook: 'Book Expedition',
      demoNoticeStrong: 'Catálogo e reserva de demonstração.',
      demoNoticeBody:
        'Preços, durações, datas e disponibilidade são fictícios. Nenhum pagamento real é processado e nenhum dado pessoal é armazenado.',
      daysFictional: 'dias (fictício)',
      perPersonFictional: '/ pess. · fictício',
      seatsSim: 'vagas (sim.)',
      assignedLodging: 'Hospedagem designada',
      destinationFacility: 'Instalação de destino (ficção)',
      includedServices: 'Serviços incluídos',
      expeditionActivities: 'Atividades da expedição',
      compare3CategoriesBtn: 'Comparar as 3 categorias',
      closeBtn: 'Fechar',
      bookCta: 'Book expedition',
      priceFictionalLine: (days, seats) =>
        `Preço fictício · ${days} dias · ${seats} vagas`,
      lodgingHeader: 'Hospedagem',
      keyServicesHeader: 'Serviços principais',
      activitiesHeader: 'Atividades',
      choosePrefix: 'Escolher',
      backToDetailsBtn: 'Voltar aos detalhes',
      selectedPackageFor: 'Pacote selecionado para',
      mainPassenger: 'Passageiro principal',
      telemetryEmail: 'E-mail de telemetria',
      travelersMax: (max) => `Viajantes (máx. ${max})`,
      launchWindow: 'Janela de lançamento (fictícia)',
      departures: [
        'Janela Alfa · Março 2031',
        'Janela Beta · Junho 2031',
        'Janela Gama · Setembro 2031',
        'Janela Delta · Dezembro 2031',
      ],
      consentText:
        'Entendo que esta solicitação é uma demonstração interativa de portfólio com preços e disponibilidade fictícios.',
      estimatedTotal: (travelers, days) =>
        `Total estimado (${travelers} ${travelers === 1 ? 'viajante' : 'viajantes'} · ${days} dias)`,
      fictionalAmountNote: 'Valor fictício de demonstração · sem cobrança real',
      confirmSimulatedBtn: 'Confirmar reserva simulada',
      registeredBadge: 'Expedição registrada (modo simulação)',
      demoBookingFor: 'Reserva demonstrativa em nome de',
      missionLocator: 'Localizador da missão',
      simulationBadge: 'Simulação · Sem valor comercial',
      destAndFacility: 'Destino e instalação',
      packageAndLodging: 'Pacote e hospedagem',
      windowAndDuration: 'Janela e duração fictícia',
      passengersCount: (days, travelers) =>
        `${days} dias · ${travelers} ${travelers === 1 ? 'passageiro' : 'passageiros'}`,
      simulatedTotalAmount: 'Valor total simulado',
      demoNoChargeNote: 'Demonstração · sem cobrança · sem dados armazenados',
      viewOtherPackagesBtn: 'Ver outros pacotes',
      finishAndReturnBtn: 'Finalizar e voltar à órbita',
      titleDone: 'Cartão de embarque simulado emitido',
      titleComparePrefix: 'Comparador',
      eyebrowDetailsSuffix: 'Detalhes do pacote',
      eyebrowCompare: 'Explorer vs Voyager vs Infinity',
      eyebrowForm: 'Solicitação de reserva demonstrativa',
      eyebrowDone: 'Confirmação simulada',
    },
    fallback: {
      ariaLabel: 'Visão planetária de compatibilidade 2D',
      contextLostTitle: 'Contexto WebGL interrompido',
      unsupportedTitle: 'Modo de compatibilidade sem WebGL',
      contextLostBody:
        'O driver gráfico reiniciou o contexto 3D. Você pode continuar navegando ou tentar novamente o motor WebGL.',
      unsupportedBody:
        'Este navegador ou dispositivo não possui aceleração WebGL ativa. Exibindo a visão 2.5D de contingência.',
      retryBtn: 'Tentar 3D novamente',
    },
  },
}

export function useTranslations() {
  const locale = useUiStore((s) => s.locale)
  return { locale, t: TRANSLATIONS[locale] }
}
