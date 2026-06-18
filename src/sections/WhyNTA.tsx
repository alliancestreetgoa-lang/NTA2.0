import { whyChoose } from '../config/site'
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
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="lg-card lg-card-hover flex h-full flex-col">
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a] via-[#0b1f3a]/30 to-transparent" />
                    <div className="absolute bottom-3 left-4 grid h-10 w-10 place-items-center rounded-xl border border-[#d4af37]/40 bg-[#0a1622]/70 text-[#d4af37] backdrop-blur">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#9aa6b3]">{item.body}</p>
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
