import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'teal' | 'warning' | 'muted'

const tones: Record<Tone, string> = {
  teal: 'border-teal/40 text-teal',
  warning: 'border-warning/50 text-warning',
  muted: 'border-white/15 text-text-secondary',
}

/** Etiqueta compacta (p. ej. FICTICIO, DATOS REALES, STATION). */
export function Badge({
  tone = 'muted',
  children,
  className,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

