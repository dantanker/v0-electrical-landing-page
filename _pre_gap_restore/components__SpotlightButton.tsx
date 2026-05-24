"use client"

import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotlightButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  type?: "button" | "submit" | "reset"
  glowRgb?: string
  disabled?: boolean
}

export function SpotlightButtonLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "relative mt-px bg-gradient-to-b from-white to-orange-50 bg-clip-text text-lg font-semibold text-transparent transition-all duration-200",
        className
      )}
    >
      {children}
    </span>
  )
}

export const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  children,
  onClick,
  href,
  className = "",
  type = "button",
  glowRgb = "255, 154, 0",
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    const element = href ? anchorRef.current : buttonRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const sharedClassName = cn(
    "relative group overflow-hidden rounded-xl border border-orange-300 bg-orange-500 px-6 py-3 font-medium text-white shadow-[0_0_24px_rgba(255,154,0,0.45)] transition-all duration-300 hover:border-orange-200 hover:bg-orange-400 hover:shadow-[0_0_36px_rgba(255,154,0,0.65)] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 inline-flex items-center justify-center",
    className
  )

  const sharedStyle = {
    "--mouse-x": `${coords.x}px`,
    "--mouse-y": `${coords.y}px`,
  } as React.CSSProperties

  const content = (
    <>
      {isHovered && !disabled && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100 mix-blend-screen"
          style={{
            background: `radial-gradient(140px circle at var(--mouse-x) var(--mouse-y), rgba(${glowRgb}, 0.55), transparent 80%)`,
          }}
        />
      )}

      {isHovered && !disabled && (
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
    </>
  )

  if (href) {
    return (
      <a
        ref={anchorRef}
        href={disabled ? undefined : href}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled || undefined}
        className={sharedClassName}
        style={sharedStyle}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={sharedClassName}
      style={sharedStyle}
    >
      {content}
    </button>
  )
}
