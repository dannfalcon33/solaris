import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useNavigationStore } from '@/stores/navigation.store'

/** Notifica al store que el canvas está listo (sale de la pantalla de carga). */
export function SceneReadyNotifier() {
  const invalidate = useThree((s) => s.invalidate)
  const markSceneReady = useNavigationStore((s) => s.markSceneReady)

  useEffect(() => {
    // Un frame de margen para que el primer render llegue a pantalla.
    const id = requestAnimationFrame(() => {
      invalidate()
      markSceneReady()
    })
    return () => cancelAnimationFrame(id)
  }, [invalidate, markSceneReady])

  return null
}

