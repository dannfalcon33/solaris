import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { WebGLFallback } from '@/components/layout/WebGLFallback'
import { HERO_CAMERA_Z, HERO_FOV } from '@/engine/camera/heroLayout'
import { SolarSystemCamera } from '@/engine/camera/SolarSystemCamera'
import { useQualityStore } from '@/engine/config/quality'
import { PerfMonitor } from '@/engine/debug/PerfMonitor'
import { Skybox } from '@/engine/environment/Skybox'
import { SunLight } from '@/engine/lighting/SunLight'
import { Starfield } from '@/engine/particles/Starfield'
import { AdaptivePerformance } from '@/engine/performance/AdaptivePerformance'
import { SolarSystem } from '@/engine/planets/SolarSystem'
import { SceneReadyNotifier } from './SceneReadyNotifier'

/**
 * Canvas 3D con Adaptive DPR, detección de pérdida de contexto WebGL y
 * fallback visual automático si WebGL no está disponible (FASE 6).
 */
export function SceneCanvas() {
  const settings = useQualityStore((s) => s.settings)
  const webglSupported = useQualityStore((s) => s.webglSupported)
  const contextLost = useQualityStore((s) => s.contextLost)

  if (!webglSupported) {
    return <WebGLFallback reason="unsupported" />
  }

  if (contextLost) {
    return <WebGLFallback reason="context_lost" />
  }

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, HERO_CAMERA_Z], fov: HERO_FOV, near: 0.1, far: 3500 }}
        dpr={[settings.minDpr, settings.maxDpr]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#020609']} />
        <AdaptivePerformance />
        <SolarSystemCamera />
        <PerfMonitor />
        <Suspense fallback={null}>
          <SunLight />
          <Skybox />
          <Starfield />
          <SolarSystem />
          <SceneReadyNotifier />
        </Suspense>
      </Canvas>
    </div>
  )
}
