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

function PartnerMarqueeTrack() {
  const track = [...PARTNERS, ...PARTNERS, ...PARTNERS]

  return (
    <div className="partner-marquee-mask overflow-hidden px-4">
      <div className="partner-marquee-track flex w-max items-center gap-8 md:gap-12">
        {track.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex h-8 shrink-0 items-center md:h-9"
          >
            <PartnerLogo id={partner.id} label={partner.label} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PartnerMarquee() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 bg-transparent"
      aria-label="Partner company logos"
    >
      <div className="py-5 md:py-6">
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
    <div aria-label="Partner company logos">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Trusted Partners & Affiliates
      </p>
      <PartnerMarqueeTrack />
    </div>
  )
}
