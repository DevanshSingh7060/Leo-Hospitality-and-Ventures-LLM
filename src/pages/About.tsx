import { Kicker, Reveal, IMG } from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import type { PageId } from "../lib/pages"

const TIMELINE = [
  {
    y: "2015",
    t: "First rooms",
    d: "Cut our teeth operating high-footfall cafés and bars across Mumbai.",
  },
  {
    y: "2018",
    t: "Multi-outlet operations",
    d: "Scaled service standards and P&L discipline across several venues.",
  },
  {
    y: "2021",
    t: "Cloud kitchens",
    d: "Moved delivery-first, building kitchens engineered for consistency.",
  },
  {
    y: "2023",
    t: "Own ventures",
    d: "Launched Café Bodhi Tree and incubated Ryvive Roots.",
  },
  {
    y: "2025",
    t: "Building brands",
    d: "Formalised as Leo Hospitality & Ventures LLP — a management partner.",
  },
]

const VALUES = [
  {
    t: "Owner mindset",
    d: "We manage every rupee and every guest as if the room were our own.",
  },
  {
    t: "Detail-oriented",
    d: "Standards live in the details — plating, timing, tone, cleanliness.",
  },
  {
    t: "Reliable systems",
    d: "Repeatable operations that hold up on a busy Saturday night.",
  },
  {
    t: "Warm hospitality",
    d: "Professional does not mean cold. Warmth is the product.",
  },
]

export function About({ go }: { go: (p: PageId) => void }) {
  return (
    <>
      <PageHero
        kicker="About Us"
        title={
          <>
            A management partner,{" "}
            <span className="italic text-forest">not a landlord.</span>
          </>
        }
        lead="Leo Hospitality & Ventures LLP exists to make hospitality brands feel effortless to their guests and dependable to their owners."
        image={IMG.lamps}
      />

      <Section className="py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <Kicker>Our Philosophy</Kicker>
            <p
              className="mt-6 text-3xl leading-[1.25] tracking-[-0.01em] sm:text-[2.3rem]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Great hospitality is built, not improvised.
            </p>
          </Reveal>
          <Reveal
            delay={100}
            className="space-y-5 leading-relaxed text-ink-soft"
          >
            <p>
              We believe the best guest experiences are the result of
              disciplined systems working quietly in the background — sourcing,
              hiring, training, costing and service design that a diner never
              notices but always feels.
            </p>
            <p>
              As a management company we take on the full weight of operations
              so owners and partners can focus on growth. From a single café to
              a multi-city cloud kitchen network, our approach stays the same:
              obsessive attention to detail, honest numbers, and warmth that
              scales.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* VALUES */}
      <section className="bg-paper py-20 lg:py-28">
        <Section>
          <Reveal>
            <Kicker>What Guides Us</Kicker>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-none border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 70} className="bg-paper p-8">
                <span className="font-display text-2xl text-bronze">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {v.d}
                </p>
              </Reveal>
            ))}
          </div>
        </Section>
      </section>

      {/* TIMELINE */}
      <Section className="py-20 lg:py-28">
        <Reveal>
          <Kicker>The Journey · 2015—2025</Kicker>
          <h2
            className="mt-5 max-w-xl text-4xl leading-tight tracking-[-0.02em] sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Ten years in hospitality.
          </h2>
        </Reveal>
        <div className="mt-14 border-t border-line">
          {TIMELINE.map((t, i) => (
            <Reveal
              key={t.y}
              delay={i * 60}
              className="grid gap-4 border-b border-line py-8 sm:grid-cols-[140px_1fr] sm:gap-12"
            >
              <span className="font-display text-3xl text-forest">{t.y}</span>
              <div>
                <h3 className="text-xl font-semibold text-ink">{t.t}</h3>
                <p className="mt-1.5 max-w-lg text-ink-soft">{t.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* QUOTE — trust signal */}
      <section className="bg-forest-deep py-24 text-paper lg:py-32">
        <Section>
          <Reveal className="mx-auto max-w-4xl text-center">
            <span className="font-display text-6xl text-bronze">&ldquo;</span>
            <blockquote
              className="mt-2 text-2xl leading-[1.4] tracking-[-0.01em] sm:text-[2rem]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              We don&rsquo;t chase logos. We build operations that outlast the
              opening buzz — the kind of consistency that turns a first visit
              into a habit.
            </blockquote>
            <div className="mt-8">
              <p className="font-semibold">
                Leadership, Leo Hospitality & Ventures LLP
              </p>
              <p className="text-sm text-paper/60">
                Founding & Operations Team
              </p>
            </div>
          </Reveal>
        </Section>
      </section>

      <CTA go={go} />
    </>
  )
}
