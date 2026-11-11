# SOLARIS INTERPLANETARY

## Plan maestro de ingeniería --- React, Three.js y WebGL

**Documento para Antigravity**\
**Tipo de proyecto:** landing page inmersiva / experiencia interactiva
3D\
**Estado:** planificación inicial\
**Estrategia:** desarrollo incremental por fases con aprobación manual
entre fases

------------------------------------------------------------------------

## 1. Visión del producto

SOLARIS INTERPLANETARY es una experiencia web ficticia de turismo
espacial. Debe combinar una landing page comercial premium con un
pequeño simulador de exploración del sistema solar.

La experiencia comienza en la Tierra. El visitante puede alejar la
cámara para descubrir el sistema solar, seleccionar destinos y realizar
un desplazamiento cinematográfico hasta cada planeta o estación orbital.
Al llegar, aparece una interfaz comercial con información y paquetes de
expedición.

La referencia de interacción es la selección de planetas y el movimiento
de cámara de videojuegos de estrategia espacial como *Star Wars: Empire
at War*. Se toma como inspiración de lenguaje visual y navegación, sin
copiar recursos protegidos.

**Objetivo de portafolio:** demostrar arquitectura frontend moderna,
dirección visual, renderizado WebGL, shaders/materiales, animación de
cámara, optimización y diseño responsive.

### Principios no negociables

1.  El realismo visual de los planetas es una prioridad central.
2.  La escena 3D y la interfaz HTML deben estar desacopladas.
3.  Cada fase debe terminar con una compilación funcional y una
    revisión.
4.  Antigravity no debe avanzar de fase sin aprobación explícita.
5.  No se deben sustituir texturas reales por esferas planas de color
    salvo como placeholders temporales claramente identificados.
6.  El rendimiento debe medirse; no se debe asumir.
7.  La experiencia debe degradarse de forma elegante en hardware
    limitado.
8.  Los datos astronómicos y los elementos ficticios deben distinguirse
    claramente.

------------------------------------------------------------------------

## 2. Dirección artística

### Identidad

-   Nombre: **SOLARIS**
-   Descriptor: **INTERPLANETARY**
-   Concepto: compañía futurista de expediciones espaciales.
-   Tono: tecnología aeroespacial premium, exploración científica y
    turismo de lujo.
-   Estética: hiperrealismo cinematográfico combinado con HUD futurista.

### Paleta

  Uso                     Color
  ----------------------- -----------
  Fondo principal         `#020609`
  Superficie secundaria   `#07151A`
  Teal principal          `#00E5C3`
  Cyan luminoso           `#35DDF2`
  Texto principal         `#E8F5F5`
  Texto secundario        `#7E9DA3`
  Advertencias            `#FFB547`

Evitar saturar toda la interfaz con neón. El espacio debe conservar
negros profundos y los planetas deben ser el foco visual.

### Referencias visuales

-   Fotografía y visualizaciones científicas de NASA/JPL.
-   Interfaces de navegación espacial y simuladores.
-   Videojuegos de estrategia espacial.
-   Cine de ciencia ficción con iluminación cinematográfica.
-   Interfaces HUD minimalistas, con jerarquía tipográfica clara.

------------------------------------------------------------------------

## 3. Destinos de la primera versión

La primera versión incluye cinco familias de destino y seis experiencias
seleccionables:

1.  **Mercury --- Solar Frontier:** expedición ficticia de superficie.
2.  **Venus --- Cloud Haven:** estación turística ficticia en las capas
    altas de la atmósfera.
3.  **Mars --- Red Frontier:** colonia y expedición de superficie.
4.  **Jupiter --- Europa Orbital Station:** complejo ficticio en órbita
    de Júpiter, con vistas a sus lunas.
5.  **Saturn --- Titan Orbital Station:** complejo ficticio en órbita de
    Saturno, con excursiones visuales hacia Titán.
