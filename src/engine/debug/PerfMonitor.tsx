import { useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { getQuality } from '@/engine/config/quality'
import { debugStats } from './debugStats'

/**
 * Overlay de rendimiento (solo con `?debug`): FPS, tiempo de frame y
 * `renderer.info`. Se dibuja con DOM puro para no añadir carga a React/R3F.
 */
export function PerfMonitor() {
  const gl = useThree((s) => s.gl)
  const enabled = new URLSearchParams(window.location.search).has('debug')

  const [counters] = useState(() => ({ frames: 0, last: performance.now(), worst: 0 }))

  useFrame((_, delta) => {
    if (!enabled) return
    counters.frames++
    counters.worst = Math.max(counters.worst, delta * 1000)
  })

  useEffect(() => {
    if (!enabled) return
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
      background: 'rgba(2,6,9,.85)',
      border: '1px solid rgba(0,229,195,.25)',
      pointerEvents: 'none',
      whiteSpace: 'pre',
    })
    document.body.appendChild(el)

    const q = getQuality()
    const id = window.setInterval(() => {
      const now = performance.now()
      const secs = (now - counters.last) / 1000
      const fps = counters.frames / secs
      const { render, memory } = gl.info
      el.textContent = [
        `FPS        ${fps.toFixed(1)}  (peor frame ${counters.worst.toFixed(1)} ms)`,
        `Draw calls ${render.calls}`,
        `Triángulos ${render.triangles.toLocaleString('es-ES')}`,
        `Geometrías ${memory.geometries}`,
        `Texturas   ${memory.textures}`,
        `DPR        ${gl.getPixelRatio().toFixed(2)}  (${gl.domElement.width}x${gl.domElement.height})`,
        `Calidad    ${q.tier}  (objetivo ${q.textureRes})`,
        `Earth tex  ${debugStats.textureRes.earth ?? '—'}  ${JSON.stringify(debugStats.textureLoadMs)}`,
        `Sky tex    ${debugStats.textureRes.sky ?? '—'}`,
      ].join('\n')
      counters.frames = 0
      counters.worst = 0
      counters.last = now
    }, 500)

    return () => {
      window.clearInterval(id)
      el.remove()
    }
    // `counters` es mutable por diseño y estable durante el montaje.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, gl, counters])

  return null
}
