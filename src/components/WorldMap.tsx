import { markets } from '../config/site'

/**
 * Lightweight world map. The base is a stylized dotted graticule (dependency-free,
 * not a true coastline); gold nodes mark the markets NTA serves, positioned by
 * percentage coordinates from config, with animated trade arcs from the UAE hub.
 */

const W = 1000
const H = 500

// Markets carry x/y as percentages (0–100) of the map rectangle.
const toPx = (x: number, y: number) => ({ x: (x / 100) * W, y: (y / 100) * H })

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
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#13283f" />
          <stop offset="100%" stopColor="#0a1622" />
        </radialGradient>
        <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
          <stop offset="50%" stopColor="#e0c074" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="url(#mapGlow)" rx="16" />

      {/* Dotted graticule grid suggesting a globe surface */}
      <g fill="#5b7185" opacity="0.22">
        {Array.from({ length: 24 }).map((_, col) =>
          Array.from({ length: 12 }).map((_, row) => {
            const x = (col / 23) * W
            const y = (row / 11) * H
            const r = 1.3 - Math.abs(row - 5.5) * 0.06
            return <circle key={`${col}-${row}`} cx={x} cy={y} r={Math.max(0.5, r)} />
          }),
        )}
      </g>

      {/* Trade arcs from hub to each market */}
      <g fill="none" stroke="url(#arc)" strokeWidth="1.5">
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
            <g
              key={m.name}
              className="animate-pulse-node"
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle cx={p.x} cy={p.y} r={m.hub ? 9 : 6} fill="#d4af37" opacity="0.18" />
              <circle cx={p.x} cy={p.y} r={m.hub ? 4 : 3} fill={m.hub ? '#e0c074' : '#d4af37'} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
