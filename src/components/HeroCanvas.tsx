import { useEffect, useRef } from 'react'

/**
 * Animated canvas backdrop: a slowly rotating globe rendered as a dotted world
 * map. A grid of points is tested against coarse continent outlines; land points
 * are projected onto the sphere (orthographic, with axial tilt) and only drawn
 * when front-facing — producing recognizable continents that rotate. Gold trade
 * hubs and arcs sit on top. Self-contained (no deps). Used as the hero's
 * poster/fallback when video is unavailable, on mobile, or under reduced-motion.
 */

const D2R = Math.PI / 180

// Coarse continent outlines as [lon, lat] rings. Low fidelity by design — the
// dotted rendering reads as a world map without needing real geodata.
const CONTINENTS: [number, number][][] = [
  // North America
  [
    [-159, 64], [-150, 61], [-140, 60], [-130, 56], [-124, 48], [-124, 40], [-118, 33],
    [-110, 23], [-105, 22], [-97, 16], [-90, 14], [-83, 9], [-81, 18], [-80, 26], [-75, 35],
    [-70, 42], [-66, 45], [-60, 47], [-56, 51], [-64, 60], [-78, 62], [-95, 60], [-110, 68],
    [-125, 70], [-140, 70], [-156, 71], [-168, 66], [-159, 64],
  ],
  // Greenland
  [
    [-45, 60], [-30, 60], [-20, 70], [-25, 80], [-45, 83], [-60, 80], [-55, 70], [-45, 60],
  ],
  // South America
  [
    [-81, 5], [-78, 0], [-80, -5], [-75, -15], [-70, -20], [-71, -30], [-73, -40], [-74, -50],
    [-68, -55], [-65, -50], [-62, -40], [-58, -35], [-56, -30], [-48, -25], [-40, -20],
    [-35, -8], [-35, -5], [-50, 0], [-60, 5], [-70, 10], [-78, 8], [-81, 5],
  ],
  // Africa
  [
    [-17, 15], [-16, 21], [-9, 30], [0, 34], [10, 36], [20, 32], [30, 31], [34, 28], [35, 22],
    [43, 12], [51, 12], [42, -5], [40, -15], [35, -22], [27, -33], [20, -35], [18, -30],
    [12, -18], [9, 0], [3, 5], [-7, 5], [-12, 9], [-17, 15],
  ],
  // Europe
  [
    [-10, 37], [-9, 43], [-2, 44], [0, 49], [2, 51], [8, 54], [12, 58], [22, 60], [30, 62],
    [40, 64], [32, 54], [30, 48], [28, 45], [20, 42], [14, 40], [8, 44], [3, 42], [-2, 38], [-10, 37],
  ],
  // Asia
  [
    [32, 54], [45, 50], [50, 44], [55, 42], [60, 38], [62, 40], [68, 38], [72, 28], [78, 22],
    [80, 10], [78, 8], [83, 17], [90, 22], [95, 16], [98, 8], [104, 9], [106, 18], [110, 20],
    [120, 22], [122, 30], [126, 34], [130, 42], [135, 45], [140, 50], [142, 54], [150, 58],
    [160, 64], [170, 66], [178, 68], [165, 70], [140, 72], [120, 73], [100, 72], [85, 70],
    [70, 68], [60, 66], [55, 60], [48, 56], [40, 56], [32, 54],
  ],
  // India peninsula (sharper)
  [
    [70, 24], [73, 18], [76, 10], [78, 8], [80, 13], [82, 18], [85, 20], [88, 22], [80, 25], [73, 24], [70, 24],
  ],
  // SE Asia / Indonesia (cluster)
  [
    [98, 4], [104, 2], [110, 0], [118, 0], [120, -4], [115, -8], [106, -8], [100, -2], [98, 4],
  ],
  // Australia
  [
    [114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [145, -16], [150, -24],
    [153, -28], [150, -38], [143, -39], [135, -35], [129, -32], [120, -34], [115, -30], [114, -22],
  ],
]

function inPolygon(lon: number, lat: number, poly: [number, number][]): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0]
    const yi = poly[i][1]
    const xj = poly[j][0]
    const yj = poly[j][1]
    const intersect = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

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
    const TILT = 0.36 // axial tilt (~20°)

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

    const globe = () => ({ cx: w * 0.72, cy: h * 0.52, r: Math.min(w, h) * 0.42 })

    type Pt = { x: number; y: number; front: boolean; depth: number }

    const project = (lon: number, lat: number, rot: number, g: ReturnType<typeof globe>): Pt => {
      const a = lon + rot
      const cosLat = Math.cos(lat)
      const X = Math.sin(a) * cosLat
      const Y0 = Math.sin(lat)
      const Z0 = Math.cos(a) * cosLat
      const Y = Y0 * Math.cos(TILT) - Z0 * Math.sin(TILT)
      const Z = Y0 * Math.sin(TILT) + Z0 * Math.cos(TILT)
      return { x: g.cx + X * g.r, y: g.cy - Y * g.r, front: Z >= -0.02, depth: (Z + 1) / 2 }
    }

    // Precompute land sample points (lon/lat radians) once. Longitude step widens
    // toward the poles to keep dot density roughly even on the sphere.
    const landPoints: [number, number][] = []
    for (let lat = -78; lat <= 80; lat += 2.6) {
      const lonStep = 2.6 / Math.max(0.22, Math.cos(lat * D2R))
      for (let lon = -180; lon <= 180; lon += lonStep) {
        if (CONTINENTS.some((c) => inPolygon(lon, lat, c))) {
          landPoints.push([lon * D2R, lat * D2R])
        }
      }
    }

    // Trade hubs (lon/lat radians) across the visible hemisphere.
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
      const rot = animate ? t * 0.00006 : 0.7
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

      // Ocean disc
      const disc = ctx.createRadialGradient(g.cx - g.r * 0.3, g.cy - g.r * 0.3, g.r * 0.1, g.cx, g.cy, g.r)
      disc.addColorStop(0, 'rgba(24, 47, 72, 0.95)')
      disc.addColorStop(1, 'rgba(9, 20, 32, 0.98)')
      ctx.beginPath()
      ctx.arc(g.cx, g.cy, g.r, 0, Math.PI * 2)
      ctx.fillStyle = disc
      ctx.fill()
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Faint equator + a couple of meridians for globe structure
      ctx.strokeStyle = 'rgba(91, 113, 133, 0.12)'
      ctx.lineWidth = 0.6
      for (const lon0 of [0, 60, 120]) {
        ctx.beginPath()
        let drawing = false
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(lon0 * D2R, lat * D2R, rot, g)
          if (p.front) {
            if (drawing) ctx.lineTo(p.x, p.y)
            else { ctx.moveTo(p.x, p.y); drawing = true }
          } else drawing = false
        }
        ctx.stroke()
      }

      // Land dots (the world map)
      const dot = 1.5
      for (const [lon, lat] of landPoints) {
        const p = project(lon, lat, rot, g)
        if (!p.front) continue
        ctx.fillStyle = `rgba(150, 180, 205, ${0.12 + p.depth * 0.55})`
        ctx.fillRect(p.x - dot / 2, p.y - dot / 2, dot, dot)
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
