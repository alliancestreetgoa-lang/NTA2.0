import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { hero } from '../config/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import HeroCanvas from './HeroCanvas'

const TICKER = [
  'UREA', 'DAP', 'NPK', 'POTASH (MOP)', 'AMMONIA', 'LNG', 'NATURAL GAS', 'GASOIL',
  'JET A-1', 'NAPHTHA', 'BRENT', 'WTI', 'METHANOL', 'POLYETHYLENE', 'WHEAT', 'SOYBEANS',
]

/**
 * Full-bleed cinematic hero: the 3D night-earth globe fills the screen, a mono
 * kicker sits top-left, the headline is pinned low-left, and a scrolling mono
 * commodity ticker runs across the very bottom.
 */
export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0a0a0b] text-white"
    >
      {/* Full-bleed globe */}
      <div className="absolute inset-0">
        <HeroCanvas animate={!reduced} />
        {/* Legibility overlays: darker at the bottom (headline) and left */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/15 to-[#0a0a0b]/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/75 via-transparent to-transparent" />
      </div>

      {/* Top-left kicker */}
      <div className="container-x pointer-events-none relative z-10 pt-28">
        <p className="eyebrow">/ EST. 2014 — UAE — GLOBAL COMMODITY TRADING</p>
      </div>

      <div className="flex-1" />

      {/* Headline pinned low-left */}
      <div className="container-x pointer-events-none relative z-10 pb-9 [&_a]:pointer-events-auto">
        <h1 className="font-display max-w-4xl text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
          <span className="text-white">Powering Global Trade Through </span>
          <span className="text-[#ff5a1f]">Energy &amp; Agri Commodities</span>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#cfc9bd] sm:text-base">
          {hero.subhead}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link to={hero.primaryCta.href} className="btn-gold group">
            {hero.primaryCta.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a href={hero.secondaryCta.href} className="btn-ghost">
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>

      {/* Bottom ticker bar */}
      <div
        className="relative z-10 overflow-hidden border-t border-white/10 bg-[#0a0a0b]/85 backdrop-blur"
        aria-hidden="true"
      >
        <div className="nta-marquee py-3">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span
              key={i}
              className="mx-5 inline-flex items-center gap-2 font-mono text-xs tracking-[0.05em] text-white/70"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              <span className="text-[#ff5a1f]">◆</span>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
