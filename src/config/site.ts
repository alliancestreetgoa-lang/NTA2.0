/**
 * Adapter over the canonical `company.ts` data module.
 *
 * `company.ts` is the single source of truth for site copy. This module reshapes
 * it into the structures the UI components consume (icon components instead of
 * icon-name strings, division field aliases, grouped hero/about/markets, etc.),
 * keeping all mapping in one place. Edit real content in `company.ts`.
 */
import { Wheat, Flame, Fuel, Droplets, FlaskConical, Sprout, type LucideIcon } from 'lucide-react'
import { company as raw, divisions as rawDivisions } from './company'

const U = 'https://images.unsplash.com/photo-'
const img = (id: string) => `${U}${id}?auto=format&fit=crop&w=800&q=70`

// Topic image per division (background imagery on the cards / detail heroes).
const divisionImages: Record<string, string> = {
  fertilizers: img('1500382017468-9049fed747ef'), // green agricultural field
  grains: img('1574323347407-f5e1ad6d020b'), // wheat
  petrochemicals: img('1518709268805-4e9042af9f23'), // refinery / chemical plant
  'crude-oil': img('1532187863486-abf9dbad1b69'), // oil / industrial
  'refined-oil': img('1519003722824-194d4455a60c'), // fuel
  lng: img('1610552050890-fe99536c2615'), // gas / pipes
}

const iconMap: Record<string, LucideIcon> = {
  Wheat,
  Flame,
  Fuel,
  Droplets,
}

export interface Division {
  slug: string
  icon: LucideIcon
  name: string
  nav: string
  short: string
  tagline: string
  overview: string
  trade: string[]
  operate: string[]
  tradeLabel: string
  operateLabel: string
  image: string
}

const mapRaw = (d: (typeof rawDivisions)[number]): Division => ({
  slug: d.slug,
  icon: iconMap[d.icon] ?? Wheat,
  name: d.title,
  nav: d.nav,
  short: d.summary,
  tagline: d.tagline,
  overview: d.overview,
  trade: d.trades,
  operate: d.services,
  tradeLabel: 'What We Trade',
  operateLabel: 'Services & Capabilities',
  image: divisionImages[d.slug] ?? divisionImages['crude-oil'],
})

const rawBySlug = Object.fromEntries(rawDivisions.map((d) => [d.slug, mapRaw(d)])) as Record<string, Division>

// Chemical Fertilizers — the company's core focus.
const fertilizers: Division = {
  slug: 'fertilizers',
  icon: Sprout,
  name: 'Chemical Fertilizers Trading',
  nav: 'Fertilizers',
  short: 'Urea, DAP, MAP, NPK, potash and ammonia sourced and delivered to importers, blenders and farms worldwide.',
  tagline: 'Nourishing global agriculture.',
  overview:
    'Chemical fertilizers are a core focus for NTA Group. We source nitrogen, phosphate and potash-based fertilizers from major production hubs and deliver them reliably to importers, blenders and agricultural distributors across the world — supporting food security at scale through disciplined sourcing and logistics.',
  trade: [
    'Urea',
    'DAP (Diammonium Phosphate)',
    'MAP (Monoammonium Phosphate)',
    'NPK Compounds',
    'Ammonium Nitrate',
    'Potash (MOP / SOP)',
    'Ammonia',
    'Phosphate Rock',
    'Sulphur',
    'Micronutrients',
  ],
  operate: [
    'Global sourcing from major fertilizer hubs',
    'Bulk & bagged procurement',
    'Export & import facilitation',
    'Supply-chain & vessel coordination',
    'Commodity risk management',
  ],
  tradeLabel: 'What We Trade',
  operateLabel: 'Services & Capabilities',
  image: divisionImages.fertilizers,
}

