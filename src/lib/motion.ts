import type { Variants } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export const reduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

export function stagger(gap = 0.08): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren: gap } } }
}

/** AOS-style reveal directions, on the framer-motion engine. */
export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade'

const OFFSET = 32
const hiddenByDirection: Record<RevealDirection, Record<string, number>> = {
  up: { y: OFFSET },
  down: { y: -OFFSET },
  left: { x: OFFSET },
  right: { x: -OFFSET },
  zoom: { scale: 0.92 },
  fade: {},
}

/** Build a reveal variant for a given direction (collapses to a plain fade when reduced motion is on). */
export function revealVariant(direction: RevealDirection, reducedMotion: boolean): Variants {
  if (reducedMotion) return reduced
  return {
    hidden: { opacity: 0, ...hiddenByDirection[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: EASE },
    },
  }
}

/** Backwards-compatible default reveal (fade-up). */
export function reveal(reducedMotion: boolean): Variants {
  return reducedMotion ? reduced : fadeUp
}
