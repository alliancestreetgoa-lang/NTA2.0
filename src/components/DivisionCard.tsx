import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Division } from '../config/site'

export default function DivisionCard({ division }: { division: Division }) {
  const Icon = division.icon
  return (
    <Link
      to={`/divisions/${division.slug}`}
      className="lg-card lg-card-hover group relative flex h-full flex-col p-7"
    >
      {/* Background topic image + legibility overlay (does not affect card size) */}
      <img
        src={division.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity duration-500 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#111114] via-[#111114]/65 to-[#111114]/20" />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-[#ff5a1f]/30 bg-[#0a0a0b]/80 text-[#ff5a1f] backdrop-blur">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug text-white">{division.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[#aab4c0]">{division.short}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff5a1f]">
          Explore division
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
