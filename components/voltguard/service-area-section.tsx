import { Clock, MapPin, Shield, Zap } from "lucide-react"
import { ShinyHeading } from "@/components/ShinyText"
import { ShieldMap } from "@/components/voltguard/shield-map"
import { SERVICE_AREA_CITIES } from "@/lib/constants"
import { FadeInUp, SlideInLeft, SlideInRight } from "@/lib/scroll-animations"

const highlights = [
  {
    icon: Zap,
    title: "42-Min Response",
    description: "Fast dispatch across the northwest suburbs.",
  },
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "Fully credentialed crews on every job.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency",
    description: "Power outages don't wait — neither do we.",
  },
]

export function ServiceAreaSection() {
  return (
    <section id="service-area" className="relative scroll-mt-20 py-16 md:py-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(37,99,235,0.18), transparent 70%), radial-gradient(ellipse 50% 40% at 85% 40%, rgba(249,115,22,0.12), transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <FadeInUp delay={0}>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500 mb-2">
              VoltGuard Protected
            </p>
            <h2 className="mb-4">
              <ShinyHeading
                text="Our Service Area"
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
              Trusted electrical service across Chicago&apos;s northwest suburbs — where
              our shield of protection covers your home and business.
            </p>
          </FadeInUp>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <SlideInLeft delay={0.15}>
            <div className="space-y-8">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                  <MapPin className="h-5 w-5 text-orange-400" />
                  Cities We Serve
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICE_AREA_CITIES.map((city) => (
                    <li
                      key={city}
                      className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-slate-200 transition-colors hover:border-orange-500/40 hover:bg-slate-800"
                    >
                      <span className="flex h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                      {city}
                    </li>
                  ))}
                  <li className="flex items-center gap-3 rounded-xl border border-dashed border-slate-600/80 bg-slate-900/40 px-4 py-3 text-slate-400 italic sm:col-span-2">
                    & surrounding northwest suburban communities
                  </li>
                </ul>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-center sm:text-left"
                  >
                    <div className="mx-auto sm:mx-0 mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/25">
                      <item.icon className="h-5 w-5 text-blue-300" />
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </SlideInLeft>

          <SlideInRight delay={0.2}>
            <ShieldMap />
          </SlideInRight>
        </div>
      </div>
    </section>
  )
}
