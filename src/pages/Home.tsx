import { useEffect, useState, useRef } from "react"
import {
  Button,
  Arrow,
  Kicker,
  Reveal,
  IMG,
  usePrefersReducedMotion,
} from "../lib/ui"
import {
  VENTURES_DATA,
  PROJECTS_DATA,
  SERVICES_DATA,
  STATS_DATA,
  type Venture,
  type Service,
} from "../lib/data"
import type { PageId } from "../lib/pages"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger)

// Standardized entrance animation tokens
const ENTRANCE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)" // Premium easeOutExpo
const ENTRANCE_DURATION = "900ms"

/* ---------- HERO ---------- */
function Hero({ go }: { go: (p: PageId) => void }) {
  const [loaded, setLoaded] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50)
    return () => clearTimeout(t)
  }, [])

  const heroItemStyle = (delay: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(16px)",
    transition: reducedMotion
      ? "none"
      : `opacity ${ENTRANCE_DURATION} ${ENTRANCE_EASING} ${delay}ms, transform ${ENTRANCE_DURATION} ${ENTRANCE_EASING} ${delay}ms`,
  })

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-cream">
      {/* Background visual with parallax overlay */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <img
          src={IMG.heroInterior}
          alt="Warm luxury hospitality room"
          data-parallax-hero-bg="0.2"
          className="absolute inset-0 w-full h-[125%] -top-[12%] object-cover opacity-60"
        />
        {/* Soft light wash for maximum text contrast */}
        <div className="absolute inset-0 bg-cream/80 z-0 backdrop-blur-[0.5px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-6 pt-32 pb-16 lg:px-12 relative z-10">
        <div style={heroItemStyle(0)}>
          <Kicker tone="forest">
            Hospitality Management | Restaurant & Café Operations | Cloud
            Kitchens | Business Ventures
          </Kicker>
        </div>

        <h1
          className="mt-6 max-w-4xl text-[3rem] leading-[0.98] tracking-[-0.02em] text-[#1a2e22] sm:text-7xl lg:text-[5.5rem]"
          style={{
            ...heroItemStyle(150),
            fontFamily: "var(--font-display)",
            fontWeight: 400,
          }}
        >
          Creating Experiences.
          <br />
          <span className="italic text-[#a97c50]">Building</span> Hospitality
          Brands.
        </h1>

        <p
          className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-[#201d18] opacity-90"
          style={heroItemStyle(280)}
        >
          We provide operational oversight, concept formulation, and management
          systems for restaurants, cafés, clubhouse dining, and delivery-first
          kitchen ventures.
        </p>

        <div className="mt-10 flex flex-wrap gap-4" style={heroItemStyle(400)}>
          <Button onClick={() => go("ventures")}>
            Explore Our Ventures <Arrow />
          </Button>
          <Button variant="secondary" onClick={() => go("franchise")}>
            Partner With Us
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-forest/60 lg:flex z-10">
        <span className="kicker text-[0.62rem]">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-forest/40" />
      </div>
    </section>
  )
}