6.  **Saturn --- Ring Observation:** experiencia especializada de
    observación de los anillos desde una instalación orbital.

Las estaciones de Júpiter y Saturno son elementos de ficción. No
representar una estación dentro de la atmósfera de un gigante gaseoso.
Ubicarla en una órbita visualmente coherente.

La Tierra será el punto de inicio y retorno de la navegación, no
necesariamente un paquete turístico.

------------------------------------------------------------------------

## 4. Stack tecnológico

Usar versiones estables y compatibles entre sí. Verificar peer
dependencies antes de instalar.

  Tecnología                    Responsabilidad
  ----------------------------- -------------------------------------------
  React 19                      Aplicación y componentes
  TypeScript                    Tipado estricto
  Vite                          Servidor de desarrollo y build
  Three.js                      Motor 3D
  React Three Fiber 9           Integración declarativa de Three.js
  @react-three/drei             Utilidades y controles 3D
  GSAP                          Secuencias cinematográficas y animaciones
  Zustand                       Estado global de navegación
  Tailwind CSS                  Sistema de estilos
  @react-three/postprocessing   Postprocesado selectivo
  Lucide React                  Iconografía

No introducir librerías adicionales sin justificar su necesidad.
Comprobar compatibilidad de React, R3F y Drei antes de fijar versiones.

### Arquitectura de alto nivel

-   **React UI:** header, HUD, paneles, navegación, catálogo y reserva.
-   **3D Engine:** escena, planetas, materiales, atmósferas, partículas
    y cámara.
-   **Animation Layer:** timelines GSAP y microinteracciones.
-   **State Layer:** destino seleccionado, modo de navegación y carga.
-   **Data Layer:** destinos, características y paquetes en archivos
    tipados.
-   **Asset Pipeline:** texturas, modelos, HDRI, compresión y licencias.

La interfaz HTML no debe implementarse como geometría 3D. El canvas 3D
debe ser una capa independiente y la UI debe superponerse mediante
HTML/CSS.

------------------------------------------------------------------------

## 5. Estructura inicial del proyecto

``` text
src/
  app/
  components/
    layout/
    hud/
    navigation/
    destinations/
    packages/
    loading/
  engine/
    canvas/
    camera/
    planets/
    materials/
    atmosphere/
    lighting/
    particles/
    orbits/
    transitions/
  data/
    destinations.ts
    packages.ts
  hooks/
  stores/
    navigation.store.ts
  types/
  styles/
  utils/
  assets/
    textures/
    models/
    hdr/
    audio/
```

La estructura puede ajustarse si existe una razón técnica. Evitar
componentes monolíticos.

------------------------------------------------------------------------

## 6. Experiencia y estados de navegación

Estados principales:

``` ts
type NavigationState =
  | "loading"
  | "earth_hero"
  | "solar_system"
  | "transitioning"
  | "planet_detail"
  | "station_detail";
```

El store global debe mantener al menos:

-   Estado actual de navegación.
-   ID del destino seleccionado.
-   Acción para seleccionar destino.
-   Acción para volver al sistema solar.
-   Indicador de transición en curso.

### Flujo de usuario

1.  Loading screen.
2.  Hero con la Tierra en primer plano.
3.  CTA `EXPLORE SOLAR SYSTEM`.
4.  Cámara se aleja y revela el sistema solar.
5.  Usuario selecciona planeta desde la escena o el HUD inferior.
6.  Cámara ejecuta travelling cinematográfico.
7.  Escena se estabiliza en vista orbital del destino.
8.  Panel informativo y paquetes aparecen.
9.  Usuario puede regresar al sistema solar o iniciar una reserva
    demostrativa.

### Cámara

No depender únicamente de OrbitControls para la navegación principal.

-   Definir posiciones y objetivos de cámara por destino.
-   Usar GSAP Timeline para interpolar posición y orientación.
-   Evitar saltos instantáneos.
-   Bloquear selecciones mientras exista una transición.
-   Gestionar cancelación o finalización segura de timelines.
-   Mantener un botón de retorno visible.
-   Evitar movimientos que provoquen vértigo innecesario.

