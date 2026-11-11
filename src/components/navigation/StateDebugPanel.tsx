import { destinations, getDestination } from '@/data/destinations'
import { useNavigationStore } from '@/stores/navigation.store'

/**
 * Controles mínimos para validar el store en la FASE 0.
 * La navegación definitiva (HUD, CTA, barra inferior) llega en las FASES 1 y 3.
 */
export function StateDebugPanel() {
  const state = useNavigationStore((s) => s.state)
  const selectedId = useNavigationStore((s) => s.selectedDestinationId)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const enterSolarSystem = useNavigationStore((s) => s.enterSolarSystem)
  const selectDestination = useNavigationStore((s) => s.selectDestination)
  const returnToSolarSystem = useNavigationStore((s) => s.returnToSolarSystem)
  const returnToEarth = useNavigationStore((s) => s.returnToEarth)

  const btn =
    'border border-teal/40 px-3 py-1.5 text-xs tracking-wider text-text-primary transition hover:bg-teal/10 focus-visible:outline-2 focus-visible:outline-cyan disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <aside className="pointer-events-auto fixed bottom-4 left-4 z-10 flex max-w-sm flex-col gap-3 border border-teal/20 bg-surface/90 p-4 text-xs">
      <header className="flex items-baseline justify-between gap-4">
        <span className="font-mono tracking-[0.3em] text-teal">SOLARIS · FASE 0</span>
        <span className="text-warning">DEBUG</span>
      </header>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono">
        <dt className="text-text-secondary">state</dt>
        <dd>{state}</dd>
        <dt className="text-text-secondary">destino</dt>
        <dd>{selectedId ? getDestination(selectedId).name : '—'}</dd>
        <dt className="text-text-secondary">transición</dt>
        <dd>{String(isTransitioning)}</dd>
      </dl>

      <div className="flex flex-wrap gap-2">
        <button className={btn} onClick={enterSolarSystem} disabled={state !== 'earth_hero'}>
          EXPLORE SOLAR SYSTEM
        </button>
        <button className={btn} onClick={returnToSolarSystem} disabled={isTransitioning || state === 'earth_hero' || state === 'loading' || state === 'solar_system'}>
          ← SISTEMA SOLAR
        </button>
        <button className={btn} onClick={returnToEarth} disabled={isTransitioning || state !== 'solar_system'}>
          ← TIERRA
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {destinations.map((d) => (
          <button
            key={d.id}
            className={btn}
            onClick={() => selectDestination(d.id)}
            disabled={isTransitioning || state === 'loading' || state === 'earth_hero'}
          >
            {d.name}
          </button>
        ))}
      </div>
    </aside>
  )
}

