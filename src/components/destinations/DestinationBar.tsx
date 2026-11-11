import { Globe, Satellite } from 'lucide-react'
import { Fade } from '@/components/ui/Fade'
import { destinations, getDestination } from '@/data/destinations'
import { useNavigationStore } from '@/stores/navigation.store'
import { cn } from '@/utils/cn'

/** Barra inferior de selección de destinos y estado de tránsito. */
export function DestinationBar() {
  const state = useNavigationStore((s) => s.state)
  const selectedId = useNavigationStore((s) => s.selectedDestinationId)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const selectDestination = useNavigationStore((s) => s.selectDestination)

  const visible = state === 'solar_system' || state === 'transitioning' || state === 'planet_detail' || state === 'station_detail'
  const activeId = state === 'solar_system' ? null : selectedId

  return (
    <Fade show={visible} from="bottom" className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 sm:px-8 sm:pb-6">
      <div className="mx-auto max-w-5xl">
        <p
          aria-live="polite"
          className="mb-2 flex h-5 items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-secondary"
        >
          {isTransitioning && selectedId ? (
            <>
              <span className="size-1.5 animate-pulse-dot rounded-full bg-cyan" aria-hidden="true" />
              <span className="text-cyan">En tránsito · {getDestination(selectedId).bodyName}</span>
            </>
          ) : state === 'solar_system' ? (
            'Selecciona un destino'
          ) : null}
        </p>

        <nav aria-label="Destinos" className="hud-panel">
          <ul className="hud-scroll flex snap-x overflow-x-auto">
            {destinations.map((d) => {
              const active = d.id === activeId
              const Icon = d.kind === 'station' ? Satellite : Globe
              return (
                <li key={d.id} className="min-w-[9.5rem] flex-1 snap-start">
                  <button
                    type="button"
                    onClick={() => selectDestination(d.id)}
                    disabled={isTransitioning}
                    aria-pressed={active}
                    className={cn(
                      'group relative flex h-full w-full flex-col items-start gap-1 px-4 py-3 text-left transition focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan',
                      active ? 'bg-teal/10' : 'hover:bg-white/5',
                      'disabled:cursor-not-allowed',
                      isTransitioning && !active && 'disabled:opacity-40',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 top-0 h-px bg-teal transition-opacity',
                        active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50',
                      )}
                    />
                    <span className="flex items-center gap-2 text-sm font-medium tracking-wide text-text-primary">
                      <Icon className={cn('size-3.5', active ? 'text-teal' : 'text-text-secondary group-hover:text-teal')} />
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

