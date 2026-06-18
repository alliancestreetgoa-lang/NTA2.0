import { Link } from 'react-router-dom'
import { Mail, Globe, MapPin } from 'lucide-react'
import { company, divisions, industries } from '../config/company'

export default function Footer() {
  return (
    <footer className="bg-[#0a1622] text-white">
      <div className="hairline" />
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <span className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-sm bg-[#d4af37] text-sm font-extrabold text-[#0a1622]">
              N
            </span>
            NTA<span className="text-[#d4af37]">Group</span>
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#8b97a5]">
            {company.tagline}. A global trading house bridging producers and markets across energy
            and agricultural commodities.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
            Divisions
          </h3>
          <ul className="space-y-2.5">
            {divisions.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/divisions/${d.slug}`}
                  className="text-sm text-[#b6c0cc] transition-colors hover:text-white"
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
            Industries Served
          </h3>
          <ul className="space-y-2.5">
            {industries.map((i) => (
              <li key={i} className="text-sm text-[#b6c0cc]">
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
            Contact
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-sm text-[#b6c0cc]">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
              <a href={`mailto:${company.email}`} className="hover:text-white">
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-[#b6c0cc]">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
              {company.website}
            </li>
            <li className="flex items-start gap-2.5 text-sm text-[#b6c0cc]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
              {company.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-[#6b7785] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>Global Commodity Trading Solutions · {company.website}</p>
        </div>
      </div>
    </footer>
  )
}
