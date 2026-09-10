import { useEffect, useState, useRef } from "react"
import {
  Button,
  Arrow,
  Kicker,
  Reveal,
  IMG,
  SpotlightCard,
  usePrefersReducedMotion,
} from "../lib/ui"
import {
  VENTURES_DATA,
  PROJECTS_DATA,
  SERVICES_DATA,
  STATS_DATA,
} from "../lib/data"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger)

// Standardized entrance animation tokens
const ENTRANCE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)" // Premium easeOutExpo
const ENTRANCE_DURATION = "900ms"

/* ---------- HERO ---------- */
function Hero({ go }) {
  const [loaded, setLoaded] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50)
    return () => clearTimeout(t)
  }, [])

  const heroItemStyle = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(16px)",
    transition: reducedMotion
      ? "none"
      : `opacity ${ENTRANCE_DURATION} ${ENTRANCE_EASING} ${delay}ms, transform ${ENTRANCE_DURATION} ${ENTRANCE_EASING} ${delay}ms`,
  })

  return (
    <section
      data-tone="dark"
      className="relative flex min-h-screen items-center overflow-hidden bg-ink snap-start snap-always"
    >
      {/* Dark, calm background with gentle parallax drift */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={IMG.lamps}
          alt="Intimate, warmly lit fine-dining room"
          data-parallax-hero-bg="0.2"
          className="absolute inset-0 w-full h-[125%] -top-[12%] object-cover"
          style={{ filter: "contrast(1.12) saturate(1.12)" }}
        />
        {/* Calm dark scrims — left-weighted for text legibility, plus depth
            at the top (nav) and bottom (grounding). */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/45" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-6 pt-36 pb-16 sm:pt-40 lg:pt-44 lg:px-12 relative z-10">
        <div className="max-w-3xl">
          <div style={heroItemStyle(0)}>
            <div className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-bronze">
              Hospitality Management &bull; Restaurant &amp; Café Operations
              &bull; Cloud Kitchens &bull; Business Ventures
            </div>
          </div>

          <h1
            className="mt-6 text-[2.85rem] leading-[1.08] tracking-[-0.015em] text-paper sm:text-6xl lg:text-[4.35rem]"
            style={{
              ...heroItemStyle(150),
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              textShadow: "0 2px 34px rgba(0,0,0,0.55)",
            }}
          >
            Creating Experiences.
            <br />
            <span className="italic font-normal text-bronze">Building</span>{" "}
            Hospitality Brands.
          </h1>

          <p
            className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-paper/85"
            style={{
              ...heroItemStyle(280),
              textShadow: "0 1px 16px rgba(0,0,0,0.5)",
            }}
          >
            We provide operational oversight, concept formulation, and
            management systems for restaurants, cafés, clubhouse dining, and
            delivery-first kitchen ventures.
          </p>

          <div className="mt-8 flex flex-wrap gap-4" style={heroItemStyle(400)}>
            <Button onClick={() => go("ventures")}>
              Explore Our Ventures <Arrow />
            </Button>
            <Button variant="light" onClick={() => go("franchise")}>
              Partner With Us
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-paper/60 lg:flex z-10">
        <span className="text-[0.62rem] uppercase tracking-[0.28em]">
          Scroll
        </span>
        <span className="h-10 w-px animate-pulse bg-paper/40" />
      </div>
    </section>
  )
}

/* ---------- STICKY PARALLAX VENTURE PANEL ---------- */
/* ---------- STICKY BIDIRECTIONAL VENTURE PANEL ---------- */
function VentureSlide({ venture, go, index }) {
  const reducedMotion = usePrefersReducedMotion()
  const isBodhi = venture.id === "bodhi-tree" || index === 0

  const trackRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (!trackRef.current || !textRef.current || !imageRef.current) return

    // Bidirectional "curtain" directions (in percent of each panel's width):
    //   Bodhi Tree  -> text enters from the LEFT (-100), image from the RIGHT (+100)
    //   Ryvive Roots-> text enters from the RIGHT (+100), image from the LEFT (-100)
    // Each panel exits back toward the side it came from.
    const textFromX = isBodhi ? -100 : 100
    const imageFromX = isBodhi ? 100 : -100
    const OPACITY_FLOOR = 0.15

    // Only run the scroll-driven sticky curtain on desktop. On phones/tablets
    // the layout is a normal stacked section, so a tall pinned track + sliding
    // panels would hijack native touch scrolling. gsap.matchMedia() sets up the
    // animation for the desktop breakpoint only and automatically reverts all
    // inline styles when leaving it (e.g. on resize), so mobile scrolls freely.
    const mm = gsap.matchMedia()

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })

        // Phase 1 — slide IN from opposite sides as the panel enters (0 -> 0.35).
        tl.fromTo(
          textRef.current,
          { xPercent: textFromX, opacity: OPACITY_FLOOR },
          { xPercent: 0, opacity: 1, ease: "power2.out", duration: 0.35 },
          0
        )
        tl.fromTo(
          imageRef.current,
          { xPercent: imageFromX, opacity: OPACITY_FLOOR },
          { xPercent: 0, opacity: 1, ease: "power2.out", duration: 0.35 },
          0
        )

        // Phase 2 — hold both panels settled while the panel is pinned (0.35 -> 0.65).
        tl.to({}, { duration: 0.3 }, 0.35)

        // Phase 3 — slide OUT back toward their entry sides as the panel leaves (0.65 -> 1).
        tl.to(
          textRef.current,
          { xPercent: textFromX, opacity: OPACITY_FLOOR, ease: "power2.in", duration: 0.35 },
          0.65
        )
        tl.to(
          imageRef.current,
          { xPercent: imageFromX, opacity: OPACITY_FLOOR, ease: "power2.in", duration: 0.35 },
          0.65
        )
      }
    )

    return () => mm.revert()
  }, [isBodhi])

  return (
    <div
      ref={trackRef}
      style={{ zIndex: 10 + index }}
      className="relative w-full bg-forest-deep snap-start lg:h-[190vh]"
    >
      <div className="w-full flex flex-col lg:sticky lg:top-0 lg:h-[100dvh] lg:flex-row lg:overflow-hidden bg-[#2a3818]">
        {/* IMAGE PANEL (slides from right for Bodhi, from left for Ryvive Roots) */}
        <div
          ref={imageRef}
          style={{ willChange: "transform, opacity" }}
          className={`relative overflow-hidden ${
            isBodhi ? "lg:order-2" : "lg:order-1"
          } order-1 w-full h-[40dvh] sm:h-[44dvh] lg:h-full lg:w-1/2 shrink-0 bg-ink`}
        >
          <img
            src={venture.images[0]}
            alt={venture.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "saturate(1.05) brightness(1.02)" }}
            loading="lazy"
          />

          {/* Scrim overlay on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 lg:hidden pointer-events-none" />

          {/* Floating accent motif */}
          {!reducedMotion && venture.floatingAsset?.[0] && (
            <div
              className="absolute select-none pointer-events-none z-20 text-[#eee6db]/70"
              style={venture.floatingAsset[0].style}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full fill-none stroke-current"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={venture.floatingAsset[0].svgPath} />
              </svg>
            </div>
          )}
        </div>

        {/* TEXT PANEL with OLIVE GREEN BACKGROUND (slides from left for Bodhi, from right for Ryvive Roots) */}
        <div
          ref={textRef}
          style={{ willChange: "transform, opacity" }}
          className={`flex flex-col justify-center px-6 py-6 sm:px-10 sm:py-8 lg:px-16 lg:py-20 xl:px-24 bg-gradient-to-br from-[#455c29] via-[#3e5225] to-[#30411d] border-t lg:border-t-0 ${
            isBodhi ? "lg:order-1 lg:border-r border-[#8a9a6b]/25" : "lg:order-2 lg:border-l border-[#8a9a6b]/25"
          } order-2 w-full flex-1 lg:h-full lg:w-1/2 lg:overflow-visible shadow-2xl`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#b89f7a]" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-[#c5d0b3]">
                {venture.tag}
              </span>
            </div>

            <h3
              className="mt-3 lg:mt-4 text-3xl sm:text-4xl lg:text-5xl text-[#f8f6f1] tracking-tight font-normal leading-[1.15]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {venture.name}
            </h3>

            <p
              className="mt-2 text-sm sm:text-base lg:text-lg italic text-[#d7c9b1] leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {venture.tagline}
            </p>

            <p className="mt-4 lg:mt-6 text-sm lg:text-base text-[#eee6db]/90 leading-relaxed max-w-xl">
              {venture.copy}
            </p>

            <ul className="mt-5 lg:mt-7 grid gap-2.5 sm:grid-cols-2 max-w-xl">
              {venture.points.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#eee6db]/90"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b89f7a]" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 lg:mt-10 flex flex-wrap gap-3 sm:gap-4 items-center">
              <Button
                variant="light"
                className="!border-[#f8f6f1] !bg-[#f8f6f1] !text-[#2e2e2e] hover:!bg-[#eee6db] shadow-md transition-all text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3"
                onClick={() => go("ventures")}
              >
                Discover Venture <Arrow />
              </Button>
              {venture.cta && (
                <Button
                  variant="light"
                  className="!border-[#eee6db]/50 !bg-white/5 !text-[#f8f6f1] hover:!bg-white/15 transition-all text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 backdrop-blur-xs"
                  onClick={() => go(venture.cta)}
                >
                  Partner With Us
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- TABBED EXPERIENCE ---------- */
function TabbedExperience({ go }) {
  const [activeTab, setActiveTab] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const tabRefs = useRef([])

  useEffect(() => {
    if (isHovered || reducedMotion) return
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % PROJECTS_DATA.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [isHovered, reducedMotion])

  const handleKeyDown = (e, idx) => {
    let nextIdx = idx
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIdx = (idx + 1) % PROJECTS_DATA.length
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIdx = (idx - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length
    } else {
      return
    }
    e.preventDefault()
    setActiveTab(nextIdx)
    tabRefs.current[nextIdx]?.focus()
  }

  return (
    <section
      className="bg-cream py-24 lg:py-32"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <Kicker>Experience</Kicker>
          <h2
            className="mt-5 text-4xl sm:text-5xl leading-tight tracking-[-0.02em] text-ink"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Proven rooms,{" "}
            <span className="italic text-forest">established standards.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Block: Interactive Tabs */}
          <div className="order-2 lg:order-1 flex flex-col gap-6">
            <div
              role="tablist"
              aria-label="Past projects and brands operated"
              className="flex flex-wrap gap-2 border-b border-line pb-4"
            >
              {PROJECTS_DATA.map((proj, idx) => (
                <button
                  key={proj.name}
                  ref={(el) => {
                    tabRefs.current[idx] = el
                  }}
                  role="tab"
                  aria-selected={activeTab === idx}
                  aria-controls={`panel-${idx}`}
                  id={`tab-${idx}`}
                  tabIndex={activeTab === idx ? 0 : -1}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 uppercase ${
                    activeTab === idx
                      ? "bg-forest text-paper shadow-sm"
                      : "text-ink-soft hover:bg-paper/80 hover:text-forest"
                  }`}
                >
                  0{idx + 1} &middot; {proj.name}
                </button>
              ))}
            </div>

            {/* Tab content panel */}
            <div className="min-h-[180px] flex flex-col justify-between">
              {PROJECTS_DATA.map((proj, idx) => {
                if (activeTab !== idx) return null
                return (
                  <div
                    key={proj.name}
                    role="tabpanel"
                    id={`panel-${idx}`}
                    aria-labelledby={`tab-${idx}`}
                    className={`transition-opacity duration-300 ${
                      reducedMotion ? "" : "animate-fadeIn"
                    }`}
                  >
                    <span className="kicker text-bronze">{proj.type}</span>
                    <h3
                      className="mt-3 text-3xl font-normal text-ink tracking-tight"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {proj.name}
                    </h3>
                    <p className="mt-4 text-ink-soft leading-relaxed max-w-lg">
                      {proj.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-bronze tracking-wide uppercase font-mono">
                      Location / Status: {proj.loc}
                    </p>
                  </div>
                )
              })}

              <div>
                <button
                  onClick={() => go("experience")}
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-deep focus:underline focus:outline-none"
                >
                  Explore full experience portfolio{" "}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Block: Image Visualizer with Sharp Edges */}
          <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-none overflow-hidden bg-cream border border-line/45">
            {PROJECTS_DATA.map((proj, idx) => (
              <img
                key={proj.name}
                src={proj.img}
                alt={proj.name}
                style={{ filter: "saturate(1.04) brightness(1.05)" }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  activeTab === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                } ${reducedMotion ? "transition-none duration-0" : ""}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* Image pairing for each service */
const SERVICE_IMAGES = [
  { img: IMG.diningRoom, alt: "Restaurant and café dining space" },
  { img: IMG.dessertPlatter, alt: "Plated culinary menu presentation" },
  { img: IMG.woodTable, alt: "Interior setup ready for opening night" },
  { img: IMG.containers, alt: "Cloud kitchen delivery dispatch operations" },
  {
    img: IMG.chefBoard,
    alt: "Culinary standards and kitchen preparation board",
  },
]

/* ---------- LUXURY EDITORIAL SERVICE CARD ---------- */
function ServiceCard({ service, index, go }) {
  const [hovered, setHovered] = useState(false)
  const imageInfo = SERVICE_IMAGES[index] || {
    img: IMG.diningRoom,
    alt: service.t,
  }

  return (
    <SpotlightCard
      spotlightColor="rgba(184, 159, 122, 0.18)"
      spotlightSize={420}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => go("services")}
      className="group flex h-full flex-col justify-between border border-line bg-extra-light shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-bronze hover:shadow-2xl cursor-pointer"
      style={{
        boxShadow: hovered
          ? "0 24px 50px -15px rgba(62, 82, 37, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)"
          : "0 4px 20px -2px rgba(46, 46, 46, 0.04)",
      }}
    >
      <div>
        {/* Photo Header with subtle zoom */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
          <img
            src={imageInfo.img}
            alt={imageInfo.alt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ filter: "saturate(1.04) brightness(1.02)" }}
            loading="lazy"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/15 to-transparent" />

          {/* Floating Glass Number Badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-3 py-1 shadow-xs backdrop-blur-md">
            <span className="font-display text-xs font-semibold text-bronze">
              {service.n}
            </span>
            <span className="h-1 w-1 rounded-full bg-forest" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-forest">
              Discipline
            </span>
          </div>

          {/* Floating Glass Icon Badge */}
          <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/75 text-forest shadow-xs backdrop-blur-md transition-colors group-hover:bg-forest group-hover:text-paper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={service.svgIcon} />
            </svg>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-7">
          <h3
            className="text-2xl font-normal tracking-tight text-ink transition-colors duration-300 group-hover:text-forest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {service.t}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {service.d}
          </p>

          {/* Capability Tags */}
          {service.caps && service.caps.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {service.caps.slice(0, 3).map((cap) => (
                <span
                  key={cap}
                  className="rounded-full border border-line bg-cream/60 px-2.5 py-1 text-[11px] text-ink-soft transition-colors group-hover:border-forest/30 group-hover:bg-cream"
                >
                  {cap}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="border-t border-line/60 px-7 py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-forest transition-colors group-hover:text-bronze">
        <span>Detailed Scope</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1.5">
          →
        </span>
      </div>
    </SpotlightCard>
  )
}

/* ---------- 06. BESPOKE ADVISORY CARD TO COMPLETE THE 3x2 GRID ---------- */
function AdvisoryCard({ go }) {
  const [hovered, setHovered] = useState(false)

  return (
    <SpotlightCard
      spotlightColor="rgba(248, 246, 241, 0.16)"
      spotlightSize={420}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => go("franchise")}
      className="group flex h-full flex-col justify-between border border-white/20 bg-forest-deep p-8 shadow-xl backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-bronze hover:shadow-2xl cursor-pointer text-paper"
      style={{
        boxShadow: hovered
          ? "0 24px 60px -15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.18)"
          : "0 12px 30px -10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-bronze backdrop-blur-md">
            <span>06</span>
            <span className="h-1 w-1 rounded-full bg-bronze" />
            <span>Advisory</span>
          </div>

          <span className="rounded-full border border-bronze/50 bg-bronze/20 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-paper/90">
            Bespoke
          </span>
        </div>

        <h3
          className="mt-8 text-2xl font-normal tracking-tight text-paper"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bespoke Venture &amp; Portfolio Advisory
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-paper/75">
          Have an atypical asset, high-profile heritage venue, or multi-brand
          portfolio requirement? Our principals structure custom joint ventures
          and turnkey operating contracts.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "Distressed Turnarounds",
            "Institutional F&B",
            "Private Equity Review",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-paper/80 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-white/15 pt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-bronze transition-colors group-hover:text-paper">
        <span>Consult With Principals</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1.5">
          →
        </span>
      </div>
    </SpotlightCard>
  )
}

/* ---------- STATS ITEM ---------- */
function StatItem({ value, label, suffix }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const [triggered, setTriggered] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true)
          if (reducedMotion) {
            setCount(value)
            return
          }
          let start = 0
          const duration = 1200 // 1.2s
          const startTime = performance.now()

          const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)

            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * value))

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(value)
            }
          }

          animate(performance.now())
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, triggered, reducedMotion])

  return (
    <div
      ref={ref}
      className="text-center p-6 border-r border-white/15 last:border-r-0 max-md:border-r-0 max-md:border-b max-md:border-white/15 max-md:last:border-b-0"
    >
      <span
        className="block text-5xl sm:text-6xl lg:text-7xl font-light text-paper tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {count}
        {suffix}
      </span>
      <span className="mt-3 block text-xs tracking-widest text-bronze uppercase font-semibold">
        {label}
      </span>
    </div>
  )
}

export function Home({ go }) {
  const reducedMotion = usePrefersReducedMotion()

  // Core GSAP ScrollTrigger scroll-scrubbed drift animation (one per section)
  useEffect(() => {
    if (reducedMotion) return

    // 1. Who We Are Parallax Image
    const triggerWho = gsap.to(".who-we-are-img", {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: ".who-we-are-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    // 2. Hero background image drift — keyed to its own section.
    const heroTweens = gsap.utils.toArray("[data-parallax-hero-bg]").map((el) =>
      gsap.to(el, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }),
    )

    return () => {
      triggerWho.scrollTrigger?.kill()
      triggerWho.kill()
      heroTweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
    }
  }, [reducedMotion])

  return (
    <>
      {/* HERO */}
      <Hero go={go} />

      {/* WHO WE ARE */}
      <section className="bg-paper py-24 lg:py-36 border-t border-line/30 who-we-are-section min-h-screen flex items-center snap-start snap-always">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12 items-center">
          {/* Left Column: bright, unshaded photograph */}
          <div className="relative overflow-hidden aspect-[4/5] bg-cream rounded-none">
            <img
              src={IMG.diningRoom}
              alt="Leo Hospitality dining setup"
              className="who-we-are-img absolute inset-0 w-full h-[125%] -top-[12%] object-cover"
              style={{ filter: "saturate(1.04) brightness(1.05)" }}
            />
          </div>

          {/* Right Column: Verbatim mission language from brief */}
          <div>
            <Reveal>
              <Kicker>Who We Are</Kicker>
              <h2
                className="mt-6 text-4xl leading-tight tracking-[-0.02em] text-ink sm:text-5xl font-normal"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Transforming spaces, managing destinations.
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 text-xl leading-relaxed text-[#201d18] font-medium">
                We transform restaurants, cafés, and clubhouse dining spaces
                into successful, well-managed, and memorable destinations
                through professional hospitality management.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                We provide end-to-end operational oversight, menu engineering,
                procurement, and management frameworks across multiple formats.
                Our team handles day-to-day management, pre-opening setup, and
                JV/franchise partnerships with professional operational
                discipline.
              </p>
              <button
                onClick={() => go("about")}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-deep focus:underline focus:outline-none"
              >
                Read more about us{" "}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SCROLL-DRIVEN "OUR VENTURES" SECTION — DARK BAND */}
      <section data-tone="dark" className="bg-forest-deep">
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-24 text-left">
          <Reveal>
            <Kicker tone="light">Our Ventures</Kicker>
            <h2
              className="mt-4 text-4xl sm:text-5xl leading-tight tracking-[-0.02em] max-w-2xl font-normal text-paper"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ventures we build and operate.
            </h2>
          </Reveal>
        </div>

        {/* Viewport Parallax Sticky Slides */}
        <div className="flex flex-col">
          {VENTURES_DATA.map((venture, idx) => (
            <VentureSlide
              key={venture.id}
              venture={venture}
              go={go}
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* FUTURE VENTURES — LIGHT BAND */}
      <section className="bg-cream py-24 border-b border-line/50">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <Reveal className="max-w-xl">
            <span className="kicker text-bronze">Future Ventures</span>
            <h2
              className="mt-4 text-3xl sm:text-4xl text-ink font-normal tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Incubating new concepts.
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed text-sm lg:text-base">
              We are currently conceptualising additional hospitality concepts
              spanning bakery, speciality tearooms, and lifestyle dining
              options. Details will be announced as projects approach opening.
            </p>
            <button
              onClick={() => go("ventures")}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-deep focus:underline focus:outline-none"
            >
              View all pipeline details{" "}
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* SERVICES SECTION — LUXURY EDITORIAL SHOWCASE */}
      <section className="relative overflow-hidden bg-cream py-24 lg:py-32 border-b border-line/40">
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-bronze/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-forest/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
          {/* Editorial Split Header */}
          <div className="mb-16 grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-forest/5 px-3.5 py-1 text-xs font-semibold tracking-wider text-forest uppercase mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-pulse" />
                Comprehensive Capabilities
              </div>
              <h2
                className="text-4xl leading-[1.12] tracking-[-0.025em] sm:text-5xl lg:text-[52px] text-ink"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                Five disciplines, <br className="hidden sm:inline" />
                <span className="italic text-forest">one standard</span> of
                care.
              </h2>
            </Reveal>

            <Reveal
              delay={120}
              className="lg:col-span-5 flex flex-col justify-end"
            >
              <p className="text-base sm:text-lg leading-relaxed text-ink-soft">
                From concept incubation to full turnkey management, our
                multidisciplinary teams bring institutional rigor, culinary
                distinction, and investor alignment to every stage of
                hospitality.
              </p>
              <div className="mt-6 flex items-center gap-6">
                <button
                  onClick={() => go("services")}
                  className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-forest hover:text-bronze transition-colors focus:outline-none"
                >
                  <span>Explore All Services &amp; Methodologies</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </button>
              </div>
            </Reveal>
          </div>

          {/* 3x2 Grid: 5 Core Disciplines + 1 Bespoke Advisory Card */}
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DATA.map((service, idx) => (
              <Reveal key={service.n} delay={idx * 60}>
                <ServiceCard service={service} index={idx} go={go} />
              </Reveal>
            ))}
            <Reveal delay={SERVICES_DATA.length * 60}>
              <AdvisoryCard go={go} />
            </Reveal>
          </div>

          {/* Operational Standard Banner */}
          <Reveal delay={400} className="mt-14">
            <div className="rounded-2xl border border-line bg-paper/80 p-6 sm:p-8 backdrop-blur-md shadow-xs">
              <div className="grid gap-6 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line/60">
                <div className="flex items-start gap-4 pt-4 md:pt-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">
                      Turnkey Delivery Framework
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                      Rapid 90–120 day pre-opening schedule with dedicated site
                      engineering and vendor management.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bronze/10 text-bronze">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">
                      Centralized Cost &amp; Menu SOPs
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                      Recipe-level COGS control, institutional supplier
                      contracts, and real-time food waste analytics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">
                      Principal-Led Governance
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                      Every project receives direct executive partner oversight
                      and weekly unit-level financial audits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS / PRESENCE SECTION — DARK BAND */}
      <section data-tone="dark" className="bg-forest py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {STATS_DATA.map((stat) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TABBED EXPERIENCE MODULE */}
      <TabbedExperience go={go} />

      {/* CTA */}
      <CTA go={go} />
    </>
  )
}

export function CTA({ go }) {
  return (
    <section
      data-tone="dark"
      className="relative overflow-hidden bg-forest py-24 text-paper lg:py-32"
    >
      {/* Ambient depth — decorative, non-interactive */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="ambient-drift absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-bronze/20 blur-3xl" />
        <div className="ambient-drift-slow absolute -right-20 -bottom-10 h-80 w-80 rounded-full bg-forest-soft/40 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-12">
        <Reveal>
          <Kicker tone="light">Let&rsquo;s build something together</Kicker>
          <h2
            className="mx-auto mt-6 max-w-3xl text-4xl leading-[1.05] tracking-[-0.02em] sm:text-6xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Have a space, a brand, or a partnership in mind?
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              variant="light"
              className="!border-paper/60 !bg-paper !text-forest hover:!bg-cream"
              onClick={() => go("franchise")}
            >
              Business Enquiry <Arrow />
            </Button>
            <Button variant="light" onClick={() => go("contact")}>
              Contact Us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Home
