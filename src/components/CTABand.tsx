import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'

interface Props {
  title?: string
  subtitle?: string
  ctaLabel?: string
  /** Anchor (e.g. "/#contact") or route. */
  to?: string
}

export default function CTABand({
  title = "Let's trade.",
  subtitle = 'Connect with our team to explore sourcing, supply, and offtake opportunities across our four divisions.',
  ctaLabel = 'Contact our trading team',
  to = '/#contact',
}: Props) {
  return (
    <section className="bg-[#0b1f3a]">
      <div className="container-x py-20">
        <Reveal className="relative overflow-hidden rounded-3xl border border-[#d4af37]/25 bg-gradient-to-br from-[#13283f] to-[#0a1622] px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#9aa6b3]">{subtitle}</p>
          <Link to={to} className="btn-gold mt-8">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
