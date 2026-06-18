import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Landing from '../pages/Landing'
import DivisionPage from '../pages/DivisionPage'
import Layout from '../components/Layout'
import { divisions, divisionBySlug } from '../config/site'

describe('NTA Group site', () => {
  it('renders the hero headline on the landing page', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { name: /Powering Global Trade/i }),
    ).toBeInTheDocument()
  })

  it('resolves all six divisions by slug, with fertilizers leading', () => {
    expect(divisions).toHaveLength(6)
    expect(divisions[0].slug).toBe('fertilizers')
    expect(divisions.map((d) => d.slug)).toEqual(
      expect.arrayContaining(['fertilizers', 'petrochemicals', 'grains', 'crude-oil', 'refined-oil', 'lng']),
    )
    divisions.forEach((d) => {
      expect(divisionBySlug(d.slug)?.name).toBe(d.name)
    })
    expect(divisionBySlug('does-not-exist')).toBeUndefined()
  })

  it('renders a division detail page from its slug', () => {
    render(
      <MemoryRouter initialEntries={['/divisions/grains']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/divisions/:slug" element={<DivisionPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { name: /Grains, Cereals & Legumes Trading/i }),
    ).toBeInTheDocument()
  })
})
