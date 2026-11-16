import { Vector3 } from 'three'
import { BODIES, DESTINATION_TO_BODY, getBodyPosition } from '@/engine/config/solarSystemLayout'
import type { TransitionGoal } from '@/stores/navigation.store'
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

export interface DestinationWaypoint {
  /** Factor de distancia orbital relativo al radio del planeta. */
  sizeMultiplier: number
  /** Desplazamiento angular horizontal respecto al terminador solar (rad). */
  yawOffset: number
  /** Elevación vertical de la cámara en múltiplos del radio del planeta. */
  liftRatio: number
  /** Desplazamiento horizontal en encuadre de escritorio. */
  screenXDesktop: number
  /** Desplazamiento vertical en encuadre de escritorio. */
  screenYDesktop: number
}

/**
 * Puntos de cámara definidos por destino (FASE 3). Cada destino tiene su
 * propia composición orbital para enfatizar sus rasgos visuales.
 */
export const DESTINATION_WAYPOINTS: Readonly<Record<DestinationId, DestinationWaypoint>> = {
  'mercury-solar-frontier': {
    sizeMultiplier: 1.06,
    yawOffset: -0.14,
    liftRatio: 0.14,
    screenXDesktop: -0.15,
    screenYDesktop: 0.04,
  },
  'venus-cloud-haven': {
    sizeMultiplier: 1.08,
    yawOffset: 0.16,
    liftRatio: 0.22,
    screenXDesktop: -0.16,
    screenYDesktop: 0.04,
  },
  'mars-red-frontier': {
    sizeMultiplier: 1.06,
    yawOffset: -0.1,
    liftRatio: 0.18,
    screenXDesktop: -0.15,
    screenYDesktop: 0.04,
  },
  'jupiter-europa-station': {
    sizeMultiplier: 1.12,
    yawOffset: 0.18,
    liftRatio: 0.2,
    screenXDesktop: -0.16,
    screenYDesktop: 0.05,
  },
  'saturn-titan-station': {
    sizeMultiplier: 1.78,
    yawOffset: -0.08,
    liftRatio: 0.44,
    screenXDesktop: -0.16,
    screenYDesktop: 0.05,
  },
  'saturn-ring-observation': {
    sizeMultiplier: 1.44,
    yawOffset: 0.42,
    liftRatio: 1.18,
    screenXDesktop: -0.14,
    screenYDesktop: 0.02,
  },
}

export interface CameraPose {
  position: Vector3
  target: Vector3
}

/**
 * Calcula la posición y punto de mira objetivo de la cámara para cada estado y
 * objetivo de transición.
 */
export function computeCameraPose(
  state: NavigationState,
  transitionGoal: TransitionGoal,
  selectedDestinationId: DestinationId | null,
  aspect: number,
): CameraPose {
  const effectiveMode =
    state === 'transitioning'
      ? transitionGoal
      : state === 'solar_system'
        ? 'solar_system'
        : state === 'planet_detail' || state === 'station_detail'
          ? 'destination'
          : 'earth_hero'

  if (effectiveMode === 'solar_system') {
    const dist = aspect < 1 ? 128 : aspect < 1.45 ? 102 : 88
    const height = aspect < 1 ? 54 : 38
    return {
      position: new Vector3(0, height, dist),
      target: new Vector3(0, -3, 0),
    }
  }

  let bodyId: CelestialBodyId = 'earth'
  let waypoint: DestinationWaypoint | null = null
  if (effectiveMode === 'destination' && selectedDestinationId) {
    bodyId = DESTINATION_TO_BODY[selectedDestinationId]
    waypoint = DESTINATION_WAYPOINTS[selectedDestinationId]
  }

  const body = BODIES[bodyId]
  const center = getBodyPosition(bodyId)
  const layout = heroLayout(aspect)

  const screenX = waypoint ? (aspect >= 1.2 ? waypoint.screenXDesktop : 0) : layout.x
  const screenY = waypoint ? (aspect >= 1.2 ? waypoint.screenYDesktop : layout.y * 0.55) : layout.y

  const sizeMultiplier = waypoint ? waypoint.sizeMultiplier : 1.0
  const scale = (body.visualRadius * sizeMultiplier) / layout.radius

  const yaw = -(body.orbitAngle - BODIES.earth.orbitAngle) + (waypoint ? waypoint.yawOffset : 0)
  const liftY = waypoint ? body.visualRadius * waypoint.liftRatio : 0

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
