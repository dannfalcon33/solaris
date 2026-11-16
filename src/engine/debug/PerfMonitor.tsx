import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useQualityStore } from '@/engine/config/quality'
import { debugStats } from './debugStats'

const GROUP_MAP_COUNT: Record<string, number> = {
  earth: 5,
  venus: 2,
  saturn: 2,
  sky: 1,
  sun: 1,
  mercury: 1,
  mars: 1,
  jupiter: 1,
}

const RES_MB_PER_MAP: Record<string, number> = {
  '2k': 11.2,
  '4k': 44.6,
  '8k': 178.3,
}

function estimateVramMb(): number {
  // Base: todos los grupos mantienen su nivel 2k en caché (14 mapas * 11,2 MB ≈ 156 MB)
  let total = 14 * RES_MB_PER_MAP['2k']!
  for (const [group, res] of Object.entries(debugStats.textureRes)) {
    if (res === '4k' || res === '8k') {
      const maps = GROUP_MAP_COUNT[group] ?? 1
      total += maps * RES_MB_PER_MAP[res]!
    }
  }
  return Math.round(total)
}

/**
 * Overlay de rendimiento y profiling WebGL (solo con `?debug` — FASE 6):
 * FPS, peor frame, draw calls, triángulos, geometrías, texturas, VRAM estimada,
 * Adaptive DPR y tiempos de carga.
 */
export function PerfMonitor() {
  const gl = useThree((s) => s.gl)
  const enabled = new URLSearchParams(window.location.search).has('debug')

  const countersRef = useRef({ frames: 0, last: 0, worst: 0 })

  useFrame((_, delta) => {
    if (!enabled) return
    countersRef.current.frames++
    countersRef.current.worst = Math.max(countersRef.current.worst, delta * 1000)
  })

  useEffect(() => {
    if (!enabled) return
    countersRef.current.last = performance.now()
    const el = document.createElement('pre')
    el.setAttribute('data-solaris-debug', '')
    Object.assign(el.style, {
      position: 'fixed',
      right: '8px',
      top: '84px',
      zIndex: '60',
      margin: '0',
      padding: '8px 10px',
      font: '11px/1.45 ui-monospace, Consolas, monospace',
      color: '#00E5C3',
      background: 'rgba(2,6,9,.88)',
      border: '1px solid rgba(0,229,195,.28)',
      pointerEvents: 'none',
      whiteSpace: 'pre',
    })
    document.body.appendChild(el)

    const id = window.setInterval(() => {
      const c = countersRef.current
      const now = performance.now()
      const secs = (now - c.last) / 1000
      const fps = c.frames / secs
      const { render, memory } = gl.info
      const q = useQualityStore.getState().settings
      const texSummary = Object.entries(debugStats.textureRes)
        .map(([k, v]) => `${k}:${v}`)
        .join(' ')
      const vramMb = estimateVramMb()
      el.textContent = [
        `FPS        ${fps.toFixed(1)}  (peor frame ${c.worst.toFixed(1)} ms)`,
        `Draw calls ${render.calls}  |  Triángulos ${render.triangles.toLocaleString('es-ES')}`,
        `GPU mem    Geo: ${memory.geometries}  Tex: ${memory.textures}  (~${vramMb} MB VRAM est.)`,
        `Adapt DPR  ${gl.getPixelRatio().toFixed(2)} [${q.minDpr}..${q.maxDpr}] (${gl.domElement.width}x${gl.domElement.height})`,
        `Calidad    ${q.tier} (obj. ${q.textureRes}, LOD0=${q.sphereSegments} / LOD1=${q.distantSphereSegments})`,
        `Niveles    ${texSummary}`,
      ].join('\n')
      c.frames = 0
      c.worst = 0
      c.last = now
    }, 500)

    return () => {
      window.clearInterval(id)
      el.remove()
    }
  }, [enabled, gl])

  return null
}
