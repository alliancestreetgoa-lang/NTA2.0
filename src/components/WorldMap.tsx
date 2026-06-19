import { useEffect, useState } from 'react'
import { markets } from '../config/site'

/**
 * Equirectangular world map. Continents are a dotted field sampled from a real
 * NASA land/ocean mask (the three.js earth specular map: ocean = light, land =
 * dark), so the coastlines are accurate. Gold/orange market nodes + animated
 * trade arcs from the UAE hub sit on top.
 */

const W = 1000
const H = 500
const MASK = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'

const toPx = (x: number, y: number) => ({ x: (x / 100) * W, y: (y / 100) * H })

export default function WorldMap() {
  const [dots, setDots] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const gw = 150
      const gh = 75
      const cv = document.createElement('canvas')
      cv.width = gw
      cv.height = gh
      const ctx = cv.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, gw, gh)
      let data: Uint8ClampedArray
      try {
        data = ctx.getImageData(0, 0, gw, gh).data
      } catch {
        return // tainted canvas — leave map empty rather than throw
      }
      const pts: { x: number; y: number }[] = []
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          // specular map: ocean is bright, land is dark -> land = low luminance
          if (data[(y * gw + x) * 4] < 95) {
            pts.push({ x: (x / gw) * W, y: (y / gh) * H })
          }
        }
      }
      setDots(pts)
    }
    img.src = MASK
  }, [])

  const hub = markets.find((m) => m.hub) ?? markets[0]
  const hubPt = toPx(hub.x, hub.y)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Map of global markets served by NTA Group"
    >
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#1a120c" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </radialGradient>
        <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0" />
          <stop offset="50%" stopColor="#ff7a45" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="url(#mapGlow)" rx="16" />

      {/* Continents — dots sampled from a real land/ocean mask */}
      <g fill="#7b8794">
        {dots.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1.7} opacity={0.55} />
        ))}
      </g>

      {/* Trade arcs from hub to each market */}
      <g fill="none" stroke="url(#arc)" strokeWidth="1.6">
        {markets
          .filter((m) => !m.hub)
          .map((m) => {
            const p = toPx(m.x, m.y)
            const mx = (hubPt.x + p.x) / 2
            const my = (hubPt.y + p.y) / 2 - Math.abs(hubPt.x - p.x) * 0.18 - 30
            return <path key={m.name} d={`M ${hubPt.x} ${hubPt.y} Q ${mx} ${my} ${p.x} ${p.y}`} />
          })}
      </g>

      {/* Market nodes */}
      <g>
        {markets.map((m) => {
          const p = toPx(m.x, m.y)
          return (
            <g key={m.name} className="animate-pulse-node" style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
              <circle cx={p.x} cy={p.y} r={m.hub ? 9 : 6} fill="#ff5a1f" opacity="0.22" />
              <circle cx={p.x} cy={p.y} r={m.hub ? 4 : 3} fill={m.hub ? '#ff7a45' : '#ff5a1f'} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
