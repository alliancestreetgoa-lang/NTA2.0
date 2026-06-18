import { sustainability } from '../config/site'
import { Leaf, Scale, Route, Handshake } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

const icons = [Leaf, Scale, Route, Handshake]

export default function Sustainability() {
  return (
    <section
      id="sustainability"
      className="relative overflow-hidden bg-[#0b1f3a] py-24 sm:py-28"
    >
      {/* soft gold glow accent */}
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#d4af37]/8 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow={sustainability.eyebrow}
          title={sustainability.heading}
          intro={sustainability.intro}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sustainability.pillars.map((p, i) => {
            const Icon = icons[i % icons.length]
            return (
              <Reveal key={p.title} delay={i * 0.09}>
                <div className="glass flex h-full flex-col rounded-2xl p-6">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-[#d4af37]/30 bg-[#0a1622]/60 text-[#d4af37]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#9aa6b3]">{p.body}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
