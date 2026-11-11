import { cn } from '@/utils/cn'

/** Logotipo SOLARIS INTERPLANETARY (SVG + texto, sin dependencias). */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <circle cx="16" cy="16" r="11" fill="none" stroke="#00E5C3" strokeWidth="1.5" />
        <ellipse
          cx="16"
          cy="16"
          rx="15"
          ry="5"
          fill="none"
          stroke="#35DDF2"
          strokeWidth="1"
          transform="rotate(-24 16 16)"
          opacity="0.8"
        />
        <circle cx="16" cy="16" r="3.2" fill="#00E5C3" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-[0.42em] text-text-primary">SOLARIS</span>
        <span className="mt-1 font-mono text-[9px] tracking-[0.5em] text-teal">INTERPLANETARY</span>
      </div>
    </div>
  )
}

