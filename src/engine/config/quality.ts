import { create } from 'zustand'

/**
 * Niveles de calidad del motor 3D. Controlan resolución de texturas, densidad
 * de geometría (LOD cercano y lejano), número de partículas y DPR máximo.
 *
 * Forzar un nivel:  `?quality=low|medium|high|ultra`  (se recuerda en localStorage).
 * En la FASE 6, `AdaptivePerformance` puede degradar dinámicamente el nivel si
 * detecta caída sostenida de FPS.
 */
export type QualityTier = 'low' | 'medium' | 'high' | 'ultra'
export type TextureRes = '2k' | '4k' | '8k'

export interface QualitySettings {
  tier: QualityTier
  /** Resolución objetivo de texturas del planeta enfocado en primer plano. */
  textureRes: TextureRes
  /** Resolución del fondo estelar. */
  skyRes: TextureRes
  /** Segmentos de esfera cuando el planeta está en primer plano (LOD 0). */
  sphereSegments: number
  /** Segmentos de esfera cuando el planeta está distante (LOD 1). */
  distantSphereSegments: number
  /** Cantidad de estrellas puntuales en `Starfield`. */
  starCount: number
  /** Sombras de nubes sobre la superficie. */
  cloudShadows: boolean
  /** Anisotropía solicitada (la GPU limita al máximo soportado). */
  anisotropy: number
  /** DPR mínimo permitido por Adaptive DPR. */
  minDpr: number
  /** DPR máximo del canvas. */
  maxDpr: number
}

export const QUALITY_PRESETS: Readonly<Record<QualityTier, QualitySettings>> = {
  low: {
    tier: 'low',
    textureRes: '2k',
    skyRes: '2k',
    sphereSegments: 64,
    distantSphereSegments: 32,
    starCount: 1200,
    cloudShadows: false,
    anisotropy: 2,
    minDpr: 0.85,
    maxDpr: 1.25,
  },
  medium: {
    tier: 'medium',
    textureRes: '4k',
    skyRes: '2k',
    sphereSegments: 96,
    distantSphereSegments: 40,
    starCount: 2200,
    cloudShadows: true,
    anisotropy: 6,
    minDpr: 1.0,
    maxDpr: 1.65,
  },
  high: {
    tier: 'high',
    textureRes: '8k',
    skyRes: '4k',
    sphereSegments: 160,
    distantSphereSegments: 48,
    starCount: 3600,
    cloudShadows: true,
    anisotropy: 16,
    minDpr: 1.0,
    maxDpr: 2.0,
  },
  ultra: {
    tier: 'ultra',
    textureRes: '8k',
    skyRes: '8k',
    sphereSegments: 224,
    distantSphereSegments: 64,
    starCount: 4500,
    cloudShadows: true,
    anisotropy: 16,
    minDpr: 1.25,
    maxDpr: 2.5,
  },
}

const STORAGE_KEY = 'solaris.quality'
const TIER_ORDER: readonly QualityTier[] = ['low', 'medium', 'high', 'ultra']
const isTier = (v: string | null): v is QualityTier => v !== null && v in QUALITY_PRESETS

export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true
  if (new URLSearchParams(window.location.search).has('nowebgl')) return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}

function maxTextureSize(): number {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    return gl ? (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) : 4096
  } catch {
    return 4096
  }
}

function detectInitialTier(): QualityTier {
  if (typeof window === 'undefined') return 'high'
  const params = new URLSearchParams(window.location.search)
  const forced = params.get('quality')
  if (isTier(forced)) {
    try {
      localStorage.setItem(STORAGE_KEY, forced)
    } catch {
      /* almacenamiento no disponible */
    }
    return forced
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isTier(saved)) return saved
  } catch {
    /* almacenamiento no disponible */
  }

  const nav = navigator as Navigator & { deviceMemory?: number }
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 768
  const memory = nav.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency || 4

  if (maxTextureSize() < 8192) return 'low'
  if (coarse && narrow) return 'low'
  if (coarse || narrow || memory < 4 || cores <= 4) return 'medium'
  return 'high'
}

interface QualityStore {
  settings: QualitySettings
  activeDpr: number
  contextLost: boolean
  webglSupported: boolean
  downgradeTier: () => boolean
  setActiveDpr: (dpr: number) => void
  setContextLost: (lost: boolean) => void
}

const initialTier = detectInitialTier()
const initialSettings = QUALITY_PRESETS[initialTier]
const initialDpr =
  typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, initialSettings.maxDpr)
    : 1

export const useQualityStore = create<QualityStore>((set, get) => ({
  settings: initialSettings,
  activeDpr: initialDpr,
  contextLost: false,
  webglSupported: detectWebGLSupport(),

  downgradeTier: () => {
    const current = get().settings.tier
    const idx = TIER_ORDER.indexOf(current)
    if (idx <= 0) return false
    const nextTier = TIER_ORDER[idx - 1]!
    const nextSettings = QUALITY_PRESETS[nextTier]
    set({
      settings: nextSettings,
      activeDpr: Math.min(get().activeDpr, nextSettings.maxDpr),
    })
    return true
  },

  setActiveDpr: (dpr) => {
    if (Math.abs(get().activeDpr - dpr) < 0.02) return
    set({ activeDpr: dpr })
  },

  setContextLost: (lost) => set({ contextLost: lost }),
}))

/** Acceso reactivo o directo a la configuración de calidad actual. */
export function getQuality(): QualitySettings {
  return useQualityStore.getState().settings
}

export function useQuality(): QualitySettings {
  return useQualityStore((s) => s.settings)
}
