import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Arrow, Kicker, Reveal, IMG } from "../lib/ui";
import { PageHero } from "../components/PageHero";
import { CTA } from "./Home";
import { VENTURES_DATA } from "../lib/data";
import type { PageId } from "../lib/pages";
import "./venture-section.css";

gsap.registerPlugin(ScrollTrigger);

function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip content
    </a>
  );
}

function VentureSection({
  venture,
  reverse,
  go,
}: {
  venture: typeof VENTURES_DATA[number];
  reverse?: boolean;
  go: (p: PageId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: 1,
        // markers: true, // enable for debugging
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const { tag, name, tagline, copy, points, images, cta } = venture;

  return (
    <section
      ref={containerRef}
      className={`venture-section ${reverse ? "reverse" : ""}`}
    >
      <SkipLink />
      <div className="venture-section__image" ref={imageRef}>
        <img
          src={images[0]}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {/* Future layered assets can be rendered here */}
      </div>
      <div className="venture-section__content" ref={contentRef}>
        <Reveal>
          <Kicker>{tag}</Kicker>
          <h2
            className="mt-5 text-4xl leading-tight tracking-[-0.02em] sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            {name}
          </h2>
          <p
            className="mt-3 text-lg italic text-bronze"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {tagline}
          </p>
          <p className="mt-5 max-w-lg leading-relaxed text-ink-soft">
            {copy}
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                {p}
              </li>
            ))}
          </ul>
          {cta && (
            <Button className="mt-8" onClick={() => go(cta)}>
              Partner With Us <Arrow />
            </Button>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function Ventures({ go }: { go: (p: PageId) => void }) {
  return (
    <>
      <PageHero
        kicker="Our Ventures"
        title={
          <>
            Brands we build, <span className="italic text-forest">run and grow.</span>
          </>
        }
        lead="A parent company with a small, deliberate portfolio — an ambience-led café and a franchise-ready cloud kitchen, with more in development."
        image={IMG.diningRoom}
      />

      {VENTURES_DATA.map((venture, idx) => (
        <VentureSection
          key={venture.id}
          venture={venture}
          reverse={idx % 2 === 1}
          go={go}
        />
      ))}

      {/* FUTURE VENTURES */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <Reveal>
            <Kicker tone="bronze">Future Ventures</Kicker>
            <h2
              className="mt-5 max-w-xl text-4xl leading-tight tracking-[-0.02em] sm:text-5xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              In development.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-ink-soft">
              New concepts we’re incubating. Details follow as each is ready to open its doors.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {["Concept in progress", "Concept in progress", "Concept in progress"].map(
              (c, i) => (
                <Reveal
                  key={i}
                  delay={i * 80}
                  className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-dashed border-line bg-cream/60 p-8"
                >
                  <span className="font-display text-4xl text-line">0{i + 1}</span>
                  <div>
                    <p className="text-lg font-semibold text-ink">{c}</p>
                    <p className="mt-1 text-sm text-ink-soft/80">To be announced</p>
                  </div>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      <CTA go={go} />
    </>
  );
}

export default Ventures;
