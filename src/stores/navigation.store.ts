import { create } from 'zustand'
import { getDestination } from '@/data/destinations'
import type { CelestialBodyId, DestinationId, NavigationState } from '@/types'

export type TransitionGoal = 'earth_hero' | 'solar_system' | 'destination'
export type SelectableBodyId = Exclude<CelestialBodyId, 'sun'>

interface NavigationStore {
  /** Estado actual de la experiencia. */
  state: NavigationState
  /** Último destino seleccionado (o al que se viaja). */
  selectedDestinationId: DestinationId | null
  /** Objetivo al que se dirige la transición de cámara en curso. */
  transitionGoal: TransitionGoal
  /** Cuerpo resaltado por hover (en la escena 3D o en la barra inferior). */
  hoveredBodyId: SelectableBodyId | null
  /** `true` mientras hay una transición de cámara en curso. */
  isTransitioning: boolean
  /** El canvas 3D ya creó el contexto WebGL y renderizó su primer frame. */
  sceneReady: boolean

  /** Llamado por el canvas cuando la escena está lista; sale de `loading`. */
  markSceneReady: () => void
  /** Earth hero → sistema solar (con transición GSAP). */
  enterSolarSystem: () => void
  /** Inicia el viaje a un destino. Ignorado si ya hay una transición. */
  selectDestination: (id: DestinationId) => void
  /** Finaliza la transición en curso y fija el estado de llegada. */
  completeTransition: () => void
  /** Vuelve a la vista del sistema solar (con transición GSAP). */
  returnToSolarSystem: () => void
  /** Vuelve a la Tierra (con transición GSAP). */
  returnToEarth: () => void
  /** Actualiza el planeta resaltado por hover. */
  setHoveredBody: (bodyId: SelectableBodyId | null) => void
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  state: 'loading',
  selectedDestinationId: null,
  transitionGoal: 'earth_hero',
  hoveredBodyId: null,
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
    set({
      isTransitioning: true,
      state: 'transitioning',
      transitionGoal: 'solar_system',
      hoveredBodyId: null,
    })
  },

  selectDestination: (id) => {
    const { isTransitioning, state, selectedDestinationId } = get()
    if (isTransitioning) return
    if (state !== 'solar_system' && state !== 'planet_detail' && state !== 'station_detail') {
      return
    }
    if ((state === 'planet_detail' || state === 'station_detail') && selectedDestinationId === id) {
      return
    }
    set({
      selectedDestinationId: id,
      isTransitioning: true,
      state: 'transitioning',
      transitionGoal: 'destination',
      hoveredBodyId: null,
    })
  },

  completeTransition: () => {
    const { selectedDestinationId, isTransitioning, transitionGoal } = get()
    if (!isTransitioning) return

    if (transitionGoal === 'earth_hero') {
      set({ isTransitioning: false, state: 'earth_hero' })
      return
    }
    if (transitionGoal === 'solar_system' || !selectedDestinationId) {
      set({ isTransitioning: false, state: 'solar_system' })
      return
    }
    const { kind } = getDestination(selectedDestinationId)
    set({
      isTransitioning: false,
      state: kind === 'station' ? 'station_detail' : 'planet_detail',
    })
  },

  returnToSolarSystem: () => {
    const { isTransitioning, state } = get()
    if (isTransitioning || state === 'loading' || state === 'solar_system') return
    set({
      isTransitioning: true,
      state: 'transitioning',
      transitionGoal: 'solar_system',
      hoveredBodyId: null,
    })
  },

  returnToEarth: () => {
    const { isTransitioning, state } = get()
    if (isTransitioning || state === 'loading' || state === 'earth_hero') return
    set({
      isTransitioning: true,
      state: 'transitioning',
      transitionGoal: 'earth_hero',
      hoveredBodyId: null,
    })
  },

  setHoveredBody: (bodyId) => {
    if (get().hoveredBodyId === bodyId) return
    set({ hoveredBodyId: bodyId })
  },
}))
