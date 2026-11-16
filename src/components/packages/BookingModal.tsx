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
import { useNavigationStore } from '@/stores/navigation.store'
import { useUiStore, type BookingStep } from '@/stores/ui.store'
import type { Destination, ExpeditionPackage, PackageTier } from '@/types'
import { formatUsd } from '@/utils/format'
import { cn } from '@/utils/cn'

const DEPARTURES = [
  'Ventana Alfa · Marzo 2031',
  'Ventana Beta · Junio 2031',
  'Ventana Gamma · Septiembre 2031',
  'Ventana Delta · Diciembre 2031',
]

const field =
  'h-11 w-full border border-white/15 bg-bg/60 px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/50 focus:border-teal focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-cyan/50'

export function BookingModal() {
  const booking = useUiStore((s) => s.booking)
  const closeBooking = useUiStore((s) => s.closeBooking)
  const selectTier = useUiStore((s) => s.selectTier)
  const destinationId = useNavigationStore((s) => s.selectedDestinationId)

  if (!booking || !destinationId) return null

  return (
    <BookingDialog
      key={`${destinationId}-${booking.tier}-${booking.step}`}
      destination={getDestination(destinationId)}
      initialTier={booking.tier}
      initialStep={booking.step}
      onSelectTier={selectTier}
      onClose={closeBooking}
    />
  )
}

