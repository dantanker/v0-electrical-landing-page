"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

interface ParallaxImage {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  images: ParallaxImage[]
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 2.85])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 3.75])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 4.5])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 6.75])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  const positionClasses = [
    "",
    "[&>div]:!-top-[31vh] [&>div]:!left-[3vw] [&>div]:!h-[29vh] [&>div]:!w-[33vw]",
    "[&>div]:!-top-[11vh] [&>div]:!-left-[27vw] [&>div]:!h-[43vh] [&>div]:!w-[19vw]",
    "[&>div]:!left-[31vw] [&>div]:!h-[24vh] [&>div]:!w-[24vw]",
    "[&>div]:!top-[29vh] [&>div]:!left-[3vw] [&>div]:!h-[24vh] [&>div]:!w-[19vw]",
    "[&>div]:!top-[29vh] [&>div]:!-left-[26vw] [&>div]:!h-[24vh] [&>div]:!w-[28vw]",
    "[&>div]:!top-[23vh] [&>div]:!left-[29vw] [&>div]:!h-[14vh] [&>div]:!w-[14vw]",
  ]

  return (
    <div ref={container} className="relative h-[115vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length]
          const isHero = index === 0

          return (
            <motion.div
              key={src}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${positionClasses[index] ?? ""}`}
            >
              <div
                className={`relative overflow-hidden rounded-xl shadow-xl ring-1 ring-white/10 ${
                  isHero ? "h-[30vh] w-[30vw]" : "h-[25vh] w-[25vw]"
                }`}
              >
                <Image
                  src={src}
                  alt={alt || `Project photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="35vw"
                  draggable={false}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
