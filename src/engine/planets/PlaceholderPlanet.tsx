import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

/**
 * PLACEHOLDER TEMPORAL (FASE 0): esfera plana que valida el canvas R3F.
 * Se sustituye por la Tierra realista en la FASE 2A.
 */
export function PlaceholderPlanet() {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15
  })

  return (
    <mesh ref={ref} name="placeholder-planet">
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshStandardMaterial color="#0b3a44" roughness={0.9} metalness={0.05} />
    </mesh>
  )
}

