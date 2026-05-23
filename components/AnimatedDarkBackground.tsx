"use client"

export function AnimatedDarkBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-slate-900" />
      <div className="animated-dark-bg__orb animated-dark-bg__orb--1" />
      <div className="animated-dark-bg__orb animated-dark-bg__orb--2" />
      <div className="animated-dark-bg__orb animated-dark-bg__orb--3" />
      <div className="animated-dark-bg__mesh absolute inset-0" />
    </div>
  )
}
