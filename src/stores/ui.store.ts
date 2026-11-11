import { create } from 'zustand'
import type { PackageTier } from '@/types'

export type BookingStep = 'details' | 'form' | 'done'

interface UiStore {
  /** Categoría resaltada en el panel comercial. */
  selectedTier: PackageTier
  /** Modal de detalles/reserva: `null` = cerrado. */
  booking: { tier: PackageTier; step: BookingStep } | null
  /** Panel comercial desplegado en pantallas pequeñas (bottom sheet). */
  sheetOpen: boolean

  selectTier: (tier: PackageTier) => void
  openBooking: (tier: PackageTier, step?: BookingStep) => void
  closeBooking: () => void
  setSheetOpen: (open: boolean) => void
}

/** Estado exclusivamente de interfaz; no interviene en la escena 3D. */
export const useUiStore = create<UiStore>((set) => ({
  selectedTier: 'voyager',
  booking: null,
  sheetOpen: false,

  selectTier: (tier) => set({ selectedTier: tier }),
  openBooking: (tier, step = 'details') => set({ booking: { tier, step }, selectedTier: tier }),
  closeBooking: () => set({ booking: null }),
  setSheetOpen: (open) => set({ sheetOpen: open }),
}))

