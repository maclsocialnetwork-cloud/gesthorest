import Hero from "@/components/home/Hero";
import StatsCounter from "@/components/home/StatsCounter";
import Services from "@/components/home/Services";
import DomainsChips from "@/components/home/DomainsChips";
import Testimonials from "@/components/home/Testimonials";
import TrustBanner from "@/components/home/TrustBanner";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <Services />
      <DomainsChips />
      <Testimonials />
      <TrustBanner />
      <FinalCta />
    </>
  );
}
