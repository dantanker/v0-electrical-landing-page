import { Header } from "@/components/voltguard/header"
import { HeroSection } from "@/components/voltguard/hero-section"
import { FeaturesMatrix } from "@/components/voltguard/features-matrix"
import { PricingSection } from "@/components/voltguard/pricing-section"
import { SocialProof } from "@/components/voltguard/social-proof"
import { ServiceAreaSection } from "@/components/voltguard/service-area-section"
import { ServicesGrid } from "@/components/voltguard/services-grid"
import { FAQSection } from "@/components/voltguard/faq-section"
import { Footer } from "@/components/voltguard/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesMatrix />
        <ServicesGrid />
        <PricingSection />
        <SocialProof />
        <ServiceAreaSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
