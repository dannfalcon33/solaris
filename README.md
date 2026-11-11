# SOLARIS INTERPLANETARY

Experiencia web 3D ficticia de turismo espacial (React + Three.js + WebGL).
Plan completo: [`SOLARIS_ENGINEERING_PLAN.md`](./SOLARIS_ENGINEERING_PLAN.md).

**Estado:** FASE 0 — arquitectura y configuración (escena placeholder).

## Requisitos

- Node.js ≥ 20.19 (probado con Node 26)
- npm

## Comandos

| Comando             | Descripción                                   |
| ------------------- | --------------------------------------------- |
| `npm install`       | Instala dependencias                          |
| `npm run dev`       | Servidor de desarrollo (Vite)                 |
| `npm run build`     | Typecheck estricto + build de producción      |
| `npm run preview`   | Sirve el build de `dist/`                     |
| `npm run lint`      | ESLint                                        |
| `npm run typecheck` | Solo comprobación de tipos                    |

## Stack (versiones instaladas)

React 19 · TypeScript (strict) · Vite · Three.js · React Three Fiber 9 ·
@react-three/drei · GSAP · Zustand · Tailwind CSS 4 · Lucide React.
`@react-three/postprocessing` se añadirá en la FASE 2 cuando se necesite.

## Arquitectura

- **Capa 3D** (`src/engine/`): `SceneCanvas` es un canvas R3F independiente
  (`fixed`, `z-0`). No importa componentes HTML.
- **Capa UI** (`src/components/`): HTML/CSS superpuesto (`z-10`).
- **Estado** (`src/stores/navigation.store.ts`): único puente entre ambas capas.
  Estados: `loading → earth_hero → solar_system → transitioning →
  planet_detail | station_detail`. Las selecciones se bloquean mientras
  `isTransitioning` es `true`.
- **Datos** (`src/data/`): destinos tipados (datos científicos separados de
  posiciones visuales) y paquetes (FASE 5).
- Alias `@/` → `src/`.

## Placeholders temporales (FASE 0)

- `engine/planets/PlaceholderPlanet.tsx` — esfera plana → Tierra real en FASE 2A.
- `engine/particles/PlaceholderStars.tsx` — estrellas de drei.
- `hooks/usePlaceholderTransition.ts` — temporizador → timelines GSAP en FASE 3.
- `components/navigation/StateDebugPanel.tsx` — controles de depuración → HUD en FASE 1.
- `components/loading/LoadingScreen.tsx` — versión básica → diseño final en FASE 1.

