import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { divisions, type Division } from '../config/site'
import Reveal from '../components/Reveal'
import '../styles/commodities.css'

// Order requested by the client — Chemical Fertilizers leads as the hero product.
const ORDER = ['fertilizers', 'lng', 'refined-oil', 'crude-oil', 'petrochemicals', 'grains']
const ACCENT: Record<string, string> = {
  fertilizers: '#ff5a1f',
  lng: '#4da3ff',
  'refined-oil': '#ff9f1c',
  'crude-oil': '#aeb4bd',
  petrochemicals: '#b98bff',
  grains: '#e6c34a',
}

const bySlug = Object.fromEntries(divisions.map((d) => [d.slug, d])) as Record<string, Division>
const list = ORDER.map((s) => bySlug[s]).filter(Boolean) as Division[]

const TICKER = [
  'UREA', 'DAP', 'NPK', 'POTASH (MOP)', 'AMMONIA', 'LNG', 'NATURAL GAS', 'GASOIL',
  'JET A-1', 'NAPHTHA', 'BRENT', 'WTI', 'METHANOL', 'POLYETHYLENE', 'WHEAT', 'SOYBEANS',
]

const HERO_STATS = [
  { v: '6', l: 'Trading Verticals' },
  { v: '40+', l: 'Destination Markets' },
  { v: 'NPK · Urea', l: 'Core Fertilizers' },
  { v: '1M+ MT', l: 'Traded Annually' },
]

export default function CommoditiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const hero = list[0]
  const rest = list.slice(1)

  return (
    <div className="cm">
      {/* Masthead */}
      <header className="cm-top">
        <div className="cm-wrap cm-top-inner">
          <Link to="/" className="cm-mark" aria-label="NTA Group home">
            <b>N</b> NTA&nbsp;Group
          </Link>
          <span className="cm-meta">Commodities Almanac · Issue 01 · 2026</span>
          <Link to="/" className="cm-back">
            <ArrowLeft size={14} /> Back to site
          </Link>
        </div>
      </header>

      {/* Ticker */}
      <div className="cm-ticker" aria-hidden="true">
        <div className="cm-ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* Hero feature — Chemical Fertilizers */}
      <section className="cm-hero" style={{ ['--accent' as string]: ACCENT[hero.slug] }}>
        <div className="cm-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <span className="cm-ghost cm-serif">01</span>
          <p className="cm-eyebrow cm-rise cm-d1">Featured Vertical · 01</p>
          <h1 className="cm-hero-title cm-rise cm-d2">
            Chemical <i>Fertilizers</i> Trading
          </h1>
          <div className="cm-hero-grid">
            <div className="cm-rise cm-d3">
              <p className="cm-lead cm-drop">{hero.overview}</p>
              <div className="cm-chips">
                {hero.trade.slice(0, 8).map((t) => (
                  <span className="cm-chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <Link to="/divisions/fertilizers" className="cm-link">
                Open the fertilizers desk <ArrowUpRight size={15} />
              </Link>
            </div>
            <figure className="cm-figure cm-rise cm-d4">
              <img src={hero.image} alt="Chemical fertilizers — bulk agricultural inputs" />
              <figcaption>
                <span>Fig. 01 — Nitrogen · Phosphate · Potash</span>
                <span>NTA / AGRI</span>
              </figcaption>
            </figure>
          </div>

          <div className="cm-stats cm-rise cm-d4">
            {HERO_STATS.map((s) => (
              <div className="cm-stat" key={s.l}>
                <b className="cm-serif">{s.v}</b>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The full portfolio */}
      <section className="cm-wrap">
        <div className="cm-rule">
          <h2 className="cm-serif">The Full Portfolio</h2>
          <span className="cm-line" />
          <span className="cm-count cm-mono">02 — 06</span>
        </div>

        {rest.map((d, i) => {
          const num = String(i + 2).padStart(2, '0')
          const flip = i % 2 === 1
          return (
            <Reveal key={d.slug}>
              <article
                className={`cm-entry${flip ? ' cm-flip' : ''}`}
                style={{ ['--accent' as string]: ACCENT[d.slug] }}
              >
                <div>
                  <div className="cm-entry-num cm-mono">{num} / VERTICAL</div>
                  <h3 className="cm-serif">{d.name}</h3>
                  <div className="cm-tag">{d.tagline}</div>
                  <p>{d.overview}</p>
                  <div className="cm-chips">
                    {d.trade.slice(0, 6).map((t) => (
                      <span className="cm-chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link to={`/divisions/${d.slug}`} className="cm-link">
                    Explore division <ArrowUpRight size={15} />
                  </Link>
                </div>
                <div className="cm-entry-media">
                  <span className="cm-badge cm-mono">{num}</span>
                  <img src={d.image} alt={d.name} loading="lazy" />
                </div>
              </article>
            </Reveal>
          )
        })}
      </section>

      {/* Closing CTA */}
      <section className="cm-cta">
        <div className="cm-wrap">
          <h2 className="cm-serif">
            Source your next cargo <i>with NTA Group.</i>
          </h2>
          <Link to="/#contact" className="cm-cta-btn">
            Contact our trading team <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="cm-colophon">
        <div className="cm-wrap cm-colophon-inner">
          <span>NTA Group — Global Commodity Trading</span>
          <span>Fertilizers · Energy · Agri · Petrochemicals</span>
          <span>© {new Date().getFullYear()} · ntagroup.ae</span>
        </div>
      </footer>
    </div>
  )
}
