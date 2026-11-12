import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { heroLayout } from '@/engine/camera/heroLayout'
import { getQuality } from '@/engine/config/quality'
import {
  ATMOSPHERE_RADIUS,
  EARTH_RADIUS,
  createAtmosphereMaterial,
  createCloudMaterial,
  setCloudTexture,
} from '@/engine/materials/cloudsAndAtmosphere'
import { createEarthSurfaceMaterial, setEarthSurfaceTextures } from '@/engine/materials/earthSurface'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'

const EARTH_SPECS = {
  day: { srgb: true },
  night: { srgb: true },
  clouds: { srgb: true },
  normal: { srgb: false },
  specular: { srgb: false },
} as const

/** Inclinación axial real (23,44°). */
const AXIAL_TILT = (23.44 * Math.PI) / 180
/** Rotación de la superficie (rad/s). Muy lenta: la escena es contemplativa. */
const SURFACE_SPIN = 0.010
/** Las nubes giran ligeramente más rápido que la superficie. */
const CLOUD_SPIN = 0.0128
/** Longitud (°E) que mira a cámara al inicio: Atlántico, entre América y África/Europa. */
const START_LONGITUDE_DEG = -30
const CLOUD_RADIUS = EARTH_RADIUS + 0.0065

/**
 * Tierra fotorrealista: superficie (albedo, relieve, océanos, luces nocturnas,
 * sombras de nubes), capa de nubes independiente y atmósfera.
 * Las texturas cargan progresivamente (2k → resolución objetivo de calidad).
 */
export function Earth() {
  const quality = getQuality()
  const { textures } = useProgressiveTextureSet('earth', EARTH_SPECS, quality.textureRes, quality.anisotropy)

  const aspect = useThree((s) => s.size.width / s.size.height)
  const layout = heroLayout(aspect)

  const surface = useMemo(() => createEarthSurfaceMaterial(quality.cloudShadows), [quality.cloudShadows])
  const clouds = useMemo(() => createCloudMaterial(), [])
  const atmosphere = useMemo(() => createAtmosphereMaterial(), [])

  useLayoutEffect(() => {
    setEarthSurfaceTextures(surface, textures)
    setCloudTexture(clouds, textures.clouds)
  }, [surface, clouds, textures])

  useLayoutEffect(
    () => () => {
      surface.dispose()
      clouds.dispose()
      atmosphere.dispose()
    },
    [surface, clouds, atmosphere],
  )

  const surfaceRef = useRef<Mesh>(null)
  const cloudsRef = useRef<Mesh>(null)
  const rigRef = useRef<Group>(null)

  useFrame((_, delta) => {
    // `delta` acotado: evita saltos tras pestañas en segundo plano.
    const dt = Math.min(delta, 0.1)
    if (surfaceRef.current) surfaceRef.current.rotation.y += dt * SURFACE_SPIN
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * CLOUD_SPIN
  })

  const startRotation = -Math.PI / 2 - (START_LONGITUDE_DEG * Math.PI) / 180
  const seg = quality.sphereSegments

  return (
    <group ref={rigRef} position={[layout.x, layout.y, 0]} scale={layout.radius}>
      <group rotation={[0, 0, AXIAL_TILT]}>
        <mesh ref={surfaceRef} material={surface} rotation={[0, startRotation, 0]} name="earth-surface">
          <sphereGeometry args={[EARTH_RADIUS, seg, seg / 2]} />
        </mesh>
        <mesh ref={cloudsRef} material={clouds} rotation={[0, startRotation, 0]} name="earth-clouds" renderOrder={1}>
          <sphereGeometry args={[CLOUD_RADIUS, seg, seg / 2]} />
        </mesh>
      </group>
      <mesh material={atmosphere} name="earth-atmosphere" renderOrder={2}>
        <sphereGeometry args={[ATMOSPHERE_RADIUS, 96, 48]} />
      </mesh>
    </group>
  )
}