Las distancias astronómicas reales no son prácticas para una escena
interactiva. Usar una escala artística comprimida y conservar datos
científicos separados de las posiciones visuales.

------------------------------------------------------------------------

# 7. Fases de desarrollo

## FASE 0 --- Arquitectura y configuración

**Objetivo:** establecer una base modular y compilable.

### Prompt para Antigravity

Actúa como Senior Frontend Architect especializado en React, TypeScript,
Three.js y WebGL.

Proyecto: SOLARIS INTERPLANETARY.

Configura el proyecto con React 19, TypeScript, Vite, Three.js, React
Three Fiber 9, Drei, GSAP, Zustand y Tailwind CSS. Verifica
compatibilidad de versiones y peer dependencies antes de instalar.

Tareas: 1. Crear la estructura modular descrita en este documento. 2.
Separar UI HTML de escena 3D. 3. Crear store de navegación con Zustand.
4. Crear tipos para destinos y paquetes. 5. Preparar un canvas R3F
independiente. 6. Preparar loading screen y Suspense. 7. Configurar
TypeScript estricto. 8. Preparar linting y scripts de build. 9. Añadir
una escena placeholder mínima. 10. Documentar cómo ejecutar y compilar
el proyecto.

No desarrollar todavía el sistema solar completo.

### Criterios de aceptación

-   El proyecto instala dependencias correctamente.
-   `npm run dev` funciona.
-   `npm run build` termina sin errores.
-   La estructura está creada.
-   La UI y el canvas están separados.
-   El store puede cambiar entre estados básicos.
-   Se presenta un resumen de archivos y decisiones.

**Detenerse y solicitar aprobación.**

------------------------------------------------------------------------

## FASE 1 --- Sistema visual y UI HUD

**Objetivo:** construir la interfaz definitiva sobre un fondo temporal,
antes de integrar todos los planetas.

### Prompt para Antigravity

Implementa la identidad visual de SOLARIS usando la paleta y dirección
artística de este documento.

Crear: 1. Header con logo SOLARIS, navegación y CTA. 2. Loading screen
futurista. 3. HUD lateral para datos del destino. 4. Panel derecho de
información comercial. 5. Barra inferior de selección de destinos. 6.
Tarjetas Explorer, Voyager e Infinity. 7. Modal de detalles y reserva
demostrativa. 8. Botones, estados hover, focus y disabled. 9.
Componentes de indicadores técnicos. 10. Microinteracciones discretas.

Usar HTML/CSS/React para todos los elementos de interfaz. No construir
el HUD como objetos 3D.

Evitar glassmorphism excesivo y neón permanente. Mantener contraste y
legibilidad.

Validar desktop 1920x1080, 1440x900, tablet y móvil.

No integrar todavía el motor planetario completo.

### Criterios de aceptación

-   Jerarquía visual clara.
-   HUD legible y no invasivo.
-   Componentes reutilizables.
-   Estados interactivos funcionales.
-   Diseño responsive.
-   Build sin errores.

**Detenerse y solicitar aprobación.**

------------------------------------------------------------------------

## FASE 2 --- Pipeline de assets y motor planetario realista

**Objetivo:** validar primero la calidad visual de un planeta antes de
producir todos los demás.

Esta fase tiene dos entregas internas:

### FASE 2A --- Prueba de realismo: Tierra

Implementar una Tierra de alta calidad con:

-   Textura albedo de alta resolución.
-   Normal map o bump map.
-   Specular/roughness cuando el asset lo permita.
-   Mapas de luces nocturnas.
-   Capa de nubes separada y animada.
-   Atmósfera con shader de scattering o aproximación visual.
-   Iluminación solar direccional.
-   Terminador día/noche.
-   Fondo estelar.
-   Rotación lenta.

