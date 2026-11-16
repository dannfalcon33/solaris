import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { WebGLRenderer } from 'three'
import { useQualityStore } from '@/engine/config/quality'

function applyRendererDpr(gl: WebGLRenderer, dpr: number): void {
  if (Math.abs(gl.getPixelRatio() - dpr) >= 0.02) {
    gl.setPixelRatio(dpr)
  }
}

/**
 * Controlador de rendimiento adaptativo (FASE 6):
 *  - Ajusta dinámicamente el DPR (`Adaptive DPR`) según los FPS reales medidos.
 *  - Degrada automáticamente el nivel de calidad (`ultra -> high -> medium -> low`)
 *    si el dispositivo sigue por debajo de 34 FPS tras haber reducido el DPR.
 *  - Escucha eventos `webglcontextlost` y `webglcontextrestored` del canvas.
 */
export function AdaptivePerformance() {
  const gl = useThree((s) => s.gl)
  const settings = useQualityStore((s) => s.settings)
  const activeDpr = useQualityStore((s) => s.activeDpr)
  const setActiveDpr = useQualityStore((s) => s.setActiveDpr)
  const downgradeTier = useQualityStore((s) => s.downgradeTier)
  const setContextLost = useQualityStore((s) => s.setContextLost)

  const windowRef = useRef({
    frames: 0,
    elapsed: 0,
    lowStreak: 0,
    highStreak: 0,
  })

  useEffect(() => {
    applyRendererDpr(gl, activeDpr)
  }, [gl, activeDpr])

  useEffect(() => {
    const canvas = gl.domElement
    const onLost = (ev: Event) => {
      ev.preventDefault()
      console.warn('[solaris] Contexto WebGL perdido; activando modo de recuperación.')
      setContextLost(true)
    }
    const onRestored = () => {
      console.info('[solaris] Contexto WebGL restaurado.')
      setContextLost(false)
    }
    canvas.addEventListener('webglcontextlost', onLost, false)
    canvas.addEventListener('webglcontextrestored', onRestored, false)
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost, false)
      canvas.removeEventListener('webglcontextrestored', onRestored, false)
    }
  }, [gl, setContextLost])

  useFrame((_, delta) => {
    // Ignorar pausas por cambio de pestaña o carga inicial pesada.
    if (delta > 0.25) return

    const w = windowRef.current
    w.frames++
    w.elapsed += delta

    if (w.elapsed < 1.6) return

    const fps = w.frames / w.elapsed
    w.frames = 0
    w.elapsed = 0

    const maxAllowed = Math.min(window.devicePixelRatio || 1, settings.maxDpr)
    const minAllowed = settings.minDpr

    if (fps < 44) {
      w.highStreak = 0
      if (activeDpr > minAllowed + 0.05) {
        const nextDpr = Math.max(minAllowed, Number((activeDpr - 0.2).toFixed(2)))
        setActiveDpr(nextDpr)
      } else if (fps < 34) {
        w.lowStreak++
        if (w.lowStreak >= 2) {
          w.lowStreak = 0
          downgradeTier()
        }
      }
    } else if (fps >= 57) {
      w.lowStreak = 0
      w.highStreak++
      if (w.highStreak >= 2 && activeDpr < maxAllowed - 0.05) {
        w.highStreak = 0
        const nextDpr = Math.min(maxAllowed, Number((activeDpr + 0.15).toFixed(2)))
        setActiveDpr(nextDpr)
      }
    } else {
      w.lowStreak = 0
      w.highStreak = 0
    }
  })

  return null
}
