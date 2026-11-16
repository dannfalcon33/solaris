import { OrbitLines } from '@/engine/orbits/OrbitLines'
import { Earth } from './Earth'
import { Jupiter } from './Jupiter'
import { Mars } from './Mars'
import { Mercury } from './Mercury'
import { Saturn } from './Saturn'
import { Sun } from './Sun'
import { Venus } from './Venus'

/**
 * Conjunto planetario completo del sistema solar en escala artística comprimida.
 */
export function SolarSystem() {
  return (
    <group name="solar-system">
      <Sun />
      <OrbitLines />
      <Mercury />
      <Venus />
      <Earth />
      <Mars />
      <Jupiter />
      <Saturn />
    </group>
  )
}
