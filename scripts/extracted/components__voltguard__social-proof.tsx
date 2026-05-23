"use client"

import clsx from "clsx"
import Image from "next/image"
import { Star } from "lucide-react"
import { ScrollObserver } from "@/components/ScrollObserver"
import { TESTIMONIALS } from "@/lib/constants"

function ReviewStats({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={clsx(
        "flex justify-center items-center gap-8 sm:gap-10 w-full max-w-md",
        compact ? "pt-4" : "border-t border-slate-800 pt-6 mt-8"
      )}
    >
      <div className="text-center flex-1">
        <p className={clsx("font-bold text-white mb-0.5", compact ? "text-2xl" : "text-3xl sm:text-4xl")}>
          2,847
        </p>
        <p className="text-slate-400 text-xs sm:text-sm leading-tight">Chicago families served this year</p>
      </div>
      <div className="w-px h-10 bg-slate-700 shrink-0" />
      <div className="text-center flex-1">
        <div className="flex items-center justify-center gap-1 mb-0.5">
          <span className={clsx("font-bold text-white", compact ? "text-2xl" : "text-3xl sm:text-4xl")}>
            4.9
          </span>
          <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
        </div>
        <p className="text-slate-400 text-xs sm:text-sm">Average rating</p>
      </div>
    </div>
  )
}

export function SocialProof() {
  return (
    <section className="bg-slate-900 py-10 md:py-14 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop */}
        <div className="hidden lg:block">
          <ScrollObserver
            className="relative grid grid-cols-2 gap-10 xl:gap-14"
            defaultActiveId={`review-${TESTIMONIALS[0].id}`}
          >
            {(isHidden) => (
              <>
                <ScrollObserver.TriggerGroup className="pb-[12vh]">
                  {TESTIMONIALS.map((testimonial) => (
                    <ScrollObserver.Trigger
                      id={`review-${testimonial.id}`}
                      key={testimonial.id}
                      className="relative min-h-screen flex items-center justify-center"
                    >
                      {(isActive) => (
                        <div
                          className={clsx(
                            isActive ? "text-white" : "text-white/15 hover:text-white/35",
                            "relative w-full rounded-2xl p-6 xl:p-8 transition-colors duration-300",
                            isActive && "bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={clsx(
                                  "w-4 h-4",
                                  isActive
                                    ? "text-orange-500 fill-orange-500"
                                    : "text-white/20 fill-white/20"
                                )}
                              />
                            ))}
                          </div>
                          <blockquote className="text-2xl xl:text-3xl font-bold leading-snug mb-5">
                            &ldquo;{testimonial.quote}&rdquo;
                          </blockquote>
                          <p className="text-lg font-semibold">{testimonial.author}</p>
                          <p className="text-slate-400 mt-1">{testimonial.location}</p>
                        </div>
                      )}
                    </ScrollObserver.Trigger>
                  ))}
                </ScrollObserver.TriggerGroup>

                <div className="sticky top-0 h-screen flex flex-col items-center justify-center self-start px-2">
                  <h2 className="text-2xl xl:text-[2rem] font-bold text-white text-center mb-4 max-w-md shrink-0">
                    Real Stories. Real Proof
                  </h2>

                  <div className="relative w-full max-w-md h-[min(42vh,420px)] min-h-[240px] shrink-0">
                    <div
                      className={clsx(
                        { "opacity-100": isHidden, "opacity-0": !isHidden },
                        "absolute inset-0 flex items-center transition-opacity duration-500"
                      )}
                    >
                      <div className="h-full w-full rounded-3xl bg-white/10 border border-white/10" />
                    </div>

                    <ScrollObserver.ReactorGroup className="absolute inset-0">
                      {TESTIMONIALS.map((testimonial) => (
                        <ScrollObserver.Reactor
                          key={testimonial.id}
                          id={`review-${testimonial.id}`}
                        >
                          {() => (
                            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/15">
                              <Image
                                src={testimonial.image}
                                alt={testimonial.author}
                                fill
                                className="object-cover"
                                sizes="400px"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-12">
                                <p className="text-white font-semibold text-lg">
                                  {testimonial.author}
                                </p>
                                <p className="text-slate-300 text-sm">{testimonial.location}</p>
                              </div>
                            </div>
                          )}
                        </ScrollObserver.Reactor>
                      ))}
                    </ScrollObserver.ReactorGroup>
                  </div>

                  <ReviewStats compact />
                </div>
              </>
            )}
          </ScrollObserver>
        </div>

        {/* Mobile / tablet */}
        <div className="lg:hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Real Stories. Real Proof
          </h2>
          <div className="space-y-10">
            {TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-2xl overflow-hidden bg-slate-800/60 border border-slate-700"
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                    ))}
                  </div>
                  <blockquote className="text-slate-200 leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-slate-500 text-sm">{testimonial.location}</p>
                </div>
              </article>
            ))}
          </div>
          <ReviewStats />
        </div>
      </div>
    </section>
  )
}
