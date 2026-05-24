"use client"

import {
  SpotlightButton,
  SpotlightButtonLabel,
} from "@/components/SpotlightButton"
import { CTA_LABEL } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useQuoteModal } from "./quote-modal-provider"

type QuoteCtaButtonProps = {
  location: string
  className?: string
  labelClassName?: string
  label?: string
  fullWidth?: boolean
  onAfterClick?: () => void
}

export function QuoteCtaButton({
  location,
  className,
  labelClassName,
  label,
  fullWidth = false,
  onAfterClick,
}: QuoteCtaButtonProps) {
  const { openQuoteModal } = useQuoteModal()

  const handleClick = () => {
    openQuoteModal(location)
    onAfterClick?.()
  }

  return (
    <SpotlightButton
      onClick={handleClick}
      className={cn(fullWidth && "w-full", className)}
    >
      <SpotlightButtonLabel className={labelClassName}>
        {label ?? CTA_LABEL}
      </SpotlightButtonLabel>
    </SpotlightButton>
  )
}
