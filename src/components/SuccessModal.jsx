import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Button, Arrow } from "../lib/ui"

const CHECK = "M20 6L9 17l-5-5"

/* ---------- Botanical Four-Leaf Clover print (matches Contact form) ---------- */
function FourLeafClover({
  size = 48,
  strokeWidth = 1.4,
  fillOpacity = 0.14,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <g id="success-clover-petal">
          <path
            d="M 50 50 C 41 37 30 20 41 10 C 47 4 50 14 50 19 C 50 14 53 4 59 10 C 70 20 59 37 50 50 Z"
            fillOpacity={fillOpacity}
          />
          <path
            d="M 50 50 L 50 18"
            strokeWidth="0.9"
            fill="none"
            opacity="0.65"
          />
        </g>
      </defs>
      <use href="#success-clover-petal" transform="rotate(0 50 50)" />
      <use href="#success-clover-petal" transform="rotate(90 50 50)" />
      <use href="#success-clover-petal" transform="rotate(180 50 50)" />
      <use href="#success-clover-petal" transform="rotate(270 50 50)" />
      <path
        d="M 50 50 Q 48 72 36 92"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  )
}

/**
 * Animated, on-brand confirmation modal shown after a form submission.
 * Renders through a portal, locks body scroll, closes on Escape / backdrop
 * click, and respects prefers-reduced-motion.
 */
export function SuccessModal({
  kicker,
  title,
  message,
  summary,
  children,
  primaryLabel = "Return Home",
  onPrimary,
  secondaryLabel,
  onSecondary,
  onClose,
}) {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  if (typeof document === "undefined") return null

  return createPortal(
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto p-4 sm:p-6 bg-forest-deep/60 backdrop-blur-md ${
        reducedMotion ? "" : "animate-backdrop"
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Submission confirmed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-white/80 bg-paper/95 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12 ${
          reducedMotion ? "" : "animate-lightbox"
        }`}
        style={{
          boxShadow:
            "0 40px 90px -25px rgba(22,51,31,0.4), inset 0 1px 0 rgba(255,255,255,0.95)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-ink-soft transition-colors hover:bg-black/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-forest/30"
        >
          &times;
        </button>

        {/* Botanical clover watermarks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 -right-8 select-none text-accent-green opacity-[0.14]"
        >
          <FourLeafClover size={190} strokeWidth={1.2} fillOpacity={0.16} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-10 select-none text-primary opacity-[0.10] -rotate-45"
        >
          <FourLeafClover size={160} strokeWidth={1.2} fillOpacity={0.14} />
        </div>

        {/* Animated success badge with pulsing ring */}
        <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          {!reducedMotion && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest/40" />
          )}
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-forest text-paper shadow-lg">
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={CHECK} />
            </svg>
          </span>
        </div>

        <span className="relative z-10 font-mono text-xs uppercase tracking-[0.24em] text-bronze">
          {kicker}
        </span>
        <h2
          className="relative z-10 mt-3 text-3xl text-forest sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>

        <p className="relative z-10 mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft">
          {message}
        </p>

        {children && <div className="relative z-10 mt-8">{children}</div>}

        {summary && summary.length > 0 && (
          <div className="relative z-10 mx-auto mt-8 max-w-sm border border-white/70 bg-white/60 p-5 text-left text-xs shadow-xs backdrop-blur-md">
            {summary.map((item, i) => (
              <div
                key={item.label}
                className={`flex justify-between gap-4 ${
                  i > 0 ? "border-t border-line/40 pt-2.5 mt-2.5" : ""
                }`}
              >
                <span className="text-ink-soft">{item.label}</span>
                <span
                  className={
                    item.accent
                      ? "font-medium text-forest"
                      : "font-semibold text-ink"
                  }
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-4">
          <Button onClick={onPrimary}>
            {primaryLabel} <Arrow />
          </Button>
          {secondaryLabel && onSecondary && (
            <button
              onClick={onSecondary}
              className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-white/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink backdrop-blur-md transition-colors hover:border-forest hover:text-forest"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SuccessModal
