import { ArrowLeft, Globe, Satellite } from 'lucide-react'
import { Fade } from '@/components/ui/Fade'
import { destinations, getDestination } from '@/data/destinations'
import { BODIES } from '@/engine/config/solarSystemLayout'
import { useNavigationStore } from '@/stores/navigation.store'
import { cn } from '@/utils/cn'

/** Barra inferior de selección de destinos, sincronizada con la escena 3D. */
export function DestinationBar() {
  const state = useNavigationStore((s) => s.state)
  const transitionGoal = useNavigationStore((s) => s.transitionGoal)
  const selectedId = useNavigationStore((s) => s.selectedDestinationId)
  const hoveredBodyId = useNavigationStore((s) => s.hoveredBodyId)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const selectDestination = useNavigationStore((s) => s.selectDestination)
  const returnToEarth = useNavigationStore((s) => s.returnToEarth)
  const setHoveredBody = useNavigationStore((s) => s.setHoveredBody)

  const visible =
    state === 'solar_system' ||
    state === 'planet_detail' ||
    state === 'station_detail' ||
    (state === 'transitioning' && transitionGoal !== 'earth_hero')

  const activeId = state === 'solar_system' ? null : selectedId

  return (
    <Fade show={visible} from="bottom" className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 sm:px-8 sm:pb-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 flex h-7 items-center justify-between gap-2 px-1">
          {state === 'solar_system' && !isTransitioning ? (
            <button
              type="button"
              onClick={returnToEarth}
              onMouseEnter={() => setHoveredBody('earth')}
              onMouseLeave={() => setHoveredBody(null)}
              className="inline-flex items-center gap-1.5 border border-teal/35 bg-surface/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-teal transition hover:border-teal hover:bg-teal/15 focus-visible:outline-2 focus-visible:outline-cyan"
            >
              <ArrowLeft className="size-3" />
              Tierra
            </button>
          ) : (
            <span />
          )}

          <p
            aria-live="polite"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary"
          >
            {isTransitioning && transitionGoal === 'destination' && selectedId ? (
              <>
                <span className="size-1.5 animate-pulse-dot rounded-full bg-cyan" aria-hidden="true" />
                <span className="text-cyan">En tránsito · {getDestination(selectedId).name}</span>
              </>
            ) : isTransitioning && transitionGoal === 'solar_system' ? (
              <>
                <span className="size-1.5 animate-pulse-dot rounded-full bg-cyan" aria-hidden="true" />
                <span className="text-cyan">Abriendo vista general · Sistema Solar</span>
              </>
            ) : state === 'solar_system' && hoveredBodyId ? (
              <span className="text-teal">
                Objetivo · {BODIES[hoveredBodyId].name} — clic para viajar
              </span>
            ) : state === 'solar_system' ? (
              'Selecciona un planeta en 3D o un destino inferior'
            ) : null}
          </p>

          <span className="hidden w-16 sm:inline-block" aria-hidden="true" />
        </div>

        <nav aria-label="Destinos" className="hud-panel">
          <ul className="hud-scroll flex snap-x overflow-x-auto">
            {destinations.map((d) => {
              const active = d.id === activeId
              const hoveredFrom3D = state === 'solar_system' && hoveredBodyId === d.bodyId
              const Icon = d.kind === 'station' ? Satellite : Globe
              return (
                <li key={d.id} className="min-w-[9.5rem] flex-1 snap-start">
                  <button
                    type="button"
                    onClick={() => selectDestination(d.id)}
                    onMouseEnter={() => !isTransitioning && setHoveredBody(d.bodyId)}
                    onMouseLeave={() => setHoveredBody(null)}
                    disabled={isTransitioning}
                    aria-pressed={active}
                    className={cn(
                      'group relative flex h-full w-full flex-col items-start gap-1 px-4 py-3 text-left transition focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan',
                      active
                        ? 'bg-teal/12'
                        : hoveredFrom3D
                          ? 'bg-teal/[0.07]'
                          : 'hover:bg-white/5',
                      'disabled:cursor-not-allowed',
                      isTransitioning && !active && 'disabled:opacity-40',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 top-0 h-px bg-teal transition-opacity',
                        active || hoveredFrom3D ? 'opacity-100' : 'opacity-0 group-hover:opacity-50',
                      )}
                    />
                    <span className="flex items-center gap-2 text-sm font-medium tracking-wide text-text-primary">
                      <Icon
                        className={cn(
                          'size-3.5',
                          active || hoveredFrom3D
                            ? 'text-teal'
                            : 'text-text-secondary group-hover:text-teal',
                        )}
                      />
                      {d.bodyName}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                      {d.experienceName}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </Fade>
  )
}
