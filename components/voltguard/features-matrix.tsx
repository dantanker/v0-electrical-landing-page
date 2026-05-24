import { ShinyHeading } from "@/components/ShinyText"
import { FadeInUp } from "@/lib/scroll-animations"
import { WhyUsAccordion } from "./why-us-accordion"

export function FeaturesMatrix() {
  return (
    <section id="why-us" className="relative pt-12 md:pt-20 pb-4 md:pb-6 scroll-mt-28 md:scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <FadeInUp delay={0}>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500 mb-2">
              Why Us
            </p>
            <h2 className="mb-3">
              <ShinyHeading
                text="Why Chicago Chooses VoltGuard"
                className="text-2xl sm:text-3xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-300 max-w-2xl mx-auto">
              From complex commercial grids to precision smart home upgrades, we don&apos;t
              just fix wiring. We future-proof your infrastructure,
            </p>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.15}>
          <div className="scroll-mt-20">
            <WhyUsAccordion />
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
