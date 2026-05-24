"use client"

import Image from "next/image"

const items = [
  {
    id: "1",
    url: "/why-us/commercial-panels.png",
    title: "Commercial & Industrial",
    description: "Built to Code, Built to Last",
    alt: "Commercial electrical panel and conduit installation",
    tags: ["Panel Upgrades", "Conduit", "Commercial", "Industrial", "Code Compliant"],
  },
  {
    id: "2",
    url: "/why-us/solar-installation.png",
    title: "Solar & Renewables",
    description: "Clean Power, Pro Install",
    alt: "Commercial solar panel and inverter installation on a flat roof",
    tags: ["Solar", "Inverters", "Commercial Roof", "Renewable", "Green Energy"],
  },
  {
    id: "3",
    url: "/why-us/smart-home-kitchen.png",
    title: "Residential & Smart Home",
    description: "Modern Living, Safely Wired",
    alt: "Luxury kitchen with smart appliances and modern lighting",
    tags: ["Smart Home", "Kitchen", "Lighting", "Appliances", "Residential"],
  },
]

export function WhyUsAccordion() {
  return (
    <div className="group flex max-md:flex-col justify-center gap-2 w-full max-w-5xl mx-auto">
      {items.map((item) => (
        <article
          key={item.id}
          className="group/article relative w-full rounded-xl overflow-hidden md:not-[&:hover]:group-hover:w-[20%] md:[&:not(:focus-within):not(:hover)]:group-focus-within:w-[20%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-gradient-to-t before:from-black/60 before:to-transparent before:transition-opacity md:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:opacity-0 md:not-[&:hover]:group-hover:after:opacity-100 md:[&:not(:focus-within):not(:hover)]:group-focus-within:after:opacity-100 after:absolute after:inset-0 after:bg-white/20 after:backdrop-blur-sm after:rounded-lg after:transition-all focus-within:ring-2 focus-within:ring-orange-400"
        >
          <div className="absolute inset-0 z-10 p-3 sm:p-4 flex flex-col justify-end text-white pointer-events-none">
            <p className="text-sm sm:text-base font-medium md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300 group-focus-within/article:delay-300">
              {item.title}
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-500 group-focus-within/article:delay-500">
              {item.description}
            </h3>
          </div>
          <Image
            className="object-cover h-72 md:h-[420px] w-full"
            src={item.url}
            width={960}
            height={480}
            alt={item.alt}
          />
        </article>
      ))}
    </div>
  )
}
