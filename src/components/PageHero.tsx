import { useRef } from "react"
import { Kicker, Reveal, useParallax } from "../lib/ui"

export function PageHero({
  kicker,
  title,
  lead,
  image,
  imageAlt = "",
  graphic = false,
}: {
  kicker: string
  title: React.ReactNode
  lead: string
  image: string
  /** Leave empty for purely decorative photography. */
  imageAlt?: string
  /** Vector illustration: shown uncropped and without the photo brightness lift. */
  graphic?: boolean
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  useParallax(imgRef, { amount: 6 })
  return (
    <section className="relative overflow-hidden pt-28 lg:pt-36">
      <div className="mx-auto grid max-w-[1440px] items-end gap-10 px-6 pb-16 lg:grid-cols-[1.15fr_1fr] lg:px-12 lg:pb-24">
        <Reveal>
          <Kicker>{kicker}</Kicker>
          <h1
            className="mt-6 text-[2.6rem] leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            {title}
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="max-w-md text-lg leading-relaxed text-ink-soft">
            {lead}
          </p>
        </Reveal>
      </div>
      <Reveal className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="relative aspect-[16/7] overflow-hidden rounded-none bg-cream">
          <img
            ref={imgRef}
            src={image}
            alt={imageAlt}
            className={`absolute inset-x-0 -top-[10%] h-[120%] w-full ${
              graphic ? "object-contain" : "object-cover"
            }`}
            style={
              graphic
                ? undefined
                : { filter: "saturate(1.04) brightness(1.05)" }
            }
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </Reveal>
    </section>
  )
}

export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`mx-auto max-w-[1440px] px-6 lg:px-12 ${className}`}>
      {children}
    </section>
  )
}
