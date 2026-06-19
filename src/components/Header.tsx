import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { nav, divisions, company } from '../config/site'
import { useScrolled } from '../hooks/useScrolled'

function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white">
      <span className="grid h-8 w-8 place-items-center rounded-sm bg-[#ff5a1f] font-display text-sm font-extrabold text-[#0a0a0b]">
        N
      </span>
      NTA<span className="text-[#ff5a1f]">Group</span>
    </span>
  )
}

export default function Header() {
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)
  const [divOpen, setDivOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  /** Anchor links target the landing page; from a sub-route, route home first. */
  const goToAnchor = (href: string) => {
    setOpen(false)
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + href)
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3 shadow-glass' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-x flex items-center justify-between">
        <Link to="/" onClick={() => goToAnchor('#top')} aria-label="NTA Group home">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 xl:flex">
          {nav.map((item) =>
            item.label === 'Divisions' ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDivOpen(true)}
                onMouseLeave={() => setDivOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-sm font-medium text-white/85 transition-colors hover:text-[#ff5a1f]"
                  onClick={() => goToAnchor(item.href)}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {divOpen && (
                  <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                    <div className="glass overflow-hidden rounded-xl p-2 shadow-glass">
                      {divisions.map((d) => (
                        <Link
                          key={d.slug}
                          to={`/divisions/${d.slug}`}
                          className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
                          onClick={() => setDivOpen(false)}
                        >
                          <d.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a1f]" />
                          <span className="text-sm font-medium text-white/90">{d.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : item.href.startsWith('/') ? (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-white/85 transition-colors hover:text-[#ff5a1f]"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => goToAnchor(item.href)}
                className="text-sm font-medium text-white/85 transition-colors hover:text-[#ff5a1f]"
              >
                {item.label}
              </button>
            ),
          )}
        </nav>

        <button onClick={() => goToAnchor('#contact')} className="btn-gold hidden text-sm xl:inline-flex">
          Get in touch
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Mobile toggle */}
        <button
          className="text-white xl:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="glass mt-3 xl:hidden">
          <nav className="container-x flex flex-col gap-1 py-4">
            {nav.map((item) =>
              item.href.startsWith('/') ? (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-left text-base font-medium text-white/90"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => goToAnchor(item.href)}
                  className="py-2.5 text-left text-base font-medium text-white/90"
                >
                  {item.label}
                </button>
              ),
            )}
            <div className="my-2 hairline" />
            {divisions.map((d) => (
              <Link
                key={d.slug}
                to={`/divisions/${d.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-2 text-sm text-white/70"
              >
                <d.icon className="h-4 w-4 text-[#ff5a1f]" />
                {d.name}
              </Link>
            ))}
            <button
              onClick={() => goToAnchor('#contact')}
              className="btn-gold mt-3 w-full"
            >
              Get in touch
            </button>
            <p className="mt-3 text-center text-xs text-white/40">{company.email}</p>
          </nav>
        </div>
      )}
    </header>
  )
}
