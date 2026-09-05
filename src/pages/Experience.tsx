import { useEffect, useRef, useState } from "react"
import { Kicker, Reveal, IMG, usePrefersReducedMotion } from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import { PROJECTS_DATA } from "../lib/data"
import type { PageId } from "../lib/pages"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ─── Horizontal Snap-Slide Cards ─── */
function HorizontalProjectCards() {
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || reducedMotion) return

    const count = PROJECTS_DATA.length

    const ctx = gsap.context(() => {
      // Horizontal overflow the track must travel through.
      const distance = () => track.scrollWidth - window.innerWidth

      // Pin the section when the first panel hits the top, then convert the
      // reserved vertical scroll into horizontal movement. GSAP holds the page
      // (vertical scroll is "locked" into the track) until the last panel is
      // reached, then unpins and vertical scrolling resumes automatically.
      const master = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1, // smoothing → premium, no jitter
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (count - 1), // settle on each panel
            duration: { min: 0.2, max: 0.5 },
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            setActiveIdx(Math.round(self.progress * (count - 1)))
          },
        },
      })

      // Parallax: each panel's image pans horizontally slower than the panel as
      // it crosses the viewport, adding depth. Driven off the horizontal scroll
      // via `containerAnimation` (the panel's own left→right transit).
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track)
      panels.forEach((panel) => {
        const img = panel.querySelector<HTMLElement>("[data-parallax-img]")
        if (!img) return
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: master,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        )
      })

      // Auto‑slide: every 3 seconds advance to the next panel.
      let autoIdx = 0
      const autoPlay = setInterval(() => {
        autoIdx = (autoIdx + 1) % count
        setActiveIdx(autoIdx)
        gsap.to(track, { x: -autoIdx * window.innerWidth, duration: 0.5, ease: "power1.out" })
      }, 2000)
      // Clean up interval on unmount/revert.
      ctx.add(() => clearInterval(autoPlay))
    }, section)

    return () => ctx.revert()
  }, [reducedMotion])

  /* Fallback: reduced motion = normal vertical grid */
  if (reducedMotion) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS_DATA.map((p, i) => (
          <Reveal key={p.name} delay={i * 70} className="group">
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    )
  }

  return (
    /* Outer wrapper — pinned by GSAP. Must NOT have overflow:hidden so the pin spacer renders correctly */
    <div
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Top bar: slide counter + hint */}
      <div className="absolute top-6 inset-x-0 z-20 flex items-center justify-between px-10 lg:px-16">
        {/* Live slide counter */}
        <span
          className="text-paper/60 font-mono text-xs tracking-widest"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <span className="text-paper font-semibold">{String(activeIdx + 1).padStart(2, "0")}</span>
          {" "}/{" "}{String(PROJECTS_DATA.length).padStart(2, "0")}
        </span>

        {/* Scroll hint */}
        <div className="flex items-center gap-2.5">
          <span className="kicker text-paper/50 text-[0.62rem] tracking-widest">
            Scroll to slide
          </span>
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            className="text-bronze"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M1 5h14M9 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Horizontal track — GSAP moves this, no CSS transition here */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{
          width: `${PROJECTS_DATA.length * 100}vw`,
          willChange: "transform",
        }}
      >
        {PROJECTS_DATA.map((p, i) => (
          <div
            key={p.name}
            data-panel
            className="relative flex-shrink-0 overflow-hidden"
            style={{ width: "100vw", height: "100vh" }}
          >
            {/* Full-bleed background image — widened for parallax headroom */}
            <img
              src={p.img}
              alt={p.name}
              data-parallax-img
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute top-0 left-[-10%] h-full w-[120%] max-w-none object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/50 to-transparent" />

            {/* Card number */}
            <span
              className="absolute top-8 left-12 text-paper/25 font-mono"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(5rem, 12vw, 10rem)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                fontWeight: 300,
              }}
            >
              0{i + 1}
            </span>

            {/* Content — bottom left */}
            <div className="absolute bottom-0 left-0 right-0 px-10 pb-14 lg:px-20 lg:pb-20 max-w-3xl">
              <span className="kicker text-bronze text-xs tracking-[0.2em]">
                {p.type} &nbsp;·&nbsp; {p.loc}
              </span>
              <h2
                className="mt-4 text-paper leading-tight tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                }}
              >
                {p.name}
              </h2>
              <p className="mt-4 text-paper/75 leading-relaxed text-sm lg:text-base max-w-xl">
                {p.description}
              </p>
            </div>

            {/* Card counter dots — driven by activeIdx so all cards share the same live indicator */}
            <div className="absolute bottom-10 right-10 lg:bottom-16 lg:right-16 flex flex-col gap-2 items-center">
              {PROJECTS_DATA.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className="block rounded-full transition-all duration-500"
                  style={{
                    width: "2px",
                    height: dotIdx === activeIdx ? "28px" : "8px",
                    background:
                      dotIdx === activeIdx
                        ? "var(--color-bronze)"
                        : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ p }: { p: (typeof PROJECTS_DATA)[0] }) {
  return (
    <>
      <div className="overflow-hidden rounded-none bg-ink">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={p.img}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3
            className="text-2xl tracking-[-0.01em] text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {p.name}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{p.type}</p>
        </div>
        <span className="kicker mt-2 shrink-0 text-bronze">{p.loc}</span>
      </div>
      <p className="mt-3 text-sm text-ink-soft/80 leading-relaxed">
        {p.description}
      </p>
    </>
  )
}

/* ─── Page ─── */
export function Experience({ go }: { go: (p: PageId) => void }) {
  return (
    <>
      <PageHero
        kicker="Experience"
        title={
          <>
            Rooms we&rsquo;ve{" "}
            <span className="italic text-forest">helped run.</span>
          </>
        }
        lead="A selection of past projects our team has operated or supported. Full case descriptions are being prepared and shared on request."
        image={IMG.woodTable}
      />

      {/* Disclaimer note */}
      <Section className="pb-0 pt-16 lg:pt-20">
        <Reveal className="mb-0 max-w-xl text-sm text-ink-soft">
          <p className="rounded-none border border-line bg-paper px-5 py-4">
            Note — project descriptions below represent key operations and
            metrics. Names and locations are verified from historical
            engagements.
          </p>
        </Reveal>
      </Section>

      {/* Horizontal scroll-jacked cards */}
      <HorizontalProjectCards />

      <CTA go={go} />
    </>
  )
}

export default Experience
