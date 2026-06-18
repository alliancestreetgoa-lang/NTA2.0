import { about } from '../config/site'
import Reveal from '../components/Reveal'

export default function About() {
  return (
    <section id="about" className="bg-[#0b1f3a] py-24 sm:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow mb-4">{about.eyebrow}</p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-balance text-white sm:text-4xl">
              {about.heading}
            </h2>
          </Reveal>
        </div>
        <div className="space-y-5">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.09}>
              <p className="text-base leading-relaxed text-[#aab4c0]">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
