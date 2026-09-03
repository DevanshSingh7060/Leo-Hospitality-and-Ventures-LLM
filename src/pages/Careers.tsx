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
  FileField,
} from "../lib/ui"
import { PageHero, Section } from "../components/PageHero"
import { CTA } from "./Home"
import type { PageId } from "../lib/pages"

const REASONS = [
  {
    t: "Real ownership",
    d: "Small team, big remit. Your judgement matters from day one.",
  },
  {
    t: "Learn every format",
    d: "Cafés, restaurants, cloud kitchens and events — all under one roof.",
  },
  {
    t: "Warmth as a standard",
    d: "We hire kind, exacting people and back them to do great work.",
  },
]

export function Careers({ go }: { go: (p: PageId) => void }) {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [honeypot, setHoneypot] = useState("")

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvError, setCvError] = useState<string | null>(null)

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
      "interest",
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

    if (!cvFile) {
      newErrors.cv = "Please upload your CV / resume."
    } else if (cvError) {
      newErrors.cv = cvError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
      window.scrollTo({ top: 400, behavior: "smooth" })
    }, 1500)
  }

  return (
    <>
      <PageHero
        kicker="Careers"
        title={
          <>
            Hospitality is a <span className="italic text-forest">craft.</span>
          </>
        }
        lead="We're always glad to meet chefs, managers and floor teams who take pride in the details. If that's you, say hello."
        image={IMG.chefPrep}
      />

      <Section className="py-16 lg:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal
              key={r.t}
              delay={i * 70}
              className="rounded-none border border-line bg-paper p-8"
            >
              <span className="font-display text-3xl text-bronze">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink">{r.t}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{r.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-paper py-16 lg:py-24 border-t border-line/40">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-12">
          <Reveal>
            <Kicker>Submit Your CV</Kicker>
            <h2
              className="mt-5 text-4xl leading-tight tracking-[-0.02em] sm:text-5xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Send us your story.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
              No open role listed? Send your CV anyway — we keep a warm list and
              reach out when the right seat opens.
            </p>
          </Reveal>

          <Reveal delay={100}>
            {sent ? (
              <div className="rounded-none border border-line bg-cream/60 p-10 text-center animate-fadeIn">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest text-3xl font-bold">
                  ✓
                </div>
                <h3
                  className="font-display text-4xl text-forest"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Received.
                </h3>
                <p className="mt-4 text-ink-soft leading-relaxed max-w-md mx-auto">
                  Thank you. Your curriculum vitae and details have been
                  recorded. We will keep your profile in our candidate pool and
                  contact you if an open position matches your background.
                </p>
                <Button className="mt-8" onClick={() => go("home")}>
                  Back to home <Arrow />
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-5 rounded-none border border-line bg-cream/60 p-8 lg:p-10"
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

                <fieldset
                  className="grid gap-5 sm:grid-cols-2"
                  disabled={submitting}
                >
                  <Field label="Full Name" required>
                    <Input
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="field-error mt-1 text-xs text-red-600 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </Field>

                  <Field label="Phone" required>
                    <Input
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="+91"
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
                      placeholder="you@email.com"
                    />
                    {errors.email && (
                      <p className="field-error mt-1 text-xs text-red-600 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </Field>

                  <Field label="Area of Interest" required>
                    <Select
                      name="interest"
                      required
                      value={form.interest}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" disabled>
                        Select area
                      </option>
                      <option value="Kitchen / Culinary">
                        Kitchen / Culinary
                      </option>
                      <option value="Floor / Service">Floor / Service</option>
                      <option value="Café / Barista">Café / Barista</option>
                      <option value="Operations & Management">
                        Operations & Management
                      </option>
                      <option value="Cloud Kitchen">Cloud Kitchen</option>
                    </Select>
                    {errors.interest && (
                      <p className="field-error mt-1 text-xs text-red-600 font-medium">
                        {errors.interest}
                      </p>
                    )}
                  </Field>
                </fieldset>

                <div className="mt-2">
                  <FileField
                    name="cv"
                    label="Upload CV"
                    required
                    hint="PDF preferred, up to 5 MB."
                    onChangeFile={(file, err) => {
                      setCvFile(file)
                      setCvError(err || null)
                      setErrors((prev) => {
                        const next = { ...prev }
                        if (err) next.cv = err
                        else delete next.cv
                        return next
                      })
                    }}
                  />
                  {errors.cv && (
                    <p className="field-error mt-1 text-xs text-red-600 font-medium">
                      {errors.cv}
                    </p>
                  )}
                </div>

                <div>
                  <Field label="A note (optional)">
                    <Textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us a little about your timeline or hospitality background…"
                    />
                  </Field>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full sm:w-auto"
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
                        Uploading...
                      </span>
                    ) : (
                      <>
                        Submit Application <Arrow />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <CTA go={go} />
    </>
  )
}
export default Careers
