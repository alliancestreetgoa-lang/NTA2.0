import { whyChoose } from '../config/site'
import { Network, LineChart, Truck, ShieldCheck, Handshake } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

const icons = [Network, LineChart, Truck, ShieldCheck, Handshake]

export default function WhyNTA() {
  return (
    <section id="why" className="bg-[#111114] py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Why Choose NTA Group"
          title="Built on reach, expertise, and trust."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="lg-card lg-card-hover group relative flex h-full min-h-[300px] flex-col overflow-hidden">
                  {/* Full-bleed background image + legibility gradient */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/55 to-[#0a0a0b]/10" />

                  <div className="relative z-10 flex flex-1 flex-col p-6">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#ff5a1f]/40 bg-[#0a0a0b]/70 text-[#ff5a1f] backdrop-blur">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-auto pt-8">
                      <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#c2ccd6]">{item.body}</p>
                    </div>
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
