import { useEffect, useState } from "react"
import { IMG, usePrefersReducedMotion } from "../lib/ui"

/* Vibrant hospitality visuals cycled inside the phone to feel like live content. */
const PHONE_MEDIA = [
  IMG.latteArt,
  IMG.souffle,
  IMG.cupcakes,
  IMG.dessertPlatter,
  IMG.breakfast,
]

const TOP_LINKS = ["Ventures", "Experience", "Franchise"]

/* Monochrome store glyphs — kept cream to suit the dark, elegant aesthetic. */
function AppleGlyph({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.99-.84.95-2.2 1.68-3.37 1.59-.14-1.12.42-2.3 1.09-3.03.76-.84 2.09-1.47 3.4-1.55zM20.5 17.2c-.6 1.38-.9 1.99-1.67 3.2-1.08 1.71-2.6 3.84-4.48 3.85-1.67.02-2.1-1.08-4.37-1.07-2.27.01-2.74 1.09-4.41 1.08-1.88-.02-3.32-1.75-4.4-3.46-3.02-4.71-3.34-10.24-1.48-13.18C1.13 6.3 2.5 5.6 3.96 5.6c1.7 0 2.77 1.09 4.18 1.09 1.36 0 2.19-1.09 4.16-1.09 1.31 0 2.7.71 3.69 1.94-3.24 1.77-2.71 6.4.51 8.66z" />
    </svg>
  )
}
function PlayGlyph({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 3.5c0-.6.63-.98 1.15-.69l14.5 8.19c.53.3.53 1.09 0 1.39l-14.5 8.2c-.52.29-1.15-.09-1.15-.7V3.5z" />
    </svg>
  )
}

function StoreBadge({ glyph, top, bottom }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-paper/20 bg-white/[0.06] px-4 py-2.5 text-paper backdrop-blur-md transition-colors duration-300 hover:border-paper/40 hover:bg-white/[0.12]">
      <span className="text-paper">{glyph}</span>
      <span className="flex flex-col leading-none">
        <span className="text-[0.6rem] uppercase tracking-wide text-paper/70">
          {top}
        </span>
        <span className="mt-0.5 text-sm font-semibold">{bottom}</span>
      </span>
    </div>
  )
}

export function IntroSplash({ onEnter }) {
  const [leaving, setLeaving] = useState(false)
  const [entered, setEntered] = useState(false)
  const [slide, setSlide] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  /* Entrance stagger */
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60)
    return () => clearTimeout(t)
  }, [])

  /* Cycle the phone's "live" content */
  useEffect(() => {
    const t = setInterval(
      () => setSlide((s) => (s + 1) % PHONE_MEDIA.length),
      2400,
    )
    return () => clearInterval(t)
  }, [])

  /* Lock page scroll while the splash is up */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const dismiss = () => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(onEnter, 650)
  }

  /* Enter / Escape / Space also dismiss */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault()
        dismiss()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving])

  const rise = (delay) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "none" : "translateY(20px)",
    transition: reducedMotion
      ? "none"
      : `opacity 800ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 800ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  })

  return (
    <div
      onClick={dismiss}
      role="button"
      tabIndex={0}
      aria-label="Enter site"
      className="fixed inset-0 z-[10000] cursor-pointer select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #1c4a30 0%, #123024 26%, #0c1a12 55%, #080808 100%)",
        opacity: leaving ? 0 : 1,
        transition: "opacity 650ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Massive overlapping brand text, layered behind the phone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
        style={rise(120)}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(6rem, 30vw, 26rem)",
            lineHeight: 0.72,
            letterSpacing: "-0.05em",
            color: "rgba(246,241,231,0.07)",
          }}
        >
          LEO
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(1.6rem, 8.5vw, 7rem)",
            lineHeight: 0.8,
            letterSpacing: "0.02em",
            marginTop: "-0.12em",
            color: "rgba(169,129,79,0.12)",
          }}
        >
          HOSPITALITY
        </span>
      </div>

      {/* Top navigation */}
      <header
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 lg:px-12"
        style={rise(0)}
      >
        <span
          className="text-paper"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.25rem",
            letterSpacing: "-0.01em",
          }}
        >
          Leo <span className="text-bronze">Hospitality</span>
        </span>
        <nav className="hidden items-center gap-9 md:flex">
          {TOP_LINKS.map((l) => (
            <span
              key={l}
              className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-paper/70 transition-colors duration-300 hover:text-paper"
            >
              {l}
            </span>
          ))}
        </nav>
      </header>

      {/* Center: glowing smartphone with live content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="relative" style={rise(220)}>
          {/* Glow */}
          <div
            className={`absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
              reducedMotion ? "" : "ambient-drift"
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(56,98,74,0.75) 0%, rgba(169,129,79,0.35) 45%, transparent 70%)",
            }}
          />
          {/* Phone body */}
          <div
            className="relative overflow-hidden rounded-[2.6rem] border-[6px] border-[#0d0d0d] bg-[#0d0d0d]"
            style={{
              width: "clamp(220px, 74vw, 300px)",
              aspectRatio: "9 / 19",
              boxShadow:
                "0 0 0 2px rgba(246,241,231,0.06), 0 30px 80px -20px rgba(0,0,0,0.8), 0 0 90px -10px rgba(56,98,74,0.5)",
            }}
          >
            {/* Screen — cycling vibrant content */}
            <div className="absolute inset-0 overflow-hidden rounded-[2.1rem] bg-black">
              {PHONE_MEDIA.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                  style={{
                    opacity: i === slide ? 1 : 0,
                    filter: "saturate(1.12) brightness(1.05)",
                    transform:
                      reducedMotion || i !== slide ? "none" : "scale(1.06)",
                    transition: "opacity 1000ms ease, transform 5000ms ease",
                  }}
                />
              ))}
              {/* Screen sheen */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10" />
              {/* Live caption chip */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-paper/20 bg-black/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-paper/90 backdrop-blur-md">
                Live · Leo
              </div>
            </div>
            {/* Notch */}
            <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0d0d0d]" />
          </div>
        </div>
      </div>

      {/* Bottom-right store badges */}
      <div
        className="absolute bottom-6 right-6 z-20 flex flex-col gap-3 sm:flex-row lg:bottom-8 lg:right-12"
        style={rise(340)}
      >
        <StoreBadge
          glyph={<AppleGlyph />}
          top="Download on the"
          bottom="App Store"
        />
        <StoreBadge
          glyph={<PlayGlyph />}
          top="Get it on"
          bottom="Google Play"
        />
      </div>

      {/* Enter hint, bottom-left */}
      <div
        className="absolute bottom-8 left-6 z-20 flex items-center gap-3 text-paper/60 lg:left-12"
        style={rise(340)}
      >
        <span
          className={`h-2 w-2 rounded-full bg-bronze ${
            reducedMotion ? "" : "animate-pulse"
          }`}
        />
        <span className="text-[0.7rem] uppercase tracking-[0.22em]">
          Tap anywhere to enter
        </span>
      </div>
    </div>
  )
}

export default IntroSplash