const petrochemicals: Division = {
  slug: 'petrochemicals',
  icon: FlaskConical,
  name: 'Petrochemicals Trading',
  nav: 'Petrochemicals',
  short: 'Methanol, olefins, aromatics and polymers traded across international markets.',
  tagline: 'The building blocks of industry.',
  overview:
    'NTA Group trades a broad slate of petrochemical feedstocks and polymers, connecting producers with manufacturers worldwide. From methanol and olefins to aromatics and polymers, we arbitrage regional supply and demand and coordinate cargo logistics end to end.',
  trade: ['Methanol', 'Ethylene', 'Propylene', 'Benzene', 'Toluene', 'Xylene (MX / PX)', 'Polyethylene (PE)', 'Polypropylene (PP)', 'PVC', 'Aromatics'],
  operate: ['International trading', 'Bulk supply contracts', 'Logistics coordination', 'Strategic procurement'],
  tradeLabel: 'What We Trade',
  operateLabel: 'Services & Capabilities',
  image: divisionImages.petrochemicals,
}

// Fertilizers lead the lineup to reflect the company's focus.
export const divisions: Division[] = [
  fertilizers,
  rawBySlug['grains'],
  petrochemicals,
  rawBySlug['crude-oil'],
  rawBySlug['refined-oil'],
  rawBySlug['lng'],
].filter(Boolean) as Division[]

export function divisionBySlug(slug?: string): Division | undefined {
  return divisions.find((d) => d.slug === slug)
}

export const hero = {
  headline: raw.heroHeadline,
  subhead:
    'A global trading house with a core focus on chemical fertilizers — alongside grains and cereals, petrochemicals, crude oil, refined products and LNG — connecting producers and markets across the world, reliably and at scale.',
  videoSrc: raw.heroVideo,
  poster: raw.heroPoster,
  primaryCta: { label: 'Explore Our Commodities', href: '/commodities' },
  secondaryCta: { label: 'Contact Our Trading Team', href: '#contact' },
}

export const about = {
  eyebrow: 'About NTA Group',
  heading: 'A trading house powering the world’s food and energy supply chains.',
  paragraphs: [
    raw.about.body,
    'Chemical fertilizers sit at the heart of our agricultural business. We connect the world’s leading nitrogen, phosphate and potash producers with importers and distributors across emerging and established markets — supporting food security while applying the same rigor to our grains, petrochemical and energy desks.',
  ],
}

// Topic images for the "Why NTA" capability cards (matched by order).
const whyImages = [
  img('1451187580459-43490279c0fa'), // global network — earth from space
  img('1611974789855-9c2a0a7236a3'), // market expertise — trading screens
  img('1578575437130-527eed3abbec'), // reliable supply chains — cargo containers
  img('1450101499163-c8848c66ca85'), // professional compliance — documents
  img('1521791136064-7986c2920216'), // strategic partnerships — handshake
]

export const whyChoose = raw.capabilities.map((c, i) => ({ ...c, image: whyImages[i % whyImages.length] }))

export const stats = raw.stats

export interface Market {
  name: string
  x: number
  y: number
  hub?: boolean
}

export const markets: Market[] = raw.markets.map((m) => ({
  ...m,
  hub: m.name === 'Dubai',
}))

export const sustainability = {
  eyebrow: 'Sustainability & Responsibility',
  heading: 'Trading responsibly across the global supply chain.',
  intro:
    'We pursue commercial excellence without compromising on compliance, transparency, or the long-term health of the markets and communities we serve.',
  pillars: raw.sustainability.map((p, i) => ({
    ...p,
    image: [
      img('1574323347407-f5e1ad6d020b'), // responsible trading — wheat / agri
      img('1450101499163-c8848c66ca85'), // compliance first — documents
      img('1601584115197-04ecc0da31d7'), // efficient logistics — warehouse/logistics
      img('1497435334941-8c899ee9e8e9'), // long-term partnerships — green field
    ][i % 4],
  })),
}

export const industries = [
  'Chemical Fertilizers',
  'Petrochemicals',
  'Agriculture & Grains',
  'Energy & LNG',
  'Refined & Crude Oil',
  'International Commodity Markets',
]

export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Divisions', href: '#divisions' },
  { label: 'Commodities', href: '/commodities' },
  { label: 'Global Markets', href: '#markets' },
  { label: 'Sustainability', href: '#sustainability' },
  { label: 'Contact', href: '#contact' },
]

export const company = {
  name: raw.name,
  tagline: 'Global Commodity Trading Solutions',
  email: raw.contact.email,
  phone: raw.contact.phone,
  website: 'ntagroup.ae',
  address: raw.contact.addressLines.join(', '),
  hours: raw.contact.hours,
}
