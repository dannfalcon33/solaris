/**
 * Niveles de calidad del motor 3D. Controlan resolución de texturas, densidad
 * de geometría y efectos opcionales. La detección automática es una primera
 * aproximación; la FASE 6 la sustituye por calidad adaptativa medida (FPS).
 *
 * Forzar un nivel:  `?quality=low|medium|high|ultra`  (se recuerda en localStorage).
 */
export type QualityTier = 'low' | 'medium' | 'high' | 'ultra'
export type TextureRes = '2k' | '4k' | '8k'

export interface QualitySettings {
  tier: QualityTier
  /** Resolución objetivo de texturas planetarias. */
  textureRes: TextureRes
  /** Resolución del fondo estelar. */
  skyRes: TextureRes
  /** Segmentos (ancho) de las esferas planetarias. */
  sphereSegments: number
  /** Sombras de nubes sobre la superficie. */
  cloudShadows: boolean
  /** Anisotropía solicitada (la GPU limita al máximo soportado). */
  anisotropy: number
  /** DPR máximo del canvas. */
  maxDpr: number
}

const PRESETS: Record<QualityTier, QualitySettings> = {
  low: {
    tier: 'low',
    textureRes: '2k',
    skyRes: '2k',
    sphereSegments: 64,
    cloudShadows: false,
    anisotropy: 4,
    maxDpr: 1.5,
  },
  medium: {
    tier: 'medium',
    textureRes: '4k',
    skyRes: '4k',
    sphereSegments: 96,
    cloudShadows: true,
    anisotropy: 8,
    maxDpr: 1.75,
  },
  high: {
    tier: 'high',
    textureRes: '8k',
    skyRes: '4k',
    sphereSegments: 160,
    cloudShadows: true,
    anisotropy: 16,
    maxDpr: 2,
  },
  ultra: {
    tier: 'ultra',
    textureRes: '8k',
    skyRes: '8k',
    sphereSegments: 256,
    cloudShadows: true,
    anisotropy: 16,
    maxDpr: 2.5,
  },
}

const STORAGE_KEY = 'solaris.quality'
const isTier = (v: string | null): v is QualityTier => v !== null && v in PRESETS

function maxTextureSize(): number {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    return gl ? (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) : 0
  } catch {
    return 0
  }
}

function detectTier(): QualityTier {
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
  if (coarse || memory < 4 || cores <= 4) return 'medium'
  return 'high'
}

let cached: QualitySettings | null = null

/** Calidad activa (se calcula una sola vez por sesión). */
export function getQuality(): QualitySettings {
  cached ??= PRESETS[detectTier()]
  return cached
}

