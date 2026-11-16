import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useQualityStore } from '@/engine/config/quality'
import { DESTINATION_TO_BODY } from '@/engine/config/solarSystemLayout'
import { useNavigationStore } from '@/stores/navigation.store'
import type { CelestialBodyId } from '@/types'

const BASE = import.meta.env.BASE_URL

const FALLBACK_TEXTURES: Record<CelestialBodyId, { tex: string; halo: string }> = {
  sun: { tex: `${BASE}textures/sun/2k/albedo.webp`, halo: 'rgba(255, 165, 55, 0.45)' },
  mercury: { tex: `${BASE}textures/mercury/2k/albedo.webp`, halo: 'rgba(180, 190, 200, 0.25)' },
  venus: { tex: `${BASE}textures/venus/2k/atmosphere.webp`, halo: 'rgba(235, 185, 105, 0.4)' },
  earth: { tex: `${BASE}textures/earth/2k/day.webp`, halo: 'rgba(55, 145, 255, 0.42)' },
  mars: { tex: `${BASE}textures/mars/2k/albedo.webp`, halo: 'rgba(217, 118, 66, 0.35)' },
  jupiter: { tex: `${BASE}textures/jupiter/2k/albedo.webp`, halo: 'rgba(219, 184, 142, 0.32)' },
  saturn: { tex: `${BASE}textures/saturn/2k/albedo.webp`, halo: 'rgba(229, 204, 150, 0.35)' },
}

/**
 * Fallback visual interactivo cuando WebGL no está disponible o el contexto
 * GPU se ha perdido (FASE 6). Mantiene el flujo de estados y el catálogo
 * comercial 100 % operativos.
 */
export function WebGLFallback({ reason }: { reason: 'unsupported' | 'context_lost' }) {
  const state = useNavigationStore((s) => s.state)
  const transitionGoal = useNavigationStore((s) => s.transitionGoal)
  const selectedDestinationId = useNavigationStore((s) => s.selectedDestinationId)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const markSceneReady = useNavigationStore((s) => s.markSceneReady)
  const completeTransition = useNavigationStore((s) => s.completeTransition)
  const setContextLost = useQualityStore((s) => s.setContextLost)

  useEffect(() => {
    markSceneReady()
  }, [markSceneReady])

  useEffect(() => {
    if (!isTransitioning) return
    const id = window.setTimeout(() => completeTransition(), 420)
    return () => window.clearTimeout(id)
  }, [isTransitioning, completeTransition])

  let bodyId: CelestialBodyId = 'earth'
  if (state === 'solar_system' || (state === 'transitioning' && transitionGoal === 'solar_system')) {
    bodyId = 'sun'
  } else if (selectedDestinationId && state !== 'earth_hero') {
    bodyId = DESTINATION_TO_BODY[selectedDestinationId]
  }

  const visual = FALLBACK_TEXTURES[bodyId]

  return (
    <div
      className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-bg"
      aria-label="Vista planetaria de compatibilidad 2D"
    >
      {/* Fondo estelar 2k */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${BASE}textures/sky/2k/milkyway.webp)` }}
      />

      {/* Esfera planetaria 2.5D con iluminación y terminador CSS */}
      <div
        className="relative size-72 rounded-full bg-cover bg-center transition-all duration-700 sm:size-96 lg:size-[28rem]"
        style={{
          backgroundImage: `url(${visual.tex})`,
          boxShadow: `inset -48px -24px 72px rgba(2, 6, 9, 0.94), 0 0 80px -12px ${visual.halo}`,
        }}
      />

      {/* Aviso discreto de estado WebGL */}
      <div className="hud-panel pointer-events-auto fixed left-4 top-20 z-30 flex max-w-sm items-start gap-3 p-3 text-xs sm:left-8 sm:top-24">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warning">
            {reason === 'context_lost'
              ? 'Contexto WebGL interrumpido'
              : 'Modo de compatibilidad sin WebGL'}
          </p>
          <p className="text-text-secondary">
            {reason === 'context_lost'
              ? 'El controlador gráfico reinició el contexto 3D. Puedes continuar navegando o reintentar el motor WebGL.'
              : 'Este navegador o dispositivo no tiene aceleración WebGL activa. Se muestra la vista 2.5D de respaldo.'}
          </p>
          {reason === 'context_lost' && (
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="size-3.5" />}
              onClick={() => setContextLost(false)}
            >
              Reintentar 3D
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
