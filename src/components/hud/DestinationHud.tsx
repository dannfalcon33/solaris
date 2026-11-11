import {
  ArrowLeft,
  Gauge,
  Globe,
  Orbit,
  Ruler,
  Satellite,
  Sun,
  Thermometer,
  Timer,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataReadout } from '@/components/ui/DataReadout'
import { Fade } from '@/components/ui/Fade'
import { getDestination } from '@/data/destinations'
import { useNavigationStore } from '@/stores/navigation.store'
import { formatDecimal, formatInt, formatOrbit, formatRotation } from '@/utils/format'

const EARTH_G = 9.81

/** HUD izquierdo: datos del destino seleccionado. */
export function DestinationHud() {
  const state = useNavigationStore((s) => s.state)
  const id = useNavigationStore((s) => s.selectedDestinationId)
  const returnToSolarSystem = useNavigationStore((s) => s.returnToSolarSystem)

  const visible = state === 'planet_detail' || state === 'station_detail'
  const destination = id ? getDestination(id) : null

  return (
    <Fade
      show={visible && destination !== null}
      from="left"
      className="absolute inset-x-4 top-20 z-10 sm:top-24 lg:inset-x-auto lg:left-8 lg:w-80"
    >
      {destination && <HudContent destination={destination} onBack={returnToSolarSystem} />}
    </Fade>
  )
}

function HudContent({
  destination,
  onBack,
}: {
  destination: ReturnType<typeof getDestination>
  onBack: () => void
}) {
  const { science: s } = destination
  const rotation = formatRotation(s.rotationPeriodHours)
  const orbit = formatOrbit(s.orbitalPeriodDays)
  const isStation = destination.kind === 'station'

  return (
    <section aria-label={`Datos de ${destination.name}`} className="hud-panel p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="teal">
          {isStation ? <Satellite className="size-3" /> : <Globe className="size-3" />}
          {isStation ? 'Estación orbital' : 'Expedición planetaria'}
        </Badge>
        {destination.isFictional && <Badge tone="warning">Instalación ficticia</Badge>}
      </div>

      <h2 className="text-3xl font-extralight tracking-wide text-text-primary">{destination.bodyName}</h2>
      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">
        {destination.experienceName}
      </p>
      <p className="mt-3 hidden text-sm leading-relaxed text-text-secondary sm:block">{destination.tagline}</p>

      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 font-mono text-[9px] uppercase tracking-[0.25em] text-text-secondary">
        <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
        Datos astronómicos reales
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-4 lg:grid-cols-2">
        <DataReadout
          icon={<Ruler />}
          label="Diámetro"
          value={formatInt(s.diameterKm)}
          unit="km"
          ratio={s.diameterKm / 139820}
        />
        <DataReadout
          icon={<Sun />}
          label="Dist. al Sol"
          value={formatDecimal(s.distanceFromSunMkm)}
          unit="M km"
          ratio={s.distanceFromSunMkm / 1434}
        />
        <DataReadout
          icon={<Gauge />}
          label="Gravedad"
          value={formatDecimal(s.gravityMs2)}
          unit="m/s²"
          ratio={s.gravityMs2 / (EARTH_G * 2.6)}
        />
        <DataReadout
          icon={<Timer />}
          label="Día"
          value={rotation.value}
          unit={rotation.unit}
          note={rotation.retrograde ? 'retrógrado' : undefined}
          className="hidden lg:flex"
        />
        <DataReadout icon={<Orbit />} label="Año" value={orbit.value} unit={orbit.unit} className="hidden lg:flex" />
        <DataReadout
          icon={<Thermometer />}
          label="Temp. media"
          value={formatInt(s.meanTemperatureC)}
          unit="°C"
          className="hidden lg:flex"
        />
      </dl>

      <Button variant="outline" size="sm" icon={<ArrowLeft className="size-4" />} onClick={onBack} className="mt-5 w-full">
        Volver al sistema solar
      </Button>
    </section>
  )
}

