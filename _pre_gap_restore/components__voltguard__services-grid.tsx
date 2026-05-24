"use client"

import { ServicesArcGallery } from "./services-arc-gallery"
import { ShinyHeading } from "@/components/ShinyText"
import { FadeInUp } from "@/lib/scroll-animations"

export function ServicesGrid() {
  return (
    <section
      id="services"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/40"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(59, 130, 246, 0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-14 pb-5 md:pb-6">
        <div className="text-center">
          <FadeInUp delay={0}>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500 mb-2">
              What We Do
            </p>
            <h2 className="mb-3">
              <ShinyHeading
                text="Our Services"
                className="text-3xl sm:text-4xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
              Explore our complete range of electrical solutions.
            </p>
          </FadeInUp>
        </div>
      </div>

      <div className="relative z-10 w-full h-[580px] md:h-[680px]">
        <ServicesArcGallery />
      </div>
    </section>
  )
}
