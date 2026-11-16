import { useLayoutEffect, useMemo } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineLoop,
} from 'three'
import { BODIES, PLANET_ORDER } from '@/engine/config/solarSystemLayout'
import { useNavigationStore } from '@/stores/navigation.store'

const SEGMENTS = 256

interface OrbitRingEntry {
  id: string
  line: LineLoop
  geometry: BufferGeometry
  material: LineBasicMaterial
}

/**
 * Órbitas visuales en el plano de la eclíptica. Cada órbita modula su
 * intensidad angularmente con un realce suave cerca de la posición actual del
 * planeta, evitando saturar la escena con líneas neón uniformes.
 * Se muestran en la vista general del sistema solar.
 */
export function OrbitLines() {
  const show = useNavigationStore((s) => s.state === 'solar_system')

  const rings = useMemo<OrbitRingEntry[]>(() => {
    return PLANET_ORDER.map((id) => {
      const cfg = BODIES[id]
      const positions = new Float32Array(SEGMENTS * 3)
      const colors = new Float32Array(SEGMENTS * 3)
      const baseColor = new Color(cfg.orbitColor)

      for (let i = 0; i < SEGMENTS; i++) {
        const theta = (i / SEGMENTS) * Math.PI * 2
        positions[i * 3] = Math.cos(theta) * cfg.orbitRadius
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = Math.sin(theta) * cfg.orbitRadius

        // Mayor intensidad cerca de la posición orbital del planeta.
        const delta = Math.atan2(
          Math.sin(theta - cfg.orbitAngle),
          Math.cos(theta - cfg.orbitAngle),
        )
        const highlight = Math.exp(-(delta * delta) / 0.45)
        const intensity = 0.14 + 0.52 * highlight

        colors[i * 3] = baseColor.r * intensity
        colors[i * 3 + 1] = baseColor.g * intensity
        colors[i * 3 + 2] = baseColor.b * intensity
      }

      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(positions, 3))
      geometry.setAttribute('color', new BufferAttribute(colors, 3))

      const material = new LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: AdditiveBlending,
        depthWrite: false,
      })

      const line = new LineLoop(geometry, material)
      line.name = `orbit-${id}`
      return { id, line, geometry, material }
    })
  }, [])

  useLayoutEffect(
    () => () => {
      for (const r of rings) {
        r.geometry.dispose()
        r.material.dispose()
      }
    },
    [rings],
  )

  return (
    <group visible={show} name="solar-system-orbits">
      {rings.map((r) => (
        <primitive key={r.id} object={r.line} />
      ))}
    </group>
  )
}
