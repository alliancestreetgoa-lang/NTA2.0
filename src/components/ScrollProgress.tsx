import { motion, useScroll, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'

/**
 * Thin progress bar pinned to the top of the viewport that fills as the
 * page scrolls. Purely decorative — hidden when the user prefers reduced motion.
 */
export default function ScrollProgress() {
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  if (reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#ff5a1f] via-[#ff7a45] to-[#ff5a1f] shadow-[0_0_12px_rgba(255,90,31,0.6)]"
    />
  )
}
