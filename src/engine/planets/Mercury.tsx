import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { BODIES, getBodyPosition, getSunDirectionForBody } from '@/engine/config/solarSystemLayout'
import { createRockyPlanetMaterial, setRockyPlanetTexture } from '@/engine/materials/rockyPlanet'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'
import { useBodyLod } from '@/hooks/useIsBodyFocused'
import { getMotionScale } from '@/hooks/usePrefersReducedMotion'

const MERCURY_SPECS = { albedo: { srgb: true } } as const
const body = BODIES.mercury
const pos = getBodyPosition('mercury')
const sunDir = getSunDirectionForBody('mercury')

/**
 * Mercurio: superficie craterizada sin atmósfera con reflectancia de regolito
 * Lommel-Seeliger, LOD por distancia e iluminación solar intensa.
 */
export function Mercury() {
  const { quality, focused, segments: seg } = useBodyLod('mercury')
  const { textures } = useProgressiveTextureSet(
    'mercury',
    MERCURY_SPECS,
    quality.textureRes,
    quality.anisotropy,
    focused,
  )

  const surface = useMemo(
    () =>
      createRockyPlanetMaterial({
        sunDir,
        sunColor: '#fff6ea',
        bumpScale: 4.2,
        regolithMix: 0.85,
        hazeStrength: 0,
        exposure: 1.42,
      }),
    [],
  )

  useLayoutEffect(() => {
    setRockyPlanetTexture(surface, textures.albedo)
  }, [surface, textures])

  useLayoutEffect(() => () => surface.dispose(), [surface])

  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1) * getMotionScale()
    if (meshRef.current) meshRef.current.rotation.y += dt * body.rotationSpeed
  })

  return (
    <group position={[pos.x, pos.y, pos.z]} scale={body.visualRadius} name="planet-mercury">
      <group rotation={[0, 0, body.axialTiltRad]}>
        <mesh ref={meshRef} material={surface} rotation={[0, 1.2, 0]} name="mercury-surface">
          <sphereGeometry args={[1, seg, seg / 2]} />
        </mesh>
      </group>
    </group>
  )
}
