import { useState } from 'react'
import { Globe2, Menu, Rocket, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslations } from '@/i18n/translations'
import { useNavigationStore } from '@/stores/navigation.store'
import { useUiStore, type Locale } from '@/stores/ui.store'
import { cn } from '@/utils/cn'
import { Logo } from './Logo'

const LOCALES: ReadonlyArray<{ code: Locale; label: string; title: string }> = [
  { code: 'es', label: 'ES', title: 'Español' },
  { code: 'en', label: 'EN', title: 'English' },
  { code: 'pt', label: 'PT', title: 'Português (Brasil)' },
]

export function Header() {
  const { locale, t } = useTranslations()
  const state = useNavigationStore((s) => s.state)
  const isTransitioning = useNavigationStore((s) => s.isTransitioning)
  const enterSolarSystem = useNavigationStore((s) => s.enterSolarSystem)
  const returnToSolarSystem = useNavigationStore((s) => s.returnToSolarSystem)
  const returnToEarth = useNavigationStore((s) => s.returnToEarth)
  const setLocale = useUiStore((s) => s.setLocale)
  const openBooking = useUiStore((s) => s.openBooking)
  const selectedTier = useUiStore((s) => s.selectedTier)
  const setSheetOpen = useUiStore((s) => s.setSheetOpen)
  const [menuOpen, setMenuOpen] = useState(false)

  const inDetail = state === 'planet_detail' || state === 'station_detail'
  const locked = isTransitioning || state === 'loading'

  const items = [
    {
      id: 'home',
      label: t.header.home,
      active: state === 'earth_hero',
      disabled: locked || state === 'earth_hero',
      onClick: returnToEarth,
    },
    {
      id: 'system',
      label: t.header.solarSystem,
      active: state === 'solar_system',
      disabled: locked || state === 'solar_system',
      onClick: state === 'earth_hero' ? enterSolarSystem : returnToSolarSystem,
    },
    {
      id: 'packages',
      label: t.header.packages,
      active: inDetail,
      disabled: !inDetail,
      onClick: () => setSheetOpen(true),
    },
  ]

  const run = (fn: () => void) => () => {
    fn()
    setMenuOpen(false)
  }

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20">
      <div className="scrim-top absolute inset-x-0 top-0 h-28" aria-hidden="true" />
      <div className="relative mx-auto flex h-16 max-w-[1800px] items-center justify-between gap-4 px-4 sm:h-20 sm:px-8">
        <Logo className="pointer-events-auto" />

        <nav aria-label={t.header.navAria} className="pointer-events-auto hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              disabled={item.disabled}
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'relative px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition focus-visible:outline-2 focus-visible:outline-cyan',
                item.active ? 'text-teal' : 'text-text-secondary hover:text-text-primary',
                'disabled:cursor-default',
                !item.active && 'disabled:opacity-35 disabled:hover:text-text-secondary',
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-4 -bottom-0.5 h-px bg-teal transition-opacity',
                  item.active ? 'opacity-100' : 'opacity-0',
                )}
              />
            </button>
          ))}
        </nav>

        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Selector de idioma ES / EN / PT-BR */}
          <div
            role="group"
            aria-label={t.header.langAria}
            className="flex items-center border border-teal/30 bg-surface/80 px-1 py-0.5"
          >
            <Globe2 className="mx-1.5 hidden size-3.5 text-teal/80 sm:block" aria-hidden="true" />
            {LOCALES.map((lang) => {
              const active = locale === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  title={lang.title}
                  aria-pressed={active}
                  onClick={() => setLocale(lang.code)}
                  className={cn(
                    'px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] transition focus-visible:outline-2 focus-visible:outline-cyan',
                    active
                      ? 'bg-teal text-bg'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {lang.label}
                </button>
              )
            })}
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<Rocket className="size-4" />}
            disabled={!inDetail}
            title={inDetail ? undefined : t.header.bookDisabledHint}
            onClick={() => openBooking(selectedTier, 'form')}
            className="hidden sm:inline-flex"
          >
            {t.header.bookCta}
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
            className="p-2 text-text-primary transition hover:text-teal focus-visible:outline-2 focus-visible:outline-cyan md:hidden"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label={t.header.mobileNavAria}
          className="hud-panel pointer-events-auto mx-4 flex animate-fade-up flex-col p-2 md:hidden"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              aria-current={item.active ? 'page' : undefined}
              onClick={run(item.onClick)}
              className={cn(
                'px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] transition focus-visible:outline-2 focus-visible:outline-cyan',
                item.active ? 'text-teal' : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                'disabled:cursor-default',
                !item.active && 'disabled:opacity-35 disabled:hover:bg-transparent',
              )}
            >
              {item.label}
            </button>
          ))}
          <Button
            variant="primary"
            className="m-2 sm:hidden"
            icon={<Rocket className="size-4" />}
            disabled={!inDetail}
            onClick={run(() => openBooking(selectedTier, 'form'))}
          >
            {t.header.bookCta}
          </Button>
        </nav>
      )}
    </header>
  )
}
