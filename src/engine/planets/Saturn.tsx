import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Euler, RingGeometry, Vector3, type Mesh } from 'three'
import { getQuality } from '@/engine/config/quality'
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
import { useIsBodyFocused } from '@/hooks/useIsBodyFocused'

const SATURN_SPECS = {
  albedo: { srgb: true },
  rings: { srgb: true },
} as const

const body = BODIES.saturn
const pos = getBodyPosition('saturn')
const sunDir = getSunDirectionForBody('saturn')

// Inclinación del sistema ecuatorial y de anillos de Saturno en espacio mundo.
const tiltEuler = new Euler(0.22, 0, body.axialTiltRad)
const ringNormal = new Vector3(0, 1, 0).applyEuler(tiltEuler).normalize()

/**
 * Crea un RingGeometry con coordenadas UV radiales:
 * `u = (r - inner) / (outer - inner)` de 0 (borde interior) a 1 (borde exterior).
 */
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
 * Saturno: bandas atmosféricas doradas, sombra proyectada de los anillos sobre
 * el globo, y sistema de anillos independiente con textura alpha, división de
 * Cassini y sombra del planeta sobre los anillos.
 */
export function Saturn() {
  const quality = getQuality()
  const focused = useIsBodyFocused('saturn')
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

  const ringGeometry = useMemo(
    () => createRadialRingGeometry(SATURN_RING_INNER, SATURN_RING_OUTER, Math.max(128, quality.sphereSegments)),
    [quality.sphereSegments],
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
    const dt = Math.min(delta, 0.1)
    if (meshRef.current) meshRef.current.rotation.y += dt * body.rotationSpeed
  })

  const seg = quality.sphereSegments

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
        <sphereGeometry args={[1.05, 96, 48]} />
      </mesh>
    </group>
  )
}
