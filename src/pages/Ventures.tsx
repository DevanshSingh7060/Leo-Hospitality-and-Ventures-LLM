import { useState } from "react"
import { Button, Arrow, Kicker, Reveal, IMG } from "../lib/ui"
import { PageHero } from "../components/PageHero"
import { CTA } from "./Home"
import { VENTURES_DATA, type Venture } from "../lib/data"
import type { PageId } from "../lib/pages"

/* -------------------------------------------------------------------------- */
/*                                DATA & ASSETS                               */
/* -------------------------------------------------------------------------- */

const VENTURE_METRICS: Record<
  string,
  { label: string; val: string; sub: string }[]
> = {
  "bodhi-tree": [
    { val: "4.8 ★", label: "Guest Satisfaction", sub: "Based on 1,400+ verified ratings" },
    { val: "350+", label: "Daily Covers", sub: "Consistent breakfast to dinner flow" },
    { val: "100%", label: "Speciality Coffee", sub: "Single-origin estate arabica beans" },
    { val: "All-Day", label: "Dining Ambience", sub: "Built for community & creative work" },
  ],
  "ryvive-roots": [
    { val: "< 28 min", label: "Avg. Delivery Time", sub: "Optimized packaging & logistics" },
    { val: "99.2%", label: "Recipe Consistency", sub: "Standardized ingredient-level prep" },
    { val: "60 Days", label: "Turnkey Setup", sub: "Site selection to kitchen launch" },
    { val: "Multi-Brand", label: "Kitchen Output", sub: "Engineered for high-volume scale" },
  ],
}

const VENTURE_HIGHLIGHTS: Record<
  string,
  { title: string; desc: string; icon: string }[]
