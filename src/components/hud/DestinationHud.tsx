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
import { useTranslations, type UiTranslations } from '@/i18n/translations'
import { useNavigationStore } from '@/stores/navigation.store'
import type { Locale } from '@/stores/ui.store'
import { formatDecimal, formatInt, formatOrbit, formatRotation } from '@/utils/format'

const EARTH_G = 9.81

/** HUD izquierdo: datos del destino seleccionado. */
export function DestinationHud() {
  const { locale, t } = useTranslations()
  const state = useNavigationStore((s) => s.state)
  const id = useNavigationStore((s) => s.selectedDestinationId)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const returnToSolarSystem = useNavigationStore((s) => s.returnToSolarSystem)
  const returnToEarth = useNavigationStore((s) => s.returnToEarth)

  const visible = state === 'planet_detail' || state === 'station_detail'
  const destination = id ? getDestination(id, locale) : null

  return (
    <Fade
      show={visible && destination !== null}
      from="left"
      className="absolute inset-x-4 top-20 z-10 sm:top-24 lg:inset-x-auto lg:left-8 lg:w-80"
    >
      {destination && (
        <HudContent
          destination={destination}
          locale={locale}
          t={t.hud}
          disabled={isTransitioning}
          onBack={returnToSolarSystem}
          onHome={returnToEarth}
        />
      )}
    </Fade>
  )
}

function HudContent({
  destination,
  locale,
  t,
  disabled,
  onBack,
  onHome,
}: {
  destination: ReturnType<typeof getDestination>
  locale: Locale
  t: UiTranslations['hud']
  disabled: boolean
  onBack: () => void
  onHome: () => void
}) {
  const { science: s } = destination
  const rotation = formatRotation(s.rotationPeriodHours, locale)
  const orbit = formatOrbit(s.orbitalPeriodDays, locale)
  const isStation = destination.kind === 'station'

  return (
    <section aria-label={`${t.sectionAriaPrefix} ${destination.name}`} className="hud-panel p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="teal">
          {isStation ? <Satellite className="size-3" /> : <Globe className="size-3" />}
          {isStation ? t.orbitalStation : t.planetaryExpedition}
        </Badge>
        {destination.isFictional && <Badge tone="warning">{t.fictionalFacilityBadge}</Badge>}
      </div>

      <h2 className="text-3xl font-extralight tracking-wide text-text-primary">{destination.bodyName}</h2>
      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">
        {destination.experienceName}
      </p>
      <p className="mt-3 hidden text-sm leading-relaxed text-text-secondary sm:block">{destination.tagline}</p>

      <div className="mt-3 border border-teal/20 bg-white/[0.02] p-2.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-warning">
          {t.orbitalFacilityHeader}
        </p>
        <p className="mt-0.5 text-xs font-medium text-text-primary">{destination.facility.facilityName}</p>
        <p className="mt-0.5 font-mono text-[10px] text-text-secondary">{destination.facility.orbitProfile}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 font-mono text-[9px] uppercase tracking-[0.25em] text-text-secondary">
        <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
        {t.realAstroDataHeader}
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-4 lg:grid-cols-2">
        <DataReadout
          icon={<Ruler />}
          label={t.diameter}
          value={formatInt(s.diameterKm, locale)}
          unit="km"
          ratio={s.diameterKm / 139820}
        />
        <DataReadout
          icon={<Sun />}
          label={t.distFromSun}
          value={formatDecimal(s.distanceFromSunMkm, locale)}
          unit="M km"
          ratio={s.distanceFromSunMkm / 1434}
        />
        <DataReadout
          icon={<Gauge />}
          label={t.gravity}
          value={formatDecimal(s.gravityMs2, locale)}
          unit="m/s²"
          ratio={s.gravityMs2 / (EARTH_G * 2.6)}
        />
        <DataReadout
          icon={<Timer />}
          label={t.day}
          value={rotation.value}
          unit={rotation.unit}
          note={rotation.retrograde ? t.retrograde : undefined}
          className="hidden lg:flex"
        />
        <DataReadout icon={<Orbit />} label={t.year} value={orbit.value} unit={orbit.unit} className="hidden lg:flex" />
        <DataReadout
          icon={<Thermometer />}
          label={t.meanTemp}
          value={formatInt(s.meanTemperatureC, locale)}
          unit="°C"
          className="hidden lg:flex"
        />
      </dl>

      <div className="mt-5 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="size-4" />}
          onClick={onBack}
          disabled={disabled}
          className="w-full"
        >
          {t.backToSolarSystem}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<Globe className="size-3.5" />}
          onClick={onHome}
          disabled={disabled}
          className="w-full"
        >
          {t.backToEarth}
        </Button>
      </div>
    </section>
  )
}
