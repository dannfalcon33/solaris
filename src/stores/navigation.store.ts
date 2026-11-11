import { create } from 'zustand'
import { getDestination } from '@/data/destinations'
import type { DestinationId, NavigationState } from '@/types'

interface NavigationStore {
  /** Estado actual de la experiencia. */
  state: NavigationState
  /** Destino seleccionado (o al que se viaja). */
  selectedDestinationId: DestinationId | null
  /** `true` mientras hay una transición de cámara en curso. */
  isTransitioning: boolean
  /** El canvas 3D ya creó el contexto WebGL y renderizó su primer frame. */
  sceneReady: boolean

  /** Llamado por el canvas cuando la escena está lista; sale de `loading`. */
  markSceneReady: () => void
  /** Earth hero → sistema solar. */
  enterSolarSystem: () => void
  /** Inicia el viaje a un destino. Ignorado si ya hay una transición. */
  selectDestination: (id: DestinationId) => void
  /** Finaliza la transición en curso y fija el estado de llegada. */
  completeTransition: () => void
  /** Vuelve a la vista del sistema solar. Ignorado durante una transición. */
  returnToSolarSystem: () => void
  /** Vuelve a la Tierra (hero). Ignorado durante una transición. */
  returnToEarth: () => void
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  state: 'loading',
  selectedDestinationId: null,
  isTransitioning: false,
  sceneReady: false,

  markSceneReady: () =>
    set((s) => ({
      sceneReady: true,
      state: s.state === 'loading' ? 'earth_hero' : s.state,
    })),

  enterSolarSystem: () => {
    const { state, isTransitioning } = get()
    if (isTransitioning || state !== 'earth_hero') return
    // FASE 3: aquí se lanzará el timeline GSAP "Tierra → sistema solar".
    set({ state: 'solar_system' })
  },

  selectDestination: (id) => {
    const { isTransitioning, state } = get()
    if (isTransitioning) return
    if (state !== 'solar_system' && state !== 'planet_detail' && state !== 'station_detail') {
      return
    }
    set({ selectedDestinationId: id, isTransitioning: true, state: 'transitioning' })
  },

  completeTransition: () => {
    const { selectedDestinationId, isTransitioning } = get()
    if (!isTransitioning || !selectedDestinationId) return
    const { kind } = getDestination(selectedDestinationId)
    set({
      isTransitioning: false,
      state: kind === 'station' ? 'station_detail' : 'planet_detail',
    })
  },

  returnToSolarSystem: () => {
    if (get().isTransitioning) return
    set({ state: 'solar_system', selectedDestinationId: null })
  },

  returnToEarth: () => {
    if (get().isTransitioning) return
    set({ state: 'earth_hero', selectedDestinationId: null })
  },
}))

