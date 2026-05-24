"use client"

import {
  SpotlightButton,
  SpotlightButtonLabel,
} from "@/components/SpotlightButton"
import { CTA_LABEL, QUOTE_FORM_ID } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"
import { cn } from "@/lib/utils"

type QuoteCtaButtonProps = {
  location: string
  className?: string
  fullWidth?: boolean
  onAfterClick?: () => void
}

export function QuoteCtaButton({
  location,
  className,
  fullWidth = false,
  onAfterClick,
}: QuoteCtaButtonProps) {
  const scrollToQuote = () => {
    trackEvent(EVENTS.CTA_CLICK, { location })
    const formElement = document.getElementById(QUOTE_FORM_ID)
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
    onAfterClick?.()
  }

  return (
    <SpotlightButton
      onClick={scrollToQuote}
      className={cn(fullWidth && "w-full", className)}
    >
      <SpotlightButtonLabel>{CTA_LABEL}</SpotlightButtonLabel>
    </SpotlightButton>
  )
}
