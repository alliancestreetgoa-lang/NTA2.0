import Hero from '../components/Hero'
import About from '../sections/About'
import Divisions from '../sections/Divisions'
import WhyNTA from '../sections/WhyNTA'
import GlobalMarkets from '../sections/GlobalMarkets'
import Sustainability from '../sections/Sustainability'
import ContactSection from '../sections/ContactSection'
import CTABand from '../components/CTABand'

export default function Landing() {
  return (
    <>
      <Hero />
      <About />
      <Divisions />
      <WhyNTA />
      <GlobalMarkets />
      <Sustainability />
      <CTABand />
      <ContactSection />
    </>
  )
}
