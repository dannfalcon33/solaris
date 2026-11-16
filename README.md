# SOLARIS INTERPLANETARY

Experiencia web 3D ficticia de turismo espacial (React + Three.js + WebGL).
Plan completo: [`SOLARIS_ENGINEERING_PLAN.md`](./SOLARIS_ENGINEERING_PLAN.md).
Registro de texturas, modelos y licencias: [`docs/ASSETS.md`](./docs/ASSETS.md).
Auditoría de rendimiento WebGL: [`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md).
Reporte de QA final: [`docs/QA_REPORT.md`](./docs/QA_REPORT.md).

**Estado:** FASE 7 completada — proyecto auditado y listo para despliegue en producción.

## Requisitos

- Node.js ≥ 20.19 (probado con Node 26)
- npm

## Comandos

| Comando             | Descripción                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `npm install`       | Instala dependencias                                             |
| `npm run textures`  | Genera niveles `2k / 4k / 8k` WebP desde `assets-src/`           |
| `npm run models`    | Genera los 6 modelos `.glb` en `public/models/`                  |
| `npm run qa`        | Ejecuta la auditoría automatizada de assets, SEO y configuración |
| `npm run dev`       | Servidor de desarrollo (Vite)                                    |
| `npm run build`     | Typecheck estricto + build de producción                         |
| `npm run preview`   | Sirve el build de `dist/`                                        |
| `npm run lint`      | ESLint                                                           |
| `npm run typecheck` | Solo comprobación de tipos                                       |

## Parámetros de URL útiles

- `?quality=low|medium|high|ultra` — fuerza el nivel de calidad y resolución de texturas (`2k`, `4k`, `8k`).
- `?debug` — muestra en tiempo real FPS, peor frame, draw calls, triángulos, geometrías, texturas, VRAM estimada y Adaptive DPR.
- `?nowebgl` — simula un entorno sin WebGL para verificar el fallback visual interactivo 2.5D.

## Arquitectura

- **Capa 3D** (`src/engine/`): `SceneCanvas` es un canvas R3F independiente (`fixed`, `z-0`). No importa componentes HTML.
  - `engine/planets/`: componentes independientes (`Earth`, `Sun`, `Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, `SolarSystem`).
  - `engine/materials/`: shaders GLSL específicos por tipo de cuerpo (`earthSurface`, `cloudsAndAtmosphere`, `rockyPlanet`, `venusMaterial`, `gasGiant`, `sunMaterial`), con muestreo equirectangular sin costuras (`seamlessGradients` + `textureGrad`).
  - `engine/orbits/OrbitLines.tsx`: órbitas visuales en el plano de la eclíptica.
  - `engine/particles/Starfield.tsx` y `engine/environment/Skybox.tsx`: campo estelar puntual 3D + Vía Láctea.
  - `engine/textures/`: carga progresiva (`2k` inmediato por Suspense → `4k/8k` bajo demanda para el planeta activo, con liberación automática de VRAM).
- **Capa UI** (`src/components/`): HTML/CSS superpuesto (`z-10`).
- **Estado** (`src/stores/navigation.store.ts` y `src/stores/ui.store.ts`).
- **Datos comerciales** (`src/data/destinations.ts` y `src/data/packages.ts`): 6 destinos y 18 paquetes tipados independientes de los componentes.
