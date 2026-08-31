import { useState } from "react"
import { Arrow } from "../lib/ui"
import { NAV_ITEMS } from "./Nav"
import type { PageId } from "../lib/pages"

export function Footer({ go }: { go: (p: PageId) => void }) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  return (
    <footer className="bg-forest-deep text-paper">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
          <div>
            <span
              className="text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Leo Hospitality
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/65">
              Creating experiences. Building hospitality brands. A management
              partner for restaurants, cafés, clubhouse cafeterias and cloud
              kitchens.
            </p>
            <div className="mt-6 flex gap-3">
              {["Instagram", "LinkedIn", "Facebook"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-xs transition-colors hover:border-bronze hover:text-bronze"
                  aria-label={s}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="kicker text-bronze">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_ITEMS.slice(0, 6).map((it) => (
                <li key={it.id}>
                  <button
                    onClick={() => go(it.id)}
                    className="text-paper/70 transition-colors hover:text-paper"
                  >
                    {it.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="kicker text-bronze">Company</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_ITEMS.slice(6).map((it) => (
                <li key={it.id}>
                  <button
                    onClick={() => go(it.id)}
                    className="text-paper/70 transition-colors hover:text-paper"
                  >
                    {it.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="kicker text-bronze">Newsletter</h4>
            <p className="mt-5 text-sm text-paper/65">
              Occasional notes on new ventures and openings. No noise.
            </p>
            {sent ? (
              <p className="mt-4 text-sm text-bronze">
                Thank you — you&rsquo;re on the list.
              </p>
            ) : (
              <form
                className="mt-4 flex items-center gap-2 border-b border-white/25 pb-2 focus-within:border-bronze"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email) setSent(true)
                }}
              >
                <input
                  id="newsletter_email"
                  name="newsletter_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-paper/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 text-bronze transition-transform hover:translate-x-1"
                  aria-label="Subscribe"
                >
                  <Arrow />
                </button>
              </form>
            )}
            <div className="mt-8 space-y-1.5 text-sm text-paper/65">
              <p>Mumbai, Maharashtra, India</p>
              <a href="tel:+912200000000" className="block hover:text-paper">
                +91 22 0000 0000
              </a>
              <a
                href="mailto:connect@leohospitality.in"
                className="block hover:text-paper"
              >
                connect@leohospitality.in
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-8 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Leo Hospitality & Ventures LLP. All
            rights reserved.
          </p>
          <p className="flex gap-5">
            <a href="#" className="hover:text-paper">
              Privacy
            </a>
            <a href="#" className="hover:text-paper">
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
