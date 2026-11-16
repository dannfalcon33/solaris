import { useQuality } from '@/engine/config/quality'
import { DESTINATION_TO_BODY } from '@/engine/config/solarSystemLayout'
import { useNavigationStore } from '@/stores/navigation.store'
import type { CelestialBodyId } from '@/types'

/**
 * Devuelve `true` cuando el cuerpo celeste está en primer plano (o es el
 * objetivo de la transición actual), para elevar sus texturas a la máxima
 * resolución (4k/8k) y su geometría a LOD 0 sin saturar la GPU con todos los
 * planetas a la vez.
 */
export function useIsBodyFocused(bodyId: CelestialBodyId): boolean {
  return useNavigationStore((s) => {
    if (bodyId === 'earth') {
      return (
        s.state === 'loading' ||
        s.state === 'earth_hero' ||
        (s.state === 'transitioning' && s.transitionGoal === 'earth_hero')
      )
    }
    if (bodyId === 'sun') {
      return (
        s.state === 'solar_system' ||
        (s.state === 'transitioning' && s.transitionGoal === 'solar_system')
      )
    }
    if (!s.selectedDestinationId) return false
    const inDetail = s.state === 'planet_detail' || s.state === 'station_detail'
    const flyingToDest = s.state === 'transitioning' && s.transitionGoal === 'destination'
    return (inDetail || flyingToDest) && DESTINATION_TO_BODY[s.selectedDestinationId] === bodyId
  })
}

/**
 * LOD geométrico por distancia/foco (FASE 6): devuelve el número de segmentos
 * de esfera adecuado según si el planeta está en primer plano (LOD 0) o
 * distante en el sistema solar (LOD 1), junto con la configuración de calidad.
 */
export function useBodyLod(bodyId: CelestialBodyId) {
  const quality = useQuality()
  const focused = useIsBodyFocused(bodyId)
  const segments = focused ? quality.sphereSegments : quality.distantSphereSegments
  const atmoSegments = focused ? 96 : 36
  return { quality, focused, segments, atmoSegments }
}
