import { useEffect } from 'react'
import { useNavigationStore } from '@/stores/navigation.store'

const PLACEHOLDER_TRANSITION_MS = 900

/**
 * PLACEHOLDER TEMPORAL (FASE 0): completa la transición con un temporizador.
 * La FASE 3 lo reemplaza por timelines GSAP que llaman a `completeTransition`.
 */
export function usePlaceholderTransition() {
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const completeTransition = useNavigationStore((s) => s.completeTransition)

  useEffect(() => {
    if (!isTransitioning) return
    const id = window.setTimeout(completeTransition, PLACEHOLDER_TRANSITION_MS)
    return () => window.clearTimeout(id)
  }, [isTransitioning, completeTransition])
}