function DemoNotice() {
  return (
    <div className="mb-5 flex items-start gap-3 border border-warning/30 bg-warning/[0.06] p-3 text-xs leading-relaxed text-warning">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p>
        <strong className="font-semibold uppercase tracking-[0.15em]">
          Catálogo y reserva de demostración.
        </strong>{' '}
        Precios, duraciones, fechas y disponibilidad son ficticios. No se procesa ningún pago real ni
        se almacena ningún dato personal.
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
  initialTier,
  initialStep,
  onSelectTier,
  onClose,
}: {
  destination: Destination
  initialTier: PackageTier
  initialStep: BookingStep
  onSelectTier: (tier: PackageTier) => void
  onClose: () => void
}) {
  const [step, setStep] = useState<BookingStep>(initialStep)
  const [activeTier, setActiveTier] = useState<PackageTier>(initialTier)
  const [passengerName, setPassengerName] = useState('')
  const [passengerEmail, setPassengerEmail] = useState('')
  const [departureWindow, setDepartureWindow] = useState(DEPARTURES[1]!)
  const [travelers, setTravelers] = useState(2)
  const [code, setCode] = useState('')

  const allPackages = getPackagesByDestination(destination.id)
  const pkg = getDestinationPackage(destination.id, activeTier)
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
      ? 'Pase de embarque simulado emitido'
      : step === 'compare'
        ? `Comparador · ${destination.name}`
        : `${pkg.tierLabel}: ${pkg.name}`

  const eyebrow =
    step === 'details'
      ? `${destination.name} · Detalles del paquete`
      : step === 'compare'
        ? 'Explorer vs Voyager vs Infinity'
        : step === 'form'
          ? 'Solicitud de reserva demostrativa'
          : 'Confirmación simulada'

  return (
    <Modal title={title} eyebrow={eyebrow} onClose={onClose}>
      {step !== 'done' && (
        <>
          <div
            role="tablist"
            aria-label="Secciones del catálogo"
            className="mb-4 flex border-b border-white/10"
          >
            {(
              [
                { id: 'details', label: 'Detalles' },
                { id: 'compare', label: 'Comparador (3)' },
                { id: 'form', label: 'Book Expedition' },
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
          <DemoNotice />
        </>
      )}

      {/* ============================================================ */}
      {/* VISTA 1: DETALLES DEL PAQUETE                                */}
      {/* ============================================================ */}
      {step === 'details' && (
        <div className="space-y-5">
          {/* Selector rápido de categoría dentro de detalles */}
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
                    {formatUsd(item.priceUsd)}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="teal">{destination.bodyName}</Badge>
            <Badge>{pkg.durationDays} días (ficticio)</Badge>
            <Badge tone="warning">{formatUsd(pkg.priceUsd)} / pers. · ficticio</Badge>
            <Badge>{pkg.availableSeats} plazas (sim.)</Badge>
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">{pkg.description}</p>

          <div className="grid gap-5 border-t border-white/10 pt-4 sm:grid-cols-2">
            <Row icon={<Home />} label="Alojamiento asignado">
              {pkg.lodging}
            </Row>
            <Row icon={<Satellite />} label="Instalación de destino (ficción)">
              <p className="font-medium">{destination.facility.facilityName}</p>
              <p className="mt-0.5 font-mono text-xs text-text-secondary">
                {destination.facility.orbitProfile}
              </p>
            </Row>
            <Row icon={<Sparkles />} label="Servicios incluidos">
              <ul className="space-y-1.5">
                {pkg.services.map((s) => (
                  <li key={s} className="flex gap-2 text-xs leading-relaxed">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-teal" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Row>
            <Row icon={<Clock />} label="Actividades de expedición">
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
              Comparar las 3 categorías
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Rocket className="size-3.5" />}
                onClick={() => setStep('form')}
              >
                Book expedition
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
                        {formatUsd(item.priceUsd)}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-warning">
                        Precio ficticio · {item.durationDays} días · {item.availableSeats} plazas
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-2.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                        Alojamiento
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-text-primary">
                        {item.lodging}
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-2.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                        Servicios clave
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
                        Actividades
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
                      Elegir {item.tierLabel}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setStep('details')}>
              Volver a detalles
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
              Paquete seleccionado para {destination.name}
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
                      {formatUsd(item.priceUsd)}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                Pasajero principal
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
                Correo de telemetría
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
                Viajeros (máx. {Math.min(6, pkg.availableSeats)})
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
                Ventana de lanzamiento (ficticia)
              </span>
              <select
                name="departure"
                value={departureWindow}
                onChange={(e) => setDepartureWindow(e.target.value)}
                className={field}
              >
                {DEPARTURES.map((d) => (
                  <option key={d} value={d} className="bg-surface">
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-start gap-3 text-xs leading-relaxed text-text-secondary">
            <input required type="checkbox" className="mt-0.5 size-4 accent-teal" />
            Entiendo que esta solicitud es una demostración interactiva de portafolio con precios y
            disponibilidad ficticios.
          </label>

          <div className="flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-white/[0.02] px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                Total estimado ({travelers} {travelers === 1 ? 'viajero' : 'viajeros'} ·{' '}
                {pkg.durationDays} días)
              </p>
              <p className="font-mono text-[10px] text-warning">
                Importe ficticio de demostración · sin cargo real
              </p>
            </div>
            <span className="font-mono text-xl text-teal">{formatUsd(total)}</span>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setStep('details')}>
              Ver detalles
            </Button>
            <Button variant="primary" type="submit" icon={<Rocket className="size-4" />}>
              Confirmar reserva simulada
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
                Expedición registrada (modo simulación)
              </p>
              <p className="mt-0.5 text-sm text-text-primary">
                Reserva demostrativa a nombre de{' '}
                <strong>{passengerName || 'Viajero SOLARIS'}</strong> ({passengerEmail || 'demo'})
              </p>
            </div>
          </div>

          <div className="border border-white/15 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-secondary">
                  Localizador de misión
                </p>
                <p className="mt-0.5 flex items-center gap-2 font-mono text-base tracking-[0.28em] text-teal">
                  <CalendarDays className="size-4" />
                  {code}
                </p>
              </div>
              <Badge tone="warning">Simulación · Sin valor comercial</Badge>
            </div>

            <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  Destino e instalación
                </dt>
                <dd className="mt-0.5 font-medium text-text-primary">{destination.name}</dd>
                <dd className="font-mono text-[11px] text-text-secondary">
                  {destination.facility.facilityName}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  Paquete y alojamiento
                </dt>
                <dd className="mt-0.5 font-medium text-text-primary">
                  {pkg.tierLabel} — {pkg.name}
                </dd>
                <dd className="text-[11px] text-text-secondary">{pkg.lodging}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  Ventana y duración ficticia
                </dt>
                <dd className="mt-0.5 text-text-primary">{departureWindow}</dd>
                <dd className="font-mono text-[11px] text-text-secondary">
                  {pkg.durationDays} días · {travelers}{' '}
                  {travelers === 1 ? 'pasajero' : 'pasajeros'}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  Importe total simulado
                </dt>
                <dd className="mt-0.5 font-mono text-base text-teal">{formatUsd(total)}</dd>
                <dd className="font-mono text-[10px] text-warning">
                  Demostración · sin cobro · sin datos almacenados
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setStep('compare')}>
              Ver otros paquetes
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Finalizar y volver a la órbita
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
