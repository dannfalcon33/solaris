import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { getQuality } from '@/engine/config/quality'
import { BODIES, getBodyPosition } from '@/engine/config/solarSystemLayout'
import {
  SUN_CORONA_RADIUS,
  advanceSunTime,
  createSunCoronaMaterial,
  createSunSurfaceMaterial,
  setSunTexture,
} from '@/engine/materials/sunMaterial'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'
import { useIsBodyFocused } from '@/hooks/useIsBodyFocused'

const SUN_SPECS = { albedo: { srgb: true } } as const
const body = BODIES.sun
const pos = getBodyPosition('sun')

/**
 * El Sol: fotosfera emisiva con convección animada y corona volumétrica.
 */
export function Sun() {
  const quality = getQuality()
  const focused = useIsBodyFocused('sun')
  // La fuente original del Sol es 4096x2048; limitamos a 4k cuando está enfocado.
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
    const dt = Math.min(delta, 0.1)
    if (meshRef.current) meshRef.current.rotation.y += dt * body.rotationSpeed
    advanceSunTime(surface, corona, dt)
  })

  const seg = Math.min(quality.sphereSegments, 128)

  return (
    <group position={[pos.x, pos.y, pos.z]} scale={body.visualRadius} name="celestial-sun">
      <mesh ref={meshRef} material={surface} rotation={[0, 0, body.axialTiltRad]} name="sun-photosphere">
        <sphereGeometry args={[1, seg, seg / 2]} />
      </mesh>
      <mesh material={corona} renderOrder={2} name="sun-corona">
        <sphereGeometry args={[SUN_CORONA_RADIUS, 96, 48]} />
      </mesh>
    </group>
  )
}
