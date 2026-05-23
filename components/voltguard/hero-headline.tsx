"use client"

import { ShinyHeading } from "@/components/ShinyText"
import { SITE_HEADLINE } from "@/lib/constants"
import { FadeInUp } from "@/lib/scroll-animations"

export function HeroHeadline() {
  return (
    <FadeInUp delay={0}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
        <ShinyHeading
          text={SITE_HEADLINE}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
        />
      </h1>
    </FadeInUp>
  )
}
