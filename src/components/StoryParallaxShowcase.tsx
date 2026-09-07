import { useEffect, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import "./StoryParallaxShowcase.css"

/* Ported from the Ryvive Roots Story page (CurtainParallaxShowcase).
   Behaviour is identical; only typed for TypeScript. */

export function StoryParallaxBackground({
  image,
  hidden,
}: {
  image: string
  hidden?: boolean
}) {
  return (
    <div
      className={`story-lower-bg${hidden ? " is-hidden" : ""}`}
      style={{ backgroundImage: `url("${image}")` }}
      aria-hidden="true"
    />
  )
}

export function StoryParallaxWrap({
  children,
  onInViewChange,
  className,
}: {
  children: ReactNode
  onInViewChange?: (inView: boolean) => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!onInViewChange) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => onInViewChange(entry.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onInViewChange])
  return (
    <div ref={ref} className={`story-parallax-wrap${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  )
}

export function ParallaxStorySection({
  variant,
  image,
  id,
  children,
  className,
}: {
  variant: "solid" | "transparent"
  image?: string
  id?: string
  children: ReactNode
  className?: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  /* Reveal once when in view; once revealed, stay revealed. */
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const sectionStyle =
    variant === "solid" && image
      ? ({ ["--section-bg"]: `url("${image}")` } as CSSProperties)
      : undefined

  const cls = [
    "parallax-section",
    variant === "solid" ? "is-solid" : "is-transparent",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <section id={id} className={cls} style={sectionStyle}>
      <div
        ref={contentRef}
        className={`parallax-section-content${revealed ? " is-visible" : ""}`}
      >
        {children}
      </div>
    </section>
  )
}

export function ParallaxDivider() {
  return <div className="parallax-divider" aria-hidden="true" />
}
