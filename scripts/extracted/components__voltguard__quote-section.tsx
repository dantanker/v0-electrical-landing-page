import { LeadCaptureForm } from "./lead-capture-form"
import { FadeInUp } from "@/lib/scroll-animations"
import { SITE_HEADLINE } from "@/lib/constants"

export function QuoteSection() {
  return (
    <section
      id="quote-form"
      className="bg-slate-900 py-16 md:py-24 scroll-mt-20"
      aria-label="Request a free quote"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp delay={0}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {SITE_HEADLINE}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Tell us about your project and we&apos;ll get back to you with a free quote.
            </p>
          </div>
        </FadeInUp>
        <div className="max-w-md mx-auto">
          <LeadCaptureForm />
        </div>
      </div>
    </section>
  )
}
