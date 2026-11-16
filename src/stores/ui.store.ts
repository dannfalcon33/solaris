import { create } from 'zustand'
import type { PackageTier } from '@/types'

export type BookingStep = 'details' | 'compare' | 'form' | 'done'
export type Locale = 'es' | 'en' | 'pt'

const LOCALE_STORAGE_KEY = 'solaris.locale'

function isLocale(val: string | null): val is Locale {
  return val === 'es' || val === 'en' || val === 'pt'
}

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'es'
  const param = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(param)) return param
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    /* localStorage no disponible */
  }
  const nav = (navigator.language || 'es').toLowerCase()
  if (nav.startsWith('pt')) return 'pt'
  if (nav.startsWith('en')) return 'en'
  return 'es'
}

function syncHtmlLang(locale: Locale): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : locale
  }
}

const initialLocale = detectInitialLocale()
syncHtmlLang(initialLocale)

interface UiStore {
  /** Idioma activo de la interfaz (Español, Inglés, Portugués de Brasil). */
  locale: Locale
  /** Categoría resaltada en el panel comercial. */
  selectedTier: PackageTier
  /** Modal de detalles/comparador/reserva: `null` = cerrado. */
  booking: { tier: PackageTier; step: BookingStep } | null
  /** Panel comercial desplegado en pantallas pequeñas (bottom sheet). */
  sheetOpen: boolean

  setLocale: (locale: Locale) => void
  selectTier: (tier: PackageTier) => void
  openBooking: (tier: PackageTier, step?: BookingStep) => void
  closeBooking: () => void
  setSheetOpen: (open: boolean) => void
}

/** Estado exclusivamente de interfaz; no interviene en la escena 3D. */
export const useUiStore = create<UiStore>((set) => ({
  locale: initialLocale,
  selectedTier: 'voyager',
  booking: null,
  sheetOpen: false,

  setLocale: (locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      /* localStorage no disponible */
    }
    syncHtmlLang(locale)
    set({ locale })
  },
  selectTier: (tier) => set({ selectedTier: tier }),
  openBooking: (tier, step = 'details') => set({ booking: { tier, step }, selectedTier: tier }),
  closeBooking: () => set({ booking: null }),
  setSheetOpen: (open) => set({ sheetOpen: open }),
}))
