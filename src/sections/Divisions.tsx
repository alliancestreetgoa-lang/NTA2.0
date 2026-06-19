import { divisions } from '../config/site'
import SectionHeading from '../components/SectionHeading'
import DivisionCard from '../components/DivisionCard'
import Reveal from '../components/Reveal'

export default function Divisions() {
  return (
    <section id="divisions" className="bg-[#0a0a0b] py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow="Business Divisions"
          title="Six trading verticals, led by chemical fertilizers."
          intro="From fertilizers and grains to petrochemicals and energy, NTA Group operates across the commodities that feed and fuel the world economy."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.09} direction="zoom">
              <DivisionCard division={d} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
