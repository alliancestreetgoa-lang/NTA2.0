import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { divisionBySlug } from '../config/site'
import Reveal from '../components/Reveal'
import CTABand from '../components/CTABand'

/** Data-driven division detail page — one component renders all four divisions. */
export default function DivisionPage() {
  const { slug } = useParams()
  const division = divisionBySlug(slug)

  if (!division) return <Navigate to="/404" replace />

  const Icon = division.icon

  return (
    <>
      {/* Hero with full-screen topic image */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#0a0a0b] pb-16 pt-32 sm:pt-40">
        <img
          src={division.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-[#0a0a0b]/82 to-[#0a0a0b]/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/55" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#ff5a1f]/10 blur-3xl" />
        <div className="container-x relative z-10">
          <Reveal>
            <Link
              to="/#divisions"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#9aa6b3] transition-colors hover:text-[#ff5a1f]"
            >
              <ArrowLeft className="h-4 w-4" />
              All divisions
            </Link>
          </Reveal>
          <Reveal delay={0.06} className="mt-8 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#ff5a1f]/30 bg-[#18181b] text-[#ff5a1f]">
              <Icon className="h-7 w-7" />
            </div>
            <p className="eyebrow">{division.tagline}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="mt-5 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-balance text-white sm:text-5xl">
              {division.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#aab4c0] sm:text-lg">
              {division.overview}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Detail lists */}
      <section className="bg-[#111114] py-20">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <Reveal>
            <DetailList title={division.tradeLabel} items={division.trade} />
          </Reveal>
          <Reveal delay={0.1}>
            <DetailList title={division.operateLabel} items={division.operate} />
          </Reveal>
        </div>
      </section>

      <CTABand
        title={`Trade ${division.name.split(' ')[0].toLowerCase()} with NTA Group.`}
        subtitle="Speak with our desk about volumes, terms, and delivery across this division."
      />
    </>
  )
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="lg-card h-full p-7 sm:p-9">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5 h-px bg-gradient-to-r from-[#ff5a1f]/50 to-transparent" />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-[#cdd5de]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a1f]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