/* ---------- STICKY PARALLAX VENTURE PANEL ---------- */
function VentureSlide({
  venture,
  go,
  index,
}: {
  venture: Venture
  go: (p: PageId) => void
  index: number
}) {
  const reducedMotion = usePrefersReducedMotion()
  const isEven = index % 2 === 0

  const panelClass = isEven ? "venture-panel-bodhi" : "venture-panel-revive"
  const propClass = isEven ? "floating-prop-bodhi" : "floating-prop-revive"

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 min-h-screen relative border-b border-line bg-cream ${panelClass}`}
    >
      {/* 1. STICKY IMAGE COLUMN (CSS ONLY) */}
      <div
        className={`relative lg:sticky lg:top-0 h-[60vh] lg:h-screen overflow-hidden bg-[#16331f] pointer-events-none ${
          isEven ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {/* Soft textured asset visualizer */}
        <div className="absolute inset-0 bg-[#16331f] flex items-center justify-center text-paper/30 font-mono text-xs uppercase tracking-widest">
          <img
            src={venture.images[0]}
            alt={venture.name}
            className="w-full h-full object-cover opacity-35"
            loading="lazy"
          />
          <div className="absolute bottom-6 left-6 bg-black/45 px-3 py-1.5 backdrop-blur-sm text-[10px] tracking-widest uppercase">
            Awaiting Client Photography &middot; {venture.name}
          </div>
        </div>

        {/* 2. SCROLL-LINKED DRIFT: Single floating prop element per section (GSAP scrubbed) */}
        {!reducedMotion && venture.floatingAsset[0] && (
          <div
            className={`${propClass} absolute select-none pointer-events-none z-20 text-[#a9814f] opacity-80`}
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

      {/* Sibling Content Column - Scrolls Normally */}
      <div
        className={`flex flex-col justify-center px-8 py-24 lg:px-20 lg:py-32 bg-cream min-h-[60vh] lg:min-h-screen ${
          isEven ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <Reveal>
          <span className="kicker text-bronze">{venture.tag}</span>
          <h3
            className="mt-4 text-4xl sm:text-5xl text-[#1a2e22] tracking-tight font-normal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {venture.name}
          </h3>
          <p
            className="mt-2 text-lg italic text-[#a97c50]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {venture.tagline}
          </p>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-6 text-[#201d18] leading-relaxed text-sm lg:text-base">
            {venture.copy}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {venture.points.map((pt) => (
              <li
                key={pt}
                className="flex items-start gap-2.5 text-sm text-[#201d18]/85"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest" />
                {pt}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button onClick={() => go("ventures")}>
              Discover Venture <Arrow />
            </Button>
            {venture.cta && (
              <Button
                variant="secondary"
                onClick={() => go(venture.cta as PageId)}
              >
                Partner With Us
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  )
}

/* ---------- TABBED EXPERIENCE ---------- */
function TabbedExperience({ go }: { go: (p: PageId) => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (isHovered || reducedMotion) return
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % PROJECTS_DATA.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [isHovered, reducedMotion])

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
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
            className="mt-5 text-4xl sm:text-5xl leading-tight tracking-[-0.02em] text-[#1a2e22]"
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
                  ref={(el) => (tabRefs.current[idx] = el)}
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
          <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-none overflow-hidden bg-line border border-line/45">
            {PROJECTS_DATA.map((proj, idx) => (
              <img
                key={proj.name}
                src={proj.img}
                alt={proj.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  activeTab === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                } ${reducedMotion ? "transition-none duration-0" : ""}`}
                loading="lazy"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent pointer-events-none z-20" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- SERVICE CARD WITH FLAT DESIGN & SHARP CORNERS ---------- */
function ServiceCard({
  service,
  index,
  go,
}: {
  service: Service
  index: number
  go: (p: PageId) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => go("services")}
      className="group cursor-pointer rounded-none border border-line bg-paper p-8 transition-colors duration-200 hover:border-forest flex flex-col justify-between min-h-[320px]"
    >
      <div>
        <div className="flex items-start justify-between">
          <span className="font-display text-sm text-bronze">{service.n}</span>
          <div
            className="text-forest transition-colors duration-300"
            style={{
              color: hovered ? "var(--color-bronze)" : "var(--color-forest)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={service.svgIcon} />
            </svg>
          </div>
        </div>

        <h3
          className="mt-6 text-2xl font-normal text-ink tracking-tight transition-colors duration-300 group-hover:text-forest"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {service.t}
        </h3>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          {service.d}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-forest group-hover:text-bronze transition-colors">
        <span>Capabilities</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </div>
  )
}

/* ---------- STATS ITEM ---------- */
function StatItem({
  value,
  label,
  suffix,
}: {
  value: number
  label: string
  suffix: string
}) {
  const ref = useRef<HTMLDivElement>(null)
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

          const animate = (now: number) => {
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
      className="text-center p-6 border-r border-line/60 last:border-r-0 max-md:border-r-0 max-md:border-b max-md:border-line/60 max-md:last:border-b-0"
    >
      <span
        className="block text-5xl sm:text-6xl lg:text-7xl font-light text-forest tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {count}
        {suffix}
      </span>
      <span className="mt-3 block text-xs tracking-widest text-ink-soft uppercase font-semibold">
        {label}
      </span>
    </div>
  )
}

export function Home({ go }: { go: (p: PageId) => void }) {
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

    // 2. Ventures Slide 1 (Bodhi Tree)
    const triggerV1 = gsap.to(".floating-prop-bodhi", {
      yPercent: -25,
      ease: "none",
      scrollTrigger: {
        trigger: ".venture-panel-bodhi",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    // 3. Ventures Slide 2 (Revive Roots)
    const triggerV2 = gsap.to(".floating-prop-revive", {
      yPercent: -25,
      ease: "none",
      scrollTrigger: {
        trigger: ".venture-panel-revive",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    // 4. Hero Background image continuous drift
    const triggerHero = gsap.to("[data-parallax-hero-bg]", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: "section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })

    return () => {
      triggerWho.scrollTrigger?.kill()
      triggerWho.kill()
      triggerV1.scrollTrigger?.kill()
      triggerV1.kill()
      triggerV2.scrollTrigger?.kill()
      triggerV2.kill()
      triggerHero.scrollTrigger?.kill()
      triggerHero.kill()
    }
  }, [reducedMotion])

  return (
    <>
      {/* HERO */}
      <Hero go={go} />

      {/* WHO WE ARE */}
      <section className="bg-cream py-24 lg:py-36 border-t border-line/30 who-we-are-section">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12 items-center">
          {/* Left Column: Visual representation resolving empty space issue (No shadow, sharp corners) */}
          <div className="relative overflow-hidden aspect-[4/5] bg-[#16331f] rounded-none border border-line/20">
            <img
              src={IMG.diningRoom}
              alt="Leo Hospitality dining setup"
              className="who-we-are-img absolute inset-0 w-full h-[125%] -top-[12%] object-cover opacity-60"
            />
            <div className="absolute bottom-6 left-6 bg-black/45 px-3 py-1.5 backdrop-blur-sm text-[10px] text-paper font-mono uppercase tracking-widest">
              Awaiting Client Photography &middot; Operations
            </div>
          </div>

          {/* Right Column: Verbatim mission language from brief */}
          <div>
            <Reveal>
              <Kicker>Who We Are</Kicker>
              <h2
                className="mt-6 text-4xl leading-tight tracking-[-0.02em] text-[#1a2e22] sm:text-5xl font-normal"
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

      {/* SCROLL-DRIVEN "OUR VENTURES" SECTION */}
      <section className="bg-paper border-y border-line/45">
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-24 text-left">
          <Reveal>
            <Kicker>Our Ventures</Kicker>
            <h2
              className="mt-4 text-4xl sm:text-5xl leading-tight tracking-[-0.02em] max-w-2xl font-normal text-[#1a2e22]"
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

        {/* Future Ventures panel (visually quieter/lighter, no parallax, flat design) */}
        <div className="bg-cream py-24 border-t border-line/50">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <Reveal className="max-w-xl">
              <span className="kicker text-bronze">Future Ventures</span>
              <h2
                className="mt-4 text-3xl sm:text-4xl text-[#1a2e22] font-normal tracking-tight"
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
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <Reveal className="mb-14">
            <Kicker>What We Do</Kicker>
            <h2
              className="mt-5 max-w-2xl text-4xl leading-tight tracking-[-0.02em] sm:text-5xl text-[#1a2e22]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Five disciplines, one standard of care.
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DATA.map((service, idx) => (
              <Reveal key={service.n} delay={idx * 60}>
                <ServiceCard service={service} index={idx} go={go} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS / PRESENCE SECTION */}
      <section className="bg-cream py-16 lg:py-24 border-y border-line/60">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-line">
            {STATS_DATA.map((stat, idx) => (
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

export function CTA({ go }: { go: (p: PageId) => void }) {
  return (
    <section className="relative overflow-hidden bg-forest py-24 text-paper lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 text-center lg:px-12">
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
