import { OrbitLines } from '@/engine/orbits/OrbitLines'
import { PlanetSelector } from '@/engine/transitions/PlanetSelector'
import { DestinationEnvironments } from './DestinationEnvironments'
import { Earth } from './Earth'
import { Jupiter } from './Jupiter'
import { Mars } from './Mars'
import { Mercury } from './Mercury'
import { Saturn } from './Saturn'
import { Sun } from './Sun'
import { Venus } from './Venus'

/**
 * Conjunto planetario completo del sistema solar en escala artística comprimida,
 * junto con las estaciones orbitales 3D (.glb), lunas y colonias de cada destino.
 */
export function SolarSystem() {
  return (
    <group name="solar-system">
      <Sun />
      <OrbitLines />
      <PlanetSelector />
      <Mercury />
      <Venus />
      <Earth />
      <Mars />
      <Jupiter />
      <Saturn />
      <DestinationEnvironments />
    </group>
  )
}
