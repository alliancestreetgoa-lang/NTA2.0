# NTA Group Website Implementation Plan (v2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium corporate site for NTA Group (UAE multi-commodity trading house): one cinematic landing page with anchor sections (Hero, About, Divisions, Why NTA, Global Markets, Sustainability, Contact) plus four routed division detail pages and a 404.

**Architecture:** React 18 + TS + Vite SPA with `react-router-dom` v6. Landing page composes section components; division pages are data-driven from `config/company.ts` (single source of truth). Framer Motion drives scroll-reveal/stagger/hover, all gated by `prefers-reduced-motion`. The hero plays a muted looped stock clip with an animated `<canvas>` globe + gold trade-route arc fallback (used on error/mobile/reduced-motion). Global Markets uses an inline-SVG stylized world (graticule + pulsing gold nodes + animated arcs).

**Tech Stack:** Vite, React 18, TypeScript, Tailwind 3.4, react-router-dom v6, framer-motion, lucide-react, Vitest + @testing-library/react.

**Status:** Task 1 (scaffold) already complete (commit b802a2c). Task 2 below upgrades that scaffold to the v2 palette + framer-motion.

## Global Constraints

- Project root: `~/ntagroup` (git repo; scaffold + docs already committed). Build on `main`.
- Package manager: `npm`. Tailwind 3.4, default breakpoints.
- ALL company copy, contact details, divisions, markets, stats, and image URLs live in `src/config/company.ts` — no hardcoded company strings in components (structural icon/label maps excepted).
- Palette tokens (exact): navy-900 `#0A1622`, navy-800 `#0B1F3A`, navy-700 `#13283F`, steel `#6B7280`, gold `#D4AF37`, gold-soft `#E0C074`, paper `#F6F4EF`, ink-900 `#101820`, ink-500 `#56616B`.
- Fonts: headings **Sora**, body **Inter** (Google Fonts via index.html). Stats use tabular numerals (`tabular-nums`).
- ALL motion must respect `prefers-reduced-motion` via the shared `useReducedMotion` hook + reduced variants. Hero video is `muted` + `playsInline`.
- Routes (exact): `/` (landing), `/divisions/:slug` (slugs `grains`, `lng`, `refined-oil`, `crude-oil`), `*` → NotFound. No separate `/about` or `/contact` routes — those are anchor sections (`#about`, `#contact`, etc.) on the landing page.
- Landing nav uses smooth in-page anchor scroll; division links are real routes. Deep-linking to `/#contact` scrolls to that section after load.
- No backend; contact form is UI-only (no network request).
- `npm run build` (tsc + vite) MUST pass with zero type errors at the end of every code task.
- Use the React automatic JSX runtime; import `type { ... } from 'react'` / `'framer-motion'` as needed (no reliance on a global `React` namespace — import `React` or the specific types).

---

### Task 1: Scaffold — COMPLETE (commit b802a2c)

Vite + React + TS + Tailwind + Router + Vitest scaffold with Sora/Inter fonts and a placeholder Home is already in place. Task 2 upgrades its theme/deps to v2. No action needed beyond awareness of existing files: `tailwind.config.js`, `src/index.css`, `src/main.tsx`, `src/App.tsx`, `src/pages/Home.tsx` (placeholder, will be replaced), `vitest.config.ts`, `src/test/setup.ts`.

---

### Task 2: Foundation upgrade — v2 theme, framer-motion, hooks, motion variants, Reveal

**Files:**
- Modify: `tailwind.config.js`, `src/index.css`, `package.json` (add framer-motion)
- Create: `src/hooks/useReducedMotion.ts`, `src/hooks/useScrolled.ts`, `src/lib/motion.ts`, `src/components/Reveal.tsx`

**Interfaces:**
- Produces:
  - Tailwind tokens: `navy.900/800/700`, `steel`, `gold` (DEFAULT) + `gold.soft`, `paper`, `ink.900/500`; `font-display` (Sora) / `font-sans` (Inter); `maxWidth.content` `1200px`.
  - `usePrefersReducedMotion(): boolean`
  - `useScrolled(threshold?: number): boolean` — true once `window.scrollY > threshold` (default 24)
  - `lib/motion.ts`: `fadeUp` (Variants), `stagger(gap?: number)` (Variants), `reduced` (Variants) — and a helper `reveal(reducedMotion: boolean)` returning the variants to use.
  - `Reveal({ children, className?, delay?, as? })` — Framer Motion `whileInView` wrapper (`once: true`, viewport margin), reduced-motion aware.

- [ ] **Step 1: Install framer-motion**

```bash
cd ~/ntagroup && npm install framer-motion
```

- [ ] **Step 2: Overwrite `tailwind.config.js` with v2 tokens**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0A1622', 800: '#0B1F3A', 700: '#13283F' },
        steel: '#6B7280',
        gold: { DEFAULT: '#D4AF37', soft: '#E0C074' },
        paper: '#F6F4EF',
        ink: { 900: '#101820', 500: '#56616B' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Overwrite `src/index.css`** (tokens, base, glass + button utilities)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }
* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #0A1622; color: #F6F4EF; font-family: 'Inter', system-ui, sans-serif; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

@layer components {
  .container-x { @apply mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10; }
  .glass { @apply border border-white/10 bg-white/[0.04] backdrop-blur-md; }
  .btn-gold { @apply inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-navy-900 transition-colors hover:bg-gold-soft; }
  .btn-ghost { @apply inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10; }
  .eyebrow { @apply inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold; }
  .rule-gold { @apply h-px w-12 bg-gold; }
}
```

- [ ] **Step 4: Write `src/hooks/useReducedMotion.ts`**

```ts
import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
```

- [ ] **Step 5: Write `src/hooks/useScrolled.ts`**

```ts
import { useEffect, useState } from 'react'

export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}
```

- [ ] **Step 6: Write `src/lib/motion.ts`**

```ts
import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const reduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

export function stagger(gap = 0.08): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren: gap } } }
}

export function reveal(reducedMotion: boolean): Variants {
  return reducedMotion ? reduced : fadeUp
}
```

- [ ] **Step 7: Write `src/components/Reveal.tsx`**

```tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { reveal } from '../lib/motion'

export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={reveal(reducedMotion)}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 8: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 9: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: upgrade foundation to v2 (gold theme, framer-motion, hooks, motion variants, Reveal)"
```

---

### Task 3: Company config (single source of truth) + tests

**Files:**
- Create: `src/config/company.ts`, `src/config/company.test.ts`

**Interfaces:**
- Produces:
  - `type Division = { slug: string; nav: string; title: string; tagline: string; icon: string; summary: string; overview: string; trades: string[]; services: string[]; image: string }`
  - `type Market = { name: string; x: number; y: number }` — x/y are percentages (0–100) on the stylized world map.
  - `company` object: `{ name; legalName; foundedYear; tagline; heroHeadline; heroSub; about: { lead; body }; capabilities: { title; body }[]; stats: { value; label }[]; markets: Market[]; sustainability: { title; body }[]; contact: { addressLines: string[]; phone; email; hours }; heroVideo: string; heroPoster: string }`
  - `divisions: Division[]` (exactly 4, slugs in order `grains`, `lng`, `refined-oil`, `crude-oil`)
  - `getDivisionBySlug(slug: string): Division | undefined`

- [ ] **Step 1: Write the failing test** — `src/config/company.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { company, divisions, getDivisionBySlug } from './company'

