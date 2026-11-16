import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { BODIES, getBodyPosition } from '@/engine/config/solarSystemLayout'
import {
  SUN_CORONA_RADIUS,
  advanceSunTime,
  createSunCoronaMaterial,
  createSunSurfaceMaterial,
  setSunTexture,
} from '@/engine/materials/sunMaterial'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'
import { useBodyLod } from '@/hooks/useIsBodyFocused'
import { getMotionScale } from '@/hooks/usePrefersReducedMotion'

const SUN_SPECS = { albedo: { srgb: true } } as const
const body = BODIES.sun
const pos = getBodyPosition('sun')

/**
 * El Sol: fotosfera emisiva con convección animada y corona volumétrica.
 */
export function Sun() {
  const { quality, focused, segments, atmoSegments } = useBodyLod('sun')
  const targetRes = quality.textureRes === '8k' ? '4k' : quality.textureRes
  const { textures } = useProgressiveTextureSet('sun', SUN_SPECS, targetRes, quality.anisotropy, focused)

  const surface = useMemo(() => createSunSurfaceMaterial(), [])
  const corona = useMemo(() => createSunCoronaMaterial(), [])

  useLayoutEffect(() => {
    setSunTexture(surface, textures.albedo)
  }, [surface, textures])

  useLayoutEffect(
    () => () => {
      surface.dispose()
      corona.dispose()
    },
    [surface, corona],
  )

  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1) * getMotionScale()
    if (meshRef.current) meshRef.current.rotation.y += dt * body.rotationSpeed
    advanceSunTime(surface, corona, dt)
  })

  const seg = Math.min(segments, 128)

  return (
    <group position={[pos.x, pos.y, pos.z]} scale={body.visualRadius} name="celestial-sun">
      <mesh ref={meshRef} material={surface} rotation={[0, 0, body.axialTiltRad]} name="sun-photosphere">
        <sphereGeometry args={[1, seg, seg / 2]} />
      </mesh>
      <mesh material={corona} renderOrder={2} name="sun-corona">
        <sphereGeometry args={[SUN_CORONA_RADIUS, atmoSegments, atmoSegments / 2]} />
      </mesh>
    </group>
  )
}