> = {
  "bodhi-tree": [
    {
      title: "Artisanal Coffee Programme",
      desc: "Custom-calibrated espresso extractions, single-origin pour-overs, and dairy-alternative beverage formulations.",
      icon: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z",
    },
    {
      title: "Atmospheric Interior Architecture",
      desc: "Biophilic greenery, curated ambient lighting, warm oak woodwork, and tactile natural stone textures.",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      title: "Seasonal Scratch Kitchen",
      desc: "Farm-to-table sourdough toasts, bowls, handcrafted confectionery, and nourishing clean-label recipes.",
      icon: "M12 3v18m-9-9h18",
    },
  ],
  "ryvive-roots": [
    {
      title: "Centrally Audited Cloud SOPs",
      desc: "Digital recipe formulation, automated inventory reordering, and uniform portion controls across all kitchens.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Multi-Aggregator Tech Integration",
      desc: "Unified order dispatch terminals connecting seamlessly to Swiggy, Zomato, and direct delivery fleets.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      title: "Plug-and-Play Franchise Blueprint",
      desc: "Turnkey equipment layouts, certified vendor supply chains, and staff training modules for 60-day launches.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
  ],
}

const FUTURE_CONCEPTS = [
  {
    num: "01",
    name: "The Conservatory Lounge",
    type: "Botanical Cocktail & Social Lounge",
    tagline: "Evening mixology paired with progressive artisanal small plates.",
    stage: "Site Feasibility",
    stageColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    location: "Mumbai (BKC / Lower Parel)",
    image: IMG.lamps,
    desc: "An intimate conservatory setting celebrating botanical spirits, rare herbal teas, and twilight dining for urban tastemakers.",
    features: ["Curated Zero-Proof & Spirit Menus", "Acoustic-Treated Lounge Architecture", "Bespoke Evening Hospitality"],
  },
  {
    num: "02",
    name: "Maison Artisane",
    type: "Boulangerie & Specialty Espresso Bar",
    tagline: "Handcrafted French viennoiserie and slow-fermented sourdoughs.",
    stage: "Culinary Lab R&D",
    stageColor: "text-amber-800 bg-amber-50 border-amber-200",
    location: "South Mumbai / Bandra",
    image: IMG.souffle,
    desc: "A neighborhood bakery honoring traditional European lamination techniques, stone-ground flours, and micro-lot single origin coffees.",
    features: ["Daily Small-Batch Baking", "Open Kitchen Display", "High-Volume Grab & Go"],
  },
  {
    num: "03",
    name: "Veda Hearth",
    type: "Wood-Fired Indian Coastal Dining",
    tagline: "Ancient clay-pot cooking meets contemporary seaside hospitality.",
    stage: "Concept Formulation",
    stageColor: "text-forest bg-light-green/40 border-forest/20",
    location: "Goa / Western Coast",
    image: IMG.woodTable,
    desc: "Charcoal and wood-fired culinary heritage reviving forgotten recipes across the Konkan, Malabar, and Coromandel coastlines.",
    features: ["Locally Sourced Coastal Catch", "Handcrafted Clay Oven Cooking", "Bespoke Heritage Beverage Pairing"],
  },
]

/* -------------------------------------------------------------------------- */
/*                            VENTURE SHOWCASE                                */
/* -------------------------------------------------------------------------- */

function VentureShowcase({
  venture,
  reverse,
  go,
}: {
  venture: Venture
  reverse?: boolean
  go: (p: PageId) => void
}) {
  const [activeTab, setActiveTab] = useState<"pillars" | "metrics">("pillars")
  const metrics = VENTURE_METRICS[venture.id] || []
  const highlights = VENTURE_HIGHLIGHTS[venture.id] || []

  return (
    <section className="relative overflow-hidden border-b border-line/60 bg-paper py-20 lg:py-28">
      {/* Ambient background decoration */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute h-96 w-96 rounded-full blur-3xl opacity-40 ${
          reverse ? "-left-20 top-20 bg-bronze/10" : "-right-20 bottom-20 bg-forest/10"
        }`}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div
          className={`grid items-center gap-12 lg:grid-cols-12 lg:gap-16 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* IMAGE SIDE (Col 1-6 or 7-12) */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Main Visual Frame with Luxury Hover Zoom */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs border border-line bg-cream shadow-xl group">
                  <img
                    src={venture.images[0]}
                    alt={venture.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60" />

                  {/* Live Status Glass Pill */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-forest font-semibold">
                      {venture.id === "bodhi-tree" ? "Flagship Dine-In Venue" : "Delivery-First Operations"}
                    </span>
                  </div>

                  {/* Title overlay on bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-paper">
                    <span className="text-xs font-mono uppercase tracking-widest text-bronze font-medium">
                      {venture.tag}
                    </span>
                    <h4
                      className="text-xl sm:text-2xl font-normal drop-shadow-sm text-paper"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {venture.name}
                    </h4>
                  </div>
                </div>

                {/* Floating Secondary Detail Photo (Offset luxury glass frame) */}
                <div className="absolute -bottom-8 -right-4 sm:-right-8 w-44 sm:w-56 aspect-[4/3] overflow-hidden rounded-xs border-2 border-white bg-paper shadow-2xl transition-transform duration-500 hover:-translate-y-1 z-20">
                  <img
                    src={venture.images[1]}
                    alt={`${venture.name} Detail`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono uppercase tracking-wider text-paper font-semibold">
                    {venture.id === "bodhi-tree" ? "Handcrafted Espresso" : "Tamper-Evident Packaging"}
                  </div>
                </div>

                {/* Floating Ambient Motif from venture.floatingAsset */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 text-forest/15 hidden sm:block"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                    <path d="M12 2C11.5 2 6 6 6 12C6 15.3 8.7 18 12 18C15.3 18 18 15.3 18 12C18 6 12.5 2 12 2Z" />
                  </svg>
                </div>
              </div>
            </Reveal>
          </div>

          {/* CONTENT SIDE (Col 7-12) */}
          <div className="lg:col-span-6 pt-6 lg:pt-0">
            <Reveal>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-bronze" />
                <Kicker tone="bronze">{venture.tag}</Kicker>
              </div>

              <h2
                className="mt-3 text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-[1.12] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {venture.name}
              </h2>

              <p
                className="mt-3 text-lg text-forest italic font-normal leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                &ldquo;{venture.tagline}&rdquo;
              </p>

              <p className="mt-5 text-base leading-relaxed text-ink-soft">
                {venture.copy}
              </p>

              {/* Interactive Tabs: Pillars vs Metrics */}
              <div className="mt-8 border-b border-line pb-2 flex gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("pillars")}
                  className={`relative pb-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === "pillars" ? "text-forest" : "text-ink-soft/70 hover:text-ink"
                  }`}
                >
                  Operational Pillars
                  {activeTab === "pillars" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("metrics")}
                  className={`relative pb-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === "metrics" ? "text-forest" : "text-ink-soft/70 hover:text-ink"
                  }`}
                >
                  Key Impact Metrics
                  {activeTab === "metrics" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest" />
                  )}
                </button>
              </div>

              {/* TAB 1: OPERATIONAL PILLARS */}
              {activeTab === "pillars" && (
                <div className="mt-6 space-y-4 animate-fadeIn">
                  {highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 rounded-none border border-line/60 bg-cream/30 p-3.5 transition-all duration-300 hover:border-forest/40 hover:bg-cream/60"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.7}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={h.icon} />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-ink">{h.title}</h4>
                        <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: KEY METRICS GRID */}
              {activeTab === "metrics" && (
                <div className="mt-6 grid grid-cols-2 gap-3 animate-fadeIn">
                  {metrics.map((m, i) => (
                    <div
                      key={i}
                      className="rounded-none border border-line bg-cream/40 p-4 transition-all duration-300 hover:border-forest/50"
                    >
                      <div
                        className="text-2xl font-normal text-forest"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {m.val}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-ink">{m.label}</div>
                      <div className="mt-0.5 text-[11px] text-ink-soft">{m.sub}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {venture.cta && (
                  <Button onClick={() => go(venture.cta as PageId)}>
                    Franchise &amp; Partner Model <Arrow />
                  </Button>
                )}
                <Button variant="secondary" onClick={() => go("contact")}>
                  Executive Inquiry
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export function Ventures({ go }: { go: (p: PageId) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "dining" | "delivery">("all")

  const filteredVentures = VENTURES_DATA.filter((v) => {
    if (selectedCategory === "dining") return v.id === "bodhi-tree"
    if (selectedCategory === "delivery") return v.id === "ryvive-roots"
    return true
  })

  return (
    <>
      <PageHero
        kicker="Brand Portfolio & Scale"
        title={
          <>
            Concepts we formulate, <span className="italic text-forest">operate and scale.</span>
          </>
        }
        lead="A deliberate hospitality portfolio spanning an ambience-led dine-in café and a franchise-engineered cloud kitchen ecosystem — built on institutional discipline, culinary integrity, and scalable economics."
        image={IMG.diningRoom}
      />

      {/* PORTFOLIO OVERVIEW METRICS STRIP */}
      <section className="border-b border-line bg-[#f8f5ee] py-8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3.5 border-r border-line/70 pr-4">
              <span className="font-display text-3xl font-normal text-forest">02</span>
              <div>
                <p className="text-xs font-semibold text-ink uppercase tracking-wider">Active Flagships</p>
                <p className="text-[11px] text-ink-soft">Dine-In &amp; Cloud Formats</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 border-r border-line/70 pr-4">
              <span className="font-display text-3xl font-normal text-bronze">03</span>
              <div>
                <p className="text-xs font-semibold text-ink uppercase tracking-wider">Concepts in Lab</p>
                <p className="text-[11px] text-ink-soft">Active Incubation Pipeline</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 border-r border-line/70 pr-4">
              <span className="font-display text-3xl font-normal text-forest">100%</span>
              <div>
                <p className="text-xs font-semibold text-ink uppercase tracking-wider">SOP Compliance</p>
                <p className="text-[11px] text-ink-soft">Standardized Prep &amp; COGS</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <span className="font-display text-3xl font-normal text-bronze">4.8★</span>
              <div>
                <p className="text-xs font-semibold text-ink uppercase tracking-wider">Guest Trust</p>
                <p className="text-[11px] text-ink-soft">Consistent Experience Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO FILTER CHIPS */}
      <section className="bg-paper pt-12 pb-4">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 flex flex-wrap items-center justify-between gap-4 border-b border-line/40 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze font-semibold">
              Live Venues
            </span>
            <h3
              className="mt-1 text-2xl sm:text-3xl text-ink font-normal"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Operating Portfolio
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Formats" },
              { id: "dining", label: "Dine-in Cafés" },
              { id: "delivery", label: "Cloud Kitchens" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  selectedCategory === tab.id
                    ? "bg-forest text-paper shadow-xs"
                    : "border border-line bg-paper text-ink hover:border-forest/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* VENTURES SHOWCASE LIST */}
      {filteredVentures.map((venture, idx) => (
        <VentureShowcase
          key={venture.id}
          venture={venture}
          reverse={idx % 2 === 1}
          go={go}
        />
      ))}

      {/* FUTURE VENTURES INCUBATION PIPELINE */}
      <section className="relative overflow-hidden bg-[#faf7f2] py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line/60 pb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze font-semibold">
                  Culinary R&amp;D Pipeline
                </span>
                <h2
                  className="mt-3 text-3xl sm:text-4xl lg:text-5xl text-ink font-normal tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  The Incubator: <span className="italic text-forest">Concepts in Development.</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                  We actively design, test, and pilot innovative dining concepts from our culinary laboratory before site deployment. Early partner inquiries and location pitches are welcome.
                </p>
              </div>

              <Button variant="secondary" onClick={() => go("franchise")}>
                Propose a Location / Space <Arrow />
              </Button>
            </div>
          </Reveal>

          {/* 3 FUTURE VENTURE CARDS */}
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {FUTURE_CONCEPTS.map((c, i) => (
              <Reveal
                key={c.num}
                delay={i * 80}
                className="group flex flex-col justify-between rounded-none border border-line bg-paper shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-bronze hover:shadow-xl overflow-hidden"
              >
                <div>
                  {/* Photo Header with subtle zoom */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />

                    {/* Number Badge */}
                    <div className="absolute left-4 top-4 flex items-center justify-center rounded-full border border-white/60 bg-white/80 px-3 py-1 shadow-xs backdrop-blur-md">
                      <span className="font-mono text-xs font-semibold text-forest">{c.num}</span>
                    </div>

                    {/* Stage Pill */}
                    <div
                      className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${c.stageColor}`}
                    >
                      {c.stage}
                    </div>

                    {/* Title in Image */}
                    <div className="absolute bottom-3 left-4 right-4 text-paper">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-bronze font-medium">
                        {c.type}
                      </p>
                      <h3
                        className="text-xl font-normal text-paper"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {c.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <p
                      className="text-xs italic text-forest font-medium"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      &ldquo;{c.tagline}&rdquo;
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                      {c.desc}
                    </p>

                    {/* Feature tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {c.features.map((f) => (
                        <span
                          key={f}
                          className="rounded-none border border-line bg-cream/60 px-2 py-0.5 text-[10px] text-ink-soft font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 border-t border-line/60 pt-3 text-[11px] text-ink-soft flex items-center justify-between">
                      <span>Target Hub:</span>
                      <span className="font-semibold text-ink">{c.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => go("contact")}
                    className="w-full rounded-none border border-line/80 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-forest hover:bg-forest hover:text-paper"
                  >
                    Inquire for Co-Investment →
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CO-INVESTMENT & EXPANSION CTA */}
      <section className="bg-forest-deep py-20 text-paper lg:py-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-12 text-center">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze font-semibold">
              Strategic Collaboration
            </span>
            <h2
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-normal text-paper"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Have a prime property or a culinary concept?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-paper/75">
              We partner with real estate developers, investors, and chefs under transparent joint venture or management-contract models. Let&apos;s evaluate feasibility together.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button variant="light" onClick={() => go("franchise")}>
                Explore Franchise Models <Arrow />
              </Button>
              <Button onClick={() => go("contact")}>
                Schedule Executive Meeting
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA go={go} />
    </>
  )
}

export default Ventures
