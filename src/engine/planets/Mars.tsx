import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { BODIES, getBodyPosition, getSunDirectionForBody } from '@/engine/config/solarSystemLayout'
import { createAtmosphereMaterial } from '@/engine/materials/cloudsAndAtmosphere'
import { createRockyPlanetMaterial, setRockyPlanetTexture } from '@/engine/materials/rockyPlanet'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'
import { useBodyLod } from '@/hooks/useIsBodyFocused'
import { getMotionScale } from '@/hooks/usePrefersReducedMotion'

const MARS_SPECS = { albedo: { srgb: true } } as const
const body = BODIES.mars
const pos = getBodyPosition('mars')
const sunDir = getSunDirectionForBody('mars')

/**
 * Marte: albedo rojizo con relieve de cañones (Valles Marineris), casquetes
 * polares, LOD por distancia y atmósfera tenue de polvo en suspensión.
 */
export function Mars() {
  const { quality, focused, segments: seg, atmoSegments } = useBodyLod('mars')
  const { textures } = useProgressiveTextureSet(
    'mars',
    MARS_SPECS,
    quality.textureRes,
    quality.anisotropy,
    focused,
  )

  const surface = useMemo(
    () =>
      createRockyPlanetMaterial({
        sunDir,
        sunColor: '#fff2e2',
        hazeColor: '#d97642',
        bumpScale: 3.6,
        regolithMix: 0.25,
        hazeStrength: 0.65,
        polarIce: 1.0,
        exposure: 1.26,
      }),
    [],
  )

  const atmosphere = useMemo(
    () =>
      createAtmosphereMaterial({
        sunDir,
        dayColor: '#d97848',
        terminatorColor: '#9e3414',
        innerColor: '#f2af80',
        intensity: 0.82,
        scaleHeight: 0.016,
        atmoRadius: 1.055,
      }),
    [],
  )

  useLayoutEffect(() => {
    setRockyPlanetTexture(surface, textures.albedo)
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
    <group position={[pos.x, pos.y, pos.z]} scale={body.visualRadius} name="planet-mars">
      <group rotation={[0, 0, body.axialTiltRad]}>
        <mesh ref={meshRef} material={surface} rotation={[0, -0.9, 0]} name="mars-surface">
          <sphereGeometry args={[1, seg, seg / 2]} />
        </mesh>
      </group>
      <mesh material={atmosphere} renderOrder={2} name="mars-atmosphere">
        <sphereGeometry args={[1.055, atmoSegments, atmoSegments / 2]} />
      </mesh>
    </group>
  )
}
