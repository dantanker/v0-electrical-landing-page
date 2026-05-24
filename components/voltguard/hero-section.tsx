import { QuoteCtaButton } from "./quote-cta-button"
import { HeroHeadline } from "./hero-headline"
import { PartnerMarquee } from "./partner-marquee"
import { FadeInUp } from "@/lib/scroll-animations"
import { SITE_SUBHEADLINE } from "@/lib/constants"

export function HeroSection() {
  return (
    <section 
      className="pt-28 pb-32 md:pt-40 md:pb-28 bg-cover bg-top bg-no-repeat bg-scroll md:bg-fixed relative min-h-[100svh] md:min-h-screen flex items-center"
      style={{
        backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/voltguard-dining-lights.jpg-NZWgi2FngoerMeUntpgXL0mqKOpqa6.png)',
      }}
    >
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl space-y-6">
          {/* Headline */}
          <HeroHeadline />

          {/* Subheadline */}
          <FadeInUp delay={0.1}>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-100 leading-relaxed max-md:text-balance md:whitespace-nowrap">
              {SITE_SUBHEADLINE}
            </p>
          </FadeInUp>

          {/* CTA */}
          <FadeInUp delay={0.15}>
            <QuoteCtaButton
              location="hero"
              className="h-14 px-8 text-lg"
            />
          </FadeInUp>


        </div>
      </div>

      <PartnerMarquee />
    </section>
  )
}
