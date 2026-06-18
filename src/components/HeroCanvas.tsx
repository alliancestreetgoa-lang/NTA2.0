import { useEffect, useRef } from 'react'

/**
 * Animated canvas backdrop: a slowly rotating dark globe with glowing gold
 * great-circle trade-route arcs and drifting particles. Self-contained (no deps).
 * Used as the hero's poster/fallback when video is unavailable, on mobile, or
 * under prefers-reduced-motion (in which case it renders a single static frame).
 */
export default function HeroCanvas({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const parent = canvas.parentElement
      w = parent?.clientWidth ?? window.innerWidth
      h = parent?.clientHeight ?? window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Globe geometry — positioned right-of-center, partly off the edge.
    const globe = () => ({ cx: w * 0.72, cy: h * 0.52, r: Math.min(w, h) * 0.42 })

    // Trade hubs as lon/lat-ish angles mapped onto the visible hemisphere.
    const hubs = [
      { lon: 0.2, lat: 0.35 },
      { lon: -0.6, lat: -0.1 },
      { lon: 0.9, lat: 0.0 },
      { lon: -0.2, lat: -0.5 },
      { lon: 0.55, lat: 0.55 },
      { lon: -0.9, lat: 0.3 },
      { lon: 0.3, lat: -0.4 },
    ]

    const project = (lon: number, lat: number, rot: number, g: ReturnType<typeof globe>) => {
      const a = lon * Math.PI + rot
      const x = Math.sin(a) * Math.cos(lat * 1.2)
      const z = Math.cos(a) * Math.cos(lat * 1.2)
      const y = Math.sin(lat * 1.2)
      return {
        x: g.cx + x * g.r,
        y: g.cy + y * g.r,
        front: z > -0.1,
        depth: (z + 1) / 2,
      }
    }

    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: Math.random() * 1.6 + 0.4,
      v: Math.random() * 0.0006 + 0.0002,
    }))

    const drawFrame = (t: number) => {
      const g = globe()
      const rot = animate ? t * 0.00007 : 0.6
      ctx.clearRect(0, 0, w, h)

      // Background wash
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#0a1622')
      bg.addColorStop(1, '#0b1f3a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Drifting particles
      particles.forEach((p) => {
        if (animate) p.y -= p.v
        if (p.y < 0) p.y = 1
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${0.12 + p.s * 0.06})`
        ctx.fill()
      })

      // Globe disc
      const disc = ctx.createRadialGradient(g.cx - g.r * 0.3, g.cy - g.r * 0.3, g.r * 0.1, g.cx, g.cy, g.r)
      disc.addColorStop(0, 'rgba(27, 52, 79, 0.9)')
      disc.addColorStop(1, 'rgba(10, 22, 34, 0.95)')
      ctx.beginPath()
      ctx.arc(g.cx, g.cy, g.r, 0, Math.PI * 2)
      ctx.fillStyle = disc
      ctx.fill()
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Latitude / longitude grid
      ctx.strokeStyle = 'rgba(91, 113, 133, 0.18)'
      ctx.lineWidth = 0.7
      for (let i = 1; i < 6; i++) {
        const ry = (i / 6) * 2 - 1
        ctx.beginPath()
        ctx.ellipse(g.cx, g.cy + ry * g.r, g.r * Math.sqrt(1 - ry * ry), g.r * 0.16, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      for (let i = 0; i < 6; i++) {
        const phase = (i / 6) * Math.PI + rot
        const rx = Math.abs(Math.cos(phase)) * g.r
        ctx.beginPath()
        ctx.ellipse(g.cx, g.cy, rx, g.r, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Hub points
      const pts = hubs.map((hh) => project(hh.lon, hh.lat, rot, g))
      pts.forEach((p) => {
        if (!p.front) return
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(224, 192, 116, ${0.5 + p.depth * 0.5})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 + p.depth * 0.25})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Arcs between consecutive front-facing hubs
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        const b = pts[(i + 2) % pts.length]
        if (!a.front || !b.front) continue
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2 - Math.hypot(a.x - b.x, a.y - b.y) * 0.28
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.quadraticCurveTo(mx, my, b.x, b.y)
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, 'rgba(212, 175, 55, 0)')
        grad.addColorStop(0.5, 'rgba(224, 192, 116, 0.55)')
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
    }

    if (animate) {
      const loop = (t: number) => {
        drawFrame(t)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    } else {
      drawFrame(0)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [animate])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
