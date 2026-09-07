import { Fragment, useState } from "react"
import { Reveal, IMG } from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import { PROJECTS_DATA } from "../lib/data"
import type { PageId } from "../lib/pages"
import {
  StoryParallaxBackground,
  StoryParallaxWrap,
  ParallaxStorySection,
  ParallaxDivider,
} from "../components/StoryParallaxShowcase"

const slug = (s: string) => s.replace(/\s+/g, "-").toLowerCase()

/* ─── Vertical curtain-parallax project showcase ───
   Ported from the Ryvive Roots Story page: a fixed lower-layer
   backdrop with full-screen sections scrolled through vertically,
   alternating solid (own fixed-attachment image) and transparent
   (lower layer shows through). */
function ProjectsParallax() {
  const [inView, setInView] = useState(true)
  return (
    <div className="relative">
      {/* Fixed lower-layer image, visible behind transparent slides.
          Hidden while the showcase is out of view so it never overlays
          the hero or CTA (which live outside the parallax wrap). */}
      <StoryParallaxBackground image={IMG.heroInterior} hidden={!inView} />

      <StoryParallaxWrap onInViewChange={setInView}>
        {PROJECTS_DATA.map((p, i) => {
          const solid = i % 2 === 0
          return (
            <Fragment key={p.name}>
              {solid ? (
                /* SOLID — project image is the full-screen fixed background */
                <ParallaxStorySection variant="solid" image={p.img} id={slug(p.name)}>
                  <div className="min-h-screen w-full flex items-end px-6 pb-16 sm:px-8 lg:px-16 lg:pb-24">
                    <div
                      className="max-w-3xl rounded-sm p-7 lg:p-9"
                      style={{
                        background: "rgba(16, 24, 18, 0.55)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        boxShadow: "0 24px 60px -30px rgba(0,0,0,0.75)",
                        border: "1px solid rgba(246,241,231,0.08)",
                      }}
                    >
                      <span
                        className="font-mono text-bronze text-xs uppercase tracking-[0.2em]"
                        style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
                      >
                        {p.type} &nbsp;·&nbsp; {p.loc}
                      </span>
                      <h2
                        className="mt-4 text-paper leading-tight tracking-[-0.02em]"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 400,
                          fontSize: "clamp(2rem, 5vw, 4rem)",
                          textShadow: "0 2px 30px rgba(0,0,0,0.55)",
                        }}
                      >
                        {p.name}
                      </h2>
                      <p
                        className="mt-4 max-w-xl text-sm leading-relaxed text-paper/85 lg:text-base"
                        style={{ textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
                      >
                        {p.description}
                      </p>
                    </div>
                  </div>
                </ParallaxStorySection>
              ) : (
                /* TRANSPARENT — lower layer shows through; project shown as an
                   inline framed image beside the copy (two-plane feel). */
                <ParallaxStorySection variant="transparent" id={slug(p.name)}>
                  <div className="min-h-screen w-full flex items-center px-6 py-24 sm:px-8 lg:px-16">
                    <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2">
                      <div
                        className="rounded-sm p-7 lg:p-9"
                        style={{
                          background: "rgba(16, 24, 18, 0.55)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          boxShadow: "0 24px 60px -30px rgba(0,0,0,0.75)",
                          border: "1px solid rgba(246,241,231,0.08)",
                        }}
                      >
                        <span
                          className="font-mono text-bronze text-xs uppercase tracking-[0.2em]"
                          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
                        >
                          {p.type} &nbsp;·&nbsp; {p.loc}
                        </span>
                        <h2
                          className="mt-4 text-paper leading-tight tracking-[-0.02em]"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 400,
                            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                            textShadow: "0 2px 30px rgba(0,0,0,0.6)",
                          }}
                        >
                          {p.name}
                        </h2>
                        <p
                          className="mt-4 max-w-lg text-sm leading-relaxed text-paper/85 lg:text-base"
                          style={{ textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
                        >
                          {p.description}
                        </p>
                      </div>
                      <div className="h-[42vh] overflow-hidden rounded-sm lg:h-[56vh]">
                        <img
                          src={p.img}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </ParallaxStorySection>
              )}
              {i < PROJECTS_DATA.length - 1 && <ParallaxDivider />}
            </Fragment>
          )
        })}
      </StoryParallaxWrap>
    </div>
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

      {/* Vertical curtain-parallax project showcase */}
      <ProjectsParallax />

      <CTA go={go} />
    </>
  )
}

export default Experience
