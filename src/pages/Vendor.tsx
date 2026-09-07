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
import type { PageId } from "../lib/pages"

const VENDOR_CATS = [
  "Food Vendors & Suppliers",
  "Vegetable & Fresh Produce",
  "Beverage Suppliers",
  "Coffee Suppliers",
  "Other F&B Raw Material Suppliers",
]

// Richer category cards with supporting copy and a distinct icon each.
const VENDOR_CATEGORY_CARDS: { t: string; d: string; icon: string }[] = [
  {
    t: "Food Vendors & Suppliers",
    d: "Packaged goods, dairy, proteins and dry stores for daily kitchen operations.",
    icon: "M3 7h18M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9 4h6a1 1 0 0 1 1 1v2H8V5a1 1 0 0 1 1-1z",
  },
  {
    t: "Vegetable & Fresh Produce",
    d: "Farm-fresh vegetables, fruit and herbs delivered on a dependable schedule.",
    icon: "M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-4 3-5 4-8zM12 22v-6",
  },
  {
    t: "Beverage Suppliers",
    d: "Juices, mixers, dairy alternatives and bottled beverages across formats.",
    icon: "M7 3h10l-1 5v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8L7 3zM7.5 8h9",
  },
  {
    t: "Coffee Suppliers",
    d: "Speciality beans, roasts and café consumables for our coffee programmes.",
    icon: "M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8zm13 1h1.5a2.5 2.5 0 0 1 0 5H17M6 3v2m4-2v2m4-2v2",
  },
  {
    t: "Other F&B Raw Materials",
    d: "Packaging, disposables, cleaning supplies and specialised ingredients.",
    icon: "M3 9l9-5 9 5-9 5-9-5zm0 0v6l9 5 9-5V9",
  },
]

// Reasons a vendor should register — used in the form sidebar.
const VENDOR_BENEFITS = [
  "Steady, forecasted demand across multiple venues and cloud kitchens",
  "Transparent onboarding with clear payment and compliance terms",
  "A single procurement point of contact for orders and support",
  "Room to grow with us as we expand into new cities",
]

