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
