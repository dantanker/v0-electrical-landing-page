const PARTNERS = [
  { id: "voltrex", label: "Voltrex" },
  { id: "electra-power", label: "Electra Power" },
  { id: "brightline", label: "Brightline" },
  { id: "helix-energy", label: "Helix Energy" },
  { id: "coronex", label: "Coronex" },
  { id: "siemens", label: "Siemens" },
] as const

function PartnerLogo({
  id,
  label,
}: {
  id: (typeof PARTNERS)[number]["id"]
  label: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/partners/${id}.png`}
      alt={label}
      className="partner-logo-mark"
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  )
}

function PartnerMarqueeTrack({ edgeToEdge = false }: { edgeToEdge?: boolean }) {
  const track = [...PARTNERS, ...PARTNERS, ...PARTNERS]

  return (
    <div
      className={
        edgeToEdge
          ? "partner-marquee-mask w-full min-w-0 overflow-hidden"
          : "partner-marquee-mask w-full min-w-0 overflow-hidden px-4"
      }
    >
      <div className="partner-marquee-track flex w-max items-center gap-6 md:gap-12">
        {track.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex h-7 shrink-0 items-center md:h-9"
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
      <div className="py-5 md:py-6">
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
        <PartnerMarqueeTrack edgeToEdge />
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
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 max-md:px-2">
        Trusted Partners & Affiliates
      </p>
      <div className="w-full min-w-0 overflow-hidden max-md:-mx-4 max-md:w-[calc(100%+2rem)] sm:mx-0 sm:w-full">
        <PartnerMarqueeTrack edgeToEdge />
      </div>
    </div>
  )
}
