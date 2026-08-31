import { Kicker, Reveal, IMG } from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import { PROJECTS_DATA } from "../lib/data"
import type { PageId } from "../lib/pages"

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

      <Section className="py-16 lg:py-24">
        <Reveal className="mb-10 max-w-xl text-sm text-ink-soft">
          <p className="rounded-none border border-line bg-paper px-5 py-4">
            Note — project descriptions below represent key operations and
            metrics. Names and locations are verified from historical
            engagements.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS_DATA.map((p, i) => (
            <Reveal key={p.name} delay={i * 70} className="group">
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
                <span className="kicker mt-2 shrink-0 text-bronze">
                  {p.loc}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-soft/80 leading-relaxed">
                {p.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTA go={go} />
    </>
  )
}

export default Experience
