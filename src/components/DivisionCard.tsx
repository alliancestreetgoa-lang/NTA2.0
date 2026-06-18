import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Division } from '../config/site'

export default function DivisionCard({ division }: { division: Division }) {
  const Icon = division.icon
  return (
    <Link
      to={`/divisions/${division.slug}`}
      className="lg-card lg-card-hover group relative flex flex-col p-7"
    >
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[#d4af37]/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-[#d4af37]/30 bg-[#0a1622] text-[#d4af37]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-semibold leading-snug text-white">
        {division.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#9aa6b3]">{division.short}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#d4af37]">
        Explore division
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
