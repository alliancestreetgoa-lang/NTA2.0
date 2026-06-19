import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { revealVariant, type RevealDirection } from '../lib/motion'

export default function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** AOS-style entrance direction. Defaults to fade-up. */
  direction?: RevealDirection
}) {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={revealVariant(direction, reducedMotion)}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
