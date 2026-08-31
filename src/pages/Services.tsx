import { useState } from "react"
import { Kicker, Reveal, IMG } from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import { SERVICES_DATA } from "../lib/data"
import type { PageId } from "../lib/pages"

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

      <Section className="py-16 lg:py-24">
        <div className="border-t border-line">
          {SERVICES_DATA.map((s, i) => {
            const isOpen = open === i
            return (
              <Reveal key={s.n} delay={i * 50}>
                <div className="border-b border-line">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group grid w-full items-center gap-4 py-7 text-left sm:grid-cols-[auto_1fr_auto] sm:gap-8 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-sm text-bronze">
                      {s.n}
                    </span>
                    <span>
                      <span
                        className="block text-2xl tracking-[-0.01em] text-ink transition-colors group-hover:text-forest sm:text-3xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {s.t}
                      </span>
                      <span className="mt-1 block text-sm text-ink-soft leading-relaxed">
                        {s.d}
                      </span>
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-forest transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-forest bg-forest/10"
                          : "group-hover:border-forest"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid overflow-hidden transition-all duration-500 ${
                      isOpen ? "grid-rows-[1fr] pb-8" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0">
                      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 sm:pl-14">
                        {s.caps.map((c) => (
                          <li
                            key={c}
                            className="flex items-start gap-3 text-sm text-ink"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                            {c}
                          </li>
                        ))}
                      </ul>
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
