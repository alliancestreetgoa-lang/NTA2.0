# NTA Group Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-page corporate marketing website for NTA Group (UAE multi-commodity trading house) with Home, About, four division detail pages, and a UI-only Contact form.

**Architecture:** React 18 + TypeScript + Vite SPA with `react-router-dom` v6. A single `config/company.ts` module is the source of truth for all placeholder copy, contact details, and the four divisions; division pages are data-driven (one component renders any division by route slug). Shared `Layout` (Header + Footer + scroll-to-top) wraps all routes. Subtle scroll-reveal motion via a small IntersectionObserver wrapper — no heavy animation library.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS 3.4, react-router-dom v6, lucide-react, Vitest + @testing-library/react (logic + light render tests).

## Global Constraints

- Project root: `~/ntagroup` (already a git repo with the spec committed).
- Node package manager: `npm`.
- Tailwind 3.4, default breakpoints (sm 640 / md 768 / lg 1024 / xl 1280).
- All company copy, contact details, stats, and division data MUST live in `src/config/company.ts` — no hardcoded company strings in components (icons/labels for nav structure excepted).
- Palette tokens (exact): navy-900 `#0A1622`, navy-800 `#0F1F30`, navy-700 `#16293D`, steel-400 `#5B7185`, accent `#C8852F`, accent-soft `#E0A85A`, paper `#F6F4EF`, ink-900 `#101820`, ink-500 `#56616B`.
- Fonts: headings **Sora**, body **Inter** (Google Fonts via index.html `<link>`).
- Routes (exact paths): `/`, `/about`, `/divisions/grains`, `/divisions/lng`, `/divisions/refined-oil`, `/divisions/crude-oil`, `/contact`, and a catch-all `*` → NotFound.
- Division slugs (exact): `grains`, `lng`, `refined-oil`, `crude-oil`.
- No backend; contact form is UI-only (no network request).
- `npm run build` (tsc + vite build) MUST pass with zero type errors at the end of every task that touches code.

---

### Task 1: Scaffold project (Vite + React + TS + Tailwind + Router + Vitest)

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/pages/Home.tsx`, `vitest.config.ts`, `src/test/setup.ts`

**Interfaces:**
- Produces: a running Vite app at `/` rendering a placeholder Home; Tailwind theme tokens available as `bg-navy-900`, `text-accent`, etc.; `npm run build`, `npm run dev`, `npm test` scripts.

- [ ] **Step 1: Create the project scaffold**

```bash
cd ~/ntagroup
npm create vite@latest . -- --template react-ts
# If prompted about non-empty dir, choose "Ignore files and continue"
```

- [ ] **Step 2: Install dependencies**

```bash
cd ~/ntagroup
npm install react-router-dom lucide-react
npm install -D tailwindcss@3.4.15 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind theme** — overwrite `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0A1622', 800: '#0F1F30', 700: '#16293D' },
        steel: { 400: '#5B7185' },
        accent: { DEFAULT: '#C8852F', soft: '#E0A85A' },
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

- [ ] **Step 4: Set up `index.html`** — replace `<head>` font links and title

```html
<!-- inside <head> of index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap" rel="stylesheet" />
<title>NTA Group — Global Commodity Trading</title>
```

- [ ] **Step 5: Write `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #F6F4EF; color: #101820; font-family: 'Inter', system-ui, sans-serif; }

@layer components {
  .container-x { @apply mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10; }
  .btn-accent { @apply inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-soft; }
  .btn-ghost { @apply inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10; }
  .eyebrow { @apply inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent; }
}
```

- [ ] **Step 6: Write placeholder `src/pages/Home.tsx`**

```tsx
export default function Home() {
  return <div className="container-x py-20"><h1 className="font-display text-4xl">NTA Group</h1></div>
}
```

- [ ] **Step 7: Write `src/App.tsx` (router shell)**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 8: Ensure `src/main.tsx` imports css and renders App**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 9: Configure Vitest** — create `vitest.config.ts` and `src/test/setup.ts`, add `"test": "vitest run"` to `package.json` scripts

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] },
})
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom'
```

