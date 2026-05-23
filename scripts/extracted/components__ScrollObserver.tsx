"use client"

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

type ScrollObserverContextValue = {
  activeId: string | null
  registerTrigger: (id: string, element: HTMLElement | null) => void
}

const ScrollObserverContext = createContext<ScrollObserverContextValue | null>(null)

function useScrollObserverContext() {
  const context = useContext(ScrollObserverContext)
  if (!context) {
    throw new Error("ScrollObserver components must be used within ScrollObserver")
  }
  return context
}

type ScrollObserverRootProps = {
  className?: string
  children: (state: { isHidden: boolean }) => ReactNode
}

function ScrollObserverRoot({ className, children }: ScrollObserverRootProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const triggersRef = useRef<Map<string, HTMLElement>>(new Map())
  const ratiosRef = useRef<Map<string, number>>(new Map())

  const registerTrigger = useCallback((id: string, element: HTMLElement | null) => {
    const observer = observerRef.current
    const existing = triggersRef.current.get(id)

    if (existing && observer) {
      observer.unobserve(existing)
    }

    if (element) {
      triggersRef.current.set(id, element)
      observer?.observe(element)
    } else {
      triggersRef.current.delete(id)
      ratiosRef.current.delete(id)
    }
  }, [])

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const pickActive = () => {
      let bestId: string | null = null
      let bestRatio = 0

      ratiosRef.current.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = id
        }
      })

      setActiveId(bestRatio > 0 ? bestId : null)
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-scroll-trigger-id")
          if (!id) return
          ratiosRef.current.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
        })
        pickActive()
      },
      {
        root: null,
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    triggersRef.current.forEach((element) => {
      observerRef.current?.observe(element)
    })

    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [])

  const isHidden = activeId === null

  return (
    <ScrollObserverContext.Provider value={{ activeId, registerTrigger }}>
      <div className={className}>{children({ isHidden })}</div>
    </ScrollObserverContext.Provider>
  )
}

type ScrollObserverGroupProps = {
  className?: string
  children?: ReactNode
}

function TriggerGroup({ className, children }: ScrollObserverGroupProps) {
  return <div className={className}>{children}</div>
}

type TriggerProps = {
  id: string
  className?: string
  children: (isActive: boolean) => ReactNode
}

function Trigger({ id, className, children }: TriggerProps) {
  const { activeId, registerTrigger } = useScrollObserverContext()

  const ref = useCallback(
    (element: HTMLElement | null) => {
      registerTrigger(id, element)
    },
    [id, registerTrigger]
  )

  return (
    <div ref={ref} data-scroll-trigger-id={id} className={className}>
      {children(activeId === id)}
    </div>
  )
}

function ReactorGroup({ className, children }: ScrollObserverGroupProps) {
  return <div className={cn("relative", className)}>{children}</div>
}

type ReactorProps = {
  id: string
  className?: string
  children: (isActive: boolean) => ReactNode
}

function Reactor({ id, className, children }: ReactorProps) {
  const { activeId } = useScrollObserverContext()
  const isActive = activeId === id

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
        className
      )}
      aria-hidden={!isActive}
    >
      {children(isActive)}
    </div>
  )
}

export const ScrollObserver = Object.assign(ScrollObserverRoot, {
  TriggerGroup,
  Trigger,
  ReactorGroup,
  Reactor,
})
