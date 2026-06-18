# NTA Group Website — Design Spec (v2, approved)

**Date:** 2026-06-18
**Domain:** ntagroup.ae (registered, no live site yet)
**Type:** Hybrid — cinematic single landing page + routed division detail pages

> Supersedes the earlier conservative v1 spec. Changes: gold accent (not copper),
> full-screen video hero with animated-canvas fallback, Framer Motion, added Global
> Markets (interactive map) and Sustainability sections, hybrid routing.

## 1. Overview

A premium corporate marketing site for **NTA Group**, a UAE-headquartered multi-commodity
trading house spanning energy and agri-commodities. It presents the company and its four
trading divisions to international partners, suppliers, and buyers, with a Bloomberg-adjacent,
institutional, "large global trading house" feel.

All company copy and contact details are **crafted placeholders** collected in a single config
module (`src/config/company.ts`) so real details swap in one place.

## 2. Brand & Visual Direction

**Direction:** Premium corporate energy/commodity — institutional, trustworthy, global, cinematic.

**Palette (CSS tokens):**
- `--navy-900` `#0A1622` (deepest sections)
- `--navy-800` `#0B1F3A` (primary brand navy)
- `--navy-700` `#13283F` (cards on dark)
- `--steel` `#6B7280` (muted text)
- `--gold` `#D4AF37` (CTAs, rules, highlights, map nodes)
- `--gold-soft` `#E0C074`
- `--paper` `#F6F4EF` (light band background)
- `--ink-900` `#101820` (text on light)
- `--ink-500` `#56616B` (muted on light)
- White `#FFFFFF`

**Typography:** **Sora** (display/headings) + **Inter** (body), Google Fonts, fluid `clamp()`.
Stats use Inter tabular numerals.

**Effects:** Glassmorphism on header, cards, stat tiles (backdrop blur + translucent navy).
Gold hairline rules, arrow micro-interactions, gradient/duotone image overlays.

**Motion (Framer Motion):** scroll-reveal (`whileInView`, once), staggered card entries, hero
text rise, hover lift on cards, scroll-aware header. **All motion gated by
`prefers-reduced-motion`** (custom `useReducedMotion` + reduced variants).

**Imagery:** Free stock industrial footage/photos (Coverr/Pexels/Unsplash CDN) as stand-ins
with descriptive alt text and clearly swappable URLs in config.

## 3. Tech Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS 3.4** with custom theme tokens for the palette
- **react-router-dom v6** (BrowserRouter)
- **framer-motion** for animation
- **lucide-react** for icons
- No backend. Contact form is UI-only.
- Project at `~/ntagroup`, its own git repo.

## 4. Site Map & Routing

| Path | Page | Purpose |
|------|------|---------|
| `/` | Landing | Hero, About, Divisions, Why NTA, Global Markets, Sustainability, Contact (anchor sections) |
| `/divisions/grains` | Grains, Cereals & Legumes | Division detail |
| `/divisions/lng` | Industrial & LNG | Division detail |
| `/divisions/refined-oil` | Refined Oil Products | Division detail |
| `/divisions/crude-oil` | Crude Oil | Division detail |
| `*` | NotFound | 404 |

Shared glassmorphic **Header** (logo, anchor nav for the landing page + Divisions dropdown,
"Get in touch" CTA, mobile hamburger, transparent→solid on scroll) and **Footer**. Home nav
uses smooth-scroll to in-page anchors; division links are real routes. Scroll-to-top on route
change; deep-link to an anchor scrolls after route load.

## 5. Page Content

### Landing (`/`)
1. **Hero** — full-screen, navy. Primary: muted/looped free stock industrial clip + navy
   gradient overlay + poster image. Fallback layer: animated `<canvas>` (dark globe + glowing
   gold great-circle trade-route arcs + drifting particles) rendered when video errors, on
   mobile, or under `prefers-reduced-motion`. Gold headline *"Powering Global Trade Through
   Energy & Agricultural Commodities."*, subcopy, two CTAs (Explore Our Divisions /
   Contact Our Trading Team), scroll cue.
2. **About** — positioning paragraphs on NTA Group as a UAE trading house bridging producers
   and global markets.
