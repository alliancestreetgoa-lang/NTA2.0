import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom lacks IntersectionObserver (used by framer-motion's whileInView).
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)

// jsdom does not implement window.scrollTo (used by ScrollManager on route change).
vi.stubGlobal('scrollTo', vi.fn())

// jsdom does not implement canvas 2D (used by HeroCanvas).
HTMLCanvasElement.prototype.getContext = vi.fn() as unknown as typeof HTMLCanvasElement.prototype.getContext

// matchMedia is also absent in jsdom (used by useReducedMotion / Hero).
if (!window.matchMedia) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}
