import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DataReadout } from '@/components/ui/DataReadout'
import { Fade } from '@/components/ui/Fade'
import { Badge } from '@/components/ui/Badge'
import { useNavigationStore } from '@/stores/navigation.store'

/** Hero sobre la Tierra: titular, CTA y telemetría orbital decorativa. */
export function HeroOverlay() {
  const state = useNavigationStore((s) => s.state)
  const enterSolarSystem = useNavigationStore((s) => s.enterSolarSystem)
  const visible = state === 'earth_hero'

  return (
    <Fade
      show={visible}
      from="left"
      className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-8 sm:pb-14 lg:pb-20"
    >
      <div className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-3/4 sm:h-full" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-[1800px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <Badge tone="teal" className="mb-5">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-teal" aria-hidden="true" />
            Expediciones espaciales · demo
          </Badge>
          <h1 className="text-4xl font-extralight leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
            El sistema solar
            <br />
            <span className="text-teal">te está esperando</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
            Despega desde la Tierra, recorre el sistema solar y reserva una expedición a Mercurio,
            Venus, Marte, Júpiter o Saturno. Experiencia ficticia de demostración.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={enterSolarSystem}
              icon={<ArrowRight className="order-last size-5" />}
            >
              Explore solar system
            </Button>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary">
              6 destinos · 5 mundos
            </span>
          </div>
        </div>

        <dl
          aria-label="Telemetría orbital simulada"
          className="hud-panel hidden w-full max-w-md grid-cols-3 gap-5 p-5 sm:grid lg:mb-1"
        >
          <DataReadout label="Altitud" value="408" unit="km" ratio={0.35} />
          <DataReadout label="Velocidad" value="7,66" unit="km/s" ratio={0.7} />
          <DataReadout label="Órbita" value="92,7" unit="min" ratio={0.5} />
          <p className="col-span-3 font-mono text-[9px] uppercase tracking-[0.25em] text-text-secondary/70">
            Telemetría de referencia · simulada
          </p>
        </dl>
      </div>
    </Fade>
  )
}

