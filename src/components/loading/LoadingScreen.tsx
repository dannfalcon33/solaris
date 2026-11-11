import { useProgress } from '@react-three/drei'
import { useNavigationStore } from '@/stores/navigation.store'

/** Pantalla de carga básica (la versión futurista llega en la FASE 1). */
export function LoadingScreen() {
  const isLoading = useNavigationStore((s) => s.state === 'loading')
  const progress = useProgress((p) => p.progress)

  if (!isLoading) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-bg"
    >
      <p className="font-mono text-sm tracking-[0.4em] text-teal">SOLARIS</p>
      <p className="text-xs tracking-[0.3em] text-text-secondary">INICIALIZANDO SISTEMA</p>
      <div className="h-px w-48 overflow-hidden bg-surface">
        <div
          className="h-full bg-teal transition-[width] duration-300"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>
    </div>
  )
}

