"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQS } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"
import { FadeInUp, BlurIn } from "@/lib/scroll-animations"

export function FAQSection() {
  const handleAccordionChange = (value: string) => {
    if (value) {
      trackEvent(EVENTS.FAQ_EXPAND, { questionId: value })
    }
  }

  return (
    <section 
      id="faq" 
      className="py-16 md:py-24 scroll-mt-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/voltguard-van-v2-ocWRpVHAqti5NUR5ti3SVbFzEUGiBD.jpg)',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <FadeInUp delay={0}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-lg">
              Frequently Asked Questions
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-100 drop-shadow">
              Got questions? {"We've"} got answers.
            </p>
          </FadeInUp>
        </div>

        <Accordion 
          type="single" 
          collapsible 
          defaultValue="response-time"
          onValueChange={handleAccordionChange}
          className="space-y-4"
        >
          {FAQS.map((faq, index) => (
            <BlurIn key={faq.id} delay={index * 0.08}>
              <AccordionItem 
                value={faq.id}
                className="bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-lg px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left text-slate-900 font-medium hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </BlurIn>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
