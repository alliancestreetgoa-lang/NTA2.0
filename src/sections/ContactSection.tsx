import { Mail, Globe, MapPin, Clock } from 'lucide-react'
import { company } from '../config/site'
import SectionHeading from '../components/SectionHeading'
import ContactForm from '../components/ContactForm'
import Reveal from '../components/Reveal'

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#0a0a0b] py-24 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            index="05"
            eyebrow="Contact Us"
            title="Talk to our trading team."
            intro="Tell us about your sourcing, supply, or offtake requirement and we'll connect you with the right desk."
          />
          <Reveal className="mt-10 space-y-5">
            <ContactItem icon={Mail} label="Email">
              <a href={`mailto:${company.email}`} className="hover:text-[#ff5a1f]">
                {company.email}
              </a>
            </ContactItem>
            <ContactItem icon={Globe} label="Website">
              {company.website}
            </ContactItem>
            <ContactItem icon={MapPin} label="Office">
              {company.address}
            </ContactItem>
            <ContactItem icon={Clock} label="Hours">
              {company.hours}
            </ContactItem>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}

function ContactItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#ff5a1f]/30 bg-[#18181b] text-[#ff5a1f]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7f8b99]">{label}</div>
        <div className="mt-0.5 text-sm text-[#cdd5de]">{children}</div>
      </div>
    </div>
  )
}
