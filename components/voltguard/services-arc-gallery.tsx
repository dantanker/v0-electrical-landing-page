"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import Image from "next/image"
import { SERVICES } from "@/lib/constants"

const DESKTOP_CARD_WIDTH = 280
const DESKTOP_CARD_GAP = 28
const SERVICE_COUNT = SERVICES.length

/** Three copies for seamless infinite scroll */
const galleryServices = [...SERVICES, ...SERVICES, ...SERVICES]

function getGalleryDimensions(containerWidth: number) {
  const isDesktop = containerWidth >= 768
  const cardWidth = isDesktop
    ? DESKTOP_CARD_WIDTH
    : Math.min(DESKTOP_CARD_WIDTH, Math.max(220, Math.round(containerWidth * 0.72)))
  const cardGap = isDesktop ? DESKTOP_CARD_GAP : 20
  const stride = cardWidth + cardGap
  const setWidth = SERVICE_COUNT * stride

  return { cardWidth, cardGap, stride, setWidth }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function ServicesArcGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLElement | null)[]>([])

  const dimsRef = useRef(getGalleryDimensions(375))
  const [dims, setDims] = useState(getGalleryDimensions(375))

  const currentX = useRef(dimsRef.current.setWidth)
  const targetX = useRef(dimsRef.current.setWidth)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartOffset = useRef(0)
  const velocity = useRef(0)
  const lastPointerX = useRef(0)
  const lastPointerTime = useRef(0)
  const rafId = useRef(0)

  const normalizeScroll = useCallback(() => {
    const { setWidth } = dimsRef.current
    while (targetX.current >= setWidth * 2) {
      targetX.current -= setWidth
      currentX.current -= setWidth
    }
    while (targetX.current < setWidth) {
      targetX.current += setWidth
      currentX.current += setWidth
    }
  }, [])

  const updateCardTransforms = useCallback((scrollX: number) => {
    const container = containerRef.current
    if (!container) return

    const { cardWidth: width, stride } = dimsRef.current
    const containerWidth = container.clientWidth
    const centerX = containerWidth / 2
    const paddingLeft = centerX - width / 2

    cardsRef.current.forEach((card, index) => {
      if (!card) return
      const cardCenter = paddingLeft + index * stride + width / 2 - scrollX
      const offset = cardCenter - centerX
      const norm = Math.max(-1, Math.min(1, offset / centerX))

      const rotate = norm * 12
      const arcY = -28 * (1 - Math.abs(norm))
      const scale = 1 - Math.abs(norm) * 0.08

      card.style.transform = `translate3d(0, ${arcY}px, 0) rotate(${rotate}deg) scale(${scale})`
    })
  }, [])

  const applyTrackPosition = useCallback(
    (x: number) => {
      const track = trackRef.current
      if (track) {
        track.style.transform = `translate3d(${-x}px, 0, 0)`
      }
      updateCardTransforms(x)
    },
    [updateCardTransforms]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const syncDimensions = () => {
      const next = getGalleryDimensions(container.clientWidth)
      dimsRef.current = next
      setDims(next)
      normalizeScroll()
      applyTrackPosition(currentX.current)
    }

    syncDimensions()
    const ro = new ResizeObserver(syncDimensions)
    ro.observe(container)

    return () => ro.disconnect()
  }, [applyTrackPosition, normalizeScroll])

  useEffect(() => {
    const tick = () => {
      if (!isDragging.current && Math.abs(velocity.current) > 0.2) {
        targetX.current += velocity.current
        velocity.current *= 0.93
      } else if (!isDragging.current) {
        velocity.current = 0
      }

      if (isDragging.current) {
        currentX.current = targetX.current
      } else {
        currentX.current = lerp(currentX.current, targetX.current, 0.12)
      }

      normalizeScroll()
      applyTrackPosition(currentX.current)
      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    applyTrackPosition(currentX.current)

    return () => cancelAnimationFrame(rafId.current)
  }, [applyTrackPosition, normalizeScroll])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const container = containerRef.current
    if (!container) return

    e.preventDefault()
    isDragging.current = true
    velocity.current = 0
    dragStartX.current = e.clientX
    dragStartOffset.current = targetX.current
    lastPointerX.current = e.clientX
    lastPointerTime.current = performance.now()
    container.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return

    const now = performance.now()
    const dt = Math.max(now - lastPointerTime.current, 1)
    const dx = e.clientX - lastPointerX.current
    velocity.current = (-dx / dt) * 14

    lastPointerX.current = e.clientX
    lastPointerTime.current = now

    targetX.current = dragStartOffset.current - (e.clientX - dragStartX.current)
    currentX.current = targetX.current
    normalizeScroll()
    applyTrackPosition(currentX.current)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    containerRef.current?.releasePointerCapture(e.pointerId)
  }

  /** Only horizontal wheel adjusts gallery — vertical scroll goes to the page */
  const onWheel = (e: React.WheelEvent) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
    if (!isHorizontal && !e.shiftKey) return

    e.preventDefault()
    const delta = e.shiftKey ? e.deltaY : e.deltaX !== 0 ? e.deltaX : e.deltaY
    targetX.current += delta
    velocity.current = 0
  }

  const { cardWidth, cardGap } = dims

  return (
    <div
      ref={containerRef}
      className="services-arc-gallery relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y max-md:overscroll-contain"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      role="region"
      aria-label="Browse electrical services"
    >
      <div
        ref={trackRef}
        className="flex h-full items-start gap-5 py-3 will-change-transform md:gap-7 md:py-4"
        style={{
          width: "max-content",
          paddingLeft: `calc(50% - ${cardWidth / 2}px)`,
          paddingRight: `calc(50% - ${cardWidth / 2}px)`,
          columnGap: cardGap,
        }}
      >
        {galleryServices.map((service, index) => (
          <article
            key={`${service.id}-${index}`}
            ref={(el) => {
              cardsRef.current[index] = el
            }}
            className="flex shrink-0 flex-col items-center will-change-transform pointer-events-none"
            style={{ width: cardWidth }}
          >
            <div className="relative w-full h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden rounded-xl">
              <Image
                src={service.image}
                alt={service.title}
                fill
                draggable={false}
                className="object-cover pointer-events-none select-none"
                sizes="(max-width: 767px) 72vw, 280px"
              />
            </div>
            <h3 className="mt-3 w-full text-center text-sm sm:text-base md:text-lg font-semibold text-white leading-snug px-1 md:mt-4">
              {service.title}
            </h3>
          </article>
        ))}
      </div>
    </div>
  )
}
