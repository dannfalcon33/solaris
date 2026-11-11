import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PlaceholderPlanet } from '@/engine/planets/PlaceholderPlanet'
import { PlaceholderStars } from '@/engine/particles/PlaceholderStars'
import { SunLight } from '@/engine/lighting/SunLight'
import { SceneReadyNotifier } from './SceneReadyNotifier'

/**
 * Canvas 3D independiente de la UI. No conoce ningún componente HTML; solo
 * se comunica con la interfaz a través del store de navegación.
 */
export function SceneCanvas() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 500 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#020609']} />
        <Suspense fallback={null}>
          <SunLight />
          <PlaceholderStars />
          <PlaceholderPlanet />
          <SceneReadyNotifier />
        </Suspense>
      </Canvas>
    </div>
  )
}