La Tierra debe verse convincente en vista orbital y en aproximación. No
utilizar una esfera azul con una textura genérica como resultado final.

### Prompt para Antigravity --- 2A

Construye una escena de Tierra hiperrealista en React Three Fiber y
Three.js. Prioriza fidelidad visual y materiales físicos.

Investiga y prepara un pipeline de texturas equirectangulares. Separa
albedo, nubes, luces nocturnas, relieve y mapas especulares cuando estén
disponibles. Implementa una atmósfera con shader apropiado y una
iluminación solar direccional.

La capa de nubes debe rotar a una velocidad ligeramente diferente a la
superficie. La atmósfera debe producir un halo sutil, sin parecer un
borde neón.

Permite controlar calidad y resolución de texturas mediante
configuración. Añade fallback de menor calidad para hardware limitado.

Documenta procedencia, resolución, formato y licencia de cada asset. No
descargar ni incorporar recursos sin comprobar sus condiciones de uso.

No continúes con los demás planetas hasta que la Tierra sea aprobada
visualmente.

### Criterios de aceptación 2A

-   La Tierra tiene relieve visual y variación de materiales.
-   Nubes separadas y animadas.
-   Iluminación día/noche coherente.
-   Atmósfera convincente.
-   No hay artefactos evidentes en los polos o costuras de textura.
-   Rendimiento medido.
-   Texturas y licencias documentadas.

**Detenerse para revisión visual.**

### FASE 2B --- Resto del sistema solar

Después de aprobar la Tierra, implementar:

-   Mercurio: superficie craterizada y rocosa.
-   Venus: atmósfera densa, nubes y tonalidad cálida.
-   Marte: albedo rojizo, relieve y casquetes cuando los mapas lo
    permitan.
-   Júpiter: bandas atmosféricas, variación de nubes y Gran Mancha Roja.
-   Saturno: bandas atmosféricas y anillos separados con textura y
    transparencia apropiadas.
-   Sol: superficie emisiva, iluminación y corona estilizada.

No aplicar el mismo material a todos los planetas. Cada uno debe tener
tratamiento específico.

Crear componentes reutilizables para geometría y configuración, pero
mantener materiales/shaders específicos cuando sean necesarios.

### Prompt para Antigravity --- 2B

Amplía el motor planetario aprobado de SOLARIS. Crea componentes
independientes por planeta y materiales visuales específicos.

Utiliza mapas planetarios de fuentes verificadas, shaders cuando aporten
valor y geometrías adecuadas. Implementa rotación, iluminación y capas
atmosféricas particulares.

Saturno necesita anillos como geometría independiente con textura y
transparencia. Júpiter necesita bandas atmosféricas reconocibles. Venus
requiere una atmósfera visualmente densa. Marte debe mostrar variación
de terreno.

Añade estrellas, órbitas visuales y composición espacial. Mantén la
escala artística comprimida.

No usar placeholders en la entrega final. Identificar claramente
cualquier asset provisional.

### Criterios de aceptación 2B

-   Todos los planetas se distinguen visualmente.
-   Saturno tiene anillos convincentes.
-   Júpiter presenta bandas atmosféricas.
-   No existen costuras o estiramientos de textura graves.
-   Escena estable.
-   Rendimiento documentado.

**Detenerse y solicitar aprobación.**

------------------------------------------------------------------------

## FASE 3 --- Navegación cinematográfica

**Objetivo:** construir la experiencia de selección planetaria.

### Prompt para Antigravity

Implementa el sistema de cámara cinematográfica con GSAP y React Three
Fiber.

Secuencia: 1. Iniciar frente a la Tierra. 2. CTA `EXPLORE SOLAR SYSTEM`.
3. Alejar cámara y revelar el sistema. 4. Permitir selección desde
planetas y HUD. 5. Bloquear interacciones durante transición. 6.
Desplazar cámara con trayectoria suave hacia destino. 7. Orientar cámara
para obtener composición atractiva. 8. Estabilizar vista orbital. 9.
Mostrar panel de destino. 10. Permitir regresar al sistema solar y a la
Tierra.

