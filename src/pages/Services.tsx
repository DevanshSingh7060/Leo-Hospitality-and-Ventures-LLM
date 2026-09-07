import { useState } from "react"
import { Kicker, Reveal, IMG } from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import { SERVICES_DATA } from "../lib/data"
import type { PageId } from "../lib/pages"

// Page-appropriate imagery, index-matched to SERVICES_DATA
const SERVICE_IMAGES = [
  IMG.diningRoom,
  IMG.souffle,
  IMG.woodTable,
  IMG.deliveryBag,
  IMG.bodhiTree,
]

export function Services({ go }: { go: (p: PageId) => void }) {
  const [open, setOpen] = useState<number>(0)

  return (
    <>
      <PageHero
        kicker="Services"
        title={
          <>
            What we take{" "}
            <span className="italic text-forest">off your plate.</span>
          </>
        }
        lead="Five capabilities that can be engaged individually or as an end-to-end management relationship."
        image={IMG.chefBoard}
      />

      {/* Intro band */}
      <Section className="pt-16 lg:pt-24">
        <Reveal className="grid items-end gap-8 border-b border-line pb-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Kicker>How we help</Kicker>
            <h2
              className="mt-5 text-3xl leading-tight tracking-[-0.02em] text-[#1a2e22] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Five disciplines, one standard of care.
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-ink-soft">
            Engage a single capability or an end-to-end management relationship
            — each is run with the same operational discipline and quiet warmth.
          </p>
        </Reveal>
      </Section>

      {/* Accordion */}
      <Section className="pb-16 lg:pb-24">
        <div>
          {SERVICES_DATA.map((s, i) => {
            const isOpen = open === i
            return (
              <Reveal key={s.n} delay={i * 50}>
                <div
                  className={`border-b border-line border-l-2 pl-4 transition-colors duration-300 sm:pl-6 ${
                    isOpen
                      ? "border-l-forest bg-paper"
                      : "border-l-transparent hover:bg-paper/50"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group grid w-full items-center gap-5 py-7 pr-2 text-left sm:grid-cols-[auto_auto_1fr_auto] sm:gap-7 cursor-pointer focus:outline-none"
                  >
                    {/* Index numeral */}
                    <span
                      className={`text-3xl leading-none transition-colors duration-300 ${
                        isOpen ? "text-bronze" : "text-line group-hover:text-bronze/70"
                      }`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {s.n}
                    </span>

                    {/* Icon badge */}
                    <span
                      className={`hidden h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 sm:flex ${
                        isOpen
                          ? "border-forest bg-forest/10 text-forest"
                          : "border-line text-forest group-hover:border-forest"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={s.svgIcon} />
                      </svg>
                    </span>

                    {/* Title + description */}
                    <span>
                      <span
                        className="block text-2xl tracking-[-0.01em] text-ink transition-colors group-hover:text-forest sm:text-3xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {s.t}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                        {s.d}
                      </span>
                    </span>

                    {/* Toggle */}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg text-forest transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-forest bg-forest/10"
                          : "border-line group-hover:border-forest"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {/* Expanded panel: capabilities + imagery */}
                  <div
                    className={`grid overflow-hidden transition-all duration-500 ease-out ${
                      isOpen ? "grid-rows-[1fr] pb-10" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="grid gap-8 sm:pl-[4.75rem] lg:grid-cols-[1.15fr_1fr] lg:gap-14">
                        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                          {s.caps.map((c) => (
                            <li
                              key={c}
                              className="flex items-start gap-2.5 text-sm text-ink"
                            >
                              <svg
                                className="mt-0.5 h-4 w-4 shrink-0 text-bronze"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              {c}
                            </li>
                          ))}
                        </ul>

                        <div className="relative min-h-[200px] overflow-hidden rounded-none bg-cream">
                          <img
                            src={SERVICE_IMAGES[i]}
                            alt={s.t}
                            loading="lazy"
                            style={{ filter: "saturate(1.04) brightness(1.05)" }}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03] motion-reduce:hover:scale-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Section>

      <CTA go={go} />
    </>
  )
}

export default Services