export function Vendor({ go }: { go: (p: PageId) => void }) {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [honeypot, setHoneypot] = useState("")

  // Form fields state
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    category: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    productCats: "",
    brands: "",
    fssaiNo: "",
    gst: "",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fssaiFile, setFssaiFile] = useState<File | null>(null)
  const [fssaiError, setFssaiError] = useState<string | null>(null)

  // Field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error on input
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Field blur validation
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
    } else if (name === "fssaiNo" && !/^\d{14}$/.test(value)) {
      err = "FSSAI license must be exactly 14 numeric digits."
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
    if (
      required ||
      name === "email" ||
      name === "phone" ||
      name === "fssaiNo"
    ) {
      validateField(name, value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Spam honeypot trigger check
    if (honeypot !== "") {
      console.warn("Spam submission blocked.")
      return
    }

    // Comprehensive validate fields
    const newErrors: Record<string, string> = {}
    const requiredFields: (keyof typeof form)[] = [
      "companyName",
      "contactPerson",
      "category",
      "phone",
      "email",
      "city",
      "address",
      "productCats",
      "fssaiNo",
    ]

    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = "This field is required."
      }
    })

    // Formatting checks
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address."
    }
    if (
      form.phone &&
      !/^\+?[0-9\s-]{10,14}$/.test(form.phone.replace(/\s+/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number (min 10 digits)."
    }
    if (form.fssaiNo && !/^\d{14}$/.test(form.fssaiNo)) {
      newErrors.fssaiNo = "FSSAI license must be exactly 14 numeric digits."
    }

    if (!fssaiFile) {
      newErrors.fssai = "Please upload your FSSAI certificate."
    } else if (fssaiError) {
      newErrors.fssai = fssaiError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Scroll to first error
      const firstErr = Object.keys(newErrors)[0]
      const el = document.getElementsByName(firstErr)[0]
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        el.focus()
      }
      return
    }

    setSubmitting(true)

    // Simulate submission API latency
    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
      window.scrollTo({ top: 400, behavior: "smooth" })
    }, 1500)
  }

  return (
    <>
      <PageHero
        kicker="Vendor Registration"
        title={
          <>
            Supply the{" "}
            <span className="italic text-forest">kitchens we run.</span>
          </>
        }
        lead="Great food starts with great suppliers. We partner with reliable F&B, fresh-produce and raw-material vendors across our cafés, restaurants and cloud kitchens. Register below to join our supplier network."
        image={IMG.chefBowl}
      />

      {/* categories */}
      <Section className="py-14 lg:py-20">
        <Reveal className="max-w-2xl">
          <Kicker>Vendor Categories</Kicker>
          <h2
            className="mt-5 text-3xl leading-tight tracking-[-0.02em] text-[#1a2e22] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            The supply partners we{" "}
            <span className="italic text-forest">work with.</span>
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            If your business fits one of the categories below, we would love to
            hear from you. Not sure where you fit? Register anyway — our
            procurement team reviews every submission.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VENDOR_CATEGORY_CARDS.map((c, i) => (
            <Reveal
              key={c.t}
              delay={i * 60}
              className="group flex flex-col gap-4 rounded-none border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-forest hover:shadow-[0_16px_40px_-24px_rgba(32,29,24,0.4)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-forest transition-colors duration-300 group-hover:border-forest group-hover:bg-forest/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={c.icon} />
                  </svg>
                </span>
                <span className="font-display text-2xl text-line transition-colors duration-300 group-hover:text-bronze">
                  0{i + 1}
                </span>
              </div>
              <div>
                <h3
                  className="text-xl tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-forest"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {c.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {c.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* form */}
      <section className="bg-paper py-16 lg:py-24 border-t border-line/40">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-12">
          {/* Left: intro + benefits sidebar */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <Kicker>Registration Form</Kicker>
            <h2
              className="mt-5 text-4xl leading-tight tracking-[-0.02em] sm:text-5xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Tell us about{" "}
              <span className="italic text-forest">your firm.</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
              It takes about three minutes. Share your details and compliance
              documents, and our procurement team will take it from there.
            </p>

            <div className="mt-8 rounded-none border border-line bg-forest-deep p-7 text-paper">
              <h3 className="kicker text-bronze">Why partner with us</h3>
              <ul className="mt-5 space-y-4">
                {VENDOR_BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-paper/85">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-bronze"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
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
                  Registration received.
                </h3>
                <p className="mx-auto mt-4 max-w-md text-ink-soft leading-relaxed">
                  Thank you for registering. Our procurement team will review
                  your FSSAI credentials and product catalogue, and reach out if
                  there is a good operational fit.
                </p>
                <Button className="mt-8" onClick={() => go("home")}>
                  Back to home <Arrow />
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-6 rounded-none border border-line bg-cream/50 p-8 shadow-[0_20px_60px_-40px_rgba(32,29,24,0.5)] lg:p-10"
              >
                {/* Honeypot field for bot mitigation */}
                <div className="sr-only pointer-events-none" aria-hidden="true">
                  <input
                    type="text"
                    name="website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    placeholder="Enter website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <fieldset className="grid gap-5" disabled={submitting}>
                  <legend className="kicker mb-3 text-forest font-semibold">
                    Company Details
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Company / Firm Name" required>
                      <Input
                        name="companyName"
                        required
                        value={form.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Registered business name"
                      />
                      {errors.companyName && (
                        <p className="field-error mt-1 text-xs text-red-600 font-medium">
                          {errors.companyName}
                        </p>
                      )}
                    </Field>

                    <Field label="Contact Person" required>
                      <Input
                        name="contactPerson"
                        required
                        value={form.contactPerson}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Full name of representative"
                      />
                      {errors.contactPerson && (
                        <p className="field-error mt-1 text-xs text-red-600 font-medium">
                          {errors.contactPerson}
                        </p>
                      )}
                    </Field>

                    <Field label="Vendor Category" required>
                      <Select
                        name="category"
                        required
                        value={form.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {VENDOR_CATS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Select>
                      {errors.category && (
                        <p className="field-error mt-1 text-xs text-red-600 font-medium">
                          {errors.category}
                        </p>
                      )}
                    </Field>

                    <Field label="Mobile Number" required>
                      <Input
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="10-digit number"
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
                        placeholder="firm@email.com"
                      />
                      {errors.email && (
                        <p className="field-error mt-1 text-xs text-red-600 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </Field>

                    <Field label="City / Service Area" required>
                      <Input
                        name="city"
                        required
                        value={form.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Mumbai (Western Suburbs)"
                      />
                      {errors.city && (
                        <p className="field-error mt-1 text-xs text-red-600 font-medium">
                          {errors.city}
                        </p>
                      )}
                    </Field>
                  </div>

                  <Field label="Address" required>
                    <Textarea
                      name="address"
                      required
                      value={form.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={2}
                      placeholder="Registered operating address"
                    />
                    {errors.address && (
                      <p className="field-error mt-1 text-xs text-red-600 font-medium">
                        {errors.address}
                      </p>
                    )}
                  </Field>
                </fieldset>

                <fieldset
                  className="grid gap-5 border-t border-line pt-6"
                  disabled={submitting}
                >
                  <legend className="kicker mb-3 text-forest font-semibold">
                    Supply Details
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Product / Raw Material Categories" required>
                      <Input
                        name="productCats"
                        required
                        value={form.productCats}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Dairy, Dry goods, Vegetables"
                      />
                      {errors.productCats && (
                        <p className="field-error mt-1 text-xs text-red-600 font-medium">
                          {errors.productCats}
                        </p>
                      )}
                    </Field>

                    <Field label="Brands / Products Supplied">
                      <Input
                        name="brands"
                        value={form.brands}
                        onChange={handleChange}
                        placeholder="Key brands or SKUs (Optional)"
                      />
                    </Field>
                  </div>
                </fieldset>

                <fieldset
                  className="grid gap-5 border-t border-line pt-6"
                  disabled={submitting}
                >
                  <legend className="kicker mb-3 text-forest font-semibold">
                    Compliance & Documents
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="FSSAI Number (14 Digits)" required>
                      <Input
                        name="fssaiNo"
                        required
                        value={form.fssaiNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="14-digit license number"
                      />
                      {errors.fssaiNo && (
                        <p className="field-error mt-1 text-xs text-red-600 font-medium">
                          {errors.fssaiNo}
                        </p>
                      )}
                    </Field>

                    <Field label="GST Details">
                      <Input
                        name="gst"
                        value={form.gst}
                        onChange={handleChange}
                        placeholder="GSTIN (Optional)"
                      />
                    </Field>
                  </div>

                  <div className="mt-3">
                    <FileField
                      name="fssai"
                      label="FSSAI Certificate Upload"
                      required
                      hint="Mandatory FSSAI Certificate — PDF, JPG or PNG (max 5MB)."
                      onChangeFile={(file, err) => {
                        setFssaiFile(file)
                        setFssaiError(err || null)
                        setErrors((prev) => {
                          const next = { ...prev }
                          if (err) next.fssai = err
                          else delete next.fssai
                          return next
                        })
                      }}
                    />
                    {errors.fssai && (
                      <p className="field-error mt-1.5 text-xs text-red-600 font-medium">
                        {errors.fssai}
                      </p>
                    )}
                  </div>
                </fieldset>

                <div className="mt-2">
                  <Field label="Additional Message / Comments">
                    <Textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="List any additional cities, volume caps, or relevant logistic specifications."
                    />
                  </Field>
                </div>

                <div className="rounded-none border border-bronze/30 bg-bronze/5 px-5 py-4 text-xs text-ink-soft leading-relaxed">
                  <span className="font-semibold text-ink">
                    Empanelment Disclaimer:
                  </span>{" "}
                  Submission of this form does not automatically constitute
                  vendor approval or empanelment. All registrations are subject
                  to compliance reviews and physical verification of facilities
                  by our quality assurance and procurement team.
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto"
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
                        Verifying details...
                      </span>
                    ) : (
                      <>
                        Submit Registration <Arrow />
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
export default Vendor
