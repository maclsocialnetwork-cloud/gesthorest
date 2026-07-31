import Hero from '@/components/home/Hero'
import StatsCounter from '@/components/home/StatsCounter'
import WhyUs from '@/components/home/WhyUs'
import Services from '@/components/home/Services'
import DomainsChips from '@/components/home/DomainsChips'
import ClientsCarousel from '@/components/home/ClientsCarousel'
import GallerySection from '@/components/home/GallerySection'
import Testimonials from '@/components/home/Testimonials'
import Newsletter from '@/components/ui/Newsletter'
import TrustBanner from '@/components/home/TrustBanner'
import FinalCta from '@/components/home/FinalCta'

export default function Home() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <WhyUs />
      <Services />
      <DomainsChips />
      <ClientsCarousel />
      <GallerySection />
      <Testimonials />
      <Newsletter />
      <TrustBanner />
      <FinalCta />
    </>
  )
}