Add to `package.json` `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 10: Verify build and dev**

Run: `cd ~/ntagroup && npm run build`
Expected: tsc + vite build succeed, no type errors, `dist/` produced.

- [ ] **Step 11: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: scaffold Vite+React+TS+Tailwind+Router+Vitest with theme tokens"
```

---

### Task 2: Company config (single source of truth) + tests

**Files:**
- Create: `src/config/company.ts`, `src/config/company.test.ts`

**Interfaces:**
- Produces:
  - `type Division = { slug: string; nav: string; title: string; tagline: string; icon: string; summary: string; overview: string; trades: string[]; operations: { title: string; body: string }[] }`
  - `company` object: `{ name: string; legalName: string; tagline: string; intro: string; about: { story: string; mission: string; vision: string; values: { title: string; body: string }[]; whyUae: string }; stats: { value: string; label: string }[]; capabilities: { title: string; body: string }[]; contact: { addressLines: string[]; phone: string; email: string; hours: string }; foundedYear: number }`
  - `divisions: Division[]` (exactly 4, slugs `grains`, `lng`, `refined-oil`, `crude-oil`)
  - `getDivisionBySlug(slug: string): Division | undefined`

- [ ] **Step 1: Write the failing test** — `src/config/company.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { company, divisions, getDivisionBySlug } from './company'

describe('company config', () => {
  it('has exactly four divisions with the expected slugs', () => {
    expect(divisions.map((d) => d.slug)).toEqual(['grains', 'lng', 'refined-oil', 'crude-oil'])
  })
  it('every division has non-empty content', () => {
    for (const d of divisions) {
      expect(d.title.length).toBeGreaterThan(0)
      expect(d.tagline.length).toBeGreaterThan(0)
      expect(d.overview.length).toBeGreaterThan(0)
      expect(d.trades.length).toBeGreaterThan(0)
      expect(d.operations.length).toBeGreaterThan(0)
    }
  })
  it('getDivisionBySlug returns the matching division or undefined', () => {
    expect(getDivisionBySlug('lng')?.title).toContain('Liquefied Natural Gas')
    expect(getDivisionBySlug('nope')).toBeUndefined()
  })
  it('exposes core company fields', () => {
    expect(company.name).toBe('NTA Group')
    expect(company.contact.email).toMatch(/@ntagroup\.ae$/)
    expect(company.stats.length).toBeGreaterThanOrEqual(3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

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
  operations: { title: string; body: string }[]
}

export const divisions: Division[] = [
  {
    slug: 'grains',
    nav: 'Grains & Legumes',
    title: 'Grains, Cereals & Legumes Trading',
    tagline: 'Feeding markets with reliable agri-commodity supply.',
    icon: 'Wheat',
    summary: 'Wheat, maize, rice, pulses and oilseeds sourced and delivered at scale.',
    overview:
      'NTA Group sources grains, cereals and legumes from leading producing regions and delivers them to mills, processors and distributors worldwide. We combine deep origination relationships with disciplined logistics to keep supply moving reliably across seasons and price cycles.',
    trades: ['Wheat (milling & feed)', 'Corn / Maize', 'Barley', 'Rice', 'Soybeans & oilseeds', 'Pulses — lentils, chickpeas, beans'],
    operations: [
      { title: 'Origination', body: 'Direct relationships with growers, co-operatives and exporters across major producing regions.' },
      { title: 'Quality assurance', body: 'Independent inspection and certification at load and discharge to agreed specifications.' },
      { title: 'Logistics', body: 'Bulk and containerised shipping, inland haulage and storage coordinated end to end.' },
      { title: 'Settlement', body: 'Transparent contracts on CIF/FOB terms with documentary credit and secure payment handling.' },
    ],
  },
  {
    slug: 'lng',
    nav: 'Natural Gas',
    title: 'Industrial & Liquefied Natural Gas Trading',
    tagline: 'Cleaner energy, dependably delivered.',
    icon: 'Flame',
    summary: 'LNG, LPG and industrial gas supply backed by terminal and shipping logistics.',
    overview:
      'We trade liquefied natural gas, LPG and industrial gases, connecting producers with industrial and utility buyers. From spot cargoes to term supply, NTA Group manages contracting, shipping and terminal logistics to deliver dependable energy across borders.',
    trades: ['Liquefied Natural Gas (LNG)', 'Liquefied Petroleum Gas (LPG)', 'Industrial gases', 'Spot & term supply contracts'],
    operations: [
      { title: 'Supply contracts', body: 'Flexible spot and term structures matched to buyer demand profiles.' },
      { title: 'Shipping & chartering', body: 'Vessel nomination and voyage management for safe, on-time cargo delivery.' },
      { title: 'Terminal logistics', body: 'Regasification, storage and offtake coordination at destination terminals.' },
      { title: 'Compliance', body: 'Full adherence to international safety, environmental and trade-control standards.' },
    ],
  },
  {
    slug: 'refined-oil',
    nav: 'Refined Products',
    title: 'Trading Refined Oil Products Abroad',
    tagline: 'Refined products moving where they are needed most.',
    icon: 'Fuel',
    summary: 'Gasoil, jet fuel, gasoline, fuel oil, naphtha and bitumen across international markets.',
    overview:
      'NTA Group trades a full slate of refined petroleum products in international markets, bridging refineries and end-users. We arbitrage regional supply and demand, manage cargo logistics and deliver products reliably under recognised international terms.',
    trades: ['Gasoil / Diesel', 'Jet fuel (Jet A-1)', 'Gasoline', 'Fuel oil', 'Naphtha', 'Bitumen'],
    operations: [
      { title: 'Market access', body: 'Established buyer and refiner networks across multiple regional markets.' },
      { title: 'Cargo logistics', body: 'Coordinated tanker shipping, storage and blending where required.' },
      { title: 'Risk management', body: 'Price and credit risk managed with disciplined hedging and counterparty review.' },
      { title: 'Delivery terms', body: 'Trades executed on CIF, FOB and other recognised Incoterms.' },
    ],
  },
  {
    slug: 'crude-oil',
    nav: 'Crude Oil',
    title: 'Crude Oil Trading Abroad',
    tagline: 'Crude cargoes connecting producers to global refineries.',
    icon: 'Droplets',
    summary: 'Crude grade cargo trading, chartering and international delivery.',
    overview:
      'We trade crude oil cargoes internationally, linking producing nations with refining centres. NTA Group manages grade selection, chartering and delivery logistics to move crude efficiently and securely across global trade routes.',
    trades: ['Multiple crude grades', 'Spot cargo trading', 'Chartering & freight', 'CIF / FOB delivery'],
    operations: [
      { title: 'Sourcing', body: 'Access to diverse crude grades through established producer relationships.' },
      { title: 'Chartering', body: 'Tanker chartering and voyage management for reliable cargo movement.' },
      { title: 'Quality & inspection', body: 'Independent verification of grade, quantity and quality at each stage.' },
      { title: 'Settlement', body: 'Secure documentary processes and trusted banking partners on every trade.' },
    ],
  },
]

export const company = {
  name: 'NTA Group',
  legalName: 'NTA Group Trading L.L.C.',
  foundedYear: 2014,
  tagline: 'Connecting global markets in energy and agri-commodities.',
  intro:
    'NTA Group is a UAE-headquartered multi-commodity trading house. From our base at the crossroads of global trade, we move grains, gas, refined products and crude oil between the world’s producers and markets — reliably, transparently and at scale.',
  about: {
    story:
      'Founded in the United Arab Emirates, NTA Group has grown into a diversified trading house spanning agriculture and energy. We built our business on long-term relationships, operational discipline and a simple promise: deliver what we commit to, every time.',
    mission:
      'To connect producers and markets across continents with dependable, transparent commodity trading and logistics.',
    vision:
      'To be a trusted name in global commodity trade — known for integrity, reliability and the strength of our partnerships.',
    values: [
      { title: 'Integrity', body: 'We do what we say. Transparent dealing is the foundation of every trade.' },
      { title: 'Reliability', body: 'Cargoes that arrive as agreed — on spec, on time, on terms.' },
      { title: 'Global reach', body: 'A network spanning producing regions and demand centres on every continent.' },
      { title: 'Compliance', body: 'Rigorous adherence to international trade, safety and environmental standards.' },
    ],
    whyUae:
      'The UAE sits at the intersection of East and West, with world-class ports, logistics and financial infrastructure. It gives NTA Group the connectivity, stability and reach to serve markets across Asia, Africa, Europe and beyond.',
  },
  stats: [
    { value: '30+', label: 'Countries served' },
    { value: '4', label: 'Commodity verticals' },
    { value: '1M+', label: 'MT traded annually' },
    { value: '10+', label: 'Years of trading' },
  ],
  capabilities: [
    { title: 'Global logistics', body: 'Bulk, containerised and tanker shipping coordinated end to end.' },
    { title: 'Market access', body: 'Established networks of producers, refiners, mills and buyers worldwide.' },
    { title: 'Trade compliance', body: 'Full adherence to international sanctions, safety and documentation standards.' },
    { title: 'Reliable settlement', body: 'Secure documentary credit and trusted banking partners on every deal.' },
  ],
  contact: {
    addressLines: ['NTA Group Trading L.L.C.', 'Business Bay, Dubai', 'United Arab Emirates'],
    phone: '+971 4 000 0000',
    email: 'info@ntagroup.ae',
    hours: 'Sunday – Thursday, 9:00 – 18:00 GST',
  },
}

export function getDivisionBySlug(slug: string): Division | undefined {
  return divisions.find((d) => d.slug === slug)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ~/ntagroup && npx vitest run src/config/company.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add company config as single source of truth with tests"
```

