import { useEffect } from 'react'
import { destinations } from '@/data/destinations'
import { useNavigationStore } from '@/stores/navigation.store'
import { useUiStore } from '@/stores/ui.store'

/**
 * Navegación accesible por teclado a nivel de aplicación (FASE 7):
 *  - `Escape` (cuando no hay modal abierto): regresa del detalle de un planeta
 *    al sistema solar, o del sistema solar al Hero de la Tierra.
 *  - `ArrowRight` / `ArrowLeft` (en vista de detalle sin foco en un input):
 *    permite recorrer los 6 destinos secuencialmente.
 */
export function useKeyboardNavigation() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Si el modal de reserva está abierto, su propio diálogo gestiona Escape y Tab.
      if (useUiStore.getState().booking !== null) return

      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return

      const nav = useNavigationStore.getState()
      if (nav.isTransitioning || nav.state === 'loading') return

      if (e.key === 'Escape') {
        if (nav.state === 'planet_detail' || nav.state === 'station_detail') {
          e.preventDefault()
          nav.returnToSolarSystem()
        } else if (nav.state === 'solar_system') {
          e.preventDefault()
          nav.returnToEarth()
        }
        return
      }

      if (
        (e.key === 'ArrowRight' || e.key === 'ArrowLeft') &&
        (nav.state === 'planet_detail' || nav.state === 'station_detail') &&
        nav.selectedDestinationId
      ) {
        const idx = destinations.findIndex((d) => d.id === nav.selectedDestinationId)
        if (idx === -1) return
        const delta = e.key === 'ArrowRight' ? 1 : -1
        const nextIdx = (idx + delta + destinations.length) % destinations.length
        const next = destinations[nextIdx]
        if (next) {
          e.preventDefault()
          nav.selectDestination(next.id)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
