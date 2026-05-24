"use client"

import { useState, type CSSProperties } from "react"
import clsx from "clsx"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { Navigation } from "@/components/Navigation"
import { QuoteCtaButton } from "./quote-cta-button"
import { PHONE_NUMBER } from "@/lib/constants"

const navItems = [
  { label: "Why Us", href: "#why-us" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Locations", href: "#service-area" },
  { label: "FAQs", href: "#faq" },
] as const

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/75 via-black/45 to-transparent pb-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.85))]">
        <div className="flex items-center justify-between gap-2 min-w-0 py-2 md:gap-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex min-w-0 max-w-[46%] shrink items-center group [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.9))] sm:max-w-none"
            aria-label="VoltGuard — go to top"
          >
            <Image
              src="/voltguard-logo-wordmark.png"
              alt="VoltGuard Electrical"
              width={869}
              height={195}
              className="h-[4.25rem] w-auto max-w-full object-contain sm:h-20 md:h-32"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <Navigation
            as="nav"
            className="hidden md:block relative mx-auto max-w-full rounded-2xl bg-white/10 p-1 shadow-[0_4px_20px_rgba(0,0,0,0.65)] backdrop-blur-sm"
            aria-label="Main navigation"
          >
            {({ ready, size, position, duration }) => (
              <div className="relative">
                <div
                  style={
                    {
                      "--size": `${size}px`,
                      "--position": `${position}px`,
                      "--duration": duration,
                    } as CSSProperties
                  }
                  className={clsx(
                    { hidden: !ready },
                    "absolute inset-y-0 left-0 h-full w-[length:var(--size)] translate-x-[length:var(--position)] rounded-lg bg-white/10 transition-[width,transform] duration-[var(--duration)]"
                  )}
                />

                <Navigation.List as="ul" className="relative flex items-center gap-0.5 lg:gap-1">
                  {navItems.map((item) => (
                    <Navigation.Item
                      key={item.href}
                      as="li"
                      onActivated={() => handleNavClick(item.href)}
                    >
                      {({ setActive, isActive }) => (
                        <button
                          type="button"
                          onClick={setActive}
                          className={clsx(
                            isActive ? "text-white" : "text-white/70 hover:text-white",
                            "inline-block whitespace-nowrap px-2.5 py-1.5 text-[13px] font-medium transition-colors lg:px-3.5 lg:text-sm [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]"
                          )}
                        >
                          {item.label}
                        </button>
                      )}
                    </Navigation.Item>
                  ))}
                </Navigation.List>
              </div>
            )}
          </Navigation>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <span className="text-white font-medium whitespace-nowrap [text-shadow:0_2px_10px_rgba(0,0,0,0.95)]">
              {PHONE_NUMBER}
            </span>
            <div className="[filter:drop-shadow(0_4px_14px_rgba(0,0,0,0.85))]">
              <QuoteCtaButton location="header" className="px-6" />
            </div>
          </div>

          {/* Mobile CTA + Menu */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:hidden">
            <QuoteCtaButton
              location="header-mobile-bar"
              label="Free Quote"
              labelClassName="!mt-0 text-[11px] font-semibold leading-none sm:text-xs"
              className="h-9 min-h-9 shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 shadow-md sm:h-10 sm:px-3.5"
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-white transition-colors [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.9))] sm:h-10 sm:w-10"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <Navigation
              as="nav"
              className="relative mx-auto rounded-2xl bg-white/5 p-1.5 mb-4"
              aria-label="Mobile navigation"
            >
              {({ ready, size, position, duration }) => (
                <div className="relative">
                  <div
                    style={
                      {
                        "--size": `${size}px`,
                        "--position": `${position}px`,
                        "--duration": duration,
                      } as CSSProperties
                    }
                    className={clsx(
                      { hidden: !ready },
                      "absolute inset-y-0 left-0 h-full w-[length:var(--size)] translate-x-[length:var(--position)] rounded-lg bg-white/10 transition-[width,transform] duration-[var(--duration)]"
                    )}
                  />

                  <Navigation.List as="ul" className="relative flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Navigation.Item
                        key={item.href}
                        as="li"
                        onActivated={() => handleNavClick(item.href)}
                      >
                        {({ setActive, isActive }) => (
                          <button
                            type="button"
                            onClick={setActive}
                            className={clsx(
                              isActive ? "text-white" : "text-white/60 hover:text-white",
                              "inline-block w-full text-left px-4 py-2 text-sm font-medium transition-colors"
                            )}
                          >
                            {item.label}
                          </button>
                        )}
                      </Navigation.Item>
                    ))}
                  </Navigation.List>
                </div>
              )}
            </Navigation>

            <div className="flex flex-col gap-4 pt-4 border-t border-white/20">
              <span className="text-slate-300 font-medium text-center py-2">
                Call: {PHONE_NUMBER}
              </span>
              <QuoteCtaButton
                location="header-mobile"
                fullWidth
                onAfterClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
