import { useEffect } from 'react'
import { Hero } from './components/Hero'
import { Countdown } from './components/Countdown'
import { NossaHistoria } from './components/NossaHistoria'
import { Local } from './components/Local'
import { Presentes } from './components/Presentes'
import { Rsvp } from './components/Rsvp'
import { Galeria } from './components/Galeria'
import { Starfield } from './components/Starfield'
import { Moon } from './components/Moon'
import { ConstellationDivider } from './components/ConstellationDivider'
import { content } from './content'
import { useScrollReveal } from './lib/useScrollReveal'

/** Deepens the sky as you scroll: 0 (dusk, hero) -> 1 (deep night, footer). */
function useNightfall() {
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      root.style.setProperty('--nightfall', p.toFixed(3))
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      root.style.removeProperty('--nightfall')
    }
  }, [])
}

export function HomePage() {
  useScrollReveal()
  useNightfall()
  return (
    <div className="ceu relative">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <Starfield />
        <Moon />
      </div>
      <main className="relative z-[1]">
        <Hero />
        <Countdown />
        <ConstellationDivider />
        <NossaHistoria />
        <ConstellationDivider />
        <Local />
        <ConstellationDivider />
        <Presentes />
        <ConstellationDivider />
        <Rsvp />
        <ConstellationDivider />
        <Galeria />
        <footer className="px-6 pb-12 pt-16 text-center">
          <p className="font-display text-4xl tracking-[0.2em] text-gold-light">
            {content.casal.noiva[0]} <span className="font-script text-gold">&amp;</span> {content.casal.noivo[0]}
          </p>
          <p className="mt-2 tracking-[0.35em] text-champagne/60">{content.dataLabel}</p>
        </footer>
      </main>
    </div>
  )
}
