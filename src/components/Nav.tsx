import { useEffect, useState } from "react"
import { Arrow } from "../lib/ui"
import type { PageId } from "../lib/pages"

export const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "ventures", label: "Ventures" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "gallery", label: "Gallery" },
  { id: "franchise", label: "Franchise" },
  { id: "careers", label: "Careers" },
  { id: "vendor", label: "Vendor Registration" },
  { id: "contact", label: "Contact" },
]

export function Nav({
  page,
  go,
}: {
  page: PageId
  go: (p: PageId) => void
  overHero: boolean
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const goTo = (p: PageId) => {
    go(p)
    setOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      {/* Floating pill */}
      <div className="relative z-20 mx-auto max-w-[1240px] px-4 pt-4 md:px-6">
        <nav
          aria-label="Main navigation"
          className={`pointer-events-auto flex h-14 items-center justify-between gap-3 rounded-full pl-2 pr-2 transition-all duration-500 ease-out md:pl-3 ${
            scrolled || open
              ? "border border-line/70 bg-cream/92 shadow-[0_10px_34px_-12px_rgba(32,29,24,0.28)] backdrop-blur-2xl"
              : "border border-line/50 bg-cream/80 shadow-[0_8px_28px_-16px_rgba(32,29,24,0.2)] backdrop-blur-xl"
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => goTo("home")}
            className="group flex shrink-0 items-center gap-2.5 pl-1"
            aria-label="Leo Hospitality & Ventures — home"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-base font-semibold text-paper transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-105"
              style={{ fontFamily: "var(--font-display)" }}
            >
              L
            </span>
            <span className="hidden leading-tight sm:block">
              <span
                className="block text-[0.95rem] font-semibold tracking-tight text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Leo Hospitality
              </span>
              <span className="block text-[0.55rem] uppercase tracking-[0.24em] text-ink-soft">
                & Ventures LLP
              </span>
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 xl:flex">
            {NAV_ITEMS.slice(0, 8).map((it) => (
              <button
                key={it.id}
                onClick={() => go(it.id)}
                aria-current={page === it.id ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-wide transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 ${
                  page === it.id
                    ? "bg-forest/10 text-forest"
                    : "text-ink-soft hover:bg-forest/5 hover:text-forest"
                }`}
              >
                {it.label}
              </button>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goTo("franchise")}
              className="hidden h-10 items-center justify-center gap-1.5 rounded-full bg-forest px-5 text-xs font-semibold text-paper transition-all duration-300 ease-out hover:bg-forest-deep active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream md:inline-flex"
            >
              Partner With Us <Arrow />
            </button>

            {/* Hamburger */}
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-300 hover:bg-forest/5 xl:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <div className="flex h-5 w-6 flex-col justify-center gap-1.5">
                <span
                  className={`h-0.5 w-6 bg-current transition-all duration-300 ${
                    open ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-6 bg-current transition-all duration-300 ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-6 bg-current transition-all duration-300 ${
                    open ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu — full-screen fade below the pill */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[84px] z-10 flex flex-col bg-cream/98 backdrop-blur-xl transition-opacity duration-300 xl:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        inert={!open ? true : undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-6">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((it, idx) => (
              <button
                key={it.id}
                onClick={() => goTo(it.id)}
                style={{ transitionDelay: open ? `${idx * 40}ms` : "0ms" }}
                className={`flex items-center gap-3 rounded-full px-5 py-3.5 text-left text-lg font-medium transition-all duration-300 ease-out motion-reduce:transition-none ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                } ${
                  page === it.id
                    ? "bg-forest text-paper"
                    : "text-ink-soft hover:bg-forest/5 hover:text-forest"
                }`}
              >
                <span
                  className={`text-xs ${page === it.id ? "text-paper/70" : "text-bronze"}`}
                >
                  0{idx + 1}
                </span>
                <span style={{ fontFamily: "var(--font-display)" }}>
                  {it.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <button
              onClick={() => goTo("franchise")}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-forest text-base font-semibold text-paper transition-transform duration-200 active:scale-[0.98]"
            >
              Partner With Us <Arrow />
            </button>
            <p className="mt-5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">
              <span className="text-bronze">●</span> Creating experiences across
              India
            </p>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Nav
