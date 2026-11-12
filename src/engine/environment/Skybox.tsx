import { useLayoutEffect, useMemo } from 'react'
import { BackSide, MeshBasicMaterial } from 'three'
import { getQuality } from '@/engine/config/quality'
import { useProgressiveTextureSet } from '@/engine/textures/useProgressiveTextureSet'

const SKY_SPECS = { milkyway: { srgb: true } } as const

/**
 * Fondo estelar: panorámica de la Vía Láctea (equirectangular) en una esfera
 * gigante que no recibe luz ni escritura de profundidad. Atenuada para que los
 * planetas sigan siendo el foco visual.
 */
export function Skybox() {
  const quality = getQuality()
  const { textures } = useProgressiveTextureSet('sky', SKY_SPECS, quality.skyRes, quality.anisotropy)

  const material = useMemo(
    () => new MeshBasicMaterial({ side: BackSide, depthWrite: false, toneMapped: false, fog: false }),
    [],
  )
  // Se asigna mapa y brillo aquí (no en render) para poder intercambiar niveles.
  useLayoutEffect(() => {
    material.map = textures.milkyway
    material.color.setScalar(0.42)
    material.needsUpdate = true
  }, [material, textures])

  return (
    <mesh material={material} renderOrder={-10} rotation={[0.45, 2.2, 0.25]} frustumCulled={false} name="skybox">
      <sphereGeometry args={[900, 64, 32]} />
    </mesh>
  )
}
