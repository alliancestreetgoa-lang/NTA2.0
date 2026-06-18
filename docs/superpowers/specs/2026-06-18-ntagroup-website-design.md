# NTA Group Website — Design Spec

**Date:** 2026-06-18
**Domain:** ntagroup.ae (registered, currently no live site — Apache 404)
**Type:** Multi-page corporate marketing website

## 1. Overview

A multi-page corporate website for **NTA Group**, a UAE-headquartered multi-commodity
trading house operating across energy and agri-commodities. The site presents the company
and its four trading divisions to international partners, suppliers, and buyers.

All company copy and contact details are **crafted placeholders** (the live domain has no
content to source from) and are written to be realistic and easily swapped. Every placeholder
is collected in a single config module so real details can be dropped in one place.

## 2. Brand & Visual Direction

**Direction:** Corporate energy/commodity — institutional, trustworthy, global.

**Palette:**
- `--navy-900` `#0A1622` (primary background / dark sections)
- `--navy-800` `#0F1F30`
- `--navy-700` `#16293D` (cards on dark)
- `--steel-400` `#5B7185` (muted text on dark)
- `--accent` `#C8852F` (amber/copper — oil & grain warmth; CTAs, rules, highlights)
- `--accent-soft` `#E0A85A`
- `--paper` `#F6F4EF` (light section background — warm off-white)
- `--ink-900` `#101820` (text on light)
- `--ink-500` `#56616B` (muted text on light)
- White `#FFFFFF`

**Typography (system / Google Fonts):**
- Headings: a strong grotesque/serif-adjacent sans — **"Fraunces"** (display serif) for big hero/section titles to read institutional, OR **"Sora"** for a cleaner corporate feel. Decision: **Sora** for headings (corporate, modern), **Inter** for body.
- Display sizes use `clamp()` for fluid scaling.

**Motion:** Subtle. Scroll-reveal fade/translate on section entry (IntersectionObserver-based,
no heavy library), accent underline + arrow micro-interactions on links/CTAs, smooth color
transitions. No parallax-heavy or distracting effects.

**Imagery:** Themed via gradient/duotone placeholder blocks + descriptive alt text, with clearly
marked slots for real photography (ports, tankers, LNG terminals, grain silos, refineries).
Use Unsplash source URLs as stand-in imagery where a photo is needed.

## 3. Tech Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS 3.4** (custom theme tokens for the palette above)
- **react-router-dom v6** for multi-page routing (BrowserRouter)
- **lucide-react** for icons
- No backend. Contact form is UI-only.
- New project at `~/ntagroup`, its own git repo.

## 4. Site Map & Routing

| Path | Page | Purpose |
|------|------|---------|
| `/` | Home | Hero, intro, 4 division cards, global-reach stats, CTA |
| `/about` | About | Who we are, mission, vision, values, why UAE |
| `/divisions/grains` | Grains, Cereals & Legumes Trading | Division detail |
| `/divisions/lng` | Industrial & Liquefied Natural Gas Trading | Division detail |
| `/divisions/refined-oil` | Refined Oil Products Trading | Division detail |
| `/divisions/crude-oil` | Crude Oil Trading | Division detail |
| `/contact` | Contact | Form (UI only) + details + map placeholder |

Shared **Header** (logo, nav, Divisions dropdown, "Get in touch" CTA, mobile menu) and
**Footer** (company blurb, division links, contact, copyright) on every page. Scroll-to-top
on route change.

## 5. Page Content

### Home
1. **Hero** — dark navy, headline *"Connecting global markets in energy and agri-commodities."*
   subcopy, two CTAs (Explore divisions / Contact us), accent detailing. Background duotone image.
2. **Intro / positioning** — short paragraph on NTA Group as a UAE-based trading house bridging
   producers and markets across continents.
3. **Divisions grid** — 4 cards (Grains/Cereals/Legumes, LNG, Refined Oil, Crude Oil), each with
   icon, one-line description, link to its page.
4. **Global reach / stats strip** — placeholder stats (e.g. "30+ countries", "4 commodity verticals",
   "1M+ MT traded annually", "10+ years"), on accent/dark band.
5. **Why NTA / capabilities** — 3–4 points: logistics, compliance, market access, reliability.
6. **CTA band** — "Let's trade." → Contact.

### About
- Company story (placeholder), mission, vision, 4 core values (Integrity, Reliability, Global
  reach, Compliance), "Why the UAE" positioning, leadership placeholder note.

### Division pages (shared layout, distinct content)
Each page: hero with division name + tagline, overview paragraph, "What we trade" list (commodity
types), "How we operate" points (sourcing, logistics, quality, settlement), CTA to contact.
- **Grains, Cereals & Legumes:** wheat, corn/maize, barley, rice, soybeans, pulses (lentils,
  chickpeas, beans), oilseeds.
- **Industrial & LNG:** LNG, LPG, industrial gases; supply contracts, shipping, terminal logistics.
- **Refined Oil Products (abroad):** gasoil/diesel, jet fuel, gasoline, fuel oil, naphtha, bitumen.
- **Crude Oil (abroad):** crude grades, cargo trading, chartering, international delivery terms (CIF/FOB).

### Contact
- Heading + intro, **contact form (UI only)**: name, company, email, division (select), message,
  submit. On submit: client-side validation + a success state ("Thanks — we'll be in touch"),
  no network request. Contact details block (address, phone, email, hours), map placeholder block.

## 6. Component Architecture

```
src/
  main.tsx                # Router setup
  App.tsx                 # Routes + Layout
  config/company.ts       # ALL placeholder copy/contact/divisions data (single source of truth)
  components/
    Layout.tsx            # Header + <Outlet/> + Footer + ScrollToTop
    Header.tsx
    Footer.tsx
    Reveal.tsx            # IntersectionObserver scroll-reveal wrapper
    DivisionCard.tsx
    StatStrip.tsx
    CTABand.tsx
    ContactForm.tsx       # UI-only form with validation + success state
  pages/
    Home.tsx
    About.tsx
    DivisionPage.tsx      # data-driven; renders from config by slug
    Contact.tsx
    NotFound.tsx
  index.css               # Tailwind + tokens + base
```

Division pages are **data-driven**: one `DivisionPage` component reads the division record
(by route slug) from `config/company.ts`, so all four pages share layout and differ only by data.

## 7. Responsive & Accessibility

- Mobile-first; breakpoints sm/md/lg. Mobile hamburger menu for nav.
- Semantic landmarks (`header`/`nav`/`main`/`footer`), alt text, labelled form fields, visible
  focus states, sufficient contrast (accent on navy and ink on paper both pass AA for text sizes used).

## 8. Success Criteria

- `npm run build` passes (tsc + vite), no type errors.
- All 7 routes render and navigate; header/footer present everywhere; 404 route works.
- 4 division pages render distinct content from config.
- Contact form validates and shows success state with no console errors / no network call.
- Responsive from 360px to 1440px; nav collapses on mobile.
- All placeholder company details live in `config/company.ts` for one-place swapping.

## 9. Out of Scope (YAGNI)

- Backend / real form submission / email.
- CMS, i18n, blog/news, careers, real authentication.
- Real photography and final legal copy (placeholders only).
- Deployment (separate step if requested).
