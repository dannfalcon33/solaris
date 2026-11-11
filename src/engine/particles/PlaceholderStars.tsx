import { Stars } from '@react-three/drei'

/** Fondo estelar provisional; se reemplazará por el sistema de partículas de la FASE 2. */
export function PlaceholderStars() {
  return <Stars radius={80} depth={40} count={2500} factor={3} saturation={0} fade speed={0.4} />
}

