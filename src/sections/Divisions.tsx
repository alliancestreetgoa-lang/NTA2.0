import { divisions } from '../config/company'
import SectionHeading from '../components/SectionHeading'
import DivisionCard from '../components/DivisionCard'
import Reveal from '../components/Reveal'

export default function Divisions() {
  return (
    <section id="divisions" className="bg-[#0a1622] py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Business Divisions"
          title="Four trading verticals, one global network."
          intro="From farm-gate agriculture to energy molecules, NTA Group operates across the commodities that move the world economy."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {divisions.map((d, i) => (
            <Reveal key={d.slug} delay={i * 90}>
              <DivisionCard division={d} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
