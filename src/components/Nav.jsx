import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { IMG } from "../lib/ui"
import logoDark from "../assets/LEO Logo-dark.svg"
import logoLight from "../assets/LEO Logo-light.svg"

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "ventures", label: "Ventures" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "gallery", label: "Gallery" },
  { id: "franchise", label: "Franchise" },
  { id: "careers", label: "Careers" },
  { id: "vendor", label: "Vendor Registration" },
  { id: "contact", label: "Contact Us" },
]

/* Links shown in the slim desktop bar. The full set lives in the drawer. */
const BAR_LINKS = [
  "about",
  "ventures",
  "services",
  "experience",
  "gallery",
  "contact",
]

/* Palette mirrors the official brand palette in index.css */
const CREAM = "#f8f6f1"
const BRONZE = "#b89f7a"
const DARK_GREEN = "#3e5225"

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

/* ---------- Social icons (inline so we carry no icon dependency) ---------- */
function IconInstagram({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconLinkedin({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-11h4v1.5" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function IconFacebook({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconHandshake({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 17l2 2 4-4 4 4M2 12l4-4 4 4-4 4zM10 8l3-3 4 4" />
    </svg>
  )
}

const SOCIALS = [
  { label: "Instagram", Icon: IconInstagram, href: "#" },
  { label: "LinkedIn", Icon: IconLinkedin, href: "#" },
  { label: "Facebook", Icon: IconFacebook, href: "#" },
]

/* ---------- Right-side drawer (portaled out of the blurred header) ---------- */
function Drawer({ open, isDesktop, page, go, close }) {
  if (typeof document === "undefined") return null

  const panelBase =
    "relative h-full shadow-2xl transition-transform duration-[650ms] motion-reduce:transition-none"
  const panelStyle = {
    transitionTimingFunction: EASE,
    transform: open ? "translateX(0)" : "translateX(100%)",
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[9998] flex justify-end overflow-hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className="absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none"
        style={{
          opacity: open ? 1 : 0,
          transitionTimingFunction: EASE,
          background: "rgba(22,20,17,0.72)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />

      {isDesktop ? (
        /* ---- Desktop: cream editorial panel ---- */
        <div
          className={`${panelBase} w-[420px] overflow-y-auto`}
          style={{
            ...panelStyle,
            background: "#f5f1e8",
            scrollbarWidth: "none",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex min-h-full flex-col px-10 pb-8 pt-8">
            {/* Logo + tagline */}
            <div className="flex shrink-0 flex-col">
              <img
                src={logoLight}
                alt="Leo Hospitality & Ventures"
                className="w-[160px] object-contain"
              />
              <p
                className="mt-3 max-w-[290px]"
                style={{
                  fontSize: "12.5px",
                  lineHeight: 1.7,
                  color: "rgba(30,25,21,0.65)",
                }}
              >
                Creating experiences. Building hospitality brands.
              </p>
            </div>

            {/* Divider */}
            <div
              className="my-5 h-px w-full shrink-0"
              style={{ background: "rgba(30,25,21,0.08)" }}
            />

            {/* Links */}
            <nav className="flex flex-col gap-[6px]">
              {NAV_ITEMS.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => {
                    go(it.id)
                    close()
                  }}
                  style={{
                    fontFamily: "var(--font-display)",
                    transitionDelay: open ? `${80 + i * 30}ms` : "0ms",
                    transitionTimingFunction: EASE,
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(14px)",
                    color: page === it.id ? "#234a36" : "rgba(30,25,21,0.78)",
                  }}
                  className="block w-fit py-[5px] text-[20px] font-light leading-none transition-all duration-500 hover:text-[#a9814f] motion-reduce:transition-none"
                >
                  {it.label}
                </button>
              ))}
            </nav>

            {/* Divider */}
            <div
              className="my-5 h-px w-full shrink-0"
              style={{ background: "rgba(30,25,21,0.08)" }}
            />

            {/* Imagery */}
            <div className="flex shrink-0 flex-col items-center gap-2">
              <div className="flex w-full justify-center gap-2">
                {[IMG.bodhiTree, IMG.latteArt].map((src) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-[8px] flex-1"
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-[72px] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                    />
                  </div>
                ))}
              </div>
              <div className="overflow-hidden rounded-[8px] w-full">
                <img
                  src={IMG.diningRoom}
                  alt=""
                  className="h-[80px] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </div>
            </div>

            {/* Socials */}
            <div className="mt-5 flex shrink-0 items-center justify-center gap-7">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-black/10 text-[#2b2622] transition-all duration-300 hover:-translate-y-[1px] hover:border-black/20"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Address */}
            <div className="mt-5 shrink-0 border-t border-black/5 pt-5">
              <div
                className="text-center"
                style={{
                  fontSize: "12.5px",
                  lineHeight: 1.9,
                  color: "rgba(30,25,21,0.65)",
                }}
              >
                Leo Hospitality &amp; Ventures LLP
                <br />
                Mumbai, Maharashtra, India
                <br />
                connect@leohospitality.in
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ---- Mobile: dark drawer ---- */
        <div
          className={`${panelBase} flex w-[85%] max-w-[420px] flex-col md:w-[480px] md:max-w-none`}
          style={{ ...panelStyle, background: DARK_GREEN }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="flex h-full flex-1 flex-col overflow-y-auto px-6 pb-8 pt-[72px] md:px-12"
            style={{ scrollbarWidth: "none" }}
          >
            <p
              className="mb-6 text-[12px] font-medium uppercase tracking-[0.2em]"
              style={{ color: BRONZE }}
            >
              Explore
            </p>

            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => {
                    go(it.id)
                    close()
                  }}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    color: page === it.id ? BRONZE : CREAM,
                    transitionDelay: open ? `${100 + i * 40}ms` : "0ms",
                    transitionTimingFunction: EASE,
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(20px)",
                  }}
                  className="block w-fit text-[20px] leading-none transition-all duration-500 hover:text-[#b89f7a] md:text-[24px] motion-reduce:transition-none"
                >
                  {it.label}
                </button>
              ))}
            </nav>

            <div
              className="my-6 h-px w-full shrink-0"
              style={{ background: "rgba(246,241,231,0.1)" }}
            />

            <div className="flex-grow" />

            <div
              className="mt-auto flex shrink-0 items-center gap-6 border-t pt-6"
              style={{ borderColor: "rgba(246,241,231,0.1)" }}
            >
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="transition-transform duration-300 hover:scale-110 hover:text-[#b89f7a]"
                  style={{ color: CREAM }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}

/* ---------- Header ---------- */
export function Nav({ page, go, overHero }) {
  const [scrolled, setScrolled] = useState(false)
  const [overDark, setOverDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  /* Scrolled state + tone detection against [data-tone="dark"] zones. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const probe = 36 // header mid-line, in viewport coordinates
      const zones = Array.from(document.querySelectorAll('[data-tone="dark"]'))
      setOverDark(
        zones.some((el) => {
          const r = el.getBoundingClientRect()
          return r.top <= probe && r.bottom > probe
        }),
      )
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [page])

  /* Close the drawer whenever the page changes. */
  useEffect(() => {
    setOpen(false)
  }, [page])

  /* Track the desktop breakpoint so the drawer can switch presentation. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => {
      setIsDesktop(mq.matches)
      setOpen(false)
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  /* Lock scroll and wire ESC while the drawer is open. */
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const headerText = overDark ? CREAM : "#3e5225"
  const headerMuted = overDark
    ? "rgba(248,246,241,0.88)"
    : "rgba(46,46,46,0.85)"
  const headerBorder = overDark
    ? "rgba(248,246,241,0.15)"
    : "rgba(215,201,177,0.4)"
  const burgerColor = open ? (isDesktop ? BRONZE : CREAM) : headerText

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-[9999] transition-all duration-500"
        style={{
          background: scrolled
            ? overDark
              ? "rgba(62,82,37,0.94)"
              : "rgba(248,246,241,0.95)"
            : overDark
              ? "rgba(62,82,37,0.45)"
              : "rgba(248,246,241,0.5)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? `1px solid ${headerBorder}`
            : overDark
              ? "1px solid rgba(248,246,241,0.15)"
              : "1px solid rgba(215,201,177,0.35)",
          boxShadow: scrolled
            ? "0 10px 30px -10px rgba(0,0,0,0.08)"
            : "0 4px 20px -4px rgba(0,0,0,0.03)",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-14">
          <div className="relative flex h-[72px] items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => go("home")}
              className="flex shrink-0 items-center transition-opacity duration-300 hover:opacity-90"
              aria-label="Leo Hospitality & Ventures — home"
            >
              <img
                src={overDark ? logoDark : logoLight}
                alt="Leo Hospitality & Ventures"
                className="h-9 w-auto shrink-0 object-contain transition-opacity duration-300 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)] sm:h-10 lg:h-9 xl:h-11"
                style={{
                  opacity: 0.98,
                }}
              />
            </button>

            {/* Desktop links */}
            <nav className="hidden items-center gap-6 lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 xl:gap-9">
              {BAR_LINKS.map((id) => {
                const item = NAV_ITEMS.find((n) => n.id === id)
                if (!item) return null
                const isCurrent = page === id
                return (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    aria-current={isCurrent ? "page" : undefined}
                    className="relative shrink-0 whitespace-nowrap uppercase tracking-[0.14em] transition-colors duration-300 font-medium xl:tracking-[0.2em]"
                    style={{
                      fontSize: "12.5px",
                      color: isCurrent ? headerText : headerMuted,
                      textShadow: overDark
                        ? "0 1px 2px rgba(0,0,0,0.3)"
                        : "0 1px 1px rgba(255,255,255,0.6)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) e.currentTarget.style.color = BRONZE
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) e.currentTarget.style.color = headerMuted
                    }}
                  >
                    {item.label}
                    {isCurrent && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: "-6px",
                          height: "1.5px",
                          background: BRONZE,
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Vendor Registration — distinct CTA pill (desktop only) */}
            <button
              onClick={() => go("vendor")}
              aria-current={page === "vendor" ? "page" : undefined}
              className="hidden shrink-0 items-center gap-2 rounded-full border px-4 py-2 uppercase tracking-[0.16em] transition-all duration-300 lg:inline-flex"
              style={{
                fontSize: "11.5px",
                fontWeight: 500,
                color: page === "vendor" ? CREAM : headerText,
                borderColor: BRONZE,
                background: page === "vendor" ? BRONZE : "transparent",
                textShadow: overDark
                  ? "0 1px 2px rgba(0,0,0,0.3)"
                  : "0 1px 1px rgba(255,255,255,0.6)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = BRONZE
                e.currentTarget.style.color = CREAM
              }}
              onMouseLeave={(e) => {
                if (page !== "vendor") {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = headerText
                }
              }}
            >
              <IconHandshake size={14} />
              Vendor Registration
            </button>

            {/* Right cluster: Burger Menu Button (mobile/tablet only) */}
            <div className="flex shrink-0 items-center gap-2 md:gap-4 lg:hidden">
              <button
                onClick={() => setOpen((o) => !o)}
                className="relative z-[9999] flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                style={{
                  background: open
                    ? "transparent"
                    : overDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.5)",
                  border: open
                    ? "none"
                    : overDark
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid rgba(20,45,28,0.15)",
                }}
              >
                <span className="relative block h-[16px] w-[22px]">
                  <span
                    className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full transition-all duration-[350ms] motion-reduce:transition-none"
                    style={{
                      background: burgerColor,
                      transform: open
                        ? "translateY(7px) rotate(45deg)"
                        : "none",
                    }}
                  />
                  <span
                    className="absolute left-0 top-[7px] block h-[1.5px] w-full rounded-full transition-opacity duration-200 motion-reduce:transition-none"
                    style={{ background: burgerColor, opacity: open ? 0 : 1 }}
                  />
                  <span
                    className="absolute left-0 top-[14px] block h-[1.5px] w-full rounded-full transition-all duration-[350ms] motion-reduce:transition-none"
                    style={{
                      background: burgerColor,
                      transform: open
                        ? "translateY(-7px) rotate(-45deg)"
                        : "none",
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Drawer
        open={open}
        isDesktop={isDesktop}
        page={page}
        go={go}
        close={() => setOpen(false)}
      />
    </>
  )
}

export default Nav
