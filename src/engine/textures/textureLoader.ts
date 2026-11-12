import {
  ImageBitmapLoader,
  LinearFilter,
  LinearMipmapLinearFilter,
  NoColorSpace,
  RepeatWrapping,
  ClampToEdgeWrapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from 'three'
import type { TextureRes } from '@/engine/config/quality'

export interface TextureSpec {
  /** Textura de color (sRGB) o de datos (normal, especular...). */
  srgb: boolean
}

const BASE = import.meta.env.BASE_URL

export const textureUrl = (group: string, res: TextureRes, name: string) =>
  `${BASE}textures/${group}/${res}/${name}.webp`

const bitmapLoader = new ImageBitmapLoader()
// Las ImageBitmap no respetan `flipY` de WebGL: se voltean al decodificar.
bitmapLoader.setOptions({ imageOrientation: 'flipY', premultiplyAlpha: 'none' })

function configure(tex: Texture, spec: TextureSpec, anisotropy: number): Texture {
  tex.colorSpace = spec.srgb ? SRGBColorSpace : NoColorSpace
  tex.wrapS = RepeatWrapping // continuidad en la costura longitudinal
  tex.wrapT = ClampToEdgeWrapping
  tex.minFilter = LinearMipmapLinearFilter
  tex.magFilter = LinearFilter
  tex.generateMipmaps = true
  tex.anisotropy = anisotropy
  tex.needsUpdate = true
  return tex
}

/** Decodifica fuera del hilo principal (ImageBitmap); fallback a TextureLoader. */
export async function loadTexture(url: string, spec: TextureSpec, anisotropy: number): Promise<Texture> {
  try {
    const bitmap = await bitmapLoader.loadAsync(url)
    const tex = new Texture(bitmap as unknown as HTMLImageElement)
    tex.flipY = false
    return configure(tex, spec, anisotropy)
  } catch {
    const tex = await new TextureLoader().loadAsync(url)
    return configure(tex, spec, anisotropy)
  }
}

export type TextureSet<K extends string> = Record<K, Texture>

export async function loadTextureSet<K extends string>(
  group: string,
  res: TextureRes,
  specs: Record<K, TextureSpec>,
  anisotropy: number,
): Promise<TextureSet<K>> {
  const names = Object.keys(specs) as K[]
  const textures = await Promise.all(
    names.map((name) => loadTexture(textureUrl(group, res, name), specs[name], anisotropy)),
  )
  return Object.fromEntries(names.map((name, i) => [name, textures[i]!])) as TextureSet<K>
}

export function disposeTextureSet<K extends string>(set: TextureSet<K>): void {
  for (const tex of Object.values<Texture>(set)) {
    const img = tex.image as { close?: () => void } | undefined
    tex.dispose()
    img?.close?.()
  }
}

