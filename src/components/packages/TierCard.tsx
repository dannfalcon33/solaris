import { Check, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { TierDefinition } from '@/types'
import { formatUsd } from '@/utils/format'
import { cn } from '@/utils/cn'

interface TierCardProps {
  tier: TierDefinition
  selected: boolean
  onSelect: () => void
  onDetails: () => void
}

/** Tarjeta de categoría (Explorer / Voyager / Infinity). Datos ficticios. */
export function TierCard({ tier, selected, onSelect, onDetails }: TierCardProps) {
  return (
    <article
      className={cn(
        'relative border transition duration-200',
        selected
          ? 'border-teal/70 bg-teal/[0.06] shadow-[0_0_32px_-14px_rgba(0,229,195,0.6)]'
          : 'border-white/10 bg-white/[0.02] hover:border-teal/35',
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="block w-full p-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-light tracking-[0.15em] text-text-primary uppercase">{tier.name}</h3>
            <p className="mt-0.5 text-xs text-text-secondary">{tier.tagline}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">Desde</p>
            <p className="font-mono text-base text-teal">{formatUsd(tier.fromPriceUsd)}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3 text-teal/80" />
            {tier.durationDays} días
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3 text-teal/80" />
            {tier.demoSeats} plazas (sim.)
          </span>
        </div>

        {selected && (
          <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
            {tier.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-xs text-text-primary/90">
                <Check className="size-3.5 shrink-0 text-teal" />
                {h}
              </li>
            ))}
          </ul>
        )}
      </button>

      <div className="flex justify-end px-4 pb-3">
        <Button variant="ghost" size="sm" onClick={onDetails} aria-label={`Ver detalles de ${tier.name}`}>
          Detalles
        </Button>
      </div>
    </article>
  )
}

