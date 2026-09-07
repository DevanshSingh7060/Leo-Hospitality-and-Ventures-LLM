import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { IMG } from "../lib/ui"
import logo from "../assets/LEO LOGO FINAL-01.png"
import type { PageId } from "../lib/pages"

export const NAV_ITEMS: { id: PageId; label: string }[] = [
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
const BAR_LINKS: PageId[] = [
  "about",
  "ventures",
  "services",
  "experience",
  "gallery",
  "contact",
]

/* Palette mirrors the tokens in index.css */
const CREAM = "#f6f1e7"
const INK = "#201d18"
const BRONZE = "#a9814f"

/* Filter that recolours the dark logo artwork to cream over dark sections. */
const LOGO_TO_CREAM =
  "brightness(0) saturate(100%) invert(93%) sepia(8%) saturate(400%) hue-rotate(20deg) brightness(103%) contrast(92%)"

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

/* ---------- Social icons (inline so we carry no icon dependency) ---------- */
function IconInstagram({ size = 18 }: { size?: number }) {
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

function IconLinkedin({ size = 18 }: { size?: number }) {
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

function IconFacebook({ size = 18 }: { size?: number }) {
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

function IconHandshake({ size = 14 }: { size?: number }) {
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
function Drawer({
  open,
  isDesktop,
  page,
  go,
  close,
}: {
  open: boolean
  isDesktop: boolean
  page: PageId
  go: (p: PageId) => void
  close: () => void
}) {
  if (typeof document === "undefined") return null

  const panelBase =
    "relative h-full shadow-2xl transition-transform duration-[650ms] motion-reduce:transition-none"
  const panelStyle: React.CSSProperties = {
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
          className={`${panelBase} w-[420px] overflow-hidden`}
          style={{ ...panelStyle, background: "#f5f1e8" }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex h-full flex-col justify-between px-10 pb-[3vh] pt-[4vh]">
            {/* Logo + tagline */}
            <div className="flex shrink-0 flex-col">
              <img
                src={logo}
                alt="Leo Hospitality & Ventures"
                className="w-[120px] object-contain"
              />
              <p
                className="mt-[2vh] max-w-[290px]"
                style={{ fontSize: "13px", lineHeight: 1.8, color: "rgba(30,25,21,0.72)" }}
              >
                Creating experiences. Building hospitality brands.
              </p>
            </div>

            {/* Links */}
            <nav className="mt-[3vh] flex min-h-0 flex-1 flex-col justify-center gap-2 overflow-y-auto">
              {NAV_ITEMS.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => {
                    go(it.id)
                    close()
                  }}
                  style={{
                    fontFamily: "var(--font-display)",
                    transitionDelay: open ? `${120 + i * 35}ms` : "0ms",
                    transitionTimingFunction: EASE,
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(14px)",
                    color: page === it.id ? "#234a36" : "rgba(30,25,21,0.78)",
                  }}
                  className="block w-fit text-[21px] font-light leading-none transition-all duration-500 hover:text-[#a9814f] motion-reduce:transition-none"
                >
                  {it.label}
                </button>
              ))}
            </nav>

            {/* Imagery */}
            <div className="my-[2vh] flex shrink-0 flex-col items-center gap-3">
              <div className="flex w-full justify-center gap-3">
                {[IMG.bodhiTree, IMG.latteArt].map((src) => (
                  <div key={src} className="overflow-hidden rounded-[8px]">
                    <img
                      src={src}
                      alt=""
                      className="h-[9vh] max-h-[88px] min-h-[48px] w-auto aspect-[154/92] object-cover transition-transform duration-700 hover:scale-[1.04]"
                    />
                  </div>
                ))}
              </div>
              <div className="overflow-hidden rounded-[8px]">
                <img
                  src={IMG.diningRoom}
                  alt=""
                  className="h-[12vh] max-h-[124px] min-h-[64px] w-auto aspect-[320/132] object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </div>
            </div>

            {/* Socials */}
            <div className="flex shrink-0 items-center justify-center gap-8">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-black/10 text-[#2b2622] transition-all duration-300 hover:-translate-y-[1px] hover:border-black/20"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Address */}
            <div className="mt-[2vh] shrink-0 border-t border-black/5 pt-5">
              <div
                className="text-center"
                style={{ fontSize: "13px", lineHeight: 2, color: "rgba(30,25,21,0.72)" }}
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
          style={{ ...panelStyle, background: "#16331f" }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="flex h-full flex-1 flex-col overflow-y-auto px-6 pb-10 pt-24 md:px-12"
            style={{ scrollbarWidth: "none" }}
          >
            <p
              className="mb-8 text-[10px] uppercase tracking-[0.2em]"
              style={{ color: BRONZE }}
            >
              Menu
            </p>

            <nav className="flex flex-col gap-4">
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
                  className="block w-fit text-[22px] leading-none transition-all duration-500 hover:text-[#a9814f] md:text-[26px] motion-reduce:transition-none"
                >
                  {it.label}
                </button>
              ))}
            </nav>

            <div
              className="my-8 h-px w-full shrink-0"
              style={{ background: "rgba(246,241,231,0.1)" }}
            />

            <button
              onClick={() => {
                go("franchise")
                close()
              }}
              className="flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-full text-base font-semibold transition-transform duration-200 active:scale-[0.98]"
              style={{ background: BRONZE, color: "#16331f" }}
            >
              Partner With Us
            </button>

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
                  className="transition-transform duration-300 hover:scale-110 hover:text-[#a9814f]"
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
export function Nav({
  page,
  go,
}: {
  page: PageId
  go: (p: PageId) => void
  overHero?: boolean
}) {
  const [scrolled, setScrolled] = useState(false)
  const [overDark, setOverDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  /* Scrolled state + tone detection against [data-tone="dark"] zones. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const probe = 36 // header mid-line, in viewport coordinates
      const zones = Array.from(
        document.querySelectorAll<HTMLElement>('[data-tone="dark"]'),
      )
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const headerText = overDark ? CREAM : INK
  const headerMuted = overDark ? "rgba(246,241,231,0.72)" : "rgba(32,29,24,0.72)"
  const headerBorder = overDark ? "rgba(246,241,231,0.15)" : "rgba(32,29,24,0.15)"
  const burgerColor = open ? (isDesktop ? BRONZE : CREAM) : headerText

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-[9999] transition-all duration-500"
        style={{
          background: scrolled
            ? overDark
              ? "rgba(22,51,31,0.9)"
              : "rgba(246,241,231,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${headerBorder}`
            : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-14">
          <div className="flex h-[72px] items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => go("home")}
              className="flex shrink-0 items-center gap-3 transition-opacity duration-300 hover:opacity-90"
              aria-label="Leo Hospitality & Ventures — home"
            >
              <img
                src={logo}
                alt="Leo Hospitality & Ventures"
                style={{
                  height: "56px",
                  width: "auto",
                  objectFit: "contain",
                  opacity: 0.95,
                  transition: "filter 0.5s ease",
                  filter: overDark ? LOGO_TO_CREAM : "none",
                }}
              />
              <span className="hidden leading-tight sm:block">
                <span
                  className="flex items-baseline gap-1.5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span
                    className="text-xl font-semibold leading-none tracking-tight transition-colors duration-500"
                    style={{ color: headerText }}
                  >
                    Leo
                  </span>
                  <span
                    className="text-sm font-medium leading-none tracking-tight transition-colors duration-500"
                    style={{ color: headerMuted }}
                  >
                    Hospitality
                  </span>
                </span>
                <span
                  className="mt-0.5 block text-[0.5rem] uppercase tracking-[0.24em] transition-colors duration-500"
                  style={{ color: headerMuted }}
                >
                  &amp; Ventures LLP
                </span>
              </span>
            </button>

            {/* Desktop links */}
            <nav className="hidden items-center gap-11 lg:flex">
              {BAR_LINKS.map((id) => {
                const item = NAV_ITEMS.find((n) => n.id === id)
                if (!item) return null
                const isCurrent = page === id
                return (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    aria-current={isCurrent ? "page" : undefined}
                    className="relative uppercase tracking-[0.2em] transition-colors duration-300"
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: isCurrent ? headerText : headerMuted,
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) e.currentTarget.style.color = headerText
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
                          height: "1px",
                          background: BRONZE,
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => go("franchise")}
                className="hidden items-center gap-2 uppercase tracking-[0.2em] transition-colors duration-300 md:inline-flex"
                style={{ fontSize: "12px", fontWeight: 500, color: headerMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = headerText
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = headerMuted
                }}
              >
                <IconHandshake size={14} /> Partner
              </button>

              {/* Compact partner action on mobile */}
              <button
                onClick={() => go("franchise")}
                className="inline-flex h-10 w-10 items-center justify-center transition-transform duration-300 hover:scale-105 md:hidden"
                style={{ color: headerMuted }}
                aria-label="Partner with us"
              >
                <IconHandshake size={19} />
              </button>

              {/* Burger — present on both mobile and desktop */}
              <button
                onClick={() => setOpen((o) => !o)}
                className="relative z-[9999] ml-1 flex h-11 w-11 items-center justify-center md:ml-2"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                <span className="relative block h-[18px] w-[26px]">
                  <span
                    className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full transition-all duration-[350ms] motion-reduce:transition-none"
                    style={{
                      background: burgerColor,
                      transform: open ? "translateY(8px) rotate(45deg)" : "none",
                    }}
                  />
                  <span
                    className="absolute left-0 top-[8px] block h-[1.5px] w-full rounded-full transition-opacity duration-200 motion-reduce:transition-none"
                    style={{ background: burgerColor, opacity: open ? 0 : 1 }}
                  />
                  <span
                    className="absolute left-0 top-[16px] block h-[1.5px] w-full rounded-full transition-all duration-[350ms] motion-reduce:transition-none"
                    style={{
                      background: burgerColor,
                      transform: open ? "translateY(-8px) rotate(-45deg)" : "none",
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
