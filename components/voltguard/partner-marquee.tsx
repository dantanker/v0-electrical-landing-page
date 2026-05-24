"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const PARTNERS = [
  { id: "voltrex", label: "Voltrex" },
  { id: "electra-power", label: "Electra Power" },
  { id: "brightline", label: "Brightline" },
  { id: "helix-energy", label: "Helix Energy" },
  { id: "coronex", label: "Coronex" },
  { id: "siemens", label: "Siemens" },
] as const

function PartnerLogoDesktop({
  id,
  label,
}: {
  id: (typeof PARTNERS)[number]["id"]
  label: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex h-8 shrink-0 items-center md:h-9">
      {failed ? (
        <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/partners/${id}.png`}
          alt={label}
          className="partner-logo-mark"
          draggable={false}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

function PartnerLogoMobile({
  id,
  label,
}: {
  id: (typeof PARTNERS)[number]["id"]
  label: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex h-8 shrink-0 items-center">
      {failed ? (
        <span className="inline-flex h-8 shrink-0 items-center rounded-full border border-slate-700/70 bg-slate-800/60 px-4 text-[11px] font-medium text-slate-300 whitespace-nowrap">
          {label}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/partners/${id}.png`}
          alt={label}
          className="partner-logo-mark partner-logo-mark--mobile"
          draggable={false}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

function PartnerMarqueeSegment({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      {PARTNERS.map((partner) =>
        mobile ? (
          <PartnerLogoMobile key={partner.id} id={partner.id} label={partner.label} />
        ) : (
          <PartnerLogoDesktop key={partner.id} id={partner.id} label={partner.label} />
        )
      )}
    </>
  )
}

/** Dual-strip loop — trailing pad must match item gap for seamless scroll */
function PartnerMarqueeLoop({
  mobile = false,
  contained = false,
}: {
  mobile?: boolean
  contained?: boolean
}) {
  const itemGap = mobile ? "gap-6" : "gap-8 lg:gap-12"
  const segmentPad = mobile ? "pr-6" : "pr-8 lg:pr-12"

  return (
    <div
      className={cn(
        mobile
          ? "partner-marquee-mobile-viewport w-full min-w-0 overflow-hidden"
          : "partner-marquee-viewport w-full min-w-0 overflow-hidden",
        !mobile && !contained && "px-4 sm:px-6 lg:px-8"
      )}
    >
      <div
        className={cn(
          "partner-marquee-loop flex w-max items-center",
          mobile && "partner-marquee-loop--mobile"
        )}
      >
        <div
          className={cn(
            "partner-marquee-segment flex shrink-0 items-center",
            itemGap,
            segmentPad
          )}
        >
          <PartnerMarqueeSegment mobile={mobile} />
        </div>
        <div
          className={cn(
            "partner-marquee-segment flex shrink-0 items-center",
            itemGap,
            segmentPad
          )}
          aria-hidden
        >
          <PartnerMarqueeSegment mobile={mobile} />
        </div>
      </div>
    </div>
  )
}

function PartnerMarqueeHeading() {
  return (
    <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
      Trusted Partners & Affiliates
    </p>
  )
}
/** Desktop hero — pinned to bottom of hero image */
export function PartnerMarquee() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 hidden bg-transparent md:block"
      aria-label="Partner company logos"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
        <PartnerMarqueeLoop contained />
      </div>
    </div>
  )
}

/** Mobile — full-width strip directly below hero */
export function PartnerMarqueeBelowHero() {
  return (
    <div
      className="relative z-10 isolate border-y border-slate-800/80 bg-transparent md:hidden"
      aria-label="Partner company logos"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <PartnerMarqueeLoop mobile contained />
      </div>
    </div>
  )
}

export function PartnerMarqueeStrip() {
  return (
    <div className="relative py-3" aria-label="Partner company logos">
      <PartnerMarqueeHeading />
      <PartnerMarqueeLoop contained />
    </div>
  )
}

export function PartnerMarqueeInline() {
  return (
    <div aria-label="Partner company logos" className="w-full min-w-0">
      <PartnerMarqueeHeading />
      <div className="md:hidden">
        <PartnerMarqueeLoop mobile contained />
      </div>
      <div className="hidden md:block">
        <PartnerMarqueeLoop contained />
      </div>
    </div>
  )
}
