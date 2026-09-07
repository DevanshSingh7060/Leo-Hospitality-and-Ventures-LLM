import { useState } from "react"
import {
  Button,
  Arrow,
  Kicker,
  Reveal,
  IMG,
  Field,
  Input,
  Select,
  Textarea,
} from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import type { PageId } from "../lib/pages"

/* ---------- Inline icons (no icon dependency in this project) ---------- */
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

const PIN = "M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
const PHONE =
  "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"
const MAIL = "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 7l-10 6L2 7"
const CLOCK = "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2"

const SOCIAL_ICONS = [
  {
    label: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z M17.5 6.5h.01",
  },
  {
    label: "LinkedIn",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5 M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
]

/* Where different enquiries actually go. */
const DIRECT_LINES: {
  t: string
  d: string
  page: PageId
  action: string
}[] = [
  {
    t: "Partnerships & Franchise",
    d: "You have a space, a brand or capital and want to build with us.",
    page: "franchise",
    action: "Start a business enquiry",
  },
  {
    t: "Vendors & Supply",
    d: "You supply food, produce, beverages or raw materials to kitchens.",
    page: "vendor",
    action: "Register as a vendor",
  },
  {
    t: "Careers",
    d: "You are a chef, manager or floor professional looking for a room.",
    page: "careers",
    action: "Send us your CV",
  },
]

/* Sets expectations after the form is sent. */
const NEXT_STEPS = [
  {
    t: "We read it",
    d: "Every enquiry reaches a person on our team, not a shared inbox nobody opens.",
  },
  {
    t: "We route it",
    d: "Your message goes to whoever actually owns it — partnerships, procurement or people.",
  },
  {
    t: "We reply",
    d: "Expect a response within two to three working days, with clear next steps.",
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
    enquiryType: "",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
      err = "Please enter a valid email address."
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
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
      "enquiryType",
      "message",
    ]

    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = "This field is required."
      }
    })

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address."
    }
    if (
      form.phone &&
      !/^\+?[0-9\s-]{10,14}$/.test(form.phone.replace(/\s+/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number (min 10 digits)."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
      window.scrollTo({ top: 300, behavior: "smooth" })
    }, 1500)
  }

  return (
    <>
      <PageHero
        kicker="Contact"
        title={
          <>
            Let&rsquo;s <span className="italic text-forest">talk.</span>
          </>
        }
        lead="Business enquiries, partnerships or a simple hello — we read everything that comes through."
        image={IMG.greeting}
        imageAlt="Two people greeting each other"
        graphic
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12">
          {/* details */}
          <Reveal className="space-y-4">
            <div className="rounded-none border border-line bg-paper p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-forest">
                  <Icon path={PIN} />
                </span>
                <div>
                  <h3 className="kicker text-forest">Office</h3>
                  <p className="mt-2 text-lg text-ink">
                    Leo Hospitality &amp; Ventures LLP
                  </p>
                  <p className="text-ink-soft">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-line bg-paper p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-forest">
                  <Icon path={PHONE} />
                </span>
                <div>
                  <h3 className="kicker text-forest">Phone</h3>
                  <a
                    href="tel:+912200000000"
                    className="mt-2 block text-lg text-ink transition-colors hover:text-forest"
                  >
                    +91 22 0000 0000
                  </a>
                  <p className="text-sm text-ink-soft">
                    Mon–Sat, during office hours
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-line bg-paper p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-forest">
                  <Icon path={MAIL} />
                </span>
                <div>
                  <h3 className="kicker text-forest">Email</h3>
                  <a
                    href="mailto:connect@leohospitality.in"
                    className="mt-2 block text-lg text-ink transition-colors hover:text-forest"
                  >
                    connect@leohospitality.in
                  </a>
                  <p className="text-xs uppercase tracking-wider text-ink-soft/70">
                    General enquiries
                  </p>
                  <a
                    href="mailto:partner@leohospitality.in"
                    className="mt-3 block text-lg text-ink transition-colors hover:text-forest"
                  >
                    partner@leohospitality.in
                  </a>
                  <p className="text-xs uppercase tracking-wider text-ink-soft/70">
                    Partnerships &amp; franchise
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-line bg-paper p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-forest">
                  <Icon path={CLOCK} />
                </span>
                <div className="w-full">
                  <h3 className="kicker text-forest">Office Hours</h3>
                  <dl className="mt-2 space-y-1.5 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Monday – Friday</dt>
                      <dd className="text-ink">10:00 – 19:00</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Saturday</dt>
                      <dd className="text-ink">11:00 – 17:00</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Sunday</dt>
                      <dd className="text-ink-soft/70">Closed</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="rounded-none border border-line bg-paper p-6">
              <h3 className="kicker text-forest">Social</h3>
              <div className="mt-3 flex gap-3">
                {SOCIAL_ICONS.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-forest hover:text-forest"
                    aria-label={s.label}
                  >
                    <Icon path={s.path} size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-none border border-line">
              <iframe
                title="Leo Hospitality location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.80%2C18.90%2C72.90%2C19.10&layer=mapnik"
                className="h-56 w-full grayscale"
                loading="lazy"
              />
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={100}>
            {sent ? (
              <div className="rounded-none border border-line bg-paper p-10 text-center animate-fadeIn">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest text-3xl font-bold">
                  ✓
                </div>
                <h2
                  className="font-display text-4xl text-forest"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Message sent.
                </h2>
                <p className="mt-4 text-ink-soft leading-relaxed max-w-md mx-auto">
                  Thanks for reaching out. A representative from our partner
                  relations team will contact you shortly.
                </p>
                <Button className="mt-8" onClick={() => go("home")}>
                  Back to home <Arrow />
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-5 rounded-none border border-line bg-paper p-8 lg:p-10"
              >
                {/* Honeypot */}
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

                <h2
                  className="text-2xl font-semibold text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Business Enquiry
                </h2>

                <fieldset
                  className="grid gap-5 sm:grid-cols-2"
                  disabled={submitting}
                >
                  <Field label="Name" required>
                    <Input
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="field-error mt-1 text-xs text-red-600 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </Field>

                  <Field label="Company / Organization">
                    <Input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="e.g. Firm name (Optional)"
                    />
                  </Field>

                  <Field label="Phone" required>
                    <Input
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Contact number"
                    />
                    {errors.phone && (
                      <p className="field-error mt-1 text-xs text-red-600 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </Field>

                  <Field label="Email" required>
                    <Input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@company.com"
                    />
                    {errors.email && (
                      <p className="field-error mt-1 text-xs text-red-600 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </Field>
                </fieldset>

                <Field label="Enquiry Type" required>
                  <Select
                    name="enquiryType"
                    required
                    value={form.enquiryType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="" disabled>
                      Select Enquiry Type
                    </option>
                    <option value="Partnership / Franchise">
                      Partnership / Franchise
                    </option>
                    <option value="Venue Management">Venue Management</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Careers">Careers</option>
                    <option value="Vendor / Supply">Vendor / Supply</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </Select>
                  {errors.enquiryType && (
                    <p className="field-error mt-1 text-xs text-red-600 font-medium">
                      {errors.enquiryType}
                    </p>
                  )}
                </Field>

                <Field label="Message" required>
                  <Textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell us what you have in mind..."
                  />
                  {errors.message && (
                    <p className="field-error mt-1 text-xs text-red-600 font-medium">
                      {errors.message}
                    </p>
                  )}
                </Field>

                <div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto mt-2"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-paper"
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
                        Sending message...
                      </span>
                    ) : (
                      <>
                        Send Message <Arrow />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* DIRECT LINES — dark band, and useful routing rather than filler */}
      <section
        data-tone="dark"
        className="bg-forest-deep py-20 text-paper lg:py-28"
      >
        <Section>
          <Reveal className="max-w-2xl">
            <Kicker tone="light">Direct Lines</Kicker>
            <h2
              className="mt-5 text-3xl leading-tight tracking-[-0.02em] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Know what you need?{" "}
              <span className="italic text-bronze">Skip the queue.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-paper/70">
              Some enquiries have a dedicated form that gets you a faster, more
              specific answer than a general message.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {DIRECT_LINES.map((d, i) => (
              <Reveal
                key={d.t}
                delay={i * 70}
                className="group flex flex-col justify-between rounded-none border border-white/15 bg-white/[0.04] p-7 transition-colors hover:border-bronze"
              >
                <div>
                  <span className="font-display text-2xl text-bronze">
                    0{i + 1}
                  </span>
                  <h3
                    className="mt-4 text-xl tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {d.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">
                    {d.d}
                  </p>
                </div>
                <button
                  onClick={() => go(d.page)}
                  className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-bronze transition-colors hover:text-paper focus:underline focus:outline-none"
                >
                  {d.action}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </Section>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <Section className="py-20 lg:py-28">
        <Reveal className="max-w-xl">
          <Kicker>What Happens Next</Kicker>
          <h2
            className="mt-5 text-3xl leading-tight tracking-[-0.02em] text-[#1a2e22] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            No message disappears here.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-none border border-line bg-line md:grid-cols-3">
          {NEXT_STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 70} className="bg-paper p-8">
              <span className="font-display text-2xl text-bronze">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {s.d}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTA go={go} />
    </>
  )
}
export default Contact
