import { use, useEffect, useState } from 'react'
import type { TextureRes } from '@/engine/config/quality'
import { debugStats } from '@/engine/debug/debugStats'
import {
  disposeTextureSet,
  loadTextureSet,
  type TextureSet,
  type TextureSpec,
} from './textureLoader'

const baseCache = new Map<string, Promise<unknown>>()

/**
 * Carga progresiva: el nivel 2k se resuelve mediante Suspense (la pantalla de
 * carga espera por él) y, en segundo plano, se carga el nivel objetivo y se
 * intercambia sin parpadeo. El nivel base nunca se libera (sirve de fallback).
 */
export function useProgressiveTextureSet<K extends string>(
  group: string,
  specs: Record<K, TextureSpec>,
  target: TextureRes,
  anisotropy: number,
): { textures: TextureSet<K>; resolution: TextureRes } {
  let basePromise = baseCache.get(group) as Promise<TextureSet<K>> | undefined
  if (!basePromise) {
    basePromise = loadTextureSet(group, '2k', specs, anisotropy)
    baseCache.set(group, basePromise)
  }
  const base = use(basePromise)

  const [upgraded, setUpgraded] = useState<{ res: TextureRes; set: TextureSet<K> } | null>(null)

  useEffect(() => {
    if (target === '2k') return
    let cancelled = false
    const t0 = performance.now()
    loadTextureSet(group, target, specs, anisotropy)
      .then((set) => {
        if (cancelled) {
          disposeTextureSet(set)
          return
        }
        debugStats.textureLoadMs[`${group}:${target}`] = Math.round(performance.now() - t0)
        setUpgraded({ res: target, set })
      })
      .catch((err) => console.warn(`[solaris] No se pudo cargar ${group}/${target}; se mantiene 2k`, err))
    return () => {
      cancelled = true
    }
    // `specs` es una constante de módulo en los llamadores.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, target, anisotropy])

  useEffect(() => {
    const current = upgraded
    return () => {
      if (current) disposeTextureSet(current.set)
    }
  }, [upgraded])

  const active = upgraded && upgraded.res === target ? upgraded : null
  const resolution = active ? active.res : '2k'
  debugStats.textureRes[group] = resolution
  return { textures: active ? active.set : base, resolution }
}

