import { Vector3 } from 'three'
import { BODIES, DESTINATION_TO_BODY, getBodyPosition } from '@/engine/config/solarSystemLayout'
import type { CelestialBodyId, DestinationId, NavigationState } from '@/types'

/** Encuadre "hero" de la Tierra según el aspecto de la ventana. */
export interface HeroLayout {
  x: number
  y: number
  /** Radio visual de referencia a distancia HERO_CAMERA_Z = 5. */
  radius: number
}

export const HERO_CAMERA_Z = 5
export const HERO_FOV = 45

/**
 * Escritorio/apaisado: Tierra grande a la derecha, dejando libre el texto del
 * hero. Vertical: Tierra centrada en la mitad superior.
 */
export function heroLayout(aspect: number): HeroLayout {
  const halfH = HERO_CAMERA_Z * Math.tan((HERO_FOV * Math.PI) / 360)
  const halfW = halfH * aspect

  if (aspect >= 1.2) {
    const radius = Math.min(1.75, halfH * 0.82)
    return { x: Math.min(halfW * 0.42, halfW - radius * 1.05), y: -0.12, radius }
  }
  const radius = Math.min(1.55, halfW * 0.88)
  return { x: 0, y: halfH * 0.28, radius }
}

export interface CameraPose {
  position: Vector3
  target: Vector3
}

/**
 * Calcula la posición y punto de mira de la cámara para cada estado.
 * Al girar el encuadre según el ángulo orbital del planeta, el Sol queda
 * siempre en un ángulo lateral-frontal cinematográfico coherente.
 */
export function computeCameraPose(
  state: NavigationState,
  selectedDestinationId: DestinationId | null,
  aspect: number,
): CameraPose {
  if (state === 'solar_system') {
    const dist = aspect < 1 ? 128 : aspect < 1.45 ? 102 : 88
    const height = aspect < 1 ? 54 : 38
    return {
      position: new Vector3(0, height, dist),
      target: new Vector3(0, -3, 0),
    }
  }

  let bodyId: CelestialBodyId = 'earth'
  if (
    (state === 'planet_detail' || state === 'station_detail' || state === 'transitioning') &&
    selectedDestinationId
  ) {
    bodyId = DESTINATION_TO_BODY[selectedDestinationId]
  }

  const body = BODIES[bodyId]
  const center = getBodyPosition(bodyId)

  // En vista de detalle centramos el planeta entre el HUD izquierdo y el panel
  // comercial derecho; en el hero de la Tierra lo desplazamos a la derecha.
  const layout = heroLayout(aspect)
  const isDetail = bodyId !== 'earth'
  const isRingObs = selectedDestinationId === 'saturn-ring-observation'

  const screenX = isDetail ? (aspect >= 1.2 ? -0.16 : 0) : layout.x
  const screenY = isDetail ? (aspect >= 1.2 ? 0.04 : layout.y * 0.55) : layout.y

  // Saturno requiere algo más de distancia para abarcar el sistema de anillos.
  const sizeMultiplier =
    bodyId === 'earth' ? 1.0 : bodyId === 'saturn' ? (isRingObs ? 1.55 : 1.78) : 1.12
  const scale = (body.visualRadius * sizeMultiplier) / layout.radius

  const yaw = -(body.orbitAngle - BODIES.earth.orbitAngle) + (isRingObs ? 0.38 : 0)
  const liftY = isRingObs ? body.visualRadius * 1.15 : isDetail && bodyId === 'saturn' ? body.visualRadius * 0.42 : 0

  const localCam = new Vector3(-screenX * scale, -screenY * scale, HERO_CAMERA_Z * scale)
  const localTarget = new Vector3(-screenX * scale, -screenY * scale, 0)

  localCam.applyAxisAngle(new Vector3(0, 1, 0), yaw)
  localTarget.applyAxisAngle(new Vector3(0, 1, 0), yaw)
  localCam.y += liftY

  return {
    position: center.clone().add(localCam),
    target: center.clone().add(localTarget),
  }
}
