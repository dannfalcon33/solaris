import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FadeProps {
  show: boolean
  children: ReactNode
  className?: string
  /** Dirección de entrada. */
  from?: 'bottom' | 'top' | 'left' | 'right' | 'none'
}

const hidden: Record<NonNullable<FadeProps['from']>, string> = {
  bottom: 'translate-y-4',
  top: '-translate-y-4',
  left: '-translate-x-6',
  right: 'translate-x-6',
  none: '',
}

/**
 * Muestra/oculta con transición sin desmontar. Cuando está oculto el contenido
 * es `inert` (no enfocable ni leído por lectores de pantalla).
 */
export function Fade({ show, children, className, from = 'bottom' }: FadeProps) {
  return (
    <div
      inert={!show}
      aria-hidden={!show}
      className={cn(
        'transition-[opacity,transform] duration-500 ease-out',
        show ? 'translate-x-0 translate-y-0 opacity-100' : cn('pointer-events-none opacity-0', hidden[from]),
        className,
      )}
    >
      {children}
    </div>
  )
}

