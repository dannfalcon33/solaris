import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  MeshBasicMaterial,
  RingGeometry,
  type Group,
} from 'three'
import { BODIES, PLANET_ORDER, getBodyPosition } from '@/engine/config/solarSystemLayout'
import { useNavigationStore, type SelectableBodyId } from '@/stores/navigation.store'
import type { DestinationId } from '@/types'

/** Destino principal al hacer clic directamente sobre un planeta en la escena 3D. */
const BODY_TO_PRIMARY_DESTINATION: Readonly<
  Record<Exclude<SelectableBodyId, 'earth'>, DestinationId>
> = {
  mercury: 'mercury-solar-frontier',
  venus: 'venus-cloud-haven',
  mars: 'mars-red-frontier',
  jupiter: 'jupiter-europa-station',
  saturn: 'saturn-titan-station',
}

interface ReticleEntry {
  id: SelectableBodyId
  pos: [number, number, number]
  hitRadius: number
  innerRadius: number
  outerRadius: number
  geometry: RingGeometry
  outerGeometry: RingGeometry
  material: MeshBasicMaterial
  outerMaterial: MeshBasicMaterial
}

function updateReticleMaterials(
  entries: ReticleEntry[],
  hoveredBodyId: SelectableBodyId | null,
  pulse: number,
): void {
  for (const e of entries) {
    const isHovered = e.id === hoveredBodyId
    e.material.opacity = isHovered ? 0.85 : 0.28 + 0.08 * pulse
    e.outerMaterial.opacity = isHovered ? 0.48 + 0.15 * pulse : 0.1
  }
}

/**
 * Selección interactiva 3D de planetas estilo estrategia espacial (FASE 3):
 *  - Retículas tácticas orbitales en el plano de la eclíptica durante la vista
 *    general del sistema solar.
 *  - Esferas de colisión generosas para facilitar el clic incluso en planetas
 *    pequeños como Mercurio o Marte.
 *  - Bloqueo total durante transiciones de cámara (`isTransitioning`).
 */
export function PlanetSelector() {
  const state = useNavigationStore((s) => s.state)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const hoveredBodyId = useNavigationStore((s) => s.hoveredBodyId)
  const selectDestination = useNavigationStore((s) => s.selectDestination)
  const returnToEarth = useNavigationStore((s) => s.returnToEarth)
  const setHoveredBody = useNavigationStore((s) => s.setHoveredBody)

  const interactive = state === 'solar_system' && !isTransitioning

  useEffect(() => {
    document.body.style.cursor = interactive && hoveredBodyId ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [interactive, hoveredBodyId])

  const entries = useMemo<ReticleEntry[]>(() => {
    return PLANET_ORDER.map((id) => {
      const cfg = BODIES[id]
      const p = getBodyPosition(id)
      const baseR = id === 'saturn' ? cfg.visualRadius * 2.45 : cfg.visualRadius * 1.45
      const innerRadius = baseR
      const outerRadius = baseR + 0.22
      const hitRadius = Math.max(baseR * 1.65, 3.3)

      const geometry = new RingGeometry(innerRadius, outerRadius, 64)
      const outerGeometry = new RingGeometry(outerRadius + 0.35, outerRadius + 0.48, 64)

      const color = new Color(id === 'earth' ? '#35ddf2' : '#00e5c3')
      const material = new MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.32,
        side: DoubleSide,
        depthWrite: false,
        blending: AdditiveBlending,
      })

      const outerMaterial = new MeshBasicMaterial({
        color: new Color(cfg.orbitColor),
        transparent: true,
        opacity: 0.12,
        side: DoubleSide,
        depthWrite: false,
        blending: AdditiveBlending,
      })

      return {
        id,
        pos: [p.x, p.y, p.z],
        hitRadius,
        innerRadius,
        outerRadius,
        geometry,
        outerGeometry,
        material,
        outerMaterial,
      }
    })
  }, [])

  useLayoutEffect(
    () => () => {
      for (const e of entries) {
        e.geometry.dispose()
        e.outerGeometry.dispose()
        e.material.dispose()
        e.outerMaterial.dispose()
      }
    },
    [entries],
  )

  const groupRefs = useRef<Record<string, Group | null>>({})
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!interactive) return
    const dt = Math.min(delta, 0.1)
    timeRef.current += dt
    const pulse = Math.sin(timeRef.current * 3.2)
    updateReticleMaterials(entries, hoveredBodyId, pulse)

    for (const e of entries) {
      const g = groupRefs.current[e.id]
      if (!g) continue
      const targetScale = e.id === hoveredBodyId ? 1.16 : 1.0
      const next = g.scale.x + (targetScale - g.scale.x) * (1 - Math.exp(-dt * 10))
      g.scale.setScalar(next)
    }
  })

  const handleOver = (id: SelectableBodyId) => (ev: ThreeEvent<PointerEvent>) => {
    if (!interactive) return
    ev.stopPropagation()
    setHoveredBody(id)
  }

  const handleOut = (id: SelectableBodyId) => (ev: ThreeEvent<PointerEvent>) => {
    if (!interactive) return
    ev.stopPropagation()
    if (useNavigationStore.getState().hoveredBodyId === id) {
      setHoveredBody(null)
    }
  }

  const handleClick = (id: SelectableBodyId) => (ev: ThreeEvent<MouseEvent>) => {
    if (!interactive) return
    ev.stopPropagation()
    if (id === 'earth') {
      returnToEarth()
      return
    }
    selectDestination(BODY_TO_PRIMARY_DESTINATION[id])
  }

  return (
    <group visible={interactive} name="planet-selector">
      {entries.map((e) => (
        <group
          key={e.id}
          ref={(node) => {
            groupRefs.current[e.id] = node
          }}
          position={e.pos}
        >
          {/* Retícula táctica en el plano de la eclíptica */}
          <mesh geometry={e.geometry} material={e.material} rotation={[-Math.PI / 2, 0, 0]} renderOrder={4} />
          <mesh
            geometry={e.outerGeometry}
            material={e.outerMaterial}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={4}
          />
          {/* Esfera invisible de selección por raycast */}
          <mesh
            onPointerOver={handleOver(e.id)}
            onPointerOut={handleOut(e.id)}
            onClick={handleClick(e.id)}
            visible={false}
          >
            <sphereGeometry args={[e.hitRadius, 16, 12]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
