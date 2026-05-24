"use client"

import Image from "next/image"
import { SERVICES } from "@/lib/constants"

export function ServicesMobileCarousel() {
  return (
    <div className="md:hidden w-full" role="region" aria-label="Browse electrical services">
      <p className="mb-4 text-center text-xs text-slate-500">Swipe to explore our services</p>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SERVICES.map((service) => (
          <article
            key={service.id}
            className="w-[min(78vw,260px)] shrink-0 snap-center flex flex-col"
          >
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10">
              <Image
                src={service.image}
                alt={service.title}
                fill
                draggable={false}
                className="object-cover"
                sizes="78vw"
              />
            </div>
            <h3 className="mt-3 min-h-[2.5rem] w-full text-center text-sm font-semibold text-white leading-snug px-1">
              {service.title}
            </h3>
          </article>
        ))}
      </div>
    </div>
  )
}