Usar GSAP timelines, easing cinematográfico y puntos de cámara definidos
por destino. Evitar teletransportes y cambios bruscos de orientación.

Gestionar correctamente timelines y estados para evitar animaciones
duplicadas o transiciones simultáneas.

### Criterios de aceptación

-   Tierra → sistema solar funciona.
-   Sistema solar → cada planeta funciona.
-   Retorno al sistema funciona.
-   No hay saltos de cámara.
-   HUD sincronizado con el destino.
-   No se permiten selecciones simultáneas durante transiciones.

**Detenerse y solicitar aprobación.**

------------------------------------------------------------------------

## FASE 4 --- Experiencias de destino y estaciones orbitales

**Objetivo:** hacer que cada destino tenga identidad propia.

### Contenido

**Mercury** - Vista orbital y superficie. - Cráteres. - Iluminación
solar intensa.

**Venus** - Atmósfera densa. - Estación turística flotante ficticia en
capas altas. - Nubes y ambiente cálido.

**Mars** - Terreno rojizo. - Hábitats y colonias futuristas. -
Instalaciones de turismo.

**Jupiter** - Planeta gigante. - Estación orbital ficticia. - Vistas de
lunas y Europa.

**Saturn** - Anillos prominentes. - Estación orbital ficticia. - Vistas
hacia Titán.

### Prompt para Antigravity

Construye escenas y elementos específicos para cada destino. Las
estaciones deben ser modelos 3D independientes, con iluminación, escala
y materiales coherentes.

Prioriza modelos GLB/GLTF optimizados. Si se usan modelos externos,
documentar autor, licencia, atribución y restricciones.

No colocar estaciones dentro de atmósferas de gigantes gaseosos.
Mantenerlas como instalaciones orbitales ficticias.

Cada destino debe integrarse con la navegación existente y reutilizar el
motor central sin recargar toda la aplicación.

### Criterios de aceptación

-   Escenas coherentes y diferenciadas.
-   Estaciones visibles y correctamente iluminadas.
-   Integración con cámara.
-   Retorno al sistema estable.
-   Assets optimizados y con licencias verificadas.

**Detenerse y solicitar aprobación.**

------------------------------------------------------------------------

## FASE 5 --- Paquetes comerciales y reservas simuladas

**Objetivo:** convertir la experiencia 3D en una landing comercial
completa.

Categorías: - Explorer. - Voyager. - Infinity.

Los precios y disponibilidades son ficticios y deben mostrarse como
contenido de demostración.

Cada paquete incluye: - Nombre. - Precio. - Duración ficticia. -
Descripción. - Alojamiento. - Servicios. - Actividades. - Disponibilidad
simulada.

### Prompt para Antigravity

Implementa el catálogo comercial de SOLARIS con datos tipados
independientes de los componentes.

Crear selector de paquetes, comparador, panel de detalles, CTA
`BOOK EXPEDITION`, formulario demostrativo y confirmación visual
simulada.

No integrar pagos reales ni backend en esta etapa. Marcar precios y
disponibilidad como ficticios.

El catálogo debe aparecer sincronizado con el destino seleccionado y
funcionar tanto en desktop como en móvil.

### Criterios de aceptación

-   Cada destino muestra sus paquetes correctos.
-   Los precios se identifican como ficticios.
-   El modal y formulario funcionan.
-   La navegación 3D no se rompe.
-   Responsive correcto.

**Detenerse y solicitar aprobación.**

------------------------------------------------------------------------

## FASE 6 --- Optimización, compatibilidad y responsive

**Objetivo:** mantener calidad visual con diferentes niveles de
hardware.

### Requisitos

