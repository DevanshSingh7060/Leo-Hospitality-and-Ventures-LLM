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
  const prevRects = useRef<Map<string, DOMRect>>(new Map())
  const reducedMotion = usePrefersReducedMotion()

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
              className={`rounded-full border px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
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
        <div className="grid auto-rows-[240px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((p, i) => (
            <div
              key={p.src}
              data-flip-id={p.src}
              onClick={() => setLightboxIdx(i)}
              className={`group relative overflow-hidden rounded-none bg-line cursor-pointer ${
                p.span ? "row-span-2" : ""
              }`}
            >
              <img
                src={p.src}
                alt={p.cat}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-semibold tracking-wider text-paper uppercase bg-forest/80 px-3 py-1.5 rounded-none backdrop-blur-sm">
                  {p.cat}
                </span>
              </div>
            </div>
          ))}
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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setLightboxIdx(null)}
          role="dialog"
          aria-label="Image Lightbox"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-6 right-6 text-paper/80 hover:text-paper text-3xl font-light p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest rounded-full"
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
            className="absolute left-4 sm:left-8 text-paper/70 hover:text-paper text-5xl font-light p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest rounded-full"
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
            className="absolute right-4 sm:right-8 text-paper/70 hover:text-paper text-5xl font-light p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest rounded-full"
            aria-label="Next image"
          >
            &#8250;
          </button>

          {/* Main Visual Frame */}
          <div
            className="max-w-[85vw] max-h-[80vh] flex flex-col items-center justify-center transition-all duration-300 transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={shown[lightboxIdx].src}
              alt={shown[lightboxIdx].cat}
              className="max-w-full max-h-[75vh] object-contain rounded-none border border-line/10"
            />
            <div className="mt-4 text-center">
              <span className="kicker text-bronze">
                {shown[lightboxIdx].cat}
              </span>
              <p className="text-xs text-paper/60 mt-1">
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
