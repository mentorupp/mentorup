import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import HomePricingTeaser from "@/components/HomePricingTeaser";
import HomeProductCards from "@/components/HomeProductCards";
import LogoBar from "@/components/LogoBar";
import TestimonialsPreview from "@/components/TestimonialsPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoBar />
      <HomeProductCards />
      <HomePricingTeaser />
      <TestimonialsPreview />
      <CTA />
    </>
  );
}
