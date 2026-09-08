import { useState, useLayoutEffect, useEffect, useRef } from "react"
import { Kicker, Reveal, usePrefersReducedMotion } from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import { GALLERY_PHOTOS_DATA } from "../lib/data"
import type { PageId } from "../lib/pages"

const CATS = [
  "All",
  "Restaurants & Cafés",
  "Food & Beverages",
  "Events",
  "Team & Operations",
  "Projects",
  "Behind the Scenes",
] as const
type Cat = typeof CATS[number]

export function Gallery({ go }: { go: (p: PageId) => void }) {
  const [cat, setCat] = useState<Cat>("All")
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [settled, setSettled] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const prevRects = useRef<Map<string, DOMRect>>(new Map())
  const reducedMotion = usePrefersReducedMotion()

  // Fire the scatter-in entrance when the grid scrolls into view (once).
  // `settled` flips on after the animation so filtering can use FLIP freely.
  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true)
      setSettled(true)
      return
    }
    const el = gridRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
          window.setTimeout(() => setSettled(true), 1800)
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reducedMotion])

  const shown = GALLERY_PHOTOS_DATA.filter(
    (p) => cat === "All" || p.cat === cat,
  )

  // Capture bounds before category state change
  const handleCatChange = (newCat: Cat) => {
    if (reducedMotion) {
      setCat(newCat)
      return
    }
    const rectsMap = new Map<string, DOMRect>()
    const elements = document.querySelectorAll("[data-flip-id]")
    elements.forEach((el) => {
      const id = el.getAttribute("data-flip-id")
      if (id) {
        rectsMap.set(id, el.getBoundingClientRect())
      }
    })
    prevRects.current = rectsMap
    setCat(newCat)
  }

  // Play FLIP animation after layout effect
  useLayoutEffect(() => {
    if (reducedMotion) return
    const elements = document.querySelectorAll("[data-flip-id]")
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement
      const id = htmlEl.getAttribute("data-flip-id")
      if (!id) return

      const firstRect = prevRects.current.get(id)
      if (!firstRect) return

      const lastRect = htmlEl.getBoundingClientRect()
      const deltaX = firstRect.left - lastRect.left
      const deltaY = firstRect.top - lastRect.top

      if (deltaX !== 0 || deltaY !== 0) {
        // Invert
        htmlEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`
        htmlEl.style.transition = "none"

        // Play
        requestAnimationFrame(() => {
          htmlEl.style.transform = ""
          htmlEl.style.transition =
            "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)"
        })
      }
    })
  }, [cat, reducedMotion])

  // Lightbox Keyboard Navigation
  useEffect(() => {
    if (lightboxIdx === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIdx(null)
      } else if (e.key === "ArrowRight") {
        setLightboxIdx((prev) =>
          prev !== null ? (prev + 1) % shown.length : null,
        )
      } else if (e.key === "ArrowLeft") {
        setLightboxIdx((prev) =>
          prev !== null ? (prev - 1 + shown.length) % shown.length : null,
        )
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden" // Lock page scroll

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [lightboxIdx, shown.length])

  return (
    <>
      <PageHero
        kicker="Gallery"
        title={
          <>
            The work, <span className="italic text-forest">in frames.</span>
          </>
        }
        lead="Interiors, plates, events and the people behind them. Filter by what you'd like to see."
        image={GALLERY_PHOTOS_DATA[4].src}
      />

      <Section className="py-14 lg:py-20">
        {/* Category filters */}
        <div className="mb-10 flex flex-wrap gap-2.5">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => handleCatChange(c)}
              className={`rounded-full border px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95 motion-reduce:active:scale-100 ${
                cat === c
                  ? "border-forest bg-forest text-paper"
                  : "border-line text-ink-soft hover:border-forest hover:text-forest"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid Container */}
        <div
          ref={gridRef}
          className="grid auto-rows-[240px] grid-cols-2 gap-4 overflow-hidden sm:grid-cols-3 lg:grid-cols-4"
        >
          {shown.map((p, i) => {
            const scatter =
              reducedMotion || settled
                ? ""
                : !revealed
                  ? "opacity-0"
                  : i % 2 === 0
                    ? "gallery-enter-left"
                    : "gallery-enter-right"
            const animating = revealed && !settled && !reducedMotion
            return (
            <div
              key={p.src}
              data-flip-id={p.src}
              onClick={() => setLightboxIdx(i)}
              className={`group relative overflow-hidden rounded-none bg-line cursor-pointer ${
                p.span ? "row-span-2" : ""
              } ${scatter}`}
              style={animating ? { animationDelay: `${Math.min(i, 12) * 55}ms` } : undefined}
            >
              {/* Inner wrapper carries the entrance animation so it never
                  conflicts with the FLIP transform on the outer element. */}
              <div
                className={
                  reducedMotion
                    ? "relative h-full w-full"
                    : "gallery-item relative h-full w-full"
                }
                style={
                  reducedMotion
                    ? undefined
                    : { animationDelay: `${Math.min(i, 14) * 45}ms` }
                }
              >
                {/* Floating layer — oversized so the drift never exposes edges;
                    staggered timing keeps the tiles from bobbing in unison. */}
                <div
                  className={
                    reducedMotion
                      ? "absolute inset-0"
                      : "float-img absolute -inset-[6%]"
                  }
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          animationDelay: `${(i % 5) * 0.6}s`,
                          animationDuration: `${6.5 + (i % 3)}s`,
                        }
                  }
                >
                  <img
                    src={p.src}
                    alt={p.cat}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                  />
                </div>
              </div>

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <span className="absolute right-3 top-3 flex h-9 w-9 scale-75 items-center justify-center rounded-full border border-paper/40 bg-ink/30 text-paper opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
                <span className="absolute bottom-4 left-4 translate-y-2 text-xs font-semibold uppercase tracking-wider text-paper transition-transform duration-300 group-hover:translate-y-0 motion-reduce:transition-none">
                  {p.cat}
                </span>
              </div>
            </div>
            )
          })}
        </div>

        {shown.length === 0 && (
          <p className="py-16 text-center text-ink-soft">
            No images in this category yet.
          </p>
        )}
      </Section>

      {/* Lightbox Overlay */}
      {lightboxIdx !== null && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 backdrop-blur-md ${
            reducedMotion ? "" : "animate-backdrop"
          }`}
          onClick={() => setLightboxIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIdx(null)}
            className="glass-dark absolute top-6 right-6 flex h-11 w-11 items-center justify-center text-2xl font-light text-paper/90 hover:text-paper cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest rounded-full"
            aria-label="Close lightbox"
          >
            &times;
          </button>

          {/* Navigation Controls */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIdx((prev) =>
                prev !== null ? (prev - 1 + shown.length) % shown.length : null,
              )
            }}
            className="glass-dark absolute left-4 sm:left-8 flex h-12 w-12 items-center justify-center text-4xl font-light text-paper/80 hover:text-paper cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest rounded-full"
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIdx((prev) =>
                prev !== null ? (prev + 1) % shown.length : null,
              )
            }}
            className="glass-dark absolute right-4 sm:right-8 flex h-12 w-12 items-center justify-center text-4xl font-light text-paper/80 hover:text-paper cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest rounded-full"
            aria-label="Next image"
          >
            &#8250;
          </button>

          {/* Main Visual Frame */}
          <div
            className={`max-w-[85vw] max-h-[80vh] flex flex-col items-center justify-center ${
              reducedMotion ? "" : "animate-lightbox"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={lightboxIdx}
              src={shown[lightboxIdx].src}
              alt={shown[lightboxIdx].cat}
              className={`max-w-full max-h-[75vh] object-contain rounded-none border border-line/10 ${
                reducedMotion ? "" : "lightbox-img"
              }`}
            />
            <div className="glass-dark mt-4 rounded-full px-5 py-2.5 text-center">
              <span className="kicker justify-center text-bronze">
                {shown[lightboxIdx].cat}
              </span>
              <p className="text-xs text-paper/70 mt-1">
                Image {lightboxIdx + 1} of {shown.length} &middot; Navigate with
                arrow keys or swipe
              </p>
            </div>
          </div>
        </div>
      )}

      <CTA go={go} />
    </>
  )
}
export default Gallery
