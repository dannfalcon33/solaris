import { SceneCanvas } from '@/engine/canvas/SceneCanvas'
import { LoadingScreen } from '@/components/loading/LoadingScreen'
import { StateDebugPanel } from '@/components/navigation/StateDebugPanel'
import { usePlaceholderTransition } from '@/hooks/usePlaceholderTransition'

/**
 * Raíz de la aplicación: capa 3D (canvas) y capa HTML (UI) desacopladas.
 * La UI se superpone al canvas con CSS; comparten solo el store de navegación.
 */
export default function App() {
  usePlaceholderTransition()

  return (
    <>
      <SceneCanvas />
      <main className="pointer-events-none relative z-10 min-h-svh">
        <h1 className="sr-only">SOLARIS INTERPLANETARY</h1>
        <StateDebugPanel />
      </main>
      <LoadingScreen />
    </>
  )
}

