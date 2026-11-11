import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface DataReadoutProps {
  label: string
  value: string
  unit?: string
  icon?: ReactNode
  /** 0–1: barra de magnitud relativa (opcional). */
  ratio?: number
  note?: string
  className?: string
}

/** Indicador técnico: etiqueta, valor, unidad y barra opcional. */
export function DataReadout({ label, value, unit, icon, ratio, note, className }: DataReadoutProps) {
  return (
    <div className={cn('group flex flex-col gap-1.5', className)}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-text-secondary">
        {icon && <span className="text-teal/80 [&>svg]:size-3.5">{icon}</span>}
        {label}
      </div>
      <div className="flex items-baseline gap-1.5 font-mono">
        <span className="text-lg leading-none text-text-primary transition-colors group-hover:text-cyan">
          {value}
        </span>
        {unit && <span className="text-[11px] text-text-secondary">{unit}</span>}
        {note && <span className="text-[10px] text-warning">{note}</span>}
      </div>
      {ratio !== undefined && (
        <div className="h-px w-full bg-white/10" aria-hidden="true">
          <div
            className="h-px bg-teal transition-[width] duration-700"
            style={{ width: `${Math.max(2, Math.min(1, ratio) * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

