import { useEffect, useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { Vector3, type Camera } from 'three'
import { computeCameraPose } from './heroLayout'
import { useNavigationStore } from '@/stores/navigation.store'

const UP = new Vector3(0, 1, 0)
const MIN_SUN_CLEARANCE = 12.5

function applyCameraPose(camera: Camera, position: Vector3, target: Vector3): void {
  camera.up.copy(UP)
  camera.position.copy(position)
  camera.lookAt(target)
}

/**
 * Calcula un desplazamiento lateral en el plano XZ para que la trayectoria
 * entre dos puntos nunca atraviese el Sol ni su corona en el origen (0,0,0).
 */
function computeSolarAvoidance(start: Vector3, end: Vector3): Vector3 {
  const dx = end.x - start.x
  const dz = end.z - start.z
  const lenSq = dx * dx + dz * dz
  if (lenSq < 1e-3) return new Vector3()

  const t = Math.max(0, Math.min(1, -(start.x * dx + start.z * dz) / lenSq))
  if (t <= 0.05 || t >= 0.95) return new Vector3()

  const closestX = start.x + dx * t
  const closestZ = start.z + dz * t
  const dist = Math.hypot(closestX, closestZ)
  if (dist >= MIN_SUN_CLEARANCE) return new Vector3()

  // Vector perpendicular en XZ orientado hacia afuera respecto al origen.
  let perpX = -dz
  let perpZ = dx
  const perpLen = Math.hypot(perpX, perpZ) || 1
  perpX /= perpLen
  perpZ /= perpLen

  if (perpX * closestX + perpZ * closestZ < 0) {
    perpX = -perpX
    perpZ = -perpZ
  }

  const push = (MIN_SUN_CLEARANCE - dist) * 1.35
  return new Vector3(perpX * push, 0, perpZ * push)
}

/**
 * Sistema de cámara cinematográfica (FASE 3):
 *  - Interpola posición y punto de mira mediante GSAP Timelines con trayectorias
 *    curvas suaves y evasión solar.
 *  - Cancela de forma segura cualquier timeline previo antes de iniciar otro.
 *  - En vista orbital estabilizada añade una micro-deriva amortiguada sin
 *    provocar vértigo ni saltos al iniciar el siguiente desplazamiento.
 */
export function SolarSystemCamera() {
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.size.width / s.size.height)

  const state = useNavigationStore((s) => s.state)
  const transitionGoal = useNavigationStore((s) => s.transitionGoal)
  const selectedDestinationId = useNavigationStore((s) => s.selectedDestinationId)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const completeTransition = useNavigationStore((s) => s.completeTransition)

  const initializedRef = useRef(false)
  const currentPosRef = useRef(new Vector3())
  const currentTargetRef = useRef(new Vector3())
  const restPoseRef = useRef({ position: new Vector3(), target: new Vector3() })
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const parallaxRef = useRef({ x: 0, y: 0 })

  // Inicialización en el primer render y actualización de pose base ante resize.
  useLayoutEffect(() => {
    const pose = computeCameraPose(state, transitionGoal, selectedDestinationId, aspect)
    restPoseRef.current.position.copy(pose.position)
    restPoseRef.current.target.copy(pose.target)

    if (!initializedRef.current) {
      initializedRef.current = true
      currentPosRef.current.copy(pose.position)
      currentTargetRef.current.copy(pose.target)
      applyCameraPose(camera, pose.position, pose.target)
    }
  }, [camera, state, transitionGoal, selectedDestinationId, aspect])

  // Ejecución del timeline GSAP cuando se activa una transición.
  useEffect(() => {
    if (!isTransitioning) return

    timelineRef.current?.kill()
    timelineRef.current = null

    const endPose = computeCameraPose(
      'transitioning',
      transitionGoal,
      selectedDestinationId,
      aspect,
    )
    restPoseRef.current.position.copy(endPose.position)
    restPoseRef.current.target.copy(endPose.target)

    const startPos = currentPosRef.current.clone()
    const startTarget = currentTargetRef.current.clone()
    const distance = startPos.distanceTo(endPose.position)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const arcLift = reducedMotion
      ? 0
      : transitionGoal === 'solar_system'
        ? Math.min(distance * 0.08, 7)
        : Math.min(Math.max(distance * 0.14, 0.9), 13)

    const sideOffset = reducedMotion ? new Vector3() : computeSolarAvoidance(startPos, endPose.position)

    const baseDuration =
      transitionGoal === 'solar_system'
        ? 2.15
        : Math.min(2.55, Math.max(1.65, 1.45 + distance * 0.012))
    const duration = reducedMotion ? 0.45 : baseDuration

    const proxy = { u: 0, look: 0 }
    const tl = gsap.timeline({
      onUpdate: () => {
        const arc = Math.sin(proxy.u * Math.PI)
        currentPosRef.current.lerpVectors(startPos, endPose.position, proxy.u)
        currentPosRef.current.y += arc * arcLift
        currentPosRef.current.addScaledVector(sideOffset, arc)

        currentTargetRef.current.lerpVectors(startTarget, endPose.target, proxy.look)
        applyCameraPose(camera, currentPosRef.current, currentTargetRef.current)
      },
      onComplete: () => {
        currentPosRef.current.copy(endPose.position)
        currentTargetRef.current.copy(endPose.target)
        applyCameraPose(camera, currentPosRef.current, currentTargetRef.current)
        timelineRef.current = null
        completeTransition()
      },
    })

    tl.to(proxy, { u: 1, duration, ease: 'power3.inOut' }, 0)
    tl.to(proxy, { look: 1, duration: duration * 0.92, ease: 'power2.inOut' }, 0)

    timelineRef.current = tl

    return () => {
      tl.kill()
      if (timelineRef.current === tl) {
        timelineRef.current = null
      }
    }
    // `aspect` se lee al iniciar la transición; un resize no debe reiniciar el vuelo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, transitionGoal, selectedDestinationId, camera, completeTransition])

  // Estabilización orbital y micro-paralaje amortiguado fuera de las transiciones.
  useFrame((frameState, delta) => {
    if (isTransitioning) return

    const dt = Math.min(delta, 0.1)
    const damp = 1 - Math.exp(-dt * 4.5)

    parallaxRef.current.x += (frameState.pointer.x - parallaxRef.current.x) * damp
    parallaxRef.current.y += (frameState.pointer.y - parallaxRef.current.y) * damp

    const restPos = restPoseRef.current.position
    const restTarget = restPoseRef.current.target
    const viewDist = restPos.distanceTo(restTarget)
    const amp = Math.min(viewDist * 0.012, 0.45)

    // Vector lateral derecha de la cámara en el plano horizontal.
    const forwardX = restTarget.x - restPos.x
    const forwardZ = restTarget.z - restPos.z
    const fLen = Math.hypot(forwardX, forwardZ) || 1
    const rightX = -forwardZ / fLen
    const rightZ = forwardX / fLen

    const desiredX = restPos.x + rightX * parallaxRef.current.x * amp
    const desiredY = restPos.y + parallaxRef.current.y * amp * 0.65
    const desiredZ = restPos.z + rightZ * parallaxRef.current.x * amp

    currentPosRef.current.x += (desiredX - currentPosRef.current.x) * damp
    currentPosRef.current.y += (desiredY - currentPosRef.current.y) * damp
    currentPosRef.current.z += (desiredZ - currentPosRef.current.z) * damp

    currentTargetRef.current.lerp(restTarget, damp)

    applyCameraPose(frameState.camera, currentPosRef.current, currentTargetRef.current)
  })

  return null
}
