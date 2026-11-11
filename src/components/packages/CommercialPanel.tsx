import { ChevronDown, ChevronUp, Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Fade } from '@/components/ui/Fade'
import { getDestination } from '@/data/destinations'
import { tiers } from '@/data/tiers'
import { useNavigationStore } from '@/stores/navigation.store'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/utils/cn'
import { TierCard } from './TierCard'

/**
 * Panel comercial: columna derecha en escritorio, bottom sheet plegable en
 * pantallas pequeñas (por encima de la barra de destinos).
 */
export function CommercialPanel() {
  const state = useNavigationStore((s) => s.state)
  const id = useNavigationStore((s) => s.selectedDestinationId)
  const selectedTier = useUiStore((s) => s.selectedTier)
  const selectTier = useUiStore((s) => s.selectTier)
  const openBooking = useUiStore((s) => s.openBooking)
  const sheetOpen = useUiStore((s) => s.sheetOpen)
  const setSheetOpen = useUiStore((s) => s.setSheetOpen)

  const visible = state === 'planet_detail' || state === 'station_detail'
  const destination = id ? getDestination(id) : null

  return (
    <Fade
      show={visible && destination !== null}
      from="right"
      className="absolute inset-x-3 bottom-[7.5rem] z-10 sm:inset-x-8 lg:inset-x-auto lg:bottom-32 lg:right-8 lg:top-24 lg:w-[26rem]"
    >
      <section
        aria-label="Paquetes de expedición"
        className="hud-panel flex max-h-[min(52svh,34rem)] flex-col lg:h-full lg:max-h-none"
      >
        <header className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">Expediciones</p>
            <h2 className="truncate text-sm font-light tracking-wide text-text-primary">
              {destination?.experienceName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="warning">Precios ficticios</Badge>
            <button
              type="button"
              onClick={() => setSheetOpen(!sheetOpen)}
              aria-expanded={sheetOpen}
              aria-controls="tier-list"
              aria-label={sheetOpen ? 'Contraer paquetes' : 'Desplegar paquetes'}
              className="p-1.5 text-text-secondary transition hover:text-text-primary focus-visible:outline-2 focus-visible:outline-cyan lg:hidden"
            >
              {sheetOpen ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
            </button>
          </div>
        </header>

        <div
          id="tier-list"
          className={cn(
            'hud-scroll min-h-0 flex-1 flex-col gap-3 overflow-y-auto border-t border-white/10 p-4',
            sheetOpen ? 'flex' : 'hidden lg:flex',
          )}
        >
          {tiers.map((tier) => (
            <TierCard
              key={tier.tier}
              tier={tier}
              selected={tier.tier === selectedTier}
              onSelect={() => selectTier(tier.tier)}
              onDetails={() => openBooking(tier.tier, 'details')}
            />
          ))}
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-text-secondary/70">
            Contenido de demostración. Precios, duraciones y disponibilidad son ficticios.
          </p>
        </div>

        <footer className={cn('border-t border-white/10 p-4', sheetOpen ? 'block' : 'hidden lg:block')}>
          <Button
            variant="primary"
            size="md"
            className="w-full"
            icon={<Rocket className="size-4" />}
            onClick={() => openBooking(selectedTier, 'form')}
          >
            Book expedition
          </Button>
        </footer>
      </section>
    </Fade>
  )
}

