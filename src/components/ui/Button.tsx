import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

const base =
  'pointer-events-auto inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-medium uppercase tracking-[0.18em] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0'

const variants: Record<Variant, string> = {
  primary:
    'bg-teal text-bg hover:bg-cyan hover:shadow-[0_0_28px_-6px_rgba(0,229,195,0.7)] disabled:hover:bg-teal disabled:hover:shadow-none',
  outline:
    'border border-teal/40 text-text-primary hover:border-teal hover:bg-teal/10 disabled:hover:border-teal/40 disabled:hover:bg-transparent',
  ghost:
    'text-text-secondary hover:bg-white/5 hover:text-text-primary disabled:hover:bg-transparent disabled:hover:text-text-secondary',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-[11px]',
  md: 'h-11 px-5 text-xs',
  lg: 'h-14 px-8 text-sm',
}

export function Button({
  variant = 'outline',
  size = 'md',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
    </button>
  )
}