3. **Divisions grid** — 4 glass cards (Grains/Cereals/Legumes, Industrial & LNG, Refined Oil,
   Crude Oil): icon, one-line description, "Explore" link to detail page.
4. **Why NTA** — capability points: global network, market expertise, reliable supply chains,
   professional compliance, strategic partnerships.
5. **Global Markets** — interactive inline-SVG world map with pulsing gold nodes on the 10 listed
   markets + animated arcs between hubs; Bloomberg-style stat strip (placeholder figures).
6. **Sustainability** — responsible trading / compliance / efficient logistics / long-term
   partnerships; 3–4 glass cards on a navy band.
7. **Contact** — heading + intro, **UI-only form** (name, company, email, division select,
   message) with client-side validation + success state (no network), contact details block.

### Division pages (shared, data-driven)
Each: hero (division name + tagline), overview, "What we trade" list, "How we operate" points,
CTA to contact. Records:
- **Grains, Cereals & Legumes:** wheat, corn/maize, barley, rice, soybeans, lentils, chickpeas,
  beans, peas, other agri-commodities. Services: global sourcing, bulk procurement, export/import
  facilitation, supply-chain management, commodity risk management.
- **Industrial & LNG:** LNG, natural gas, industrial gas solutions. Capabilities: international
  LNG supply, long-term agreements, industrial gas procurement, cross-border solutions.
- **Refined Oil Products:** diesel, gasoline, jet fuel, fuel oil, naphtha, base oils, marine
  fuels. Services: international trading, bulk supply contracts, logistics coordination,
  strategic procurement.
- **Crude Oil:** spot transactions, long-term supply agreements, global market access, contract
  structuring, trading support.

## 6. Component Architecture

```
src/
  main.tsx                # BrowserRouter
  App.tsx                 # Routes + Layout
  config/company.ts       # ALL copy/contact/divisions/markets/stats (single source of truth)
  hooks/
    useReducedMotion.ts
    useScrolled.ts
  lib/
    motion.ts             # shared Framer Motion variants (reveal, stagger)
  components/
    Layout.tsx            # Header + <Outlet/> + Footer + ScrollManager
    Header.tsx            # glass, scroll-aware, divisions dropdown, mobile menu
    Footer.tsx
    ScrollManager.tsx     # scroll-to-top on route change + anchor deep-link
    Reveal.tsx            # Framer Motion whileInView wrapper (reduced-motion aware)
    HeroCanvas.tsx        # animated globe + trade-route arcs fallback
    Hero.tsx
    DivisionCard.tsx
    WorldMap.tsx          # inline SVG world + gold nodes + arcs
    StatStrip.tsx
    SustainabilityCards.tsx
    CTABand.tsx
    ContactForm.tsx       # UI-only validation + success
  sections/               # landing-page sections composing the above
    About.tsx Divisions.tsx WhyNTA.tsx GlobalMarkets.tsx Sustainability.tsx ContactSection.tsx
  pages/
    Landing.tsx
    DivisionPage.tsx      # data-driven by slug
    NotFound.tsx
  index.css               # Tailwind + tokens + base + fonts
```

## 7. Responsive & Accessibility

- Mobile-first; sm/md/lg breakpoints; hamburger nav on mobile.
- Semantic landmarks, alt text, labelled fields, visible focus rings, AA contrast (gold-on-navy
  and ink-on-paper verified for sizes used; gold used for large text / non-text accents).
- Hero canvas/video respect `prefers-reduced-motion`; video is `muted`/`playsinline`.

## 8. Success Criteria

- `npm run build` passes (tsc + vite), zero type errors.
- All routes render and navigate; header/footer everywhere; 404 works.
- 4 division pages render distinct content from config.
- Landing anchors smooth-scroll; deep-links work.
- Hero shows video, falls back to animated canvas on error/mobile/reduced-motion.
- Global Markets map renders nodes + arcs; stat strip shows figures.
- Contact form validates and shows success with no console errors / no network call.
- Responsive 360px–1440px.
- All placeholder details live in `config/company.ts`.

## 9. Out of Scope (YAGNI)

- Backend / real form submission / email.
- CMS, i18n, blog/news, careers, real auth.
- Final legal copy and real photography (placeholders only).
- Deployment (separate step if requested).
