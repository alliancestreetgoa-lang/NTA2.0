import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'

/**
 * Animates a numeric value from 0 up to its target when scrolled into view.
 * Accepts display strings like "30+", "1M+" or "10" — it counts the leading
 * number and preserves any prefix/suffix (e.g. "M+", "$").
 */
export default function CountUp({ value, durationMs = 1400 }: { value: string; durationMs?: number }) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const [display, setDisplay] = useState('0')

  // Split "1M+" -> prefix "", number 1, suffix "M+"
  const match = value.match(/^(\D*)([\d.]+)(.*)$/)
  const prefix = match?.[1] ?? ''
  const target = match ? parseFloat(match[2]) : 0
  const suffix = match?.[3] ?? ''
  const decimals = match?.[2].includes('.') ? match[2].split('.')[1].length : 0

  useEffect(() => {
    if (!match) {
      setDisplay(value)
      return
    }
    if (reduced || !inView) {
      if (reduced) setDisplay(`${prefix}${target.toFixed(decimals)}${suffix}`)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      const current = (target * eased).toFixed(decimals)
      setDisplay(`${prefix}${current}${suffix}`)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, target, decimals, prefix, suffix, durationMs, match, value])

  return <span ref={ref}>{display}</span>
}
