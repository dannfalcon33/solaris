import { DESTINATION_TO_BODY } from '@/engine/config/solarSystemLayout'
import { useNavigationStore } from '@/stores/navigation.store'
import type { CelestialBodyId } from '@/types'

/**
 * Devuelve `true` cuando el cuerpo celeste está en primer plano, para elevar
 * sus texturas a la máxima resolución (4k/8k) sin saturar la VRAM con todos
 * los planetas a la vez.
 */
export function useIsBodyFocused(bodyId: CelestialBodyId): boolean {
  return useNavigationStore((s) => {
    if (bodyId === 'earth') {
      return s.state === 'loading' || s.state === 'earth_hero'
    }
    if (bodyId === 'sun') {
      return s.state === 'solar_system'
    }
    if (!s.selectedDestinationId) return false
    const active =
      s.state === 'transitioning' ||
      s.state === 'planet_detail' ||
      s.state === 'station_detail'
    return active && DESTINATION_TO_BODY[s.selectedDestinationId] === bodyId
  })
}