-   Carga progresiva de texturas y modelos.
-   LOD por distancia.
-   Adaptive DPR.
-   Texturas comprimidas KTX2/Basis cuando sea apropiado.
-   Modelos GLB/GLTF optimizados.
-   Instancing para partículas repetidas.
-   Gestión y liberación de recursos GPU.
-   Limitar efectos de postprocesado.
-   Reducir partículas y resolución en móviles.
-   Detectar pérdida de contexto WebGL.
-   Respetar `prefers-reduced-motion`.
-   Fallback visual si WebGL no está disponible.

### Prompt para Antigravity

Actúa como WebGL Performance Engineer. Audita la aplicación en desktop,
tablet y móvil.

Mide FPS, draw calls, geometrías, texturas, memoria estimada y tiempos
de carga. Usa renderer.info y herramientas de profiling del navegador.

Implementa LOD, Adaptive DPR, carga diferida, compresión de assets y
reducción dinámica de calidad según capacidad del dispositivo.

No sacrifiques la estabilidad por efectos visuales. Documenta las
pruebas realizadas y los equipos utilizados.

### Criterios de aceptación

-   Navegación estable.
-   Sin fugas de recursos evidentes.
-   Carga progresiva funcional.
-   Fallback WebGL.
-   Calidad adaptativa.
-   Resultados de profiling documentados.

**Detenerse y solicitar aprobación.**

------------------------------------------------------------------------

## FASE 7 --- QA final y despliegue

### Prompt para Antigravity

Realiza auditoría final de SOLARIS.

Verifica: 1. Todas las rutas y estados. 2. Todas las transiciones. 3.
Todos los destinos. 4. Todos los paquetes. 5. Responsive. 6.
Accesibilidad y teclado. 7. Contraste. 8. Errores de consola. 9. Carga
de assets. 10. Rendimiento WebGL. 11. SEO y metadatos. 12. Build de
producción.

Prepara despliegue en Vercel. Primero generar Preview Deployment y
validar la URL. No desplegar a producción definitiva sin aprobación
explícita.

Entregar reporte de QA, problemas encontrados y estado final.

### Criterios de aceptación

-   Build de producción correcto.
-   Preview verificada.
-   Sin errores críticos.
-   Navegación completa.
-   Assets y licencias documentados.
-   Aprobación final del usuario.

------------------------------------------------------------------------

# 8. Estrategia de hiperrealismo y recursos

La calidad final dependerá en gran medida de los assets, no solo del
motor 3D.

## Fuentes recomendadas

  Fuente               Uso
  -------------------- -------------------------------
  NASA/JPL             Mapas e imágenes planetarias
  Solar System Scope   Texturas planetarias
  Poly Haven           HDRI y materiales
  AmbientCG            Materiales PBR
  Sketchfab            Modelos de estaciones y naves
  Blender              Ajuste y creación de modelos
  glTF Transform       Optimización de GLB/GLTF
  KTX2/Basis           Compresión de texturas

En todos los casos, verificar licencia, atribución, uso comercial y
restricciones antes de incorporar un recurso.

## Pipeline de assets

Para cada recurso registrar:

-   Nombre del archivo.
-   Destino al que pertenece.
-   Fuente y URL.
-   Autor.
-   Licencia.
-   Resolución.
-   Formato.
-   Tamaño.
-   Uso dentro de la escena.

No almacenar assets sin procedencia conocida.

## Materiales planetarios

Cuando los datos estén disponibles, priorizar: - Albedo/base color. -
Normal o bump. - Roughness/specular. - Displacement en casos
justificados. - Emissive para luces nocturnas. - Clouds como capa
independiente. - Atmosphere mediante shader.

No todos los planetas requieren exactamente los mismos mapas. Adaptar el
material a las características visuales de cada cuerpo.

------------------------------------------------------------------------

# 9. Entorno de desarrollo y visualización remota

El ordenador HP Pavilion se utilizará principalmente para programación,
edición y control del proyecto. No se debe asumir que puede renderizar
la escena final con máxima calidad.

