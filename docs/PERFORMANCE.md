# SOLARIS INTERPLANETARY — Auditoría de Rendimiento y Optimización WebGL (FASE 6)

Este documento recoge las medidas de optimización, compatibilidad multi-dispositivo y resultados de profiling implementados en la **FASE 6** conforme a `SOLARIS_ENGINEERING_PLAN.md`.

---

## 1. Arquitectura de optimización implementada

### 1.1 Perfiles de calidad adaptativa y Adaptive DPR (`quality.ts` + `AdaptivePerformance.tsx`)
Se definen 4 perfiles (`low`, `medium`, `high`, `ultra`) seleccionados inicialmente por heurística de hardware (`navigator.deviceMemory`, `navigator.hardwareConcurrency`, `pointer: coarse`, ancho de ventana y `gl.MAX_TEXTURE_SIZE`), con ajuste dinámico en tiempo de ejecución:

| Perfil | Resolución objetivo (foco) | Fondo estelar | Esfera LOD 0 (primer plano) | Esfera LOD 1 (distante) | Estrellas (`Starfield`) | Cinturón instanciado | Rango Adaptive DPR |
|---|---|---|---|---|---|---|---|
| `low` (móvil / GPU integrada básica) | `2k` | `2k` | `64×32` (4.096 tris) | `32×16` (1.024 tris) | 1.200 | 160 | `0.85 – 1.25` |
| `medium` (tablet / portátil medio) | `4k` | `2k` | `96×48` (9.216 tris) | `40×20` (1.600 tris) | 2.200 | 280 | `1.00 – 1.65` |
| `high` (desktop GPU dedicada) | `8k` | `4k` | `160×80` (25.600 tris) | `48×24` (2.304 tris) | 3.600 | 420 | `1.00 – 2.00` |
| `ultra` (workstation RTX / 4K) | `8k` | `8k` | `224×112` (50.176 tris) | `64×32` (4.096 tris) | 4.500 | 420 | `1.25 – 2.50` |

- **Algoritmo de Adaptive DPR (`AdaptivePerformance.tsx`):**
  - Mide el framerate real en ventanas deslizantes de `1,6 s` (descartando pausas de pestaña en segundo plano `delta > 250 ms`).
  - Si `FPS < 44`: reduce el `pixelRatio` del renderer en pasos de `-0.20` hasta `minDpr`.
  - Si `FPS < 34` durante 2 ventanas consecutivas estando ya en `minDpr`: degrada automáticamente el perfil global (`ultra → high → medium → low`), reduciendo al instante la densidad geométrica (LOD), el conteo de partículas y el techo de resolución de texturas.
  - Si `FPS ≥ 57` de forma sostenida durante 2 ventanas: recupera progresivamente el DPR (`+0.15`) hasta `Math.min(window.devicePixelRatio, maxDpr)`.

### 1.2 LOD geométrico por distancia/foco (`useBodyLod`)
- Sólo el cuerpo celeste enfocado (`useIsBodyFocused`) utiliza la malla `LOD 0` (`160×80` en `high`).
- Los 6 cuerpos restantes que se encuentran lejos de cámara reducen su geometría a `LOD 1` (`48×24` en `high`), reduciendo el conteo de triángulos por planeta distante en **un 91 %** (`2.304` frente a `25.600` triángulos).

### 1.3 Gestión estricta de VRAM y carga progresiva (`useProgressiveTextureSet.ts`)
- **Decodificación fuera del hilo principal:** `ImageBitmapLoader` con `{ imageOrientation: 'flipY', premultiplyAlpha: 'none' }`.
- **Presupuesto de VRAM acotado:**
  - La base `2k` de todo el sistema solar (14 mapas equirectangulares) ocupa **~3,16 MB en red (WebP)** y **~156 MB en VRAM con mipmaps**.
  - Sólo el planeta en primer plano carga su conjunto `8k` (o `4k` en `medium`). Al viajar a otro destino, el conjunto `8k` del planeta anterior ejecuta `tex.dispose()` e `imageBitmap.close()`, evitando fugas de memoria GPU.
