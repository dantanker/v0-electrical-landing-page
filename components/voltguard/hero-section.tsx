import { Shield, BadgeCheck } from "lucide-react"
import { QuoteCtaButton } from "./quote-cta-button"
import { HeroHeadline } from "./hero-headline"
import { PartnerMarquee } from "./partner-marquee"
import { FadeInUp } from "@/lib/scroll-animations"
import { SITE_SUBHEADLINE } from "@/lib/constants"

export function HeroSection() {
  return (
    <section 
      className="pt-36 pb-24 md:pt-40 md:pb-28 bg-cover bg-top bg-no-repeat relative min-h-screen flex items-center"
      style={{
        backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/voltguard-dining-lights.jpg-NZWgi2FngoerMeUntpgXL0mqKOpqa6.png)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
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
            <p className="text-lg sm:text-xl text-slate-100 leading-relaxed max-w-2xl">
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

          {/* Trust Badges */}
          <FadeInUp delay={0.2}>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-300" />
                </div>
                <span className="text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-blue-300" />
                </div>
                <span className="text-sm font-medium">Background-Checked</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-300 text-xs font-bold">$</span>
                </div>
                <span className="text-sm font-medium">Flat-Rate Pricing</span>
              </div>
            </div>
          </FadeInUp>

          {/* Social Proof Stat */}
          <FadeInUp delay={0.3}>
            <div className="pt-4">
              <p className="text-slate-300 text-sm">
                <span className="text-white font-semibold">2,847 Chicago families</span> served this year
              </p>
            </div>
          </FadeInUp>
        </div>
      </div>

      <PartnerMarquee />
    </section>
  )
}
