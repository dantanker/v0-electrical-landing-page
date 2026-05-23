import { Clock, Shield, BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { WARRANTY_YEARS } from "@/lib/constants"
import { FadeInUp, WaveItem } from "@/lib/scroll-animations"

const guarantees = [
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "Book by 2 PM, we'll be there today.",
  },
  {
    icon: Shield,
    title: `${WARRANTY_YEARS}-Year Warranty`,
    description: "All repairs backed by our written guarantee.",
  },
  {
    icon: BadgeCheck,
    title: "Price Match",
    description: "Found a lower quote? We'll beat it by 10%.",
  },
]

export function GuaranteeSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeInUp delay={0}>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Our Guarantees
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We stand behind every job with clear promises — no fine print.
            </p>
          </FadeInUp>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {guarantees.map((guarantee, index) => (
            <WaveItem key={guarantee.title} index={index} delay={0.15}>
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                    <guarantee.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {guarantee.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {guarantee.description}
                  </p>
                </CardContent>
              </Card>
            </WaveItem>
          ))}
        </div>
      </div>
    </section>
  )
}
