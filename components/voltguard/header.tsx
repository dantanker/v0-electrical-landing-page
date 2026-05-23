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
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faq" },
]

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between h-auto py-2 gap-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center group shrink-0"
            aria-label="VoltGuard — go to top"
          >
            <Image
              src="/voltguard-logo-white-no-tagline.png"
              alt="VoltGuard Electrical"
              width={420}
              height={128}
              className="h-32 w-auto object-contain"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <Navigation
            as="nav"
            className="hidden md:block relative mx-auto rounded-2xl bg-white/5 p-1.5"
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

                <Navigation.List as="ul" className="relative flex items-center gap-1">
                  {navItems.map((item, index) => (
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
                            "inline-block px-4 py-1.5 text-sm font-medium transition-colors"
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
            <span className="text-slate-300 font-medium whitespace-nowrap">
              {PHONE_NUMBER}
            </span>
            <QuoteCtaButton location="header" size="default" className="px-6" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors shrink-0"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
