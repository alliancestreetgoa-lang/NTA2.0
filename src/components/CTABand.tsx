import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'

interface Props {
  title?: string
  subtitle?: string
  ctaLabel?: string
  /** Anchor (e.g. "/#contact") or route. */
  to?: string
}

/** Bold solid-orange climax band (Industrial Terminal identity). */
export default function CTABand({
  title = "Let's trade.",
  subtitle = 'Connect with our team to explore sourcing, supply, and offtake opportunities across our six trading verticals.',
  ctaLabel = 'Contact our trading team',
  to = '/#contact',
}: Props) {
  return (
    <section className="bg-[#ff5a1f]">
      <div className="container-x py-20 text-center sm:py-24">
        <Reveal className="flex flex-col items-center">
          <h2 className="font-display mx-auto max-w-3xl text-4xl font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-balance text-[#0a0a0b] sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#0a0a0b]/75">{subtitle}</p>
          <Link
            to={to}
            className="btn-glass-dark mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-[#ff5a1f] transition-transform duration-300 hover:-translate-y-0.5"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
