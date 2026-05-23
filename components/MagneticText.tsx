"use client"

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ElementType,
  type ReactNode,
} from "react"
import { motion, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

type MagneticTextContextValue = {
  containerRef: React.RefObject<HTMLElement | null>
  mouseX: number
  mouseY: number
  radius: number
  strength: number
}

const MagneticTextContext = createContext<MagneticTextContextValue | null>(null)

function useMagneticTextContext() {
  const context = useContext(MagneticTextContext)
  if (!context) {
    throw new Error("MagneticText.Token must be used within MagneticText")
  }
  return context
}

function smoothstep(fallback: number) {
  const t = Math.max(0, Math.min(1, fallback))
  return t * t * (3 - 2 * t)
}

type MagneticTextRootProps = {
  body: string
  as?: ElementType
  className?: string
  radius?: number
  strength?: number
  children: (tokens: string[]) => ReactNode
}

function MagneticTextRoot({
  body,
  as: Component = "div",
  className,
  radius = 120,
  strength = 0.35,
  children,
}: MagneticTextRootProps) {
  const tokens = useMemo(() => body.split(""), [body])
  const containerRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })

  const updateMouse = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    setMouse({ x: clientX - rect.left, y: clientY - rect.top })
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      updateMouse(event.clientX, event.clientY)
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) updateMouse(touch.clientX, touch.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [updateMouse])

  return (
    <MagneticTextContext.Provider
      value={{ containerRef, mouseX: mouse.x, mouseY: mouse.y, radius, strength }}
    >
      <Component ref={containerRef as never} className={className}>
        {children(tokens)}
        <span className="sr-only">{body}</span>
      </Component>
    </MagneticTextContext.Provider>
  )
}

type MagneticTextTokenProps = {
  body: string
  className?: string
}

function MagneticTextToken({ body, className }: MagneticTextTokenProps) {
  const { containerRef, mouseX, mouseY, radius, strength } = useMagneticTextContext()
  const tokenRef = useRef<HTMLSpanElement>(null)
  const x = useSpring(0, { stiffness: 280, damping: 22, mass: 0.4 })
  const y = useSpring(0, { stiffness: 280, damping: 22, mass: 0.4 })

  useEffect(() => {
    if (body === " ") {
      x.set(0)
      y.set(0)
      return
    }

    const container = containerRef.current
    const token = tokenRef.current
    if (!container || !token) return

    const containerRect = container.getBoundingClientRect()
    const rect = token.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2 - containerRect.left
    const centerY = rect.top + rect.height / 2 - containerRect.top

    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance >= radius || mouseX < -1000) {
      x.set(0)
      y.set(0)
      return
    }

    const falloff = smoothstep(1 - distance / radius)
    const pull = falloff * strength

    x.set(dx * pull)
    y.set(dy * pull)
  }, [body, containerRef, mouseX, mouseY, radius, strength, x, y])

  if (body === " ") {
    return <span className={cn(className, "inline-block")}>&nbsp;</span>
  }

  return (
    <motion.span
      ref={tokenRef}
      style={{ x, y }}
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      {body}
    </motion.span>
  )
}

export const MagneticText = Object.assign(MagneticTextRoot, {
  Token: MagneticTextToken,
})
