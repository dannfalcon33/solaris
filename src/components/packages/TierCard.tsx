import { Check, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { ExpeditionPackage } from '@/types'
import { formatUsd } from '@/utils/format'
import { cn } from '@/utils/cn'

interface TierCardProps {
  pkg: ExpeditionPackage
  selected: boolean
  onSelect: () => void
  onDetails: () => void
  onBook: () => void
}

/** Tarjeta de paquete comercial por destino (Explorer / Voyager / Infinity). Datos ficticios. */
export function TierCard({ pkg, selected, onSelect, onDetails, onBook }: TierCardProps) {
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
        className="block w-full p-4 pb-2.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
              {pkg.tierLabel}
            </span>
            <h3 className="truncate text-base font-medium tracking-wide text-text-primary">
              {pkg.name}
            </h3>
            <p className="mt-0.5 text-xs text-text-secondary">{pkg.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-warning">
              Demo · /pers.
            </p>
            <p className="font-mono text-base text-teal">{formatUsd(pkg.priceUsd)}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3 text-teal/80" />
            {pkg.durationDays} días (sim.)
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3 text-teal/80" />
            {pkg.availableSeats} plazas (sim.)
          </span>
        </div>

        {selected && (
          <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
            {pkg.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-xs text-text-primary/90">
                <Check className="mt-0.5 size-3.5 shrink-0 text-teal" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </button>

      <div className="flex items-center justify-end gap-2 px-4 pb-3 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDetails}
          aria-label={`Ver detalles de ${pkg.name}`}
        >
          Detalles
        </Button>
        {selected && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBook}
            aria-label={`Reservar ${pkg.name}`}
          >
            Reservar
          </Button>
        )}
      </div>
    </article>
  )
}
