"use client"

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react"

type IndicatorState = {
  ready: boolean
  size: number
  position: number
  duration: string
}

type NavigationContextValue = {
  activeIndex: number
  activateItem: (index: number, onActivated?: () => void) => void
  registerItem: (index: number, node: HTMLElement | null) => void
  registerList: (node: HTMLElement | null) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

function useNavigationContext() {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error("Navigation components must be used within Navigation")
  }
  return ctx
}

type NavigationProps = {
  as?: ElementType
  className?: string
  defaultActiveIndex?: number
  children: (state: IndicatorState) => ReactNode
} & Omit<HTMLAttributes<HTMLElement>, "children">

function NavigationRoot({
  as: Component = "div",
  className,
  defaultActiveIndex = 0,
  children,
  ...rest
}: NavigationProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex)
  const [indicator, setIndicator] = useState<IndicatorState>({
    ready: false,
    size: 0,
    position: 0,
    duration: "300ms",
  })
  const itemRefs = useRef(new Map<number, HTMLElement>())
  const listRef = useRef<HTMLElement | null>(null)

  const updateIndicator = useCallback(() => {
    const list = listRef.current
    const item = itemRefs.current.get(activeIndex)
    if (!list || !item) return

    const listRect = list.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()

    setIndicator({
      ready: true,
      size: itemRect.width,
      position: itemRect.left - listRect.left,
      duration: "300ms",
    })
  }, [activeIndex])

  useEffect(() => {
    updateIndicator()

    const resizeObserver = new ResizeObserver(updateIndicator)
    if (listRef.current) resizeObserver.observe(listRef.current)
    itemRefs.current.forEach((node) => resizeObserver.observe(node))

    window.addEventListener("resize", updateIndicator)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateIndicator)
    }
  }, [updateIndicator])

  const registerList = useCallback(
    (node: HTMLElement | null) => {
      listRef.current = node
      requestAnimationFrame(updateIndicator)
    },
    [updateIndicator]
  )

  const registerItem = useCallback(
    (index: number, node: HTMLElement | null) => {
      if (node) itemRefs.current.set(index, node)
      else itemRefs.current.delete(index)
      requestAnimationFrame(updateIndicator)
    },
    [updateIndicator]
  )

  const activateItem = useCallback(
    (index: number, onActivated?: () => void) => {
      setActiveIndex(index)
      requestAnimationFrame(() => {
        updateIndicator()
        onActivated?.()
      })
    },
    [updateIndicator]
  )

  return (
    <NavigationContext.Provider
      value={{ activeIndex, activateItem, registerItem, registerList }}
    >
      <Component className={className} {...rest}>
        {children(indicator)}
      </Component>
    </NavigationContext.Provider>
  )
}

type NavigationListProps = {
  as?: ElementType
  className?: string
  children?: ReactNode
}

function NavigationList({ as: Component = "ul", className, children }: NavigationListProps) {
  const { registerList } = useNavigationContext()
  const indexRef = useRef(0)
  indexRef.current = 0

  const wrappedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child
    const index = indexRef.current++
    return cloneElement(child as ReactElement<{ index?: number }>, { index })
  })

  return (
    <Component ref={registerList} className={className}>
      {wrappedChildren}
    </Component>
  )
}

type NavigationItemProps = {
  as?: ElementType
  className?: string
  index?: number
  onActivated?: () => void
  children: (props: { setActive: () => void; isActive: boolean }) => ReactNode
}

function NavigationItem({
  as: Component = "li",
  index = 0,
  onActivated,
  children,
  className,
}: NavigationItemProps) {
  const { activeIndex, activateItem, registerItem } = useNavigationContext()
  const isActive = activeIndex === index

  const setActive = () => {
    activateItem(index, onActivated)
  }

  return (
    <Component
      ref={(node: HTMLElement | null) => registerItem(index, node)}
      className={className}
    >
      {children({ setActive, isActive })}
    </Component>
  )
}

export const Navigation = Object.assign(NavigationRoot, {
  List: NavigationList,
  Item: NavigationItem,
})

export type { IndicatorState, NavigationProps }
