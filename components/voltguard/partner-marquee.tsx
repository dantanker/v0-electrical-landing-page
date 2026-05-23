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
      loading="eager"
      decoding="async"
    />
  )
}

export function PartnerMarquee() {
  const track = [...PARTNERS, ...PARTNERS, ...PARTNERS]

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 bg-transparent"
      aria-label="Partner company logos"
    >
      <div className="partner-marquee-mask overflow-hidden px-4 py-5 md:py-6">
        <div className="partner-marquee-track flex w-max items-center gap-10 md:gap-14">
          {track.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex h-9 shrink-0 items-center md:h-10"
            >
              <PartnerLogo id={partner.id} label={partner.label} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