## Aclaración sobre GeForce NOW

GeForce NOW está diseñado para transmitir videojuegos ejecutados en
infraestructura NVIDIA. No debe tratarse como un escritorio Windows
remoto genérico para ejecutar Antigravity, Vite o un navegador
arbitrario con aceleración WebGL.

Para utilizar una GPU RTX remota en la visualización de SOLARIS se
necesita un **Cloud PC o workstation remota con GPU**, con escritorio
completo y navegador compatible con WebGL.

## Arquitectura recomendada

1.  Antigravity desarrolla el proyecto en el HP.
2.  Código versionado en GitHub.
3.  Vercel genera deployments Preview para cada fase aprobada.
4.  La URL Preview se abre en el navegador de la máquina remota con GPU.
5.  La revisión visual se realiza allí.
6.  Una vez aprobada la fase, se conserva el commit y se continúa.

Separar: - Desarrollo local. - Preview / QA. - Producción.

No publicar cada cambio experimental directamente en el dominio
definitivo.

## Pruebas de rendimiento

Medir por separado: - Rendimiento del navegador local. - Rendimiento del
navegador remoto. - Latencia de streaming remoto. - FPS real de la
escena WebGL. - Calidad y resolución de renderizado.

Una conexión remota puede transmitir una imagen fluida aunque la escena
tenga una tasa de renderizado menor. No confundir FPS del streaming con
FPS del motor WebGL.

------------------------------------------------------------------------

# 10. Protocolo de trabajo con Antigravity

Este protocolo aplica a todas las fases.

Antes de comenzar una fase: 1. Leer este documento. 2. Revisar el estado
actual del repositorio. 3. Identificar qué existe y qué falta. 4.
Confirmar la fase autorizada. 5. No rehacer funcionalidades que ya estén
aprobadas.

Al terminar una fase: 1. Ejecutar build. 2. Corregir errores. 3. Probar
los criterios de aceptación. 4. Enumerar archivos creados y modificados.
5. Documentar dependencias y assets. 6. Mostrar capturas o URL Preview
cuando corresponda. 7. Explicar limitaciones pendientes. 8. Detenerse y
esperar aprobación.

### Regla de control

**No avanzar automáticamente a la siguiente fase.**

El usuario y el asistente revisarán el resultado antes de autorizar el
siguiente bloque de trabajo.

No realizar refactors amplios ni cambiar el stack sin explicar primero
el motivo y el impacto.

------------------------------------------------------------------------

# 11. Primer comando de inicio

Cuando este documento esté dentro del repositorio, iniciar Antigravity
con el siguiente prompt:

Lee completamente `SOLARIS_ENGINEERING_PLAN.md`.

Tu tarea actual es ejecutar exclusivamente la FASE 0.

Antes de modificar archivos: - Inspecciona el repositorio. - Identifica
si ya existe código. - No sobrescribas trabajo válido. - Presenta un
breve plan de cambios.

Después implementa la FASE 0, ejecuta las verificaciones y entrega el
reporte.

No avances a la FASE 1 ni implementes funcionalidades de fases
posteriores. Espera aprobación explícita.

------------------------------------------------------------------------

## 12. Definición de éxito

SOLARIS estará completo cuando un visitante pueda:

1.  Entrar y contemplar una Tierra cinematográfica.
2.  Explorar el sistema solar.
3.  Seleccionar cualquier destino.
4.  Ver una transición de cámara fluida y espectacular.
5.  Llegar a una escena planetaria convincente.
6.  Explorar estaciones y estructuras orbitales ficticias.
7.  Consultar paquetes de viaje.
8.  Completar una reserva demostrativa.
9.  Utilizar la experiencia en desktop y móvil con degradación visual
    apropiada.

**Prioridad absoluta:** calidad visual planetaria, navegación
cinematográfica, estabilidad y rendimiento. La cantidad de efectos no
sustituye la calidad de ejecución.
