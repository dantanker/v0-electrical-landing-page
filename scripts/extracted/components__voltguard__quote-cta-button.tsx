"use client"

import { Button } from "@/components/ui/button"
import { CTA_LABEL, QUOTE_FORM_ID } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"
import { cn } from "@/lib/utils"

type QuoteCtaButtonProps = {
  location: string
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  fullWidth?: boolean
}

export function QuoteCtaButton({
  location,
  className,
  size = "lg",
  fullWidth = false,
}: QuoteCtaButtonProps) {
  const scrollToQuote = () => {
    trackEvent(EVENTS.CTA_CLICK, { location })
    const formElement = document.getElementById(QUOTE_FORM_ID)
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Button
      onClick={scrollToQuote}
      size={size}
      className={cn(
        "bg-orange-500 hover:bg-orange-600 text-white font-semibold",
        fullWidth && "w-full",
        className
      )}
    >
      {CTA_LABEL}
    </Button>
  )
}
