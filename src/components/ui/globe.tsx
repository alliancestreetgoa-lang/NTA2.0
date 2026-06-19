import type { CSSProperties } from 'react'

/**
 * CSS rotating-earth globe. The artwork is authored at 250px (with hand-tuned
 * inset box-shadows for the spherical lighting) and scaled via transform so it
 * can be dropped in at any size without breaking the shading.
 */
interface GlobeProps {
  /** Rendered diameter in px. */
  size?: number
  className?: string
  style?: CSSProperties
}

const STARS = [
  { left: -20, top: 0, animation: 'twinkling 3s infinite' },
  { left: -40, top: 30, animation: 'twinkling-slow 2s infinite' },
  { left: 350, top: 90, animation: 'twinkling-long 4s infinite' },
  { left: 200, top: 290, animation: 'twinkling 3s infinite' },
  { left: 50, top: 270, animation: 'twinkling-fast 1.5s infinite' },
  { left: 250, top: -50, animation: 'twinkling-long 4s infinite' },
  { left: 290, top: 60, animation: 'twinkling-slow 2s infinite' },
]

const BALL_SHADOW =
  '0 0 26px rgba(255,255,255,0.25),-6px 0 10px #c3f4ff inset,12px 2px 22px #00000088 inset,' +
  '-24px -2px 34px #c3f4ffbb inset,250px 0 70px #00000033 inset,150px 0 60px #00000055 inset'

export default function Globe({ size = 250, className, style }: GlobeProps) {
  const scale = size / 250
  return (
    <>
      <style>
        {`
          @keyframes earthRotate { 0% { background-position: 0 0; } 100% { background-position: 400px 0; } }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @media (prefers-reduced-motion: reduce) {
            .gl-ball { animation: none !important; }
          }
        `}
      </style>
      <div className={className} style={{ width: size, height: size, ...style }}>
        <div style={{ width: 250, height: 250, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <div
            className="gl-ball relative h-[250px] w-[250px] overflow-hidden rounded-full"
            style={{
              boxShadow: BALL_SHADOW,
              backgroundImage:
                "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'left',
              filter: 'brightness(1.5) contrast(1.06) saturate(1.18)',
              animation: 'earthRotate 30s linear infinite',
            }}
          >
            {STARS.map((s, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white"
                style={{ left: s.left, top: s.top, animation: s.animation }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