---

### Task 3: Layout shell — Reveal, ScrollToTop, Header, Footer

**Files:**
- Create: `src/components/Reveal.tsx`, `src/components/ScrollToTop.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/Layout.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `company`, `divisions` from `src/config/company.ts`.
- Produces:
  - `Reveal({ children, className?, delay? }: { children: ReactNode; className?: string; delay?: number })` — fades/translates children in on scroll.
  - `<Layout />` — renders `Header`, `<Outlet />`, `Footer`, includes `ScrollToTop`.

- [ ] **Step 1: Write `src/components/Reveal.tsx`**

```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react'

export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Write `src/components/ScrollToTop.tsx`**

```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
```

- [ ] **Step 3: Write `src/components/Header.tsx`**

```tsx
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { divisions } from '../config/company'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-900/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-accent font-display text-sm font-bold">NTA</span>
          <span className="font-display text-lg font-semibold tracking-tight">NTA Group</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/about" className="text-sm text-steel-400 transition-colors hover:text-white">About</NavLink>
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm text-steel-400 transition-colors hover:text-white">
              Divisions <ChevronDown size={14} />
            </button>
            <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="rounded-xl border border-white/10 bg-navy-800 p-2 shadow-xl">
                {divisions.map((d) => (
                  <NavLink key={d.slug} to={`/divisions/${d.slug}`} className="block rounded-lg px-3 py-2 text-sm text-steel-400 transition-colors hover:bg-navy-700 hover:text-white">
                    {d.title}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <Link to="/contact" className="btn-accent !px-5 !py-2">Get in touch <ArrowRight size={15} /></Link>
        </nav>

        <button className="text-white md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy-900 md:hidden">
          <div className="container-x flex h-16 items-center justify-between">
            <span className="font-display text-lg font-semibold text-white">NTA Group</span>
            <button className="text-white" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
          </div>
          <nav className="container-x flex flex-col gap-1 pt-6">
            <NavLink to="/about" onClick={() => setOpen(false)} className="py-3 font-display text-2xl text-white">About</NavLink>
            {divisions.map((d) => (
              <NavLink key={d.slug} to={`/divisions/${d.slug}`} onClick={() => setOpen(false)} className="py-3 font-display text-2xl text-white">{d.nav}</NavLink>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-accent mt-6 justify-center">Get in touch <ArrowRight size={16} /></Link>
          </nav>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Write `src/components/Footer.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { company, divisions } from '../config/company'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-steel-400">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="font-display text-xl font-semibold text-white">NTA Group</span>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{company.tagline}</p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Divisions</h4>
          <ul className="space-y-2 text-sm">
            {divisions.map((d) => (
              <li key={d.slug}><Link to={`/divisions/${d.slug}`} className="transition-colors hover:text-white">{d.nav}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-accent" /><span>{company.contact.addressLines.join(', ')}</span></li>
            <li className="flex gap-2"><Phone size={16} className="shrink-0 text-accent" />{company.contact.phone}</li>
            <li className="flex gap-2"><Mail size={16} className="shrink-0 text-accent" />{company.contact.email}</li>
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

- [ ] **Step 5: Write `src/components/Layout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main><Outlet /></main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 6: Wire Layout into `src/App.tsx`**

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

- [ ] **Step 7: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 8: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add Layout shell (Header, Footer, Reveal, ScrollToTop)"
```

---

### Task 4: Home page + shared section components

**Files:**
- Create: `src/components/DivisionCard.tsx`, `src/components/StatStrip.tsx`, `src/components/CTABand.tsx`, `src/components/Icon.tsx`
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `company`, `divisions`, `Division` from config; `Reveal`.
- Produces:
  - `Icon({ name, ...props })` — maps a string name to a lucide icon (`Wheat`, `Flame`, `Fuel`, `Droplets`, plus fallback).
  - `DivisionCard({ division }: { division: Division })`
  - `StatStrip()`, `CTABand({ title?, body? })`

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
    <Link to={`/divisions/${division.slug}`} className="group flex flex-col rounded-2xl border border-ink-900/10 bg-white p-7 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-accent"><Icon name={division.icon} size={22} /></span>
      <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">{division.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{division.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">Explore <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
    </Link>
  )
}
```

- [ ] **Step 3: Write `src/components/StatStrip.tsx`**

```tsx
import { company } from '../config/company'

export default function StatStrip() {
  return (
    <section className="bg-navy-900">
      <div className="container-x grid grid-cols-2 gap-8 py-16 md:grid-cols-4">
        {company.stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-4xl font-bold text-accent">{s.value}</div>
            <div className="mt-2 text-sm text-steel-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `src/components/CTABand.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTABand({ title = "Let's trade.", body = 'Talk to our team about your sourcing or offtake requirements.' }: { title?: string; body?: string }) {
  return (
    <section className="bg-accent">
      <div className="container-x flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">{title}</h2>
          <p className="mt-2 max-w-md text-white/90">{body}</p>
        </div>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-navy-800">Contact us <ArrowRight size={16} /></Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Write `src/pages/Home.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { company, divisions } from '../config/company'
import Reveal from '../components/Reveal'
import DivisionCard from '../components/DivisionCard'
import StatStrip from '../components/StatStrip'
import CTABand from '../components/CTABand'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,133,47,0.18),transparent_55%)]" />
        <div className="container-x relative grid gap-10 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
          <div>
            <span className="eyebrow">UAE-based commodity trading</span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">{company.tagline}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel-400">{company.intro}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/contact" className="btn-accent">Get in touch <ArrowRight size={16} /></Link>
              <a href="#divisions" className="btn-ghost">Explore divisions</a>
            </div>
          </div>
          <div className="hidden items-end lg:flex">
            <div className="grid w-full grid-cols-2 gap-4">
              {company.stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-navy-800 p-6">
                  <div className="font-display text-3xl font-bold text-accent">{s.value}</div>
                  <div className="mt-1 text-sm text-steel-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro / positioning */}
      <section className="bg-paper">
        <div className="container-x py-20">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">Who we are</span>
            <p className="mt-5 font-display text-2xl leading-snug text-ink-900 sm:text-3xl">{company.about.story}</p>
          </Reveal>
        </div>
      </section>

      {/* Divisions */}
      <section id="divisions" className="bg-paper">
        <div className="container-x pb-20">
          <Reveal><h2 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">Our divisions</h2></Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {divisions.map((d, i) => (
              <Reveal key={d.slug} delay={i * 80}><DivisionCard division={d} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatStrip />

      {/* Capabilities */}
      <section className="bg-paper">
        <div className="container-x py-20">
          <Reveal><span className="eyebrow">Why NTA Group</span><h2 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-4xl">Built for dependable global trade</h2></Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 80} className="rounded-2xl border border-ink-900/10 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  )
}
```

- [ ] **Step 6: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 7: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: build Home page with division cards, stats, capabilities, CTA"
```

---

### Task 5: About page

**Files:**
- Create: `src/pages/About.tsx`
- Modify: `src/App.tsx` (add `/about` route)

**Interfaces:**
- Consumes: `company`, `Reveal`, `CTABand`.

- [ ] **Step 1: Write `src/pages/About.tsx`**

```tsx
import { company } from '../config/company'
import Reveal from '../components/Reveal'
import CTABand from '../components/CTABand'

export default function About() {
  const { about } = company
  return (
    <>
      <section className="bg-navy-900">
        <div className="container-x py-24">
          <span className="eyebrow">About NTA Group</span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">Strategy-led commodity trading, built on trust.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel-400">{about.story}</p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x grid gap-10 py-20 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-ink-900/10 bg-white p-8">
            <h2 className="font-display text-2xl font-bold text-ink-900">Our mission</h2>
            <p className="mt-3 leading-relaxed text-ink-500">{about.mission}</p>
          </Reveal>
          <Reveal delay={80} className="rounded-2xl border border-ink-900/10 bg-white p-8">
            <h2 className="font-display text-2xl font-bold text-ink-900">Our vision</h2>
            <p className="mt-3 leading-relaxed text-ink-500">{about.vision}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x pb-20">
          <Reveal><h2 className="font-display text-3xl font-bold text-ink-900">Our values</h2></Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="border-t-2 border-accent pt-5">
                <h3 className="font-display text-lg font-semibold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-900">
        <div className="container-x grid gap-8 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal><h2 className="font-display text-3xl font-bold text-white">Why the UAE</h2></Reveal>
          <Reveal delay={80}><p className="text-lg leading-relaxed text-steel-400">{about.whyUae}</p></Reveal>
        </div>
      </section>

      <CTABand title="Partner with NTA Group" body="Reliable sourcing and offtake across energy and agri-commodities." />
    </>
  )
}
```

- [ ] **Step 2: Add `/about` route in `src/App.tsx`**

```tsx
import About from './pages/About'
// inside <Route element={<Layout />}> add:
<Route path="/about" element={<About />} />
```

- [ ] **Step 3: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 4: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add About page"
```

---

### Task 6: Data-driven Division page + 4 routes

**Files:**
- Create: `src/pages/DivisionPage.tsx`
- Modify: `src/App.tsx` (add 4 division routes)

**Interfaces:**
- Consumes: `getDivisionBySlug` from config; `useParams`, `Navigate` from router; `Reveal`, `CTABand`, `Icon`.
- One component renders any division by `:slug` route param; unknown slug redirects to `/`.

- [ ] **Step 1: Write `src/pages/DivisionPage.tsx`**

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
      <section className="bg-navy-900">
        <div className="container-x py-24">
          <Link to="/#divisions" className="text-sm text-steel-400 transition-colors hover:text-white">← All divisions</Link>
          <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-white"><Icon name={division.icon} size={26} /></span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">{division.title}</h1>
          <p className="mt-4 text-lg text-accent-soft">{division.tagline}</p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink-900">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-500">{division.overview}</p>
          </Reveal>
          <Reveal delay={80} className="rounded-2xl border border-ink-900/10 bg-white p-7">
            <h3 className="font-display text-lg font-semibold text-ink-900">What we trade</h3>
            <ul className="mt-4 space-y-3">
              {division.trades.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-ink-500"><Check size={16} className="mt-0.5 shrink-0 text-accent" />{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x pb-20">
          <Reveal><h2 className="font-display text-3xl font-bold text-ink-900">How we operate</h2></Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {division.operations.map((o, i) => (
              <Reveal key={o.title} delay={i * 80} className="rounded-2xl border border-ink-900/10 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink-900">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{o.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <Link to="/contact" className="btn-accent">Enquire about this division <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  )
}
```

- [ ] **Step 2: Add division routes in `src/App.tsx`**

```tsx
import DivisionPage from './pages/DivisionPage'
// inside <Route element={<Layout />}> add:
<Route path="/divisions/:slug" element={<DivisionPage />} />
```

- [ ] **Step 3: Verify build**

Run: `cd ~/ntagroup && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 4: Manually verify all four division URLs resolve**

Run: `cd ~/ntagroup && npm run dev` then visit `/divisions/grains`, `/divisions/lng`, `/divisions/refined-oil`, `/divisions/crude-oil` and confirm distinct titles render; `/divisions/bogus` redirects to `/`.
Expected: 4 distinct pages, bad slug redirects home. Stop dev server after.

- [ ] **Step 5: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add data-driven division detail page with 4 routes"
```

---

### Task 7: Contact page + UI-only form (with validation tests)

**Files:**
- Create: `src/lib/validateContact.ts`, `src/lib/validateContact.test.ts`, `src/components/ContactForm.tsx`, `src/pages/Contact.tsx`
- Modify: `src/App.tsx` (add `/contact` route)

**Interfaces:**
- Produces:
  - `type ContactValues = { name: string; company: string; email: string; division: string; message: string }`
  - `validateContact(v: ContactValues): Partial<Record<keyof ContactValues, string>>` — returns a map of field → error message; empty object means valid.
  - `<ContactForm />` — controlled form, validates on submit, shows success state, no network call.

- [ ] **Step 1: Write the failing test** — `src/lib/validateContact.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { validateContact } from './validateContact'

const base = { name: 'A', company: 'B', email: 'a@b.com', division: 'grains', message: 'Hello there' }

describe('validateContact', () => {
  it('returns no errors for valid input', () => {
    expect(validateContact(base)).toEqual({})
  })
  it('flags a missing name', () => {
    expect(validateContact({ ...base, name: '' }).name).toBeTruthy()
  })
  it('flags an invalid email', () => {
    expect(validateContact({ ...base, email: 'not-an-email' }).email).toBeTruthy()
  })
  it('flags a too-short message', () => {
    expect(validateContact({ ...base, message: 'hi' }).message).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

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

- [ ] **Step 4: Run test to verify it passes**

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
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-accent/30 bg-white p-8">
        <CheckCircle2 className="text-accent" />
        <h3 className="font-display text-xl font-semibold text-ink-900">Thanks — we’ll be in touch.</h3>
        <p className="text-sm text-ink-500">Your enquiry has been received. A member of our team will respond shortly.</p>
        <button onClick={() => setSent(false)} className="mt-2 text-sm font-medium text-accent">Send another message</button>
      </div>
    )
  }

  const field = 'w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-accent'
  const label = 'mb-1.5 block text-sm font-medium text-ink-900'
  const err = 'mt-1 text-xs text-red-600'

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-ink-900/10 bg-white p-8">
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
      <button type="submit" className="btn-accent mt-6">Send enquiry <Send size={16} /></button>
    </form>
  )
}
```

- [ ] **Step 6: Write `src/pages/Contact.tsx`**

```tsx
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { company } from '../config/company'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  const { contact } = company
  return (
    <>
      <section className="bg-navy-900">
        <div className="container-x py-20">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">Let’s talk trade.</h1>
          <p className="mt-4 max-w-xl text-lg text-steel-400">Tell us about your sourcing or offtake requirements and our team will get back to you.</p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x grid gap-10 py-20 lg:grid-cols-[1.3fr_0.7fr]">
          <ContactForm />
          <div className="space-y-6">
            <div className="rounded-2xl border border-ink-900/10 bg-white p-7">
              <ul className="space-y-4 text-sm text-ink-500">
                <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-accent" /><span>{contact.addressLines.join(', ')}</span></li>
                <li className="flex gap-3"><Phone size={18} className="shrink-0 text-accent" />{contact.phone}</li>
                <li className="flex gap-3"><Mail size={18} className="shrink-0 text-accent" />{contact.email}</li>
                <li className="flex gap-3"><Clock size={18} className="shrink-0 text-accent" />{contact.hours}</li>
              </ul>
            </div>
            <div className="flex h-56 items-center justify-center rounded-2xl border border-ink-900/10 bg-navy-800 text-sm text-steel-400">Map placeholder — Dubai, UAE</div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 7: Add `/contact` route in `src/App.tsx`**

```tsx
import Contact from './pages/Contact'
// inside <Route element={<Layout />}> add:
<Route path="/contact" element={<Contact />} />
```

- [ ] **Step 8: Verify build and tests**

Run: `cd ~/ntagroup && npm test && npm run build`
Expected: all tests PASS; build PASS, no type errors.

- [ ] **Step 9: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add Contact page with UI-only validated form"
```

---

### Task 8: NotFound page + final wiring & full verification

**Files:**
- Create: `src/pages/NotFound.tsx`
- Modify: `src/App.tsx` (catch-all route)

**Interfaces:**
- Consumes: router `Link`.

- [ ] **Step 1: Write `src/pages/NotFound.tsx`**

```tsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="bg-navy-900">
      <div className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
        <span className="font-display text-6xl font-bold text-accent">404</span>
        <h1 className="mt-4 font-display text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-steel-400">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="btn-accent mt-8">Back to home</Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Finalise `src/App.tsx` with all routes + catch-all**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import DivisionPage from './pages/DivisionPage'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/divisions/:slug" element={<DivisionPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 3: Full verification**

Run: `cd ~/ntagroup && npm test && npm run build`
Expected: all tests PASS; production build PASS, no type errors.

- [ ] **Step 4: Manual smoke test**

Run: `cd ~/ntagroup && npm run dev` and check: Home, About, all 4 division pages, Contact (submit empty → errors; submit valid → success state), a bad URL → 404, mobile menu opens/closes, footer links work. Stop dev server after.
Expected: all routes work, no console errors.

- [ ] **Step 5: Commit**

```bash
cd ~/ntagroup && git add -A
git commit -m "feat: add 404 page and finalise routing"
```

---

## Notes for the implementer

- Vite SPA routing: `npm run dev` and `npm run preview` handle deep links automatically; production hosting will need an SPA rewrite (all paths → `index.html`) — out of scope for this plan, relevant only at deploy time.
- Keep ALL company strings in `src/config/company.ts`. If a component needs new copy, add it to the config, not the component.
- Imagery is intentionally placeholder (gradient/duotone blocks). Swapping in real photos is a later pass.
