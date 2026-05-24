"use client"

import { useState } from "react"

const PARTNERS = [
  { id: "voltrex", label: "Voltrex" },
  { id: "electra-power", label: "Electra Power" },
  { id: "brightline", label: "Brightline" },
  { id: "helix-energy", label: "Helix Energy" },
  { id: "coronex", label: "Coronex" },
  { id: "siemens", label: "Siemens" },
] as const

/** Two identical sets — animation moves exactly one set width for a seamless loop */
const MARQUEE_ITEMS = [...PARTNERS, ...PARTNERS] as const

function PartnerLogo({
  id,
  label,
}: {
  id: (typeof PARTNERS)[number]["id"]
  label: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-800/60 px-3 py-1 text-[11px] font-medium text-slate-300 whitespace-nowrap">
        {label}
      </span>
    )
  }

  return (
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
  )
}

function PartnerMarqueeTrack() {
  return (
    <div className="partner-marquee-viewport w-full min-w-0 overflow-hidden">
      <div className="partner-marquee-track flex w-max items-center gap-8 md:gap-12">
        {MARQUEE_ITEMS.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex h-8 shrink-0 items-center md:h-9"
            aria-hidden={index >= PARTNERS.length ? true : undefined}
          >
            <PartnerLogo id={partner.id} label={partner.label} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Desktop hero — pinned to bottom of hero image */
export function PartnerMarquee() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 hidden bg-transparent md:block"
      aria-label="Partner company logos"
    >
      <div className="px-4 py-5 md:py-6">
        <PartnerMarqueeTrack />
      </div>
    </div>
  )
}

/** Mobile — full-width strip directly below hero */
export function PartnerMarqueeBelowHero() {
  return (
    <div
      className="relative z-10 border-y border-slate-800/80 bg-slate-950/95 md:hidden"
      aria-label="Partner company logos"
    >
      <div className="py-4">
        <p className="mb-3 px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Trusted Partners & Affiliates
        </p>
        <PartnerMarqueeTrack />
      </div>
    </div>
  )
}

export function PartnerMarqueeStrip() {
  return (
    <div className="relative py-3" aria-label="Partner company logos">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Trusted Partners & Affiliates
      </p>
      <PartnerMarqueeTrack />
    </div>
  )
}

export function PartnerMarqueeInline() {
  return (
    <div aria-label="Partner company logos" className="w-full min-w-0">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Trusted Partners & Affiliates
      </p>
      <PartnerMarqueeTrack />
    </div>
  )
}
