/**
 * NTA Group — single source of truth for all site copy, contact details, and data.
 * Every value here is a crafted placeholder. Swap real details in one place.
 */

import type { LucideIcon } from 'lucide-react'
import { Wheat, Flame, Droplets, Fuel } from 'lucide-react'

export const company = {
  name: 'NTA Group',
  tagline: 'Global Commodity Trading Solutions',
  email: 'info@ntagroup.ae',
  website: 'ntagroup.ae',
  phone: '+971 4 000 0000',
  address: 'Jumeirah Lakes Towers, Dubai, United Arab Emirates',
  hours: 'Sun – Fri · 09:00–18:00 GST',
  founded: '2014',
} as const

export const hero = {
  headline: 'Powering Global Trade Through Energy & Agricultural Commodities',
  subhead:
    'NTA Group is a global trading company specializing in grains, cereals, legumes, crude oil, refined petroleum products, and industrial & liquefied natural gas trading across international markets.',
  // Free, hotlink-friendly stock clip — swap for owned footage.
  videoSrc:
    'https://cdn.coverr.co/videos/coverr-an-oil-refinery-at-night-2633/1080p.mp4',
  poster:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=60',
  primaryCta: { label: 'Explore Our Divisions', href: '#divisions' },
  secondaryCta: { label: 'Contact Our Trading Team', href: '#contact' },
}

export const about = {
  eyebrow: 'About NTA Group',
  heading: 'An international trading house connecting producers and global markets.',
  paragraphs: [
    'NTA Group is an international trading organization focused on connecting producers, suppliers, and buyers across global commodity markets.',
    'With expertise in agricultural commodities and energy products, we facilitate reliable and efficient trade solutions while maintaining the highest standards of professionalism, compliance, and operational excellence.',
    'Our extensive network enables us to deliver competitive sourcing, strategic trading solutions, and long-term value to our partners worldwide.',
  ],
}

export interface Division {
  slug: string
  icon: LucideIcon
  name: string
  short: string
  tagline: string
  overview: string
  trade: string[]
  operate: string[]
  // section label for the "what we trade" / capability lists
  tradeLabel: string
  operateLabel: string
}

export const divisions: Division[] = [
  {
    slug: 'grains',
    icon: Wheat,
    name: 'Grains, Cereals & Legumes Trading',
    short: 'High-quality agricultural commodities sourced from major producing regions worldwide.',
    tagline: 'Feeding markets from farm to port.',
    overview:
      'We source and trade high-quality agricultural commodities from major producing regions worldwide, connecting reliable supply with consistent global demand.',
    tradeLabel: 'Products',
    trade: [
      'Wheat',
      'Corn (Maize)',
      'Barley',
      'Rice',
      'Soybeans',
      'Lentils',
      'Chickpeas',
      'Beans',
      'Peas',
      'Other Agricultural Commodities',
    ],
    operateLabel: 'Services',
    operate: [
      'Global Sourcing',
      'Bulk Procurement',
      'Export & Import Facilitation',
      'Supply Chain Management',
      'Commodity Risk Management',
    ],
  },
  {
    slug: 'lng',
    icon: Flame,
    name: 'Industrial & Liquefied Natural Gas Trading',
    short: 'International trading of industrial gases and LNG through trusted global partnerships.',
    tagline: 'Energy that moves across borders.',
    overview:
      'NTA Group facilitates international trading of industrial gases and liquefied natural gas through trusted global partnerships and long-term supply relationships.',
    tradeLabel: 'Products',
    trade: ['LNG', 'Natural Gas', 'Industrial Gas Solutions'],
    operateLabel: 'Capabilities',
    operate: [
      'International LNG Supply',
      'Long-Term Trading Agreements',
      'Industrial Gas Procurement',
      'Cross-Border Trading Solutions',
    ],
  },
  {
    slug: 'refined-oil',
    icon: Droplets,
    name: 'Refined Oil Products Trading',
    short: 'International trading of refined petroleum products across strategic global markets.',
    tagline: 'Refined products, dependable delivery.',
    overview:
      'We support international trading activities for refined petroleum products across strategic global markets, backed by robust logistics and procurement.',
    tradeLabel: 'Products',
    trade: [
      'Diesel',
      'Gasoline',
      'Jet Fuel',
      'Fuel Oil',
      'Naphtha',
      'Base Oils',
      'Marine Fuels',
    ],
    operateLabel: 'Services',
    operate: [
      'International Trading',
      'Bulk Supply Contracts',
      'Logistics Coordination',
      'Strategic Procurement',
    ],
  },
  {
    slug: 'crude-oil',
    icon: Fuel,
    name: 'Crude Oil Trading',
    short: 'Connecting crude suppliers and buyers through transparent commercial relationships.',
    tagline: 'Crude trading, transparently structured.',
    overview:
      'NTA Group participates in international crude oil trading, connecting suppliers and buyers through efficient and transparent commercial relationships.',
    tradeLabel: 'Capabilities',
    trade: [
      'Spot Transactions',
      'Long-Term Supply Agreements',
      'Global Market Access',
      'Contract Structuring',
      'Trading Support Services',
    ],
    operateLabel: 'How We Operate',
    operate: [
      'Rigorous counterparty due diligence',
      'CIF / FOB international delivery terms',
      'Chartering & cargo coordination',
      'Settlement and trade finance support',
    ],
  },
]

