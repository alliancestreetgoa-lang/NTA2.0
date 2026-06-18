import { stats } from '../config/company'
import Reveal from './Reveal'

export default function StatStrip() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal
          key={s.label}
          delay={i * 90}
          className="bg-[#0b1f3a] px-6 py-8 text-center"
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
