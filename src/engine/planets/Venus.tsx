import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { getQuality } from '@/engine/config/quality'
import { BODIES, getBodyPosition, getSunDirectionForBody } from '@/engine/config/solarSystemLayout'
import { ATMOSPHERE_RADIUS, createAtmosphereMaterial } from '@/engine/materials/cloudsAndAtmosphere'
import { advanceVenusClouds, createVenusMaterial, setVenusTextures } from '@/engine/materials/venusMaterial'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'
import { useIsBodyFocused } from '@/hooks/useIsBodyFocused'

const VENUS_SPECS = {
  surface: { srgb: true },
  atmosphere: { srgb: true },
} as const

const body = BODIES.venus
const pos = getBodyPosition('venus')
const sunDir = getSunDirectionForBody('venus')

/**
 * Venus: atmósfera densa de ácido sulfúrico en super-rotación sobre la
 * superficie volcánica, con halo atmosférico cálido dorado-ámbar.
 */
export function Venus() {
  const quality = getQuality()
  const focused = useIsBodyFocused('venus')
  const { textures } = useProgressiveTextureSet(
    'venus',
    VENUS_SPECS,
    quality.textureRes,
    quality.anisotropy,
    focused,
  )

  const surface = useMemo(() => createVenusMaterial(sunDir), [])
  const atmosphere = useMemo(
    () =>
      createAtmosphereMaterial({
        sunDir,
        dayColor: '#e8b86b',
        terminatorColor: '#d95f18',
        innerColor: '#fae2ad',
        intensity: 1.5,
        scaleHeight: 0.03,
        atmoRadius: 1.08,
      }),
    [],
  )

  useLayoutEffect(() => {
    setVenusTextures(surface, textures.surface, textures.atmosphere)
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
    const dt = Math.min(delta, 0.1)
    if (meshRef.current) meshRef.current.rotation.y += dt * body.rotationSpeed
    advanceVenusClouds(surface, dt)
  })

  const seg = quality.sphereSegments

  return (
    <group position={[pos.x, pos.y, pos.z]} scale={body.visualRadius} name="planet-venus">
      <group rotation={[0, 0, 0.05]}>
        <mesh ref={meshRef} material={surface} rotation={[0, 0.8, 0]} name="venus-body">
          <sphereGeometry args={[1, seg, seg / 2]} />
        </mesh>
      </group>
      <mesh material={atmosphere} renderOrder={2} name="venus-atmosphere">
        <sphereGeometry args={[ATMOSPHERE_RADIUS + 0.01, 96, 48]} />
      </mesh>
    </group>
  )
}
