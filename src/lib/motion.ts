import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const reduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

export function stagger(gap = 0.08): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren: gap } } }
}

export function reveal(reducedMotion: boolean): Variants {
  return reducedMotion ? reduced : fadeUp
}
