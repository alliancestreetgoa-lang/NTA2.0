import { useEffect, useRef } from 'react'

/**
 * Animated canvas backdrop: a slowly rotating dark globe rendered as a true
 * projected sphere wireframe (evenly spaced meridians + parallels, front
 * hemisphere only), with glowing gold trade-route arcs and drifting particles.
 * Self-contained (no deps). Used as the hero's poster/fallback when video is
 * unavailable, on mobile, or under prefers-reduced-motion (single static frame).
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
    const TILT = 0.34 // axial tilt (~19°) so the poles read correctly

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

    type Pt = { x: number; y: number; z: number; front: boolean; depth: number }

    // Orthographic projection of a unit-sphere point (lon/lat in radians),
    // rotated about the polar axis by `rot`, then tilted about the X axis.
    const project = (lon: number, lat: number, rot: number, g: ReturnType<typeof globe>): Pt => {
      const a = lon + rot
      const cosLat = Math.cos(lat)
      const X = Math.sin(a) * cosLat
      const Y0 = Math.sin(lat)
      const Z0 = Math.cos(a) * cosLat
      const Y = Y0 * Math.cos(TILT) - Z0 * Math.sin(TILT)
      const Z = Y0 * Math.sin(TILT) + Z0 * Math.cos(TILT)
      return {
        x: g.cx + X * g.r,
        y: g.cy - Y * g.r,
        z: Z,
        front: Z >= -0.015,
        depth: (Z + 1) / 2,
      }
    }

    // Stroke a polyline, breaking it wherever points dip behind the sphere.
    const strokeLine = (pts: Pt[], color: string, lw: number) => {
      ctx.strokeStyle = color
      ctx.lineWidth = lw
      ctx.beginPath()
      let drawing = false
      for (const p of pts) {
        if (p.front) {
          if (drawing) ctx.lineTo(p.x, p.y)
          else {
            ctx.moveTo(p.x, p.y)
            drawing = true
          }
        } else {
          drawing = false
        }
      }
      ctx.stroke()
    }

    const D2R = Math.PI / 180

    // Trade hubs (lon/lat in radians) spread across the visible hemisphere.
    const hubs = [
      { lon: -1.15, lat: 0.5 },
      { lon: -0.45, lat: 0.12 },
      { lon: 0.25, lat: 0.62 },
      { lon: 0.95, lat: -0.05 },
      { lon: -0.7, lat: -0.5 },
      { lon: 0.1, lat: -0.6 },
      { lon: 1.35, lat: 0.32 },
    ]

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
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Meridians (every 15° of longitude)
      for (let m = 0; m < 24; m++) {
        const lon = m * 15 * D2R
        const pts: Pt[] = []
        for (let lat = -90; lat <= 90; lat += 4) pts.push(project(lon, lat * D2R, rot, g))
        strokeLine(pts, 'rgba(91, 113, 133, 0.16)', 0.7)
      }

      // Parallels (every 20° of latitude)
      for (let latDeg = -80; latDeg <= 80; latDeg += 20) {
        const lat = latDeg * D2R
        const pts: Pt[] = []
        for (let lon = 0; lon <= 360; lon += 4) pts.push(project(lon * D2R, lat, rot, g))
        strokeLine(pts, latDeg === 0 ? 'rgba(91, 113, 133, 0.26)' : 'rgba(91, 113, 133, 0.16)', latDeg === 0 ? 0.9 : 0.7)
      }

      // Hub points (front-facing only)
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

      // Arcs between front-facing hubs
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