- **Sobre KTX2/Basis:** se evaluó frente a WebP multirresolución (`2k/4k/8k`) decodificado con `ImageBitmap` y liberación activa de VRAM; dado que nunca coexisten dos planetas `8k` en VRAM, WebP ofrece mayor fidelidad cromática sin artefactos de bloques UASTC/ETC1S en los gradientes suaves del terminador atmosférico y con un peso de transferencia inicial de solo `1,13 MB` (`earth 2k` + `sky 2k`).

### 1.4 Carga diferida de modelos `.glb` e Instancing (`DestinationEnvironments.tsx`)
- **Carga diferida (`.glb`):** los 6 modelos binarios `.glb` de estaciones orbitales ya no bloquean el `Suspense` inicial del Hero de la Tierra; se precargan en segundo plano `900 ms` después de `sceneReady` y dan prioridad inmediata al destino seleccionado.
- **Activación selectiva de estaciones y luces:** únicamente la estación orbital del destino activo (y sus 2 luces puntuales PBR) se activa en el grafo de escena (`visible={isActive}`), eliminando 10 luces puntuales y 5 estaciones fuera de cámara.
- **Instancing (`InstancedMesh`):**
  - Las colonias de superficie en Marte y Mercurio (21 mallas individuales de domos, torres y anillos) se consolidaron en **3 `InstancedMesh` globales** (3 draw calls en total).
  - El cinturón de asteroides entre Marte y Júpiter (`InstancedAsteroidBelt`, hasta 420 cuerpos) se dibuja en **1 único draw call** mediante `InstancedMesh`.

### 1.5 Respeto a `prefers-reduced-motion`, pérdida de contexto WebGL y Fallback 2.5D
- **`prefers-reduced-motion: reduce` (`usePrefersReducedMotion.ts`):** atenúa en un 88 % las rotaciones planetarias, de nubes y de anillos centrífugos, y acorta las transiciones de cámara a `0,45 s` sin elevación de arco.
- **Pérdida de contexto (`webglcontextlost` / `webglcontextrestored`) y Fallback (`WebGLFallback.tsx`):**
  - Si el navegador no soporta WebGL (o se prueba con `?nowebgl`) o el driver GPU reinicia el contexto, se activa automáticamente `WebGLFallback`, que renderiza el planeta activo en 2.5D con iluminación esférica CSS usando las texturas `2k` WebP y mantiene 100 % funcionales la navegación de estados, el HUD, el comparador y la reserva simulada.

---

## 2. Métricas de profiling (`renderer.info` y build)

### 2.1 Particionado de bundles de producción (`vite build`)
Mediante `manualChunks` en `vite.config.ts`, el bundle monolítico anterior (`1.393 KB`) se dividió en chunks paralelizables y cacheables sin advertencias de tamaño:
- `vendor-three`: motor Three.js
- `vendor-r3f`: React Three Fiber + Drei
- `vendor-gsap`: motor de animación GSAP
- `vendor-react`: React + ReactDOM + Zustand
- `index`: código de aplicación, shaders y catálogo comercial

### 2.2 Métricas de escena WebGL por estado (`?debug`)

| Estado de navegación | Perfil `high` (Desktop / RTX) — Draw calls | Triángulos activos (`high`) | Perfil `low` (Móvil) — Draw calls | Triángulos activos (`low`) | VRAM estimada (`high` / `low`) |
|---|---|---|---|---|---|
| `earth_hero` (Tierra en 1.er plano) | ~18 | ~78.000 | ~18 | ~16.500 | ~1.045 MB (`8k`) / ~156 MB (`2k`) |
| `solar_system` (Vista general con órbitas y asteroides) | ~31 | ~48.500 | ~31 | ~14.200 | ~245 MB (`sun 4k` + resto `2k`) / ~156 MB |
| `planet_detail` / `station_detail` (Planeta + estación `.glb`) | ~22 | ~62.000 | ~22 | ~18.000 | ~335–512 MB (`8k` del planeta activo) / ~156 MB |

- **Equipos de referencia:**
  - **Entorno de desarrollo local (HP Pavilion, Windows):** usado para compilación (`tsc`, `vite build`), validación de tipos/lint y pruebas de carga de recursos.
  - **Workstation remota con GPU NVIDIA RTX (producción / Preview `solaris.falconit.xyz`):** visualización a máxima calidad (`high`/`ultra`, texturas `8k`, `DPR 2.0`) a 60 FPS estables.
