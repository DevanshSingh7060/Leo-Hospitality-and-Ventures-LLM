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
import { PageHero } from "../components/PageHero"
import type { PageId } from "../lib/pages"

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
    const requiredFields: keyof typeof form[] = [
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
        image={IMG.coffeeHand}
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12">
          {/* details */}
          <Reveal className="space-y-8">
            <div>
              <h3 className="kicker text-forest">Office</h3>
              <p className="mt-3 text-lg text-ink">
                Leo Hospitality & Ventures LLP
              </p>
              <p className="text-ink-soft">Mumbai, Maharashtra, India</p>
            </div>
            <div>
              <h3 className="kicker text-forest">Phone</h3>
              <a
                href="tel:+912200000000"
                className="mt-3 block text-lg text-ink hover:text-forest transition-colors"
              >
                +91 22 0000 0000
              </a>
            </div>
            <div>
              <h3 className="kicker text-forest">Email</h3>
              <a
                href="mailto:connect@leohospitality.in"
                className="mt-3 block text-lg text-ink hover:text-forest transition-colors"
              >
                connect@leohospitality.in
              </a>
              <a
                href="mailto:partner@leohospitality.in"
                className="block text-ink-soft hover:text-forest transition-colors"
              >
                partner@leohospitality.in
              </a>
            </div>
            <div>
              <h3 className="kicker text-forest">Social</h3>
              <div className="mt-3 flex gap-3">
                {["Instagram", "LinkedIn", "Facebook"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-sm text-ink-soft transition-colors hover:border-forest hover:text-forest"
                    aria-label={s}
                  >
                    {s[0]}
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
                <div className="sr-only aria-hidden pointer-events-none">
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

                <div
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
                      <p className="mt-1 text-xs text-red-600 font-medium">
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
                      <p className="mt-1 text-xs text-red-600 font-medium">
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
                      <p className="mt-1 text-xs text-red-600 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </Field>
                </div>

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
                    <p className="mt-1 text-xs text-red-600 font-medium">
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
                    <p className="mt-1 text-xs text-red-600 font-medium">
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
    </>
  )
}
export default Contact
