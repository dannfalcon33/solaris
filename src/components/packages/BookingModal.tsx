import { useState, type FormEvent, type ReactNode } from 'react'
import {
  CalendarDays,
  Check,
  Clock,
  Columns3,
  Home,
  Info,
  Rocket,
  Satellite,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { getDestination } from '@/data/destinations'
import { getDestinationPackage, getPackagesByDestination } from '@/data/packages'
import { useTranslations, type UiTranslations } from '@/i18n/translations'
import { useNavigationStore } from '@/stores/navigation.store'
import { useUiStore, type BookingStep, type Locale } from '@/stores/ui.store'
import type { Destination, ExpeditionPackage, PackageTier } from '@/types'
import { formatUsd } from '@/utils/format'
import { cn } from '@/utils/cn'

const field =
  'h-11 w-full border border-white/15 bg-bg/60 px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/50 focus:border-teal focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-cyan/50'

export function BookingModal() {
  const { locale, t } = useTranslations()
  const booking = useUiStore((s) => s.booking)
  const closeBooking = useUiStore((s) => s.closeBooking)
  const selectTier = useUiStore((s) => s.selectTier)
  const destinationId = useNavigationStore((s) => s.selectedDestinationId)

  if (!booking || !destinationId) return null

  return (
    <BookingDialog
      key={`${destinationId}-${booking.tier}-${booking.step}-${locale}`}
      destination={getDestination(destinationId, locale)}
      locale={locale}
      t={t.modal}
      initialTier={booking.tier}
      initialStep={booking.step}
      onSelectTier={selectTier}
      onClose={closeBooking}
    />
  )
}

function DemoNotice({ t }: { t: UiTranslations['modal'] }) {
  return (
    <div className="mb-5 flex items-start gap-3 border border-warning/30 bg-warning/[0.06] p-3 text-xs leading-relaxed text-warning">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p>
        <strong className="font-semibold uppercase tracking-[0.15em]">
          {t.demoNoticeStrong}
        </strong>{' '}
        {t.demoNoticeBody}
      </p>
    </div>
  )
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-teal [&>svg]:size-4">{icon}</span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
          {label}
        </p>
        <div className="mt-1 text-sm text-text-primary">{children}</div>
      </div>
    </div>
  )
}

