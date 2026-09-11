import { useState } from "react"

import { Reveal, Button, Arrow, IMG, SpotlightCard } from "../lib/ui"

/* ---------- MILESTONES DATA ---------- */

const TIMELINE = [
  {
    y: "2015",

    phase: "The Genesis",

    t: "High-Footfall Operations",

    d: "Cut our teeth operating fast-paced cafés, bistros, and lounge venues in Mumbai's most competitive dining corridors, mastering front-of-house warmth and kitchen pressure.",

    badge: "Operational Foundation",
  },

  {
    y: "2018",

    phase: "Scalable Systems",

    t: "Multi-Outlet Governance",

    d: "Expanded operational scope across multiple properties. Engineered centralized supplier contracts, recipe-level COGS formulas, and unit P&L discipline.",

    badge: "P&L Frameworks",
  },

  {
    y: "2021",

    phase: "Delivery Excellence",

    t: "Cloud Kitchen Infrastructure",

    d: "Pioneered specialized delivery-first culinary hubs with optimized prep timelines, temperature-controlled dispatch, and real-time food waste analytics.",

    badge: "Delivery Architecture",
  },

  {
    y: "2023",

    phase: "Proprietary Brands",

    t: "Concept Incubation & Launch",

    d: "Conceptualized, engineered, and launched flagship proprietary ventures including Café Bodhi Tree and lifestyle concept Ryvive Roots.",

    badge: "Brand Incubation",
  },

  {
    y: "2025",

    phase: "Institutional Scale",

    t: "The Management Partnership",

    d: "Formalized as Leo Hospitality & Ventures LLP — structuring institutional management contracts, joint ventures, and turnkey operational advisory.",

    badge: "Venture Advisory",
  },
]

/* ---------- CORE VALUES ---------- */

const VALUES = [
  {
    num: "01",

    t: "Owner-Aligned Stewardship",

    d: "We manage every rupee, procurement invoice, and customer touchpoint with the exact rigor of an equity partner.",

    sub: "Fiduciary Discipline",

    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },

  {
    num: "02",

    t: "Obsessive Craft in the Details",

    d: "Hospitality standards live in nuances — acoustic balance, warm lighting temperatures, plating symmetry, and glassware hygiene.",

    sub: "Sensory Architecture",

    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    ),
  },

  {
    num: "03",

    t: "Pressure-Tested Systems",

    d: "Repeatable operational playbooks and kitchen workflows engineered to hold firm during peak Saturday evening rushes without compromise.",

    sub: "Zero Operational Drift",

    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
    ),
  },

  {
    num: "04",

    t: "Warmth as the Core Product",

    d: "Rigorous processes create consistency, but heartfelt empathy creates lasting patron loyalty. Professionalism with genuine human connection.",

    sub: "Guest Devotion Engine",

    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
  },
]

/* ---------- STATS / HIGHLIGHTS ---------- */

const STATS = [
  { val: "10+", label: "Years in Mumbai F&B", sub: "Operational track record" },

  { val: "5", label: "Core Disciplines", sub: "End-to-end execution" },

  { val: "90–120", label: "Days Pre-Opening", sub: "Rapid turnkey deployment" },

  {
    val: "100%",

    label: "Open-Book P&L",

    sub: "Complete fiduciary transparency",
  },
]

