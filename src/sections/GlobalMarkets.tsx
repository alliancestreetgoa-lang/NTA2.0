import { markets } from '../config/site'
import SectionHeading from '../components/SectionHeading'
import StatStrip from '../components/StatStrip'
import WorldMap from '../components/WorldMap'
import Reveal from '../components/Reveal'

export default function GlobalMarkets() {
  return (
    <section id="markets" className="bg-[#0a0a0b] py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Global Markets"
          title="Trading across the world's key commodity corridors."
          intro="NTA Group serves clients and counterparties across major producing and consuming regions, anchored by our trading desk in the UAE."
        />

        <Reveal className="mt-12 overflow-hidden rounded-2xl border border-white/8">
          <WorldMap />
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap gap-2.5">
          {markets.map((m) => (
            <span
              key={m.name}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#18181b] px-4 py-2 text-sm text-[#b6c0cc]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
              {m.name}
            </span>
          ))}
        </Reveal>

        <div className="mt-14">
          <StatStrip />
        </div>
      </div>
    </section>
  )
}
