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
import { SuccessModal } from "../components/SuccessModal"
import type { PageId } from "../lib/pages"

const CATEGORIES = [
  {
    t: "Franchise a Venture",
    d: "Bring Ryvive Roots or a future concept to your city with a turnkey playbook and our operational backing.",
  },
  {
    t: "Management Partnership",
    d: "You own the space and the brand — we run the operation on a management or revenue-share model.",
  },
  {
    t: "Society & Clubhouse Cafeterias",
    d: "Managed café and cafeteria services for residential societies and clubhouses.",
  },
  {
    t: "Joint Ventures & Investment",
    d: "Co-invest and co-build new hospitality concepts from the ground up.",
  },
]

export function Franchise({ go }: { go: (p: PageId) => void }) {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [honeypot, setHoneypot] = useState("")

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    type: "",
    message: "",
  })

  const resetForm = () => {
    setSent(false)
    setForm({
      name: "",
      company: "",
      phone: "",
      email: "",
      type: "",
      message: "",
    })
  }

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
      "type",
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
    }, 1500)
  }

  return (
    <>
      <PageHero
        kicker="Franchise / Business Opportunities"
        title={
          <>
            Let&rsquo;s build{" "}
            <span className="italic text-forest">something together.</span>
          </>
        }
        lead="Whether you have a space, a brand or capital, there's a partnership model that fits. Here's where we usually start."
        image={IMG.bodhiTree}
      />

      <Section className="py-16 lg:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((c, i) => (
            <Reveal
              key={c.t}
              delay={i * 70}
              className="group rounded-none border border-line bg-paper p-8 transition-colors hover:border-forest/50"
            >
              <span className="font-display text-3xl text-bronze">
                0{i + 1}
              </span>
              <h3
                className="mt-4 text-2xl tracking-[-0.01em] text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {c.t}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{c.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ENQUIRY FORM */}
      <section
        data-tone="dark"
        className="bg-forest-deep py-20 text-paper lg:py-28"
      >
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-12">
          <Reveal>
            <Kicker tone="light">Business Enquiry</Kicker>
            <h2
              className="mt-5 text-4xl leading-tight tracking-[-0.02em] sm:text-5xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Tell us what you have in mind.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-paper/70">
              Share a few details and our partnerships team will get back to you
              with next steps. Prefer email? Reach us at{" "}
              <a
                href="mailto:partner@leohospitality.in"
                className="text-bronze underline-offset-4 hover:underline transition-all"
              >
                partner@leohospitality.in
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={100}>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-5 rounded-none bg-paper p-8 text-ink lg:p-10"
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
                    name="type"
                    required
                    value={form.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="" disabled>
                      Select a partnership type
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c.t} value={c.t}>
                        {c.t}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </Select>
                  {errors.type && (
                    <p className="field-error mt-1 text-xs text-red-600 font-medium">
                      {errors.type}
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
                    placeholder="Tell us about your space, brand or idea…"
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
                        Submitting enquiry...
                      </span>
                    ) : (
                      <>
                        Submit Enquiry <Arrow />
                      </>
                    )}
                  </Button>
                </div>
              </form>

            {sent && (
              <SuccessModal
                kicker="Enquiry Registered"
                title={`Thank you${form.name ? `, ${form.name}` : ""}!`}
                message={
                  <>
                    Your franchise enquiry has been registered. Our business
                    development team will review your{" "}
                    {form.type ? (
                      <>
                        interest in{" "}
                        <span className="font-medium text-forest">
                          &ldquo;{form.type}&rdquo;
                        </span>{" "}
                      </>
                    ) : (
                      "partnership details "
                    )}
                    and follow up within 2&ndash;3 business days.
                  </>
                }
                summary={[
                  ...(form.type
                    ? [{ label: "Partnership", value: form.type }]
                    : []),
                  ...(form.phone
                    ? [{ label: "Direct Phone", value: form.phone }]
                    : []),
                  {
                    label: "Routing",
                    value: "Business Development",
                    accent: true,
                  },
                ]}
                primaryLabel="Back to Home"
                onPrimary={() => go("home")}
                secondaryLabel="Send Another Enquiry"
                onSecondary={resetForm}
                onClose={resetForm}
              />
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
// export default Franchise
