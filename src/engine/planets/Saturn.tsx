import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Euler, RingGeometry, Vector3, type Mesh } from 'three'
import { BODIES, getBodyPosition, getSunDirectionForBody } from '@/engine/config/solarSystemLayout'
import { createAtmosphereMaterial } from '@/engine/materials/cloudsAndAtmosphere'
import {
  SATURN_RING_INNER,
  SATURN_RING_OUTER,
  createGasGiantMaterial,
  createSaturnRingMaterial,
  setGasGiantTextures,
} from '@/engine/materials/gasGiant'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'
import { useBodyLod } from '@/hooks/useIsBodyFocused'
import { getMotionScale } from '@/hooks/usePrefersReducedMotion'

const SATURN_SPECS = {
  albedo: { srgb: true },
  rings: { srgb: true },
} as const

const body = BODIES.saturn
const pos = getBodyPosition('saturn')
const sunDir = getSunDirectionForBody('saturn')

const tiltEuler = new Euler(0.22, 0, body.axialTiltRad)
const ringNormal = new Vector3(0, 1, 0).applyEuler(tiltEuler).normalize()

function createRadialRingGeometry(inner: number, outer: number, thetaSegments: number): RingGeometry {
  const geo = new RingGeometry(inner, outer, thetaSegments, 1)
  const posAttr = geo.attributes.position!
  const uvAttr = geo.attributes.uv!
  const v = new Vector3()
  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i)
    const r = v.length()
    const u = (r - inner) / (outer - inner)
    uvAttr.setXY(i, u, 0.5)
  }
  uvAttr.needsUpdate = true
  return geo
}

/**
 * Saturno: bandas atmosféricas doradas, sombra de anillos, geometría
 * independiente de anillos y LOD por distancia.
 */
export function Saturn() {
  const { quality, focused, segments: seg, atmoSegments } = useBodyLod('saturn')
  const { textures } = useProgressiveTextureSet(
    'saturn',
    SATURN_SPECS,
    quality.textureRes,
    quality.anisotropy,
    focused,
  )

  const surface = useMemo(
    () =>
      createGasGiantMaterial({
        sunDir,
        hazeColor: '#e5cc96',
        bumpScale: 1.4,
        hasRings: true,
        ringNormal,
      }),
    [],
  )

  const ringMaterial = useMemo(
    () => createSaturnRingMaterial(sunDir, body.visualRadius),
    [],
  )

  const ringSegments = focused ? Math.max(128, seg) : 64
  const ringGeometry = useMemo(
    () => createRadialRingGeometry(SATURN_RING_INNER, SATURN_RING_OUTER, ringSegments),
    [ringSegments],
  )

  const atmosphere = useMemo(
    () =>
      createAtmosphereMaterial({
        sunDir,
        dayColor: '#e5cc96',
        terminatorColor: '#ad723b',
        innerColor: '#f7e9c6',
        intensity: 0.72,
        scaleHeight: 0.019,
        atmoRadius: 1.05,
      }),
    [],
  )

  useLayoutEffect(() => {
    setGasGiantTextures(surface, textures.albedo, textures.rings, ringMaterial)
  }, [surface, ringMaterial, textures])

  useLayoutEffect(
    () => () => {
      surface.dispose()
      ringMaterial.dispose()
      ringGeometry.dispose()
      atmosphere.dispose()
    },
    [surface, ringMaterial, ringGeometry, atmosphere],
  )

  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1) * getMotionScale()
    if (meshRef.current) meshRef.current.rotation.y += dt * body.rotationSpeed
  })

  return (
    <group position={[pos.x, pos.y, pos.z]} scale={body.visualRadius} name="planet-saturn">
      <group rotation={[tiltEuler.x, tiltEuler.y, tiltEuler.z]}>
        <mesh ref={meshRef} material={surface} name="saturn-surface">
          <sphereGeometry args={[1, seg, seg / 2]} />
        </mesh>
        <mesh
          geometry={ringGeometry}
          material={ringMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={3}
          name="saturn-rings"
        />
      </group>
      <mesh material={atmosphere} renderOrder={2} name="saturn-atmosphere">
        <sphereGeometry args={[1.05, atmoSegments, atmoSegments / 2]} />
      </mesh>
    </group>
  )
}
