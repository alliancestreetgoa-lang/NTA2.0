import { whyChoose } from '../config/company'
import { Network, LineChart, Truck, ShieldCheck, Handshake } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

const icons = [Network, LineChart, Truck, ShieldCheck, Handshake]

export default function WhyNTA() {
  return (
    <section id="why" className="bg-[#0b1f3a] py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why Choose NTA Group"
          title="Built on reach, expertise, and trust."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <Reveal key={item.title} delay={i * 80}>
                <div className="flex h-full gap-4 rounded-2xl border border-white/8 bg-[#13283f] p-6">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#d4af37]/30 bg-[#0a1622] text-[#d4af37]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#9aa6b3]">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
