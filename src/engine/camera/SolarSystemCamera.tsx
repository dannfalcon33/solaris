import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { computeCameraPose } from './heroLayout'
import { useNavigationStore } from '@/stores/navigation.store'

/**
 * Posiciona y orienta la cámara según el estado actual de navegación y el
 * aspecto de pantalla. En la FASE 3 este controlador se ampliará con los
 * timelines cinematográficos GSAP.
 */
export function SolarSystemCamera() {
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.size.width / s.size.height)
  const state = useNavigationStore((s) => s.state)
  const selectedDestinationId = useNavigationStore((s) => s.selectedDestinationId)

  useLayoutEffect(() => {
    const pose = computeCameraPose(state, selectedDestinationId, aspect)
    camera.position.copy(pose.position)
    camera.lookAt(pose.target)
    camera.updateProjectionMatrix()
  }, [camera, state, selectedDestinationId, aspect])

  return null
}
