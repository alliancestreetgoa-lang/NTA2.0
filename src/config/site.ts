/**
 * Adapter over the canonical `company.ts` data module.
 *
 * `company.ts` is the single source of truth for site copy. This module reshapes
 * it into the structures the UI components consume (icon components instead of
 * icon-name strings, division field aliases, grouped hero/about/markets, etc.),
 * keeping all mapping in one place. Edit real content in `company.ts`.
 */
import { Wheat, Flame, Fuel, Droplets, type LucideIcon } from 'lucide-react'
import { company as raw, divisions as rawDivisions } from './company'

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
}

export const divisions: Division[] = rawDivisions.map((d) => ({
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
}))

export function divisionBySlug(slug?: string): Division | undefined {
  return divisions.find((d) => d.slug === slug)
}

export const hero = {
  headline: raw.heroHeadline,
  subhead: raw.heroSub,
  videoSrc: raw.heroVideo,
  poster: raw.heroPoster,
  primaryCta: { label: 'Explore Our Divisions', href: '#divisions' },
  secondaryCta: { label: 'Contact Our Trading Team', href: '#contact' },
}

export const about = {
  eyebrow: 'About NTA Group',
  heading: raw.about.lead,
  paragraphs: [raw.about.body],
}

const U = 'https://images.unsplash.com/photo-'
const img = (id: string) => `${U}${id}?auto=format&fit=crop&w=800&q=70`

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
  'Agriculture',
  'Energy',
  'Industrial Trading',
  'Petroleum Products',
  'International Commodity Markets',
]

export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Divisions', href: '#divisions' },
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
