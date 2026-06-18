import { stats } from '../config/site'
import Reveal from './Reveal'

export default function StatStrip() {
  return (
    <div className="lg-card grid grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal
          key={s.label}
          delay={i * 0.09}
          className="px-6 py-8 text-center"
        >
          <div className="font-display text-3xl font-bold tabular-nums text-[#d4af37] sm:text-4xl">
            {s.value}
          </div>
          <div className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[#8b97a5]">
            {s.label}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
