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

function PartnerLogoDesktop({
  id,
  label,
}: {
  id: (typeof PARTNERS)[number]["id"]
  label: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex h-9 w-[6.5rem] shrink-0 items-center justify-center">
      {failed ? (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/partners/${id}.png`}
          alt={label}
          className="partner-logo-mark max-h-9 max-w-[6.5rem] object-contain"
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
          <span
            key={partner.id}
            className="partner-marquee-pill inline-flex h-8 shrink-0 items-center rounded-full border border-slate-700/70 bg-slate-800/60 px-4 text-[11px] font-medium text-slate-300 whitespace-nowrap"
          >
            {partner.label}
          </span>
        ) : (
          <PartnerLogoDesktop key={partner.id} id={partner.id} label={partner.label} />
        )
      )}
    </>
  )
}

/** Dual-strip loop — two equal segments, animate -50% for seamless scroll */
function PartnerMarqueeLoop({ mobile = false }: { mobile?: boolean }) {
  const gapClass = mobile ? "gap-5" : "gap-8 md:gap-12"
  const viewportClass = mobile
    ? "partner-marquee-mobile-viewport overflow-hidden w-full"
    : "partner-marquee-viewport w-full min-w-0 overflow-hidden px-4"

  return (
    <div className={viewportClass}>
      <div className={`partner-marquee-loop flex w-max ${mobile ? "partner-marquee-loop--mobile" : ""}`}>
        <div className={`partner-marquee-segment flex shrink-0 items-center ${gapClass} pr-5 md:pr-12`}>
          <PartnerMarqueeSegment mobile={mobile} />
        </div>
        <div
          className={`partner-marquee-segment flex shrink-0 items-center ${gapClass} pr-5 md:pr-12`}
          aria-hidden
        >
          <PartnerMarqueeSegment mobile={mobile} />
        </div>
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
      <div className="py-5 md:py-6">
        <PartnerMarqueeLoop />
      </div>
    </div>
  )
}

/** Mobile — full-width strip directly below hero */
export function PartnerMarqueeBelowHero() {
  return (
    <div
      className="relative z-10 isolate border-y border-slate-800/80 bg-slate-950 md:hidden"
      aria-label="Partner company logos"
    >
      <div className="py-4">
        <p className="mb-3 px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Trusted Partners & Affiliates
        </p>
        <PartnerMarqueeLoop mobile />
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
      <PartnerMarqueeLoop />
    </div>
  )
}

export function PartnerMarqueeInline() {
  return (
    <div aria-label="Partner company logos" className="w-full min-w-0">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Trusted Partners & Affiliates
      </p>
      <div className="md:hidden">
        <PartnerMarqueeLoop mobile />
      </div>
      <div className="hidden md:block">
        <PartnerMarqueeLoop />
      </div>
    </div>
  )
}