export function About({ go }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="overflow-hidden bg-cream">
      {/* 1. HERO SECTION — EDITORIAL LUXURY SHOWCASE */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32 border-b border-line/40">
        {/* Ambient atmospheric glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-bronze/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-forest/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
          {/* Header row */}
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-forest/5 px-3.5 py-1 text-xs font-semibold tracking-wider text-forest uppercase mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-pulse" />
                Our Heritage &amp; Ethos
              </div>
              <h1
                className="text-4xl leading-[1.08] tracking-[-0.02em] sm:text-6xl lg:text-[68px] text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A management partner, <br className="hidden sm:inline" />
                <span className="italic font-normal text-bronze">
                  not a landlord.
                </span>
              </h1>
            </Reveal>

            <Reveal
              delay={120}
              className="lg:col-span-5 flex flex-col justify-end"
            >
              <p className="text-base sm:text-lg leading-relaxed text-ink-soft">
                Leo Hospitality &amp; Ventures LLP exists to make hospitality
                concepts feel effortless to their guests and dependable to their
                owners. We bridge culinary distinction with institutional
                financial governance.
              </p>
              {/* Quick credential chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Mumbai Operational Core",

                  "Turnkey Development",

                  "Joint Venture Structures",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-line bg-paper/80 px-3 py-1 text-xs font-medium text-ink-soft shadow-2xs"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Panoramic Visual Banner with floating glass caption */}
          <Reveal delay={200} className="mt-14 lg:mt-20">
            <div className="relative aspect-[4/3] sm:aspect-[16/8] lg:aspect-[16/7] w-full overflow-hidden rounded-2xl border border-line bg-cream shadow-xl">
              <img
                src={IMG.lamps}
                alt="Leo Hospitality warm ambient lamps"
                className="h-full w-full object-cover"
                style={{ filter: "saturate(1.06) brightness(1.03)" }}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Floating Glass Badge */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-10 sm:right-auto flex max-w-lg items-center gap-3 sm:gap-4 rounded-xl border border-white/25 bg-white/20 p-2.5 sm:p-4 shadow-xl backdrop-blur-xl text-paper">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-bronze text-paper font-display font-semibold text-xs sm:text-base">
                  01
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-bronze font-mono">
                    Operational Mandate
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white/95 mt-0.5 leading-snug">
                    Bridging front-of-house theater with back-of-house fiduciary
                    discipline.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. OUR OPERATING PHILOSOPHY — EDITORIAL MANIFESTO */}
      <section className="py-24 lg:py-36 border-b border-line/40">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20 items-center">
            {/* Left Column: Overlapping Luxury Photography Frame */}
            <Reveal className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-cream shadow-xl">
                <img
                  src={IMG.diningRoom}
                  alt="Leo Hospitality dining room interior"
                  className="h-full w-full object-cover"
                  style={{ filter: "saturate(1.05) brightness(1.02)" }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating Inset Photo Accent */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 w-1/2 aspect-square overflow-hidden rounded-2xl border-4 border-paper bg-cream shadow-2xl hidden sm:block">
                <img
                  src={IMG.chefPrep}
                  alt="Chef culinary preparation"
                  className="h-full w-full object-cover"
                  style={{ filter: "saturate(1.06) brightness(1.02)" }}
                  loading="lazy"
                />
              </div>

              {/* Floating Trust Pill */}
              <div className="absolute top-6 -left-3 sm:-left-6 rounded-full border border-white/60 bg-white/85 px-4 py-2 text-xs font-semibold text-forest shadow-lg backdrop-blur-md">
                100% Turnkey Discipline
              </div>
            </Reveal>

            {/* Right Column: Manifesto Narrative */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-bronze/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-bronze uppercase">
                  Our Operating Manifesto
                </div>
                <h2
                  className="mt-5 text-3xl sm:text-4xl lg:text-[44px] leading-tight tracking-[-0.02em] text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Great hospitality is engineered with rigor,{" "}
                  <span className="italic text-bronze">
                    then delivered with warmth.
                  </span>
                </h2>
              </Reveal>

              <Reveal
                delay={120}
                className="mt-6 space-y-5 text-base sm:text-lg leading-relaxed text-ink-soft"
              >
                <p>
                  We believe the best guest experiences are the quiet triumph of
                  disciplined backstage systems — precision recipe costing,
                  bespoke guest journeys, rigorous culinary training, and
                  micro-audits that a diner never explicitly notices, but always
                  instinctively feels.
                </p>
                <p>
                  As an active management company, we shoulder the full weight
                  of operations so owners, investors, and real-estate partners
                  can focus on capital allocation and strategic growth. From
                  boutique lifestyle cafés to multi-brand commercial kitchen
                  networks, our ethos remains immovable: obsessive attention to
                  detail, honest numbers, and warmth that scales.
                </p>
              </Reveal>

              {/* Three Executive Commitments */}
              <Reveal
                delay={200}
                className="mt-10 grid gap-4 sm:grid-cols-3 pt-8 border-t border-line"
              >
                <div className="rounded-xl border border-line bg-paper/60 p-4">
                  <div className="font-display text-lg font-semibold text-forest">
                    01. Open P&amp;L
                  </div>
                  <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                    Audited unit-level accounting, zero hidden procurement
                    markups.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-paper/60 p-4">
                  <div className="font-display text-lg font-semibold text-bronze">
                    02. Culinary R&amp;D
                  </div>
                  <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                    SOPs engineered for consistent taste across 10,000 covers.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-paper/60 p-4">
                  <div className="font-display text-lg font-semibold text-forest">
                    03. People First
                  </div>
                  <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                    Staff retention and dignified frontline hospitality
                    training.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES / GUIDING PRINCIPLES */}
      <section className="bg-paper py-24 lg:py-36 border-b border-line/40">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-3.5 py-1 text-xs font-semibold tracking-wider text-forest uppercase">
                Ethos &amp; Standards
              </div>
              <h2
                className="mt-4 text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The principles that protect our care.
              </h2>
              <p className="mt-4 text-ink-soft text-base leading-relaxed">
                Four non-negotiable standards that govern how our managers hire,
                how our kitchens prep, and how our dining rooms welcome guests.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <SpotlightCard
                  spotlightColor="rgba(184, 159, 122, 0.16)"
                  spotlightSize={360}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-extra-light p-8 shadow-xs transition-all duration-500 hover:-translate-y-1.5 hover:border-bronze hover:shadow-xl"
                >
                  <div>
                    {/* Header with number and icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-normal text-bronze">
                        {v.num}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white/70 text-forest shadow-2xs transition-colors group-hover:bg-forest group-hover:text-paper">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          {v.icon}
                        </svg>
                      </div>
                    </div>

                    <h3
                      className="mt-6 text-xl font-normal tracking-tight text-ink transition-colors group-hover:text-forest"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {v.t}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {v.d}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-line/60 pt-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-bronze font-medium">
                      {v.sub}
                    </span>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DECADE TIMELINE — 2015 TO 2025 */}
      <section className="py-24 lg:py-36 border-b border-line/40">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="mb-16 grid gap-6 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-3.5 py-1 text-xs font-semibold tracking-wider text-forest uppercase mb-4">
                Decade of Evolution
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ten years in hospitality. <br className="hidden sm:inline" />
                <span className="italic text-bronze">
                  Built shift by shift.
                </span>
              </h2>
            </Reveal>

            <Reveal
              delay={120}
              className="lg:col-span-4 flex flex-col justify-end"
            >
              <p className="text-sm sm:text-base leading-relaxed text-ink-soft">
                From managing late-night bistro rushes in South Mumbai to
                engineering proprietary multi-city cloud brands and advisory
                joint ventures.
              </p>
            </Reveal>
          </div>

          {/* Interactive Timeline List */}
          <div className="relative border-l-2 border-bronze/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
            {TIMELINE.map((t, idx) => (
              <Reveal key={t.y} delay={idx * 60}>
                <SpotlightCard
                  spotlightColor="rgba(35, 74, 54, 0.12)"
                  spotlightSize={480}
                  onMouseEnter={() => setActiveTab(idx)}
                  className={`group relative rounded-2xl border p-6 sm:p-8 transition-all duration-500 cursor-pointer ${
                    activeTab === idx
                      ? "border-bronze bg-paper shadow-xl -translate-y-1"
                      : "border-line bg-white/60 hover:border-forest/40 hover:bg-paper/80"
                  }`}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[47px] top-8 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                      activeTab === idx
                        ? "border-bronze bg-forest-deep scale-125"
                        : "border-bronze/50 bg-cream"
                    }`}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-3xl sm:text-4xl font-normal text-forest tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {t.y}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
                      <span className="text-xs uppercase tracking-widest text-bronze font-mono font-medium">
                        {t.phase}
                      </span>
                    </div>

                    <span className="rounded-full border border-forest/15 bg-forest/5 px-3 py-0.5 text-xs font-medium text-forest">
                      {t.badge}
                    </span>
                  </div>

                  <h3
                    className="mt-4 text-xl sm:text-2xl font-normal text-ink tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.t}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-ink-soft max-w-3xl">
                    {t.d}
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BY THE NUMBERS / IMPACT STRIP */}
      <section
        data-tone="dark"
        className="bg-forest-deep py-16 lg:py-24 text-paper relative overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-bronze/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {STATS.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 80}
                className="pt-6 sm:pt-0 sm:px-6 first:pl-0 text-center sm:text-left"
              >
                <div
                  className="text-4xl sm:text-5xl lg:text-6xl font-light text-paper tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.val}
                </div>
                <div className="mt-2 text-sm font-semibold text-bronze tracking-wide uppercase">
                  {s.label}
                </div>
                <div className="mt-1 text-xs text-paper/70">{s.sub}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EXECUTIVE STATEMENT / LEADERSHIP QUOTE */}
      <section className="py-24 lg:py-36 bg-cream border-b border-line/40">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <Reveal>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-bronze/30 bg-bronze/10 text-bronze">
              <span className="font-display text-4xl leading-none">
                &ldquo;
              </span>
            </div>
            <blockquote
              className="mt-6 text-2xl sm:text-3xl lg:text-[34px] leading-[1.35] tracking-[-0.015em] text-ink font-normal"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We don&rsquo;t chase logos or transient opening hype. We build
              resilient operational engines that outlast the opening buzz — the
              quiet consistency that turns a first visit into an enduring habit.
            </blockquote>
            <div className="mt-8 flex flex-col items-center justify-center">
              <div className="h-8 w-px bg-bronze/40 mb-4" />
              <div className="font-semibold text-ink text-base tracking-wide">
                Leadership Council
              </div>
              <div className="text-xs uppercase tracking-widest text-bronze font-mono mt-1">
                Leo Hospitality &amp; Ventures LLP &bull; Mumbai, India
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. NEXT ACTIONS / PARTNERSHIP CTA */}
      <section className="py-20 lg:py-28 bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="rounded-3xl border border-line bg-gradient-to-br from-extra-light via-paper to-cream p-8 sm:p-14 lg:p-16 shadow-lg">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest">
                  Take The Next Step
                </span>
                <h2
                  className="mt-3 text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Ready to elevate your venue&rsquo;s standards?
                </h2>
                <p className="mt-4 text-base sm:text-lg text-ink-soft max-w-2xl leading-relaxed">
                  Whether you are planning a new flagship café, seeking turnkey
                  management for an existing dining room, or exploring a brand
                  joint venture — our principals are ready to advise.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-end">
                <Button
                  onClick={() => go("contact")}
                  className="w-full sm:w-auto text-center justify-center"
                >
                  Consult With Our Team <Arrow />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => go("ventures")}
                  className="w-full sm:w-auto text-center justify-center"
                >
                  Explore Our Ventures
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