export function divisionBySlug(slug?: string): Division | undefined {
  return divisions.find((d) => d.slug === slug)
}

export const whyChoose = [
  {
    title: 'Global Trading Network',
    body: 'Strong relationships across major commodity-producing and consuming regions.',
  },
  {
    title: 'Market Expertise',
    body: 'Deep understanding of agricultural and energy markets and their cycles.',
  },
  {
    title: 'Reliable Supply Chains',
    body: 'Efficient logistics and procurement solutions from origin to destination.',
  },
  {
    title: 'Professional Compliance',
    body: 'Commitment to international trade regulations and industry standards.',
  },
  {
    title: 'Strategic Partnerships',
    body: 'Long-term relationships with suppliers, traders, and end-users.',
  },
]

export const stats = [
  { value: '30+', label: 'Countries Served' },
  { value: '4', label: 'Commodity Verticals' },
  { value: '1M+', label: 'MT Traded Annually' },
  { value: '10+', label: 'Years of Trade' },
]

/** Global markets — coordinates are approximate lon/lat for the SVG equirectangular map. */
export interface Market {
  name: string
  lat: number
  lon: number
  hub?: boolean
}

export const markets: Market[] = [
  { name: 'United Arab Emirates', lat: 24.0, lon: 54.0, hub: true },
  { name: 'Saudi Arabia', lat: 24.0, lon: 45.0 },
  { name: 'India', lat: 21.0, lon: 78.0 },
  { name: 'China', lat: 35.0, lon: 104.0 },
  { name: 'Singapore', lat: 1.3, lon: 103.8 },
  { name: 'Turkey', lat: 39.0, lon: 35.0 },
  { name: 'Netherlands', lat: 52.1, lon: 5.3 },
  { name: 'United Kingdom', lat: 54.0, lon: -2.0 },
  { name: 'United States', lat: 39.0, lon: -98.0 },
  { name: 'African Markets', lat: 9.0, lon: 21.0 },
]

export const sustainability = {
  eyebrow: 'Sustainability & Responsibility',
  heading: 'Trading responsibly across the global supply chain.',
  intro:
    'We pursue commercial excellence without compromising on compliance, transparency, or the long-term health of the markets and communities we serve.',
  pillars: [
    {
      title: 'Responsible Sourcing',
      body: 'We work with vetted producers and suppliers who meet international quality and conduct standards.',
    },
    {
      title: 'Regulatory Compliance',
      body: 'Adherence to international trade, sanctions, and anti-money-laundering frameworks across every transaction.',
    },
    {
      title: 'Efficient Logistics',
      body: 'Optimized routing and cargo planning that reduce waste and emissions per tonne moved.',
    },
    {
      title: 'Long-Term Partnerships',
      body: 'Durable relationships that create shared, sustainable value for suppliers and end-users alike.',
    },
  ],
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
