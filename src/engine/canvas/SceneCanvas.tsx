import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { HERO_CAMERA_Z, HERO_FOV } from '@/engine/camera/heroLayout'
import { getQuality } from '@/engine/config/quality'
import { PerfMonitor } from '@/engine/debug/PerfMonitor'
import { Skybox } from '@/engine/environment/Skybox'
import { SunLight } from '@/engine/lighting/SunLight'
import { Earth } from '@/engine/planets/Earth'
import { SceneReadyNotifier } from './SceneReadyNotifier'

/**
 * Canvas 3D independiente de la UI. No conoce ningún componente HTML; solo
 * se comunica con la interfaz a través del store de navegación.
 */
export function SceneCanvas() {
  const quality = getQuality()

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, HERO_CAMERA_Z], fov: HERO_FOV, near: 0.1, far: 2000 }}
        dpr={[1, quality.maxDpr]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#020609']} />
        <PerfMonitor />
        <Suspense fallback={null}>
          <SunLight />
          <Skybox />
          <Earth />
          <SceneReadyNotifier />
        </Suspense>
      </Canvas>
    </div>
  )
}
