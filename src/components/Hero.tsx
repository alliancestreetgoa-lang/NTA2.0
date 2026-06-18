import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { hero } from '../config/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import HeroCanvas from './HeroCanvas'

/**
 * Full-screen hero.
 * Primary layer: looped/muted stock video with a navy gradient overlay.
 * Fallback layer (animated canvas) shows when video errors, on small screens,
 * or under prefers-reduced-motion (rendered as a single static frame).
 */
export default function Hero() {
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoOk, setVideoOk] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Use video only when allowed; otherwise the canvas carries the hero.
  const useVideo = !reduced && !isMobile

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0a1622] text-white"
    >
      {/* Background media */}
      <div className="absolute inset-0">
        {/* Canvas always present as base layer / fallback */}
        <HeroCanvas animate={!reduced} />

        {useVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoOk ? 'opacity-100' : 'opacity-0'
            }`}
            src={hero.videoSrc}
            poster={hero.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setVideoOk(true)}
            onError={() => setVideoOk(false)}
            aria-hidden="true"
          />
        )}

        {/* Gradient overlays — opaque behind text (left), clear over the globe (right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1622] from-15% via-[#0a1622]/45 via-45% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1622]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-x relative z-10 py-28">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6 animate-fade-up">Global Commodity Trading</p>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            <span className="text-white">Powering Global Trade Through </span>
            <span className="text-[#d4af37]">Energy &amp; Agricultural Commodities</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#c3cdd8] sm:text-lg">
            {hero.subhead}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={hero.primaryCta.href} className="btn-gold group">
              {hero.primaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href={hero.secondaryCta.href} className="btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/50 transition-colors hover:text-[#d4af37]"
      >
        <ChevronDown className={`h-6 w-6 ${reduced ? '' : 'animate-cue'}`} />
      </a>
    </section>
  )
}
