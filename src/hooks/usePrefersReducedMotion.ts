import { useEffect, useState } from 'react'

export function prefersReducedMotionNow(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Escala de velocidad de animación rotacional/orbital respetando
 * `prefers-reduced-motion: reduce` (FASE 6).
 */
export function getMotionScale(): number {
  return prefersReducedMotionNow() ? 0.12 : 1.0
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotionNow)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
