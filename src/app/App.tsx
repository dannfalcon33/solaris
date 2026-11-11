import { SceneCanvas } from '@/engine/canvas/SceneCanvas'
import { Header } from '@/components/layout/Header'
import { HeroOverlay } from '@/components/layout/HeroOverlay'
import { DestinationHud } from '@/components/hud/DestinationHud'
import { DestinationBar } from '@/components/destinations/DestinationBar'
import { CommercialPanel } from '@/components/packages/CommercialPanel'
import { BookingModal } from '@/components/packages/BookingModal'
import { LoadingScreen } from '@/components/loading/LoadingScreen'
import { usePlaceholderTransition } from '@/hooks/usePlaceholderTransition'

/**
 * Raíz de la aplicación: capa 3D (canvas) y capa HTML (UI) desacopladas.
 * La UI se superpone al canvas con CSS; comparten solo el store de navegación.
 * `main` no captura el puntero: solo los controles lo hacen, de modo que la
 * selección directa de planetas (FASE 3) siga llegando al canvas.
 */
export default function App() {
  usePlaceholderTransition()

  return (
    <>
      <SceneCanvas />
      <main className="pointer-events-none fixed inset-0 z-10 overflow-hidden [&_button]:pointer-events-auto [&_nav]:pointer-events-auto [&_section]:pointer-events-auto">
        <Header />
        <HeroOverlay />
        <DestinationHud />
        <CommercialPanel />
        <DestinationBar />
      </main>
      <BookingModal />
      <LoadingScreen />
    </>
  )
}
