import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { useNavigationStore } from '@/stores/navigation.store'
import { cn } from '@/utils/cn'

const MIN_MS = 1800
const EXIT_MS = 800

const STATUS = [
  'Calibrando instrumentos',
  'Sincronizando órbitas',
  'Cargando cartografía estelar',
  'Preparando lanzamiento',
]

/** Pantalla de carga: se mantiene un tiempo mínimo para evitar parpadeos. */
export function LoadingScreen() {
  const isLoading = useNavigationStore((s) => s.state === 'loading')
  const assetProgress = useProgress((p) => p.progress)
  const [elapsed, setElapsed] = useState(0)
  const [gone, setGone] = useState(false)

  const done = !isLoading && elapsed >= MIN_MS

  useEffect(() => {
    if (done) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      setElapsed(now - start)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [done])

  useEffect(() => {
    if (!done) return
    const id = window.setTimeout(() => setGone(true), EXIT_MS)
    return () => window.clearTimeout(id)
  }, [done])

  if (gone) return null

  const timed = Math.min(92, (elapsed / MIN_MS) * 92)
  const progress = done ? 100 : Math.max(assetProgress, timed)
  const statusIndex = Math.min(STATUS.length - 1, Math.floor((progress / 100) * STATUS.length))

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando SOLARIS"
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg px-6 transition-opacity duration-700',
        done && 'pointer-events-none opacity-0',
      )}
    >
      <div className="relative mb-10 size-28">
        <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,229,195,0.18)" strokeWidth="1" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#00E5C3"
            strokeWidth="1.5"
            strokeDasharray="60 230"
            strokeLinecap="round"
          />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden="true">
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(53,221,242,0.35)" strokeWidth="1" />
          <circle cx="50" cy="50" r="6" fill="#00E5C3" className="animate-pulse-dot" />
        </svg>
      </div>

      <p className="text-2xl font-semibold tracking-[0.5em] text-text-primary">SOLARIS</p>
      <p className="mt-2 font-mono text-[10px] tracking-[0.6em] text-teal">INTERPLANETARY</p>

      <div className="mt-12 w-64 max-w-full">
        <div className="relative h-px w-full overflow-hidden bg-white/10">
          <div className="h-full bg-teal transition-[width] duration-200" style={{ width: `${progress}%` }} />
          <div className="absolute inset-y-0 left-0 w-1/3 animate-scan bg-linear-to-r from-transparent via-cyan/60 to-transparent" />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
          <span>{STATUS[statusIndex]}</span>
          <span className="text-text-primary">{String(Math.round(progress)).padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  )
}
