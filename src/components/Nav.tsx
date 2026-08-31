import { useEffect, useState } from "react"
import { Button, Arrow } from "../lib/ui"
import type { PageId } from "../lib/pages"

export const NAV_ITEMS: { id: PageId label: string }[] = [
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
  overHero,
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
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const solid = scrolled || !overHero || open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "border-b border-line/50 bg-cream/95 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between px-6 transition-all duration-300 lg:px-12 ${
            scrolled ? "py-2.5" : "py-5"
          }`}
        >
          <button
            onClick={() => {
              go("home")
              setOpen(false)
            }}
            className="flex items-center gap-3 text-left"
            aria-label="Leo Hospitality & Ventures — home"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/30 bg-forest text-paper text-lg font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              L
            </span>
            <span className="leading-tight">
              <span
                className="block text-[0.95rem] font-semibold tracking-tight text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Leo Hospitality
              </span>
              <span className="block text-[0.62rem] tracking-[0.24em] uppercase text-ink-soft">
                & Ventures LLP
              </span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 xl:flex">
            {NAV_ITEMS.slice(0, 8).map((it) => (
              <button
                key={it.id}
                onClick={() => go(it.id)}
                className={`relative text-[0.82rem] font-medium tracking-wide transition-colors text-ink-soft hover:text-forest ${
                  page === it.id ? "text-forest font-semibold" : ""
                }`}
              >
                {it.label}
                {page === it.id && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-forest" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* CTA always visible in desktop and mobile */}
            <Button
              variant="primary"
              className="!px-5 !py-2.5 max-sm:!px-4 text-xs font-semibold"
              onClick={() => {
                go("franchise")
                setOpen(false)
              }}
            >
              Partner With Us <Arrow />
            </Button>
            <button
              className="xl:hidden z-50 p-1 text-ink"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-6 h-5 justify-center">
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
        </div>
      </header>

      {/* Full-screen mobile slide-in menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-cream/98 backdrop-blur-md flex flex-col justify-between p-8 pt-28 transition-transform duration-500 xl:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-5 text-left overflow-y-auto max-h-[70vh]">
          {NAV_ITEMS.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => {
                go(it.id)
                setOpen(false)
              }}
              style={{ transitionDelay: open ? `${idx * 45}ms` : "0ms" }}
              className={`text-2xl font-display text-ink text-left transition-all duration-500 transform ${
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              }`}
            >
              <span className="font-sans text-xs text-bronze mr-3">
                0{idx + 1}
              </span>
              <span
                className={
                  page === it.id
                    ? "text-forest border-b-2 border-forest pb-0.5"
                    : "text-ink"
                }
              >
                {it.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="border-t border-line pt-6 space-y-3">
          <p className="text-[0.65rem] tracking-[0.24em] text-ink-soft uppercase font-semibold">
            Leo Hospitality & Ventures LLP
          </p>
          <div className="flex flex-col gap-1 text-xs">
            <a
              href="mailto:connect@leohospitality.in"
              className="text-forest font-medium hover:underline"
            >
              connect@leohospitality.in
            </a>
            <a
              href="tel:+912200000000"
              className="text-ink-soft hover:text-forest"
            >
              +91 22 0000 0000
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
export default Nav
