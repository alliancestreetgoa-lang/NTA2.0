import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'

/**
 * Full-bleed background image that drifts vertically as its section scrolls
 * through the viewport, creating a parallax depth effect. The image is
 * over-sized so the drift never reveals an edge. Collapses to a static image
 * when the user prefers reduced motion.
 */
export default function ParallaxImage({
  src,
  className = '',
  /** Drift distance in px across the full scroll range. */
  strength = 80,
}: {
  src: string
  className?: string
  strength?: number
}) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.img
        src={src}
        alt=""
        loading="lazy"
        style={reduced ? undefined : { y }}
        className={`absolute -inset-y-[12%] inset-x-0 h-[124%] w-full object-cover ${className}`}
      />
    </div>
  )
}
