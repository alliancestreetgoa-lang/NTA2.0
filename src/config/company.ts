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
    'A UAE-headquartered multi-commodity trading house, moving grains, gas, refined products and crude oil between the world\'s producers and markets — reliably and at scale.',
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