describe('company config', () => {
  it('has four divisions with expected slugs in order', () => {
    expect(divisions.map((d) => d.slug)).toEqual(['grains', 'lng', 'refined-oil', 'crude-oil'])
  })
  it('every division has full content', () => {
    for (const d of divisions) {
      expect(d.title.length).toBeGreaterThan(0)
      expect(d.tagline.length).toBeGreaterThan(0)
      expect(d.overview.length).toBeGreaterThan(0)
      expect(d.trades.length).toBeGreaterThan(0)
      expect(d.services.length).toBeGreaterThan(0)
    }
  })
  it('getDivisionBySlug resolves or returns undefined', () => {
    expect(getDivisionBySlug('lng')?.title).toContain('Liquefied Natural Gas')
    expect(getDivisionBySlug('nope')).toBeUndefined()
  })
  it('exposes core fields, markets and stats', () => {
    expect(company.name).toBe('NTA Group')
    expect(company.contact.email).toMatch(/@ntagroup\.ae$/)
    expect(company.stats.length).toBeGreaterThanOrEqual(3)
    expect(company.markets.length).toBeGreaterThanOrEqual(8)
    for (const m of company.markets) {
      expect(m.x).toBeGreaterThanOrEqual(0); expect(m.x).toBeLessThanOrEqual(100)
      expect(m.y).toBeGreaterThanOrEqual(0); expect(m.y).toBeLessThanOrEqual(100)
    }
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

Run: `cd ~/ntagroup && npx vitest run src/config/company.test.ts`
Expected: FAIL — cannot resolve `./company`.

- [ ] **Step 3: Write `src/config/company.ts`**

```ts
export type Division = {
  slug: string
  nav: string
  title: string
  tagline: string
  icon: string
  summary: string
  overview: string
  trades: string[]
  services: string[]
  image: string
}

export type Market = { name: string; x: number; y: number }

export const divisions: Division[] = [
  {
    slug: 'grains',
    nav: 'Grains & Legumes',
    title: 'Grains, Cereals & Legumes Trading',
    tagline: 'Feeding markets with reliable agri-commodity supply.',
    icon: 'Wheat',
    summary: 'Wheat, maize, rice, pulses and oilseeds sourced and delivered at global scale.',
    overview:
      'NTA Group sources grains, cereals and legumes from leading producing regions and delivers them to mills, processors and distributors worldwide. We pair deep origination relationships with disciplined logistics to keep supply moving reliably across seasons and price cycles.',
    trades: ['Wheat', 'Corn / Maize', 'Barley', 'Rice', 'Soybeans & oilseeds', 'Lentils', 'Chickpeas', 'Beans', 'Peas'],
    services: ['Global sourcing', 'Bulk procurement', 'Export & import facilitation', 'Supply-chain management', 'Commodity risk management'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'lng',
    nav: 'Industrial & LNG',
    title: 'Industrial & Liquefied Natural Gas Trading',
    tagline: 'Cleaner energy, dependably delivered.',
    icon: 'Flame',
    summary: 'LNG, natural gas and industrial gas solutions backed by international supply.',
    overview:
      'We trade liquefied natural gas, natural gas and industrial gases, connecting producers with industrial and utility buyers. From spot cargoes to long-term agreements, NTA Group manages contracting, shipping and cross-border logistics to deliver dependable energy.',
    trades: ['Liquefied Natural Gas (LNG)', 'Natural gas', 'Industrial gas solutions'],
    services: ['International LNG supply', 'Long-term supply agreements', 'Industrial gas procurement', 'Cross-border solutions'],
    image: 'https://images.unsplash.com/photo-1605557202138-c7a5f6e6e8b9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'refined-oil',
    nav: 'Refined Products',
    title: 'Trading Refined Oil Products Abroad',
    tagline: 'Refined products moving where they are needed most.',
    icon: 'Fuel',
    summary: 'Diesel, gasoline, jet fuel, fuel oil, naphtha, base oils and marine fuels.',
    overview:
      'NTA Group trades a full slate of refined petroleum products in international markets, bridging refineries and end-users. We arbitrage regional supply and demand, coordinate cargo logistics and deliver products reliably under recognised international terms.',
    trades: ['Diesel', 'Gasoline', 'Jet fuel', 'Fuel oil', 'Naphtha', 'Base oils', 'Marine fuels'],
    services: ['International trading', 'Bulk supply contracts', 'Logistics coordination', 'Strategic procurement'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'crude-oil',
    nav: 'Crude Oil',
    title: 'Crude Oil Trading Abroad',
    tagline: 'Crude cargoes connecting producers to global refineries.',
    icon: 'Droplets',
    summary: 'Spot and term crude trading with global market access.',
    overview:
      'We trade crude oil internationally, linking producing nations with refining centres. NTA Group manages spot transactions, long-term agreements and contract structuring to move crude efficiently and securely across global trade routes.',
    trades: ['Spot transactions', 'Long-term supply agreements', 'Multiple crude grades'],
    services: ['Global market access', 'Contract structuring', 'Trading support', 'Logistics & chartering'],
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
  },
]

export const company = {
  name: 'NTA Group',
  legalName: 'NTA Group Trading L.L.C.',
  foundedYear: 2014,
  tagline: 'Powering global trade through energy and agricultural commodities.',
  heroHeadline: 'Powering Global Trade Through Energy & Agricultural Commodities.',
  heroSub:
    'A UAE-headquartered multi-commodity trading house, moving grains, gas, refined products and crude oil between the world’s producers and markets — reliably and at scale.',
  about: {
    lead: 'A UAE trading house built for global markets.',
    body:
      'From our base at the crossroads of global trade, NTA Group connects producers and markets across continents. We built our business on long-term relationships, operational discipline and a simple promise: deliver what we commit to, every time — across agriculture and energy.',
  },
  capabilities: [
    { title: 'Global network', body: 'Producers, refiners, mills and buyers across every major region.' },
    { title: 'Market expertise', body: 'Deep desk knowledge across agri-commodities and energy.' },
    { title: 'Reliable supply chains', body: 'Bulk, containerised and tanker logistics coordinated end to end.' },
    { title: 'Professional compliance', body: 'Rigorous adherence to international trade, safety and sanctions standards.' },
    { title: 'Strategic partnerships', body: 'Long-term relationships that weather price and supply cycles.' },
  ],
  stats: [
    { value: '30+', label: 'Countries served' },
    { value: '4', label: 'Commodity verticals' },
    { value: '1M+', label: 'MT traded annually' },
    { value: '10+', label: 'Years of trading' },
  ],
  markets: [
    { name: 'Dubai', x: 65.4, y: 36.0 },
    { name: 'London', x: 50.0, y: 21.4 },
    { name: 'Rotterdam', x: 51.3, y: 21.2 },
    { name: 'Houston', x: 23.5, y: 33.5 },
    { name: 'São Paulo', x: 37.1, y: 63.1 },
    { name: 'Lagos', x: 50.9, y: 46.4 },
    { name: 'Mumbai', x: 70.2, y: 39.4 },
    { name: 'Singapore', x: 78.8, y: 49.3 },
    { name: 'Shanghai', x: 83.8, y: 32.7 },
    { name: 'Tokyo', x: 88.8, y: 30.2 },
  ],
  sustainability: [
    { title: 'Responsible trading', body: 'Ethical, transparent dealing across every counterparty and cargo.' },
    { title: 'Compliance first', body: 'Full alignment with international sanctions, safety and environmental standards.' },
    { title: 'Efficient logistics', body: 'Optimised routing and load planning to reduce waste and emissions.' },
    { title: 'Long-term partnerships', body: 'Durable relationships that support stable, sustainable supply.' },
  ],
  contact: {
    addressLines: ['NTA Group Trading L.L.C.', 'Business Bay, Dubai', 'United Arab Emirates'],
    phone: '+971 4 000 0000',
    email: 'info@ntagroup.ae',
    hours: 'Sunday – Thursday, 9:00 – 18:00 GST',
  },
  heroVideo: 'https://cdn.coverr.co/videos/coverr-cargo-ship-at-sea-1573/1080p.mp4',
  heroPoster: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=80',
}

export function getDivisionBySlug(slug: string): Division | undefined {
  return divisions.find((d) => d.slug === slug)
}
```

- [ ] **Step 4: Run test — verify it passes**

Run: `cd ~/ntagroup && npx vitest run src/config/company.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add company config (divisions, markets, stats, copy) with tests"
```

---

### Task 4: Layout — ScrollManager, glass scroll-aware Header, Footer, Layout

**Files:**
- Create: `src/components/ScrollManager.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/Layout.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `company`, `divisions`; `useScrolled`.
- Produces:
  - `<ScrollManager />` — on route change: if location has a hash, scroll to that element (after a tick); else scroll to top.
  - `<Header />` — fixed glass header; transparent at top, solid navy + shadow once scrolled. Nav links are anchor links to landing sections (`/#about`, `/#divisions`, `/#markets`, `/#contact`) + a Divisions dropdown (real routes) + "Get in touch" CTA (`/#contact`). Mobile hamburger sheet.
  - `<Footer />` — company blurb, division links, contact, copyright.
  - `<Layout />` — `ScrollManager` + `Header` + `<main><Outlet/></main>` + `Footer`.

**Anchor-link note:** Use `<a href="/#about">` style links (full path + hash) so they work from both the landing page and division pages. `ScrollManager` handles the scroll on navigation.

- [ ] **Step 1: Write `src/components/ScrollManager.tsx`**

```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else window.scrollTo(0, 0)
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}
```

- [ ] **Step 2: Write `src/components/Header.tsx`**

```tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { divisions } from '../config/company'
import { useScrolled } from '../hooks/useScrolled'

const ANCHORS = [
  { label: 'About', href: '/#about' },
  { label: 'Divisions', href: '/#divisions' },
  { label: 'Global Markets', href: '/#markets' },
  { label: 'Sustainability', href: '/#sustainability' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled ? 'border-b border-white/10 bg-navy-900/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-gold font-display text-sm font-bold text-navy-900">NTA</span>
          <span className="font-display text-lg font-semibold tracking-tight">NTA Group</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {ANCHORS.map((a) => (
            <a key={a.href} href={a.href} className="text-sm text-white/70 transition-colors hover:text-white">{a.label}</a>
          ))}
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white">Our Divisions <ChevronDown size={14} /></button>
            <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="glass rounded-xl p-2 shadow-xl">
                {divisions.map((d) => (
                  <Link key={d.slug} to={`/divisions/${d.slug}`} className="block rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">{d.title}</Link>
                ))}
              </div>
            </div>
          </div>
          <a href="/#contact" className="btn-gold !px-5 !py-2">Get in touch <ArrowRight size={15} /></a>
        </nav>

        <button className="text-white lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy-900 lg:hidden">
          <div className="container-x flex h-16 items-center justify-between">
            <span className="font-display text-lg font-semibold text-white">NTA Group</span>
            <button className="text-white" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
          </div>
          <nav className="container-x flex flex-col gap-1 pt-6">
            {ANCHORS.map((a) => (
              <a key={a.href} href={a.href} onClick={() => setOpen(false)} className="py-3 font-display text-2xl text-white">{a.label}</a>
            ))}
            {divisions.map((d) => (
              <Link key={d.slug} to={`/divisions/${d.slug}`} onClick={() => setOpen(false)} className="py-3 font-display text-2xl text-white">{d.nav}</Link>
            ))}
            <a href="/#contact" onClick={() => setOpen(false)} className="btn-gold mt-6 justify-center">Get in touch <ArrowRight size={16} /></a>
          </nav>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 3: Write `src/components/Footer.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { company, divisions } from '../config/company'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-900 text-white/60">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="font-display text-xl font-semibold text-white">NTA Group</span>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{company.tagline}</p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Divisions</h4>
          <ul className="space-y-2 text-sm">
            {divisions.map((d) => (
              <li key={d.slug}><Link to={`/divisions/${d.slug}`} className="transition-colors hover:text-gold">{d.nav}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" /><span>{company.contact.addressLines.join(', ')}</span></li>
            <li className="flex gap-2"><Phone size={16} className="shrink-0 text-gold" />{company.contact.phone}</li>
            <li className="flex gap-2"><Mail size={16} className="shrink-0 text-gold" />{company.contact.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-6 text-xs">© {new Date().getFullYear()} {company.legalName}. All rights reserved.</div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Write `src/components/Layout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollManager from './ScrollManager'

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main><Outlet /></main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 5: Wire Layout into `src/App.tsx`** (Home still placeholder for now)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 6: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 7: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add Layout (glass scroll-aware Header, Footer, ScrollManager)"
```

---

### Task 5: Hero + animated canvas fallback

**Files:**
- Create: `src/components/HeroCanvas.tsx`, `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `company` (heroHeadline, heroSub, heroVideo, heroPoster); `usePrefersReducedMotion`; framer-motion.
- Produces: `<HeroCanvas className?>` (full-bleed animated canvas) and `<Hero />` (full-screen hero section, `id="hero"`).

**HeroCanvas spec (implement faithfully; this is judgment work):**
A full-bleed `<canvas>` that fills its parent and renders an animated dark "global trade" motif: a faint rotating wireframe globe (a circle with several latitude ellipses + longitude arcs) centred right-of-centre, a handful of glowing **gold** (`#D4AF37`) great-circle-style arcs that animate (e.g. a travelling dash/comet along quadratic-bezier curves), and slowly drifting small particles. Requirements:
- Size to `devicePixelRatio`; handle resize via `ResizeObserver` on the parent; clean up RAF + observer on unmount.
- If `usePrefersReducedMotion()` is true, render a single static frame (no RAF loop).
- Pure canvas 2D, no external libs. Subtle and dark — it sits behind hero text. Keep under ~150 lines.

**Hero spec:**
- Full-screen `<section id="hero" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-navy-900">`.
- Background layer order (absolute inset-0): (a) `<video>` muted/loop/playsInline/autoPlay with `poster={company.heroPoster}`, `object-cover`, hidden if it errors or on reduced-motion; (b) `<HeroCanvas>` shown when video is hidden/errored OR on reduced-motion (always rendered as the dark base, video layered over it when available); (c) a navy gradient overlay (`bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/40`) for text legibility.
- Track video error with `onError` → set state to hide video and reveal canvas. On reduced-motion, don't autoplay video (render canvas static frame instead).
- Foreground (relative z-10, container-x, bottom-aligned with flarge top padding): eyebrow "UAE-based commodity trading", motion-animated H1 `company.heroHeadline` (gold accent on a key phrase acceptable), `company.heroSub`, two CTAs — `<a href="/#divisions" className="btn-gold">Explore Our Divisions</a>` and `<a href="/#contact" className="btn-ghost">Contact Our Trading Team</a>` — and a subtle scroll cue at the bottom.
- Hero text entrance uses framer-motion `initial/animate` with reduced-motion fallback (no transform when reduced).

- [ ] **Step 1: Write `src/components/HeroCanvas.tsx`** per the spec above (canvas globe + gold arcs + particles, dpr-aware, ResizeObserver, reduced-motion static frame, RAF cleanup).

- [ ] **Step 2: Write `src/components/Hero.tsx`** per the spec above (video + canvas fallback + gradient + foreground content + CTAs + scroll cue).

- [ ] **Step 3: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 4: Manual check**

Run: `cd ~/ntagroup && npm run dev`, load `/`, confirm hero fills viewport, headline/CTAs visible and legible, canvas animates (or video plays). Stop dev server.

- [ ] **Step 5: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add cinematic hero with animated canvas globe fallback"
```

---

### Task 6: Landing sections A — About, Divisions (+ DivisionCard), Why NTA

**Files:**
- Create: `src/components/DivisionCard.tsx`, `src/components/Icon.tsx`, `src/sections/About.tsx`, `src/sections/Divisions.tsx`, `src/sections/WhyNTA.tsx`

**Interfaces:**
- Consumes: `company`, `divisions`, `Division`; `Reveal`.
- Produces:
  - `Icon({ name, ...props })` — maps `Wheat`, `Flame`, `Fuel`, `Droplets` (+ fallback `Box`) to lucide icons.
  - `DivisionCard({ division })` — glass card linking to `/divisions/${slug}`.
  - Section components `<About />` (`id="about"`), `<Divisions />` (`id="divisions"`), `<WhyNTA />` (`id="why"`).

- [ ] **Step 1: Write `src/components/Icon.tsx`**

```tsx
import { Wheat, Flame, Fuel, Droplets, Box, type LucideProps } from 'lucide-react'

const MAP: Record<string, React.ComponentType<LucideProps>> = { Wheat, Flame, Fuel, Droplets }

export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = MAP[name] ?? Box
  return <Cmp {...props} />
}
```

- [ ] **Step 2: Write `src/components/DivisionCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Icon from './Icon'
import type { Division } from '../config/company'

export default function DivisionCard({ division }: { division: Division }) {
  return (
    <Link to={`/divisions/${division.slug}`} className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-gold/40">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold"><Icon name={division.icon} size={22} /></span>
      <h3 className="mt-5 font-display text-lg font-semibold text-white">{division.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{division.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold">Explore <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
    </Link>
  )
}
```

- [ ] **Step 3: Write `src/sections/About.tsx`**

```tsx
import { company } from '../config/company'
import Reveal from '../components/Reveal'

export default function About() {
  return (
    <section id="about" className="bg-navy-900">
      <div className="container-x grid gap-10 py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="eyebrow">Who we are</span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">{company.about.lead}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-white/70">{company.about.body}</p>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `src/sections/Divisions.tsx`**

```tsx
import { divisions } from '../config/company'
import Reveal from '../components/Reveal'
import DivisionCard from '../components/DivisionCard'

export default function Divisions() {
  return (
    <section id="divisions" className="bg-navy-800">
      <div className="container-x py-24">
        <Reveal><span className="eyebrow">What we trade</span><h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">Our divisions</h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {divisions.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.08}><DivisionCard division={d} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Write `src/sections/WhyNTA.tsx`**

```tsx
import { company } from '../config/company'
import Reveal from '../components/Reveal'

export default function WhyNTA() {
  return (
    <section id="why" className="bg-navy-900">
      <div className="container-x py-24">
        <Reveal><span className="eyebrow">Why NTA Group</span><h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">Built for dependable global trade</h2></Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {company.capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md">
                <div className="rule-gold" />
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 7: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add About, Divisions, Why NTA sections + DivisionCard"
```

---

### Task 7: Global Markets — WorldMap (SVG) + StatStrip + GlobalMarkets section

**Files:**
- Create: `src/components/WorldMap.tsx`, `src/components/StatStrip.tsx`, `src/sections/GlobalMarkets.tsx`

**Interfaces:**
- Consumes: `company` (markets, stats); `usePrefersReducedMotion`.
- Produces: `<WorldMap />`, `<StatStrip />`, `<GlobalMarkets />` (`id="markets"`).

**WorldMap spec (judgment work):**
Inline `<svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid meet" className="w-full">` rendering a stylized "global network" — NOT an accurate continent map:
- A faint graticule background: evenly spaced horizontal + vertical hairlines (stroke `white` at low opacity) drawn programmatically across the viewBox.
- A pulsing **gold** node (small circle + an expanding/fading ring) at each `company.markets[i]` position (x,y are percentages → multiply x by 1.0 since viewBox width is 100; y percentage maps to viewBox height 56, i.e. `cy = m.y/100*56`). Treat the first market (Dubai) as the hub.
- Animated gold arcs from the hub to every other market: quadratic-bezier paths with a control point lifted toward the top; animate a travelling highlight (stroke-dash offset) along each.
- Under `usePrefersReducedMotion()`: draw nodes + arcs statically, no animation (no pulsing rings, no dash travel).
- Use framer-motion or CSS/SMIL for the animation — your choice — but it must be reduced-motion aware. Keep it tasteful and subtle. Label each node with its market name in small text (white/70).

- [ ] **Step 1: Write `src/components/WorldMap.tsx`** per the spec above.

- [ ] **Step 2: Write `src/components/StatStrip.tsx`**

```tsx
import { company } from '../config/company'

export default function StatStrip() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
      {company.stats.map((s) => (
        <div key={s.label} className="bg-navy-800 p-6">
          <div className="font-display text-3xl font-bold tabular-nums text-gold">{s.value}</div>
          <div className="mt-1 text-sm text-white/60">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Write `src/sections/GlobalMarkets.tsx`**

```tsx
import Reveal from '../components/Reveal'
import WorldMap from '../components/WorldMap'
import StatStrip from '../components/StatStrip'

export default function GlobalMarkets() {
  return (
    <section id="markets" className="bg-navy-800">
      <div className="container-x py-24">
        <Reveal><span className="eyebrow">Global reach</span><h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">Trading across the world’s key markets</h2></Reveal>
        <Reveal delay={0.1} className="mt-10 rounded-2xl border border-white/10 bg-navy-900 p-4 sm:p-8"><WorldMap /></Reveal>
        <Reveal delay={0.15} className="mt-8"><StatStrip /></Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 5: Manual check**

Run: `cd ~/ntagroup && npm run dev`, load `/#markets`, confirm map renders with nodes/labels/arcs and the stat strip shows figures. Stop dev server.

- [ ] **Step 6: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add Global Markets section with SVG world map and stat strip"
```

---

### Task 8: Sustainability + Contact (form + validation) + CTABand

**Files:**
- Create: `src/lib/validateContact.ts`, `src/lib/validateContact.test.ts`, `src/components/ContactForm.tsx`, `src/components/CTABand.tsx`, `src/sections/Sustainability.tsx`, `src/sections/ContactSection.tsx`

**Interfaces:**
- Consumes: `company`, `divisions`; `Reveal`.
- Produces:
  - `type ContactValues = { name; company; email; division; message }`
  - `validateContact(v): Partial<Record<keyof ContactValues, string>>` (empty = valid)
  - `<ContactForm />`, `<CTABand />`, `<Sustainability />` (`id="sustainability"`), `<ContactSection />` (`id="contact"`).

- [ ] **Step 1: Write the failing test** — `src/lib/validateContact.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { validateContact } from './validateContact'

const base = { name: 'A', company: 'B', email: 'a@b.com', division: 'grains', message: 'Hello there' }

describe('validateContact', () => {
  it('returns no errors for valid input', () => { expect(validateContact(base)).toEqual({}) })
  it('flags a missing name', () => { expect(validateContact({ ...base, name: '' }).name).toBeTruthy() })
  it('flags an invalid email', () => { expect(validateContact({ ...base, email: 'nope' }).email).toBeTruthy() })
  it('flags a too-short message', () => { expect(validateContact({ ...base, message: 'hi' }).message).toBeTruthy() })
})
```

- [ ] **Step 2: Run test — verify it fails**

Run: `cd ~/ntagroup && npx vitest run src/lib/validateContact.test.ts`
Expected: FAIL — cannot resolve `./validateContact`.

- [ ] **Step 3: Write `src/lib/validateContact.ts`**

```ts
export type ContactValues = { name: string; company: string; email: string; division: string; message: string }

export function validateContact(v: ContactValues): Partial<Record<keyof ContactValues, string>> {
  const errors: Partial<Record<keyof ContactValues, string>> = {}
  if (!v.name.trim()) errors.name = 'Please enter your name.'
  if (!v.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'Please enter a valid email address.'
  if (v.message.trim().length < 5) errors.message = 'Please enter a longer message.'
  return errors
}
```

- [ ] **Step 4: Run test — verify it passes**

Run: `cd ~/ntagroup && npx vitest run src/lib/validateContact.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write `src/components/ContactForm.tsx`**

```tsx
import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { divisions } from '../config/company'
import { validateContact, type ContactValues } from '../lib/validateContact'

const EMPTY: ContactValues = { name: '', company: '', email: '', division: '', message: '' }

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({})
  const [sent, setSent] = useState(false)

  function update<K extends keyof ContactValues>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }))
  }
  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateContact(values)
    setErrors(errs)
    if (Object.keys(errs).length === 0) { setSent(true); setValues(EMPTY) }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-gold/30 bg-white/[0.04] p-8 backdrop-blur-md">
        <CheckCircle2 className="text-gold" />
        <h3 className="font-display text-xl font-semibold text-white">Thank you — we’ll be in touch.</h3>
        <p className="text-sm text-white/60">Your enquiry has been received. A member of our trading team will respond shortly.</p>
        <button onClick={() => setSent(false)} className="mt-2 text-sm font-medium text-gold">Send another message</button>
      </div>
    )
  }

  const field = 'w-full rounded-lg border border-white/15 bg-navy-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-gold'
  const label = 'mb-1.5 block text-sm font-medium text-white/80'
  const err = 'mt-1 text-xs text-red-400'

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Name</label>
          <input id="name" className={field} value={values.name} onChange={(e) => update('name', e.target.value)} />
          {errors.name && <p className={err}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="company" className={label}>Company</label>
          <input id="company" className={field} value={values.company} onChange={(e) => update('company', e.target.value)} />
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" type="email" className={field} value={values.email} onChange={(e) => update('email', e.target.value)} />
          {errors.email && <p className={err}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="division" className={label}>Division of interest</label>
          <select id="division" className={field} value={values.division} onChange={(e) => update('division', e.target.value)}>
            <option value="">General enquiry</option>
            {divisions.map((d) => <option key={d.slug} value={d.slug}>{d.nav}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="message" className={label}>Message</label>
        <textarea id="message" rows={5} className={field} value={values.message} onChange={(e) => update('message', e.target.value)} />
        {errors.message && <p className={err}>{errors.message}</p>}
      </div>
      <button type="submit" className="btn-gold mt-6">Send enquiry <Send size={16} /></button>
    </form>
  )
}
```

- [ ] **Step 6: Write `src/components/CTABand.tsx`**

```tsx
import { ArrowRight } from 'lucide-react'

export default function CTABand({ title = 'Let’s trade.', body = 'Talk to our team about your sourcing or offtake requirements.' }: { title?: string; body?: string }) {
  return (
    <section className="bg-gold">
      <div className="container-x flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy-900">{title}</h2>
          <p className="mt-2 max-w-md text-navy-900/80">{body}</p>
        </div>
        <a href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-navy-800">Contact us <ArrowRight size={16} /></a>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Write `src/sections/Sustainability.tsx`**

```tsx
import { company } from '../config/company'
import Reveal from '../components/Reveal'

export default function Sustainability() {
  return (
    <section id="sustainability" className="bg-navy-900">
      <div className="container-x py-24">
        <Reveal><span className="eyebrow">Responsibility</span><h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">Trading responsibly, for the long term</h2></Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {company.sustainability.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md">
                <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Write `src/sections/ContactSection.tsx`**

```tsx
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { company } from '../config/company'
import Reveal from '../components/Reveal'
import ContactForm from '../components/ContactForm'

export default function ContactSection() {
  const { contact } = company
  return (
    <section id="contact" className="bg-navy-800">
      <div className="container-x py-24">
        <Reveal><span className="eyebrow">Contact</span><h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">Let’s talk trade.</h2><p className="mt-4 max-w-xl text-lg text-white/60">Tell us about your sourcing or offtake requirements and our trading team will respond.</p></Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal><ContactForm /></Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md">
              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-gold" /><span>{contact.addressLines.join(', ')}</span></li>
                <li className="flex gap-3"><Phone size={18} className="shrink-0 text-gold" />{contact.phone}</li>
                <li className="flex gap-3"><Mail size={18} className="shrink-0 text-gold" />{contact.email}</li>
                <li className="flex gap-3"><Clock size={18} className="shrink-0 text-gold" />{contact.hours}</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 9: Verify build + tests**

Run: `cd ~/ntagroup && npm test && npm run build`
Expected: all tests PASS; build PASS, no type errors.

- [ ] **Step 10: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add Sustainability, Contact form section, CTABand with validation tests"
```

---

### Task 9: Compose Landing, Division page, NotFound + final routing & verification

**Files:**
- Create: `src/pages/Landing.tsx`, `src/pages/DivisionPage.tsx`, `src/pages/NotFound.tsx`
- Modify: `src/App.tsx`
- Delete: `src/pages/Home.tsx` (replaced by Landing)

**Interfaces:**
- Consumes: all section components; `getDivisionBySlug`; `Reveal`, `CTABand`, `Icon`.

- [ ] **Step 1: Write `src/pages/Landing.tsx`**

```tsx
import Hero from '../components/Hero'
import About from '../sections/About'
import Divisions from '../sections/Divisions'
import WhyNTA from '../sections/WhyNTA'
import GlobalMarkets from '../sections/GlobalMarkets'
import Sustainability from '../sections/Sustainability'
import ContactSection from '../sections/ContactSection'

export default function Landing() {
  return (
    <>
      <Hero />
      <About />
      <Divisions />
      <WhyNTA />
      <GlobalMarkets />
      <Sustainability />
      <ContactSection />
    </>
  )
}
```

- [ ] **Step 2: Write `src/pages/DivisionPage.tsx`**

```tsx
import { useParams, Navigate, Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { getDivisionBySlug } from '../config/company'
import Reveal from '../components/Reveal'
import CTABand from '../components/CTABand'
import Icon from '../components/Icon'

export default function DivisionPage() {
  const { slug = '' } = useParams()
  const division = getDivisionBySlug(slug)
  if (!division) return <Navigate to="/" replace />

  return (
    <>
      <section className="bg-navy-900 pt-28">
        <div className="container-x py-16">
          <Link to="/#divisions" className="text-sm text-white/60 transition-colors hover:text-white">← All divisions</Link>
          <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/15 text-gold"><Icon name={division.icon} size={26} /></span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">{division.title}</h1>
          <p className="mt-4 text-lg text-gold-soft">{division.tagline}</p>
        </div>
      </section>

      <section className="bg-navy-800">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-white">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">{division.overview}</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md">
            <h3 className="font-display text-lg font-semibold text-white">What we trade</h3>
            <ul className="mt-4 space-y-3">
              {division.trades.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-white/70"><Check size={16} className="mt-0.5 shrink-0 text-gold" />{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy-900">
        <div className="container-x py-20">
          <Reveal><h2 className="font-display text-3xl font-bold text-white">Our services</h2></Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {division.services.map((s, i) => (
              <Reveal key={s} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
                  <div className="rule-gold" />
                  <p className="mt-3 text-sm font-medium text-white">{s}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12"><a href="/#contact" className="btn-gold">Enquire about this division <ArrowRight size={16} /></a></Reveal>
        </div>
      </section>

      <CTABand />
    </>
  )
}
```

- [ ] **Step 3: Write `src/pages/NotFound.tsx`**

```tsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="bg-navy-900">
      <div className="container-x flex min-h-[70vh] flex-col items-start justify-center py-24">
        <span className="font-display text-6xl font-bold text-gold">404</span>
        <h1 className="mt-4 font-display text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-white/60">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="btn-gold mt-8">Back to home</Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Finalise `src/App.tsx` and remove the placeholder Home**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import DivisionPage from './pages/DivisionPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/divisions/:slug" element={<DivisionPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

Then delete `src/pages/Home.tsx` (`git rm src/pages/Home.tsx`).

- [ ] **Step 5: Full verification**

Run: `cd ~/ntagroup && npm test && npm run build`
Expected: all tests PASS; production build PASS, no type errors.

- [ ] **Step 6: Manual smoke test**

Run: `cd ~/ntagroup && npm run dev` and check: landing renders all sections in order; header anchor links smooth-scroll; Divisions dropdown → each of the 4 division pages renders distinct content; `/#contact` deep-link scrolls; contact form (empty → errors; valid → success); a bad URL → 404; mobile menu; footer links. Stop dev server.
Expected: all routes/sections work, no console errors.

- [ ] **Step 7: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: compose landing page, division pages, 404 and finalise routing"
```

---

## Notes for the implementer

- SPA deep links work under `npm run dev`/`preview`; production hosting needs an SPA rewrite (all paths → index.html) — out of scope, relevant at deploy time only.
- Keep ALL company strings in `src/config/company.ts`.
- Stock video/image URLs are placeholders; if a given URL 404s, swap for any equivalent free industrial clip/photo and note it — do not block on a specific asset.
- HeroCanvas and WorldMap are the two judgment-heavy components: implement them faithfully to their specs; favour subtlety and reduced-motion correctness over visual complexity.
```