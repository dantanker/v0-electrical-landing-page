"use client"

import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotlightButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
  glowRgb?: string
}

export const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  glowRgb = "6, 182, 212",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-950 px-6 py-3 font-medium text-slate-200 transition-all duration-300 hover:text-white hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      style={
        {
          "--mouse-x": `${coords.x}px`,
          "--mouse-y": `${coords.y}px`,
        } as React.CSSProperties
      }
    >
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100 mix-blend-screen"
          style={{
            background: `radial-gradient(120px circle at var(--mouse-x) var(--mouse-y), rgba(${glowRgb}, 0.15), transparent 80%)`,
          }}
        />
      )}

      {isHovered && (
        <div
          className="absolute inset-[-1px] pointer-events-none rounded-xl transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(80px circle at var(--mouse-x) var(--mouse-y), rgb(${glowRgb}), transparent 70%)`,
            maskImage:
              "linear-gradient(white, white) exclude, linear-gradient(white, white)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  )
}