function BookingDialog({
  destination,
  locale,
  t,
  initialTier,
  initialStep,
  onSelectTier,
  onClose,
}: {
  destination: Destination
  locale: Locale
  t: UiTranslations['modal']
  initialTier: PackageTier
  initialStep: BookingStep
  onSelectTier: (tier: PackageTier) => void
  onClose: () => void
}) {
  const [step, setStep] = useState<BookingStep>(initialStep)
  const [activeTier, setActiveTier] = useState<PackageTier>(initialTier)
  const [passengerName, setPassengerName] = useState('')
  const [passengerEmail, setPassengerEmail] = useState('')
  const [departureWindow, setDepartureWindow] = useState<string>(t.departures[1])
  const [travelers, setTravelers] = useState(2)
  const [code, setCode] = useState('')

  const allPackages = getPackagesByDestination(destination.id, locale)
  const pkg = getDestinationPackage(destination.id, activeTier, locale)
  const total = pkg.priceUsd * travelers

  const handleTierChange = (tier: PackageTier) => {
    setActiveTier(tier)
    onSelectTier(tier)
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const prefix = destination.bodyId.slice(0, 3).toUpperCase()
    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase()
    setCode(`SLR-${prefix}-${randomPart}`)
    setStep('done')
  }

  const title =
    step === 'done'
      ? t.titleDone
      : step === 'compare'
        ? `${t.titleComparePrefix} · ${destination.name}`
        : `${pkg.tierLabel}: ${pkg.name}`

  const eyebrow =
    step === 'details'
      ? `${destination.name} · ${t.eyebrowDetailsSuffix}`
      : step === 'compare'
        ? t.eyebrowCompare
        : step === 'form'
          ? t.eyebrowForm
          : t.eyebrowDone

  return (
    <Modal title={title} eyebrow={eyebrow} closeLabel={t.closeAria} onClose={onClose}>
      {step !== 'done' && (
        <>
          <div
            role="tablist"
            aria-label={t.tabsAria}
            className="mb-4 flex border-b border-white/10"
          >
            {(
              [
                { id: 'details', label: t.tabDetails },
                { id: 'compare', label: t.tabCompare },
                { id: 'form', label: t.tabBook },
              ] as const
            ).map((tab) => {
              const active = step === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStep(tab.id)}
                  className={cn(
                    'relative px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] transition focus-visible:outline-2 focus-visible:outline-cyan',
                    active ? 'text-teal' : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {tab.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-teal"
                    />
                  )}
                </button>
              )
            })}
          </div>
          <DemoNotice t={t} />
        </>
      )}

      {/* ============================================================ */}
      {/* VISTA 1: DETALLES DEL PAQUETE                                */}
      {/* ============================================================ */}
      {step === 'details' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {allPackages.map((item) => {
              const isSelected = item.tier === activeTier
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTierChange(item.tier)}
                  className={cn(
                    'border p-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-cyan',
                    isSelected
                      ? 'border-teal bg-teal/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-teal/40',
                  )}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal">
                    {item.tierLabel}
                  </p>
                  <p className="truncate text-xs font-medium text-text-primary">{item.name}</p>
                  <p className="mt-1 font-mono text-xs text-text-secondary">
                    {formatUsd(item.priceUsd, locale)}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="teal">{destination.bodyName}</Badge>
            <Badge>
              {pkg.durationDays} {t.daysFictional}
            </Badge>
            <Badge tone="warning">
              {formatUsd(pkg.priceUsd, locale)} {t.perPersonFictional}
            </Badge>
            <Badge>
              {pkg.availableSeats} {t.seatsSim}
            </Badge>
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">{pkg.description}</p>

          <div className="grid gap-5 border-t border-white/10 pt-4 sm:grid-cols-2">
            <Row icon={<Home />} label={t.assignedLodging}>
              {pkg.lodging}
            </Row>
            <Row icon={<Satellite />} label={t.destinationFacility}>
              <p className="font-medium">{destination.facility.facilityName}</p>
              <p className="mt-0.5 font-mono text-xs text-text-secondary">
                {destination.facility.orbitProfile}
              </p>
            </Row>
            <Row icon={<Sparkles />} label={t.includedServices}>
              <ul className="space-y-1.5">
                {pkg.services.map((s) => (
                  <li key={s} className="flex gap-2 text-xs leading-relaxed">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-teal" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Row>
            <Row icon={<Clock />} label={t.expeditionActivities}>
              <ul className="space-y-1.5">
                {pkg.activities.map((a) => (
                  <li key={a} className="flex gap-2 text-xs leading-relaxed">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-teal" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </Row>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              icon={<Columns3 className="size-3.5" />}
              onClick={() => setStep('compare')}
            >
              {t.compare3CategoriesBtn}
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="ghost" size="sm" onClick={onClose}>
                {t.closeBtn}
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Rocket className="size-3.5" />}
                onClick={() => setStep('form')}
              >
                {t.bookCta}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 2: COMPARADOR DE PAQUETES DEL DESTINO                  */}
      {/* ============================================================ */}
      {step === 'compare' && (
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            {allPackages.map((item: ExpeditionPackage) => {
              const isSelected = item.tier === activeTier
              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex flex-col justify-between border p-4 transition',
                    isSelected
                      ? 'border-teal bg-teal/[0.06]'
                      : 'border-white/10 bg-white/[0.02]',
                  )}
                >
                  <div className="space-y-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
                        {item.tierLabel}
                      </span>
                      <h3 className="mt-0.5 text-base font-medium text-text-primary">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-mono text-lg text-teal">
                        {formatUsd(item.priceUsd, locale)}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-warning">
                        {t.priceFictionalLine(item.durationDays, item.availableSeats)}
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-2.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                        {t.lodgingHeader}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-text-primary">
                        {item.lodging}
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-2.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                        {t.keyServicesHeader}
                      </p>
                      <ul className="mt-1 space-y-1">
                        {item.services.map((s) => (
                          <li key={s} className="flex gap-1.5 text-[11px] text-text-secondary">
                            <Check className="mt-0.5 size-3 shrink-0 text-teal" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-white/10 pt-2.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                        {t.activitiesHeader}
                      </p>
                      <ul className="mt-1 space-y-1">
                        {item.activities.map((a) => (
                          <li key={a} className="flex gap-1.5 text-[11px] text-text-secondary">
                            <Check className="mt-0.5 size-3 shrink-0 text-teal" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-3">
                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        handleTierChange(item.tier)
                        setStep('form')
                      }}
                    >
                      {t.choosePrefix} {item.tierLabel}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setStep('details')}>
              {t.backToDetailsBtn}
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 3: FORMULARIO DEMOSTRATIVO DE RESERVA                  */}
      {/* ============================================================ */}
      {step === 'form' && (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
              {t.selectedPackageFor} {destination.name}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {allPackages.map((item) => {
                const isSelected = item.tier === activeTier
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTierChange(item.tier)}
                    className={cn(
                      'border p-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-cyan',
                      isSelected
                        ? 'border-teal bg-teal/12'
                        : 'border-white/10 bg-white/[0.02] hover:border-teal/40',
                    )}
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal">
                      {item.tierLabel}
                    </p>
                    <p className="truncate text-xs font-medium text-text-primary">{item.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-text-secondary">
                      {formatUsd(item.priceUsd, locale)}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                {t.mainPassenger}
              </span>
              <input
                required
                name="name"
                autoComplete="name"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="Ada Lovelace"
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                {t.telemetryEmail}
              </span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                value={passengerEmail}
                onChange={(e) => setPassengerEmail(e.target.value)}
                placeholder="ada@solaris.demo"
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                {t.travelersMax(Math.min(6, pkg.availableSeats))}
              </span>
              <input
                required
                type="number"
                name="travelers"
                min={1}
                max={Math.min(6, pkg.availableSeats)}
                value={travelers}
                onChange={(e) =>
                  setTravelers(
                    Math.min(
                      Math.min(6, pkg.availableSeats),
                      Math.max(1, Number(e.target.value) || 1),
                    ),
                  )
                }
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                {t.launchWindow}
              </span>
              <select
                name="departure"
                value={departureWindow}
                onChange={(e) => setDepartureWindow(e.target.value)}
                className={field}
              >
                {t.departures.map((d) => (
                  <option key={d} value={d} className="bg-surface">
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-start gap-3 text-xs leading-relaxed text-text-secondary">
            <input required type="checkbox" className="mt-0.5 size-4 accent-teal" />
            {t.consentText}
          </label>

          <div className="flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-white/[0.02] px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                {t.estimatedTotal(travelers, pkg.durationDays)}
              </p>
              <p className="font-mono text-[10px] text-warning">{t.fictionalAmountNote}</p>
            </div>
            <span className="font-mono text-xl text-teal">{formatUsd(total, locale)}</span>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setStep('details')}>
              {t.backToDetailsBtn}
            </Button>
            <Button variant="primary" type="submit" icon={<Rocket className="size-4" />}>
              {t.confirmSimulatedBtn}
            </Button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* VISTA 4: CONFIRMACIÓN VISUAL SIMULADA (PASE DE EMBARQUE)     */}
      {/* ============================================================ */}
      {step === 'done' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 border border-teal/40 bg-teal/[0.07] p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-teal text-teal">
              <Check className="size-6" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
                {t.registeredBadge}
              </p>
              <p className="mt-0.5 text-sm text-text-primary">
                {t.demoBookingFor} <strong>{passengerName || 'SOLARIS Traveler'}</strong> (
                {passengerEmail || 'demo'})
              </p>
            </div>
          </div>

          <div className="border border-white/15 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-secondary">
                  {t.missionLocator}
                </p>
                <p className="mt-0.5 flex items-center gap-2 font-mono text-base tracking-[0.28em] text-teal">
                  <CalendarDays className="size-4" />
                  {code}
                </p>
              </div>
              <Badge tone="warning">{t.simulationBadge}</Badge>
            </div>

            <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  {t.destAndFacility}
                </dt>
                <dd className="mt-0.5 font-medium text-text-primary">{destination.name}</dd>
                <dd className="font-mono text-[11px] text-text-secondary">
                  {destination.facility.facilityName}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  {t.packageAndLodging}
                </dt>
                <dd className="mt-0.5 font-medium text-text-primary">
                  {pkg.tierLabel} — {pkg.name}
                </dd>
                <dd className="text-[11px] text-text-secondary">{pkg.lodging}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  {t.windowAndDuration}
                </dt>
                <dd className="mt-0.5 text-text-primary">{departureWindow}</dd>
                <dd className="font-mono text-[11px] text-text-secondary">
                  {t.passengersCount(pkg.durationDays, travelers)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  {t.simulatedTotalAmount}
                </dt>
                <dd className="mt-0.5 font-mono text-base text-teal">{formatUsd(total, locale)}</dd>
                <dd className="font-mono text-[10px] text-warning">{t.demoNoChargeNote}</dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setStep('compare')}>
              {t.viewOtherPackagesBtn}
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              {t.finishAndReturnBtn}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
