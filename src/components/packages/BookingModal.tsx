import { useState, type FormEvent, type ReactNode } from 'react'
import { CalendarDays, Check, Clock, Home, Info, Sparkles, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { getDestination } from '@/data/destinations'
import { getTier } from '@/data/tiers'
import { useNavigationStore } from '@/stores/navigation.store'
import { useUiStore, type BookingStep } from '@/stores/ui.store'
import type { Destination, TierDefinition } from '@/types'
import { formatUsd } from '@/utils/format'

const DEPARTURES = ['Marzo 2031', 'Junio 2031', 'Septiembre 2031', 'Diciembre 2031']

const field =
  'h-11 w-full border border-white/15 bg-bg/60 px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/50 focus:border-teal focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-cyan/50'

export function BookingModal() {
  const booking = useUiStore((s) => s.booking)
  const closeBooking = useUiStore((s) => s.closeBooking)
  const destinationId = useNavigationStore((s) => s.selectedDestinationId)

  if (!booking || !destinationId) return null

  return (
    <BookingDialog
      key={`${destinationId}-${booking.tier}-${booking.step}`}
      destination={getDestination(destinationId)}
      tier={getTier(booking.tier)}
      initialStep={booking.step}
      onClose={closeBooking}
    />
  )
}

function DemoNotice() {
  return (
    <div className="mb-5 flex items-start gap-3 border border-warning/30 bg-warning/[0.06] p-3 text-xs leading-relaxed text-warning">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p>
        <strong className="font-semibold uppercase tracking-[0.15em]">Reserva de demostración.</strong> Precios,
        fechas y disponibilidad son ficticios. No se procesa ningún pago ni se almacena ningún dato.
      </p>
    </div>
  )
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-teal [&>svg]:size-4">{icon}</span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">{label}</p>
        <div className="mt-1 text-sm text-text-primary">{children}</div>
      </div>
    </div>
  )
}

function BookingDialog({
  destination,
  tier,
  initialStep,
  onClose,
}: {
  destination: Destination
  tier: TierDefinition
  initialStep: BookingStep
  onClose: () => void
}) {
  const [step, setStep] = useState<BookingStep>(initialStep)
  const [code, setCode] = useState('')
  const [travelers, setTravelers] = useState(2)

  const total = tier.fromPriceUsd * travelers

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCode(`SLR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
    setStep('done')
  }

  const title =
    step === 'done' ? 'Reserva simulada confirmada' : `${tier.name} · ${destination.experienceName}`
  const eyebrow =
    step === 'details' ? 'Detalles del paquete' : step === 'form' ? 'Reserva demostrativa' : 'Confirmación'

  return (
    <Modal title={title} eyebrow={eyebrow} onClose={onClose}>
      {step !== 'done' && <DemoNotice />}

      {step === 'details' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="teal">{destination.bodyName}</Badge>
            <Badge>{tier.durationDays} días</Badge>
            <Badge tone="warning">Desde {formatUsd(tier.fromPriceUsd)} · ficticio</Badge>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">{destination.description}</p>

          <div className="grid gap-5 sm:grid-cols-2">
            <Row icon={<Home />} label="Alojamiento">
              {tier.lodging}
            </Row>
            <Row icon={<Users />} label="Disponibilidad simulada">
              {tier.demoSeats} plazas
            </Row>
            <Row icon={<Sparkles />} label="Servicios">
              <ul className="space-y-1">
                {tier.services.map((s) => (
                  <li key={s} className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-teal" />
                    {s}
                  </li>
                ))}
              </ul>
            </Row>
            <Row icon={<Clock />} label="Actividades">
              <ul className="space-y-1">
                {tier.activities.map((a) => (
                  <li key={a} className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-teal" />
                    {a}
                  </li>
                ))}
              </ul>
            </Row>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => setStep('form')}>
              Continuar reserva
            </Button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                Nombre completo
              </span>
              <input required name="name" autoComplete="name" placeholder="Ada Lovelace" className={field} />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                Correo electrónico
              </span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="ada@ejemplo.com"
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                Viajeros
              </span>
              <input
                required
                type="number"
                name="travelers"
                min={1}
                max={6}
                value={travelers}
                onChange={(e) => setTravelers(Math.min(6, Math.max(1, Number(e.target.value) || 1)))}
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                Ventana de salida
              </span>
              <select name="departure" defaultValue={DEPARTURES[1]} className={field}>
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
            Entiendo que esta es una reserva de demostración con datos ficticios.
          </label>

          <div className="flex items-center justify-between border border-white/10 bg-white/[0.02] px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
              Total estimado (ficticio)
            </span>
            <span className="font-mono text-lg text-teal">{formatUsd(total)}</span>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setStep('details')}>
              Ver detalles
            </Button>
            <Button variant="primary" type="submit">
              Confirmar reserva
            </Button>
          </div>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-teal/60 text-teal">
            <Check className="size-7" />
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            Tu expedición <strong className="text-text-primary">{tier.name}</strong> a{' '}
            <strong className="text-text-primary">{destination.name}</strong> ha sido registrada de forma
            simulada.
          </p>
          <div className="mx-auto inline-flex items-center gap-3 border border-teal/30 px-5 py-3">
            <CalendarDays className="size-4 text-teal" />
            <span className="font-mono text-sm tracking-[0.3em] text-text-primary">{code}</span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warning">
            Demostración · sin cobro · sin datos almacenados
          </p>
          <Button variant="primary" onClick={onClose} className="mx-auto">
            Cerrar
          </Button>
        </div>
      )}
    </Modal>
  )
}

