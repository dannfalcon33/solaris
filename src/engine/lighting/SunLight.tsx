import { DirectionalLight } from 'three'
import { SUN_DIRECTION } from './sun'

const SUN_DISTANCE = 100

/** Luz solar direccional (para materiales estándar, p. ej. estaciones futuras). */
export function SunLight() {
  return (
    <>
      <ambientLight intensity={0.02} />
      <directionalLight
        position={SUN_DIRECTION.clone().multiplyScalar(SUN_DISTANCE)}
        intensity={3.2}
        color="#fff4e0"
      />
    </>
  )
}

export type { DirectionalLight }
