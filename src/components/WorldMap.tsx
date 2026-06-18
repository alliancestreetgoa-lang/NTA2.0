import { markets } from '../config/site'
import { landGrid } from '../lib/worldGeo'

/**
 * Equirectangular world map: dotted continents (from shared geo data) form the
 * base map, with gold market nodes positioned by percentage coordinates and
 * animated trade arcs from the UAE hub.
 */

const W = 1000
const H = 500

const toPx = (x: number, y: number) => ({ x: (x / 100) * W, y: (y / 100) * H })
// lon/lat (deg) -> map pixels on an equirectangular projection
const geoToPx = (lon: number, lat: number) => ({
  x: ((lon + 180) / 360) * W,
  y: ((90 - lat) / 180) * H,
})

// Precompute continent dots once (even grid, no polar widening for a flat map).
const LAND = landGrid(3.2, 3.2, false).map(([lon, lat]) => geoToPx(lon, lat))

export default function WorldMap() {
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
          <stop offset="0%" stopColor="#15314c" />
          <stop offset="100%" stopColor="#0a1622" />
        </radialGradient>
        <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
          <stop offset="50%" stopColor="#e0c074" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="url(#mapGlow)" rx="16" />

      {/* Continents — dotted landmasses */}
      <g fill="#7e9bb8">
        {LAND.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1.7} opacity={0.5} />
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
              <circle cx={p.x} cy={p.y} r={m.hub ? 9 : 6} fill="#d4af37" opacity="0.2" />
              <circle cx={p.x} cy={p.y} r={m.hub ? 4 : 3} fill={m.hub ? '#e0c074' : '#d4af37'} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
