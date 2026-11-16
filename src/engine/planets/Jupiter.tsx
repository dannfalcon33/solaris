import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { BODIES, getBodyPosition, getSunDirectionForBody } from '@/engine/config/solarSystemLayout'
import { createAtmosphereMaterial } from '@/engine/materials/cloudsAndAtmosphere'
import { createGasGiantMaterial, setGasGiantTextures } from '@/engine/materials/gasGiant'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'
import { useBodyLod } from '@/hooks/useIsBodyFocused'
import { getMotionScale } from '@/hooks/usePrefersReducedMotion'

const JUPITER_SPECS = { albedo: { srgb: true } } as const
const body = BODIES.jupiter
const pos = getBodyPosition('jupiter')
const sunDir = getSunDirectionForBody('jupiter')

/**
 * Júpiter: bandas atmosféricas ecuatoriales, Gran Mancha Roja, LOD por
 * distancia y oscurecimiento de limbo de gigante gaseoso.
 */
export function Jupiter() {
  const { quality, focused, segments: seg, atmoSegments } = useBodyLod('jupiter')
  const { textures } = useProgressiveTextureSet(
    'jupiter',
    JUPITER_SPECS,
    quality.textureRes,
    quality.anisotropy,
    focused,
  )

  const surface = useMemo(
    () =>
      createGasGiantMaterial({
        sunDir,
        hazeColor: '#dbb88e',
        bumpScale: 2.1,
      }),
    [],
  )

  const atmosphere = useMemo(
    () =>
      createAtmosphereMaterial({
        sunDir,
        dayColor: '#d9b589',
        terminatorColor: '#9e542a',
        innerColor: '#f5e1c3',
        intensity: 0.72,
        scaleHeight: 0.018,
        atmoRadius: 1.05,
      }),
    [],
  )

  useLayoutEffect(() => {
    setGasGiantTextures(surface, textures.albedo)
  }, [surface, textures])

  useLayoutEffect(
    () => () => {
      surface.dispose()
      atmosphere.dispose()
    },
    [surface, atmosphere],
  )

  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1) * getMotionScale()
    if (meshRef.current) meshRef.current.rotation.y += dt * body.rotationSpeed
  })

  return (
    <group position={[pos.x, pos.y, pos.z]} scale={body.visualRadius} name="planet-jupiter">
      <group rotation={[0, 0, body.axialTiltRad]}>
        <mesh ref={meshRef} material={surface} rotation={[0, -1.8, 0]} name="jupiter-surface">
          <sphereGeometry args={[1, seg, seg / 2]} />
        </mesh>
      </group>
      <mesh material={atmosphere} renderOrder={2} name="mars-atmosphere">
        <sphereGeometry args={[1.05, atmoSegments, atmoSegments / 2]} />
      </mesh>
    </group>
  )
}
