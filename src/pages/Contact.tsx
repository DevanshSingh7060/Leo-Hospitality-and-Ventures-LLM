import { useState } from "react"
import {
  Button,
  Arrow,
  Kicker,
  Reveal,
  IMG,
  Field,
  Input,
  Textarea,
} from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import type { PageId } from "../lib/pages"

/* ---------- Inline icons ---------- */
function Icon({
  path,
  size = 18,
}: {
  path: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

/* ---------- Botanical Four-Leaf Clover Print Graphic ---------- */
function FourLeafClover({
  size = 48,
  className = "",
  strokeWidth = 1.4,
  fillOpacity = 0.14,
}: {
  size?: number
  className?: string
  strokeWidth?: number
  fillOpacity?: number
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
        <g id="clover-petal">
          {/* Heart-notched botanical leaflet */}
          <path
            d="M 50 50 C 41 37 30 20 41 10 C 47 4 50 14 50 19 C 50 14 53 4 59 10 C 70 20 59 37 50 50 Z"
            fillOpacity={fillOpacity}
          />
          {/* Delicate leaflet vein */}
          <path d="M 50 50 L 50 18" strokeWidth="0.9" fill="none" opacity="0.65" />
        </g>
      </defs>
      {/* 4 clover leaflets radiating at 0, 90, 180, 270 */}
      <use href="#clover-petal" transform="rotate(0 50 50)" />
      <use href="#clover-petal" transform="rotate(90 50 50)" />
      <use href="#clover-petal" transform="rotate(180 50 50)" />
      <use href="#clover-petal" transform="rotate(270 50 50)" />
      {/* Curved organic stem */}
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

const PIN =
  "M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
const PHONE =
  "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"
const MAIL =
  "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 7l-10 6L2 7"
const CLOCK = "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2"
const CHECK = "M20 6L9 17l-5-5"
const SHIELD = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
const MAP = "M9 18l-6-3V3l6 3 6-3 6 3v15l-6-3-6 3z M9 6v12 M15 3v12"

const SOCIAL_ICONS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z M17.5 6.5h.01",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5 M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
]

const ENQUIRY_TYPES = [
  { id: "Franchise & Expansion", label: "Franchise & Expansion", desc: "Partner on high-yield food & beverage formats" },
  { id: "Venue Operations", label: "Venue Operations", desc: "Turnkey management for prime hospitality spaces" },
  { id: "Cloud Kitchens", label: "Cloud Kitchens", desc: "Commissary & delivery brand expansion" },
  { id: "Vendor & Supply", label: "Vendor & Supply", desc: "Food, produce and equipment procurement" },
  { id: "Careers", label: "Careers", desc: "Culinary, bar and leadership opportunities" },
  { id: "General Enquiry", label: "General Enquiry", desc: "Media, corporate and exploratory discussions" },
]

const TIMELINE_OPTIONS = [
  "Immediate (1–3 Months)",
  "Strategic (3–6 Months)",
  "Long-term (6–12 Months)",
  "Exploratory",
]

const DIRECT_LINES: {
  t: string
  d: string
  page: PageId
  action: string
  badge: string
}[] = [
  {
    t: "Partnerships & Franchise",
    d: "You possess commercial real estate, an established brand, or investment capital and want to build with our operational backbone.",
    page: "franchise",
    action: "Start a business enquiry",
    badge: "Direct Partner Channel",
  },
  {
    t: "Vendors & Supply Onboarding",
    d: "You supply fresh produce, artisanal ingredients, packaging, or professional kitchen machinery to our restaurants.",
    page: "vendor",
    action: "Register as a verified vendor",
    badge: "Procurement Desk",
  },
  {
    t: "Culinary & Management Careers",
    d: "You are an executive chef, operations director, or floor leader aspiring to craft standards with a growth-focused group.",
    page: "careers",
    action: "Submit your credentials",
    badge: "Talent Acquisition",
  },
]

const NEXT_STEPS = [
  {
    t: "Leadership Review",
    d: "Every enquiry is reviewed by our core operations and partnerships team — never lost in an automated queue.",
  },
  {
    t: "Executive Routing",
    d: "Your inquiry is immediately routed to the specific department director: development, procurement, or culinary.",
  },
  {
    t: "Guaranteed Response",
    d: "Expect an informed response within 24 to 48 business hours with actionable next steps and discussion scheduling.",
  },
]

export function Contact({ go }: { go: (p: PageId) => void }) {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [honeypot, setHoneypot] = useState("")

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    enquiryType: "Franchise & Expansion",
    location: "",
    timeline: "Immediate (1–3 Months)",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validateField = (name: string, value: string) => {
    let err = ""
    if (!value.trim()) {
      err = "This field is required."
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      err = "Please enter a valid business email address."
    } else if (
      name === "phone" &&
      !/^\+?[0-9\s-]{10,14}$/.test(value.replace(/\s+/g, ""))
    ) {
      err = "Please enter a valid phone number (min 10 digits)."
    }

    setErrors((prev) => {
      if (err) return { ...prev, [name]: err }
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, required } = e.target
    if (required || name === "email" || name === "phone") {
      validateField(name, value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (honeypot !== "") {
      console.warn("Spam submission blocked.")
      return
    }

    const newErrors: Record<string, string> = {}
    const requiredFields: (keyof typeof form)[] = [
      "name",
      "phone",
      "email",
      "message",
    ]

    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = "This field is required."
      }
    })

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid business email address."
    }
    if (
      form.phone &&
      !/^\+?[0-9\s-]{10,14}$/.test(form.phone.replace(/\s+/g, ""))
    ) {
      newErrors.phone = "Please enter a valid contact number (min 10 digits)."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
      window.scrollTo({ top: 350, behavior: "smooth" })
    }, 1300)
  }

  return (
    <>
      <PageHero
        kicker="Direct Executive Access"
        title={
          <>
            Let&rsquo;s craft something{" "}
            <span className="italic text-forest">lasting.</span>
          </>
        }
        lead="Whether you hold prime commercial real estate, wish to scale a high-volume culinary brand, or seek turnkey management — our partners and leadership review every enquiry personally."
        image={IMG.heroInterior}
        imageAlt="Atmospheric warm interior of Leo Hospitality venue with ambient chandeliers"
      />

      {/* MAIN SUITE: EXECUTIVE CHANNELS & INTERACTIVE FORM WITH GLASS EFFECT */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Ambient atmospheric backdrop lighting for rich glassmorphism depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-forest/[0.08] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 right-10 h-[36rem] w-[36rem] rounded-full bg-bronze/[0.09] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-12 h-[28rem] w-[28rem] rounded-full bg-forest-deep/[0.06] blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
          {/* Top Live Concierge Bar — Frosted Glass Capsule */}
          <div
            className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/80 bg-white/50 px-6 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl"
            style={{
              boxShadow:
                "0 8px 30px rgba(22,51,31,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-forest">
                Executive Desk Active &nbsp;&middot;&nbsp; Mumbai, India (GMT+5:30)
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-ink-soft">
              <span className="flex items-center gap-1.5">
                <Icon path={SHIELD} size={14} /> Strict NDA &amp; Confidentiality
              </span>
              <span className="hidden font-mono text-bronze sm:inline-block">
                Average reply time: &lt; 24h
              </span>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            {/* LEFT COLUMN: EXECUTIVE CONCIERGE & HEADQUARTERS */}
            <Reveal className="space-y-6">
              {/* Primary Head Office Card — Frosted Glass */}
              <div
                className="relative overflow-hidden border border-white/80 bg-white/65 p-8 shadow-[0_20px_50px_rgba(22,51,31,0.06)] backdrop-blur-2xl lg:p-10"
                style={{
                  boxShadow:
                    "0 20px 50px -10px rgba(22,51,31,0.07), inset 0 1px 0 rgba(255,255,255,0.95)",
                }}
              >
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-forest/[0.05] blur-xl" />

                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bronze">
                  Flagship Headquarters
                </span>
                <h2
                  className="mt-2 text-2xl text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Leo Hospitality &amp; Ventures LLP
                </h2>

                <div className="mt-8 space-y-6">
                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/90 bg-white/70 text-forest shadow-xs backdrop-blur-md">
                      <Icon path={PIN} />
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Registered Office
                      </h3>
                      <p className="mt-1 text-base font-medium text-ink">
                        Bandra Kurla Complex (BKC)
                      </p>
                      <p className="text-sm text-ink-soft">
                        Mumbai, Maharashtra 400051, India
                      </p>
                    </div>
                  </div>

                  {/* Direct Phone */}
                  <div className="flex items-start gap-4 border-t border-line/40 pt-6">
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/90 bg-white/70 text-forest shadow-xs backdrop-blur-md">
                      <Icon path={PHONE} />
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Executive Desk
                      </h3>
                      <a
                        href="tel:+912269001200"
                        className="mt-1 block text-lg font-medium text-ink transition-colors hover:text-forest"
                      >
                        +91 22 6900 1200
                      </a>
                      <p className="text-xs text-ink-soft">
                        Mon&ndash;Sat, 10:00 &ndash; 19:00 IST
                      </p>
                    </div>
                  </div>

                  {/* Direct Inboxes */}
                  <div className="flex items-start gap-4 border-t border-line/40 pt-6">
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/90 bg-white/70 text-forest shadow-xs backdrop-blur-md">
                      <Icon path={MAIL} />
                    </span>
                    <div className="w-full">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Departmental Inboxes
                      </h3>
                      <div className="mt-2 space-y-3">
                        <div>
                          <a
                            href="mailto:partner@leohospitality.in"
                            className="text-base font-medium text-ink transition-colors hover:text-forest"
                          >
                            partner@leohospitality.in
                          </a>
                          <p className="text-xs uppercase tracking-wider text-bronze">
                            Franchise &amp; Capital Partnerships
                          </p>
                        </div>
                        <div>
                          <a
                            href="mailto:connect@leohospitality.in"
                            className="text-base font-medium text-ink transition-colors hover:text-forest"
                          >
                            connect@leohospitality.in
                          </a>
                          <p className="text-xs uppercase tracking-wider text-ink-soft">
                            General, Press &amp; Institutional
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operating Schedule */}
                  <div className="flex items-start gap-4 border-t border-line/40 pt-6">
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/90 bg-white/70 text-forest shadow-xs backdrop-blur-md">
                      <Icon path={CLOCK} />
                    </span>
                    <div className="w-full">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Concierge Schedule
                      </h3>
                      <dl className="mt-2 space-y-1.5 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-ink-soft">Monday &ndash; Friday</dt>
                          <dd className="font-medium text-ink">10:00 &ndash; 19:00 IST</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-ink-soft">Saturday</dt>
                          <dd className="font-medium text-ink">11:00 &ndash; 17:00 IST</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-ink-soft">Sunday</dt>
                          <dd className="italic text-ink-soft/70">By Appointment Only</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="mt-8 border-t border-line/40 pt-6">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Connect With Our Brands
                  </span>
                  <div className="mt-3 flex gap-3">
                    {SOCIAL_ICONS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/60 text-ink-soft shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-forest hover:bg-forest hover:text-paper"
                        aria-label={s.label}
                      >
                        <Icon path={s.path} size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* STYLIZED ARCHITECTURAL LOCATION CARD — Dark Frosted Glass */}
              <div
                className="relative overflow-hidden border border-white/20 bg-forest-deep/90 p-7 text-paper shadow-2xl backdrop-blur-2xl"
                style={{
                  boxShadow:
                    "0 24px 60px -20px rgba(62,82,37,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bronze">
                      <Icon path={MAP} size={15} /> Metropolitan Hub
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-paper/80 backdrop-blur-md">
                      Mumbai HQ
                    </span>
                  </div>

                  <h3
                    className="mt-4 text-xl text-paper"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Bandra Kurla Complex, Mumbai
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/75">
                    Situated at the financial core of Mumbai. Private parking and dedicated conference facilities available for partner presentations.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-bronze/60 bg-bronze/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-paper shadow-sm backdrop-blur-md transition-all hover:bg-bronze hover:text-forest-deep"
                    >
                      Open in Maps ↗
                    </a>
                    <button
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          enquiryType: "Venue Operations",
                          message:
                            "I would like to schedule an in-person walkthrough of your operating spaces.",
                        }))
                        window.scrollTo({ top: 400, behavior: "smooth" })
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-paper/85 backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/10 hover:text-paper"
                    >
                      Book Walkthrough
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* RIGHT COLUMN: BESPOKE INTERACTIVE ENQUIRY FORM — Frosted Glass Panel */}
            <Reveal delay={100}>
              {sent ? (
                <div
                  className="relative overflow-hidden border border-white/80 bg-white/70 p-10 text-center shadow-xl backdrop-blur-2xl lg:p-14 animate-fadeIn"
                  style={{
                    boxShadow:
                      "0 25px 60px -15px rgba(46,46,46,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
                  }}
                >
                  {/* Four-leaf clover success watermark prints */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-8 -right-8 select-none text-accent-green opacity-[0.14]"
                  >
                    <FourLeafClover size={200} strokeWidth={1.2} fillOpacity={0.16} />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-8 -left-8 select-none text-primary opacity-[0.10] -rotate-45"
                  >
                    <FourLeafClover size={160} strokeWidth={1.2} fillOpacity={0.14} />
                  </div>

                  <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-forest text-paper shadow-lg">
                    <Icon path={CHECK} size={32} />
                  </div>

                  <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze">
                    Enquiry Logged
                  </span>
                  <h2
                    className="mt-3 text-3xl text-forest sm:text-4xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Your message is with our partners.
                  </h2>

                  <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
                    Thank you, <strong className="text-ink">{form.name}</strong>. A dedicated partner manager will evaluate your submission regarding{" "}
                    <span className="font-medium text-forest">&ldquo;{form.enquiryType}&rdquo;</span> and reach back within 24&ndash;48 business hours.
                  </p>

                  {/* Submission Summary Ticket */}
                  <div className="mx-auto mt-8 max-w-md border border-white/70 bg-white/60 p-5 text-left text-xs shadow-xs backdrop-blur-md">
                    <div className="flex justify-between border-b border-line/40 pb-2.5">
                      <span className="text-ink-soft">Channel:</span>
                      <span className="font-semibold text-ink">{form.enquiryType}</span>
                    </div>
                    <div className="flex justify-between border-b border-line/40 py-2.5">
                      <span className="text-ink-soft">Direct Phone:</span>
                      <span className="font-semibold text-ink">{form.phone}</span>
                    </div>
                    <div className="flex justify-between pt-2.5">
                      <span className="text-ink-soft">Routing:</span>
                      <span className="font-medium text-forest">Executive Partner Desk</span>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Button onClick={() => go("home")}>
                      Return Home <Arrow />
                    </Button>
                    <button
                      onClick={() => {
                        setSent(false)
                        setForm({
                          name: "",
                          company: "",
                          phone: "",
                          email: "",
                          enquiryType: "Franchise & Expansion",
                          location: "",
                          timeline: "Immediate (1–3 Months)",
                          message: "",
                        })
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-white/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink backdrop-blur-md transition-colors hover:border-forest hover:text-forest"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="relative overflow-hidden border border-white/85 bg-white/75 p-8 shadow-[0_25px_60px_-15px_rgba(46,46,46,0.08)] backdrop-blur-2xl lg:p-12"
                  style={{
                    boxShadow:
                      "0 25px 60px -15px rgba(46,46,46,0.08), inset 0 1px 0 rgba(255,255,255,0.98)",
                  }}
                >
                  {/* Subtle Botanical Four-Leaf Clover Watermark Prints */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-12 -right-12 select-none text-accent-green opacity-[0.15] rotate-12 transition-transform duration-700"
                  >
                    <FourLeafClover size={240} strokeWidth={1.2} fillOpacity={0.16} />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-14 -left-14 select-none text-primary opacity-[0.11] -rotate-45"
                  >
                    <FourLeafClover size={220} strokeWidth={1.2} fillOpacity={0.14} />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 -right-8 -translate-y-1/2 select-none text-accent-brown opacity-[0.09] rotate-[28deg]"
                  >
                    <FourLeafClover size={130} strokeWidth={1.3} fillOpacity={0.12} />
                  </div>

                  {/* Honeypot for spam mitigation */}
                  <div className="sr-only pointer-events-none" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Form Header with Botanical Clover Seal */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-light-green/45 text-primary shadow-2xs">
                          <FourLeafClover size={14} strokeWidth={1.8} fillOpacity={0.5} />
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze font-semibold">
                          Partner Inquiries
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-line/70 bg-white/50 px-3 py-1 text-[11px] font-mono text-accent-green">
                        <FourLeafClover size={12} strokeWidth={1.8} fillOpacity={0.5} />
                        <span>Four-Leaf Standard of Care</span>
                      </div>
                    </div>

                    <h2
                      className="mt-3 text-2xl text-ink sm:text-3xl"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      Initiate a Partnership Conversation
                    </h2>
                    <p className="mt-2 text-sm text-ink-soft">
                      Select your primary category below to ensure immediate routing to the relevant domain director.
                    </p>
                  </div>

                  {/* INTERACTIVE ENQUIRY TYPE CHIPS — Frosted Glass Pills */}
                  <div className="mt-8 border-t border-line/40 pt-6">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                      1. Select Enquiry Category <span className="text-bronze">*</span>
                    </label>
                    <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                      {ENQUIRY_TYPES.map((cat) => {
                        const isSelected = form.enquiryType === cat.id
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, enquiryType: cat.id }))
                            }
                            className={`flex flex-col items-start border p-3.5 text-left backdrop-blur-md transition-all duration-300 ${
                              isSelected
                                ? "border-forest bg-forest/95 text-paper shadow-md scale-[1.01]"
                                : "border-white/80 bg-white/45 text-ink hover:border-forest/40 hover:bg-white/80 shadow-xs"
                            }`}
                          >
                            <span className="text-sm font-semibold tracking-tight">
                              {cat.label}
                            </span>
                            <span
                              className={`mt-1 text-[11px] leading-tight ${
                                isSelected ? "text-paper/85" : "text-ink-soft"
                              }`}
                            >
                              {cat.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* CORE DETAILS GRID — Frosted Input Elements */}
                  <div className="mt-8 border-t border-line/40 pt-6">
                    <label className="mb-4 block text-xs font-semibold uppercase tracking-wider text-ink">
                      2. Contact Credentials &amp; Scope
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full Name" required>
                        <input
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. Rahul Mehta"
                          className="w-full border border-line/70 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 backdrop-blur-md transition-all duration-200 focus:border-forest focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-xs"
                        />
                        {errors.name && (
                          <p className="field-error mt-1 text-xs font-medium text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </Field>

                      <Field label="Phone / Mobile" required>
                        <input
                          name="phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="+91 98200 00000"
                          className="w-full border border-line/70 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 backdrop-blur-md transition-all duration-200 focus:border-forest focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-xs"
                        />
                        {errors.phone && (
                          <p className="field-error mt-1 text-xs font-medium text-red-600">
                            {errors.phone}
                          </p>
                        )}
                      </Field>

                      <Field label="Business Email" required>
                        <input
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="name@company.com"
                          className="w-full border border-line/70 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 backdrop-blur-md transition-all duration-200 focus:border-forest focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-xs"
                        />
                        {errors.email && (
                          <p className="field-error mt-1 text-xs font-medium text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </Field>

                      <Field label="Company / Brand / Real Estate Firm">
                        <input
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Entity or Brand name (Optional)"
                          className="w-full border border-line/70 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 backdrop-blur-md transition-all duration-200 focus:border-forest focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-xs"
                        />
                      </Field>

                      <Field label="Target City / Location">
                        <input
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="e.g. Mumbai, Pune, Bengaluru"
                          className="w-full border border-line/70 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 backdrop-blur-md transition-all duration-200 focus:border-forest focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-xs"
                        />
                      </Field>

                      <Field label="Anticipated Project Timeline">
                        <select
                          name="timeline"
                          value={form.timeline}
                          onChange={handleChange}
                          className="w-full border border-line/70 bg-white/60 px-4 py-3 text-sm text-ink outline-none backdrop-blur-md transition-all duration-200 focus:border-forest focus:bg-white/95 focus:ring-2 focus:ring-forest/20 shadow-xs"
                        >
                          {TIMELINE_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>

                  {/* MESSAGE TEXTAREA */}
                  <div className="mt-6">
                    <Field label="Project Vision or Proposal Details" required>
                      <textarea
                        name="message"
                        required
                        value={form.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={4}
                        placeholder="Please outline your space dimensions, concept background, target market, or specific collaboration objectives..."
                        className="w-full border border-line/70 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 backdrop-blur-md transition-all duration-200 focus:border-forest focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-xs resize-y"
                      />
                      {errors.message && (
                        <p className="field-error mt-1 text-xs font-medium text-red-600">
                          {errors.message}
                        </p>
                      )}
                    </Field>
                  </div>

                  {/* TRUST SIGNALS & SUBMISSION */}
                  <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-t border-line/40 pt-6">
                    <div className="flex items-center gap-3 text-xs text-ink-soft">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/80 bg-white/70 text-primary shadow-xs backdrop-blur-sm">
                        <FourLeafClover size={16} strokeWidth={1.8} fillOpacity={0.4} />
                      </span>
                      <span>
                        Protected by four-leaf confidentiality standards. Mutual NDA executed prior to commercial disclosures.
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto shrink-0 shadow-md"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 animate-spin text-paper"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Routing to Executive Desk...
                        </span>
                      ) : (
                        <>
                          Send Business Enquiry <Arrow />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIRECT LINES: DEDICATED CHANNEL ROUTING — Dark Glass Cards */}
      <section
        data-tone="dark"
        className="relative overflow-hidden bg-forest-deep py-20 text-paper lg:py-28"
      >
        {/* Subtle interior glow in dark section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-1/4 h-[30rem] w-[30rem] rounded-full bg-bronze/10 blur-3xl"
        />

        <Section>
          <Reveal className="max-w-2xl">
            <Kicker tone="light">Specific Department Desks</Kicker>
            <h2
              className="mt-5 text-3xl leading-tight tracking-[-0.02em] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Know exactly what you need?{" "}
              <span className="italic text-bronze">Connect directly.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-paper/70">
              Each dedicated intake path has tailored criteria and expedited review cycles for property holders, suppliers, and culinary talent.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {DIRECT_LINES.map((d, i) => (
              <Reveal key={d.t} delay={i * 80}>
                <div
                  className="group flex h-full flex-col justify-between border border-white/15 bg-white/[0.05] p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-bronze hover:bg-white/[0.1] hover:shadow-2xl"
                  style={{
                    boxShadow:
                      "0 20px 40px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl text-bronze">
                        0{i + 1}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-paper/60">
                        {d.badge}
                      </span>
                    </div>
                    <h3
                      className="mt-5 text-xl tracking-[-0.01em]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {d.t}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper/70">
                      {d.d}
                    </p>
                  </div>
                  <button
                    onClick={() => go(d.page)}
                    className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-bronze transition-colors hover:text-paper focus:underline focus:outline-none"
                  >
                    {d.action}
                    <span className="transition-transform group-hover:translate-x-1.5">
                      →
                    </span>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </section>

      {/* TRANSPARENT COMMITMENT: WHAT HAPPENS NEXT — Glass Tile Sequence */}
      <Section className="py-20 lg:py-28">
        <Reveal className="max-w-xl">
          <Kicker>What Happens Next</Kicker>
          <h2
            className="mt-5 text-3xl leading-tight tracking-[-0.02em] text-[#1a2e22] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            No message disappears into a void.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            We hold a disciplined communication protocol to honor every partner&rsquo;s time and commercial vision.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {NEXT_STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 80}>
              <div
                className="h-full border border-white/70 bg-white/60 p-8 shadow-xs backdrop-blur-xl transition-all hover:bg-white/80 hover:shadow-md lg:p-10"
                style={{
                  boxShadow:
                    "0 15px 35px -10px rgba(22,51,31,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <span className="font-display text-3xl text-bronze">
                  0{i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTA go={go} />
    </>
  )
}

export default Contact
