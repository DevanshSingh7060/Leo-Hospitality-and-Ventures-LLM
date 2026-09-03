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
        lead="We onboard reliable F&B, fresh-produce and raw-material vendors across our venues and cloud kitchens. Register below to be considered for empanelment."
        image={IMG.chefBowl}
      />

      {/* categories */}
      <Section className="py-14 lg:py-20">
        <Reveal>
          <Kicker>Vendor Categories</Kicker>
        </Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VENDOR_CATS.map((c, i) => (
            <Reveal
              key={c}
              delay={i * 50}
              className="flex items-center gap-4 rounded-none border border-line bg-paper px-5 py-4"
            >
              <span className="font-display text-lg text-bronze">0{i + 1}</span>
              <span className="text-sm font-medium text-ink">{c}</span>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* form */}
      <section className="bg-paper py-16 lg:py-24 border-t border-line/40">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-12">
          <Reveal>
            <Kicker>Registration Form</Kicker>
            <h2
              className="mt-5 text-4xl leading-tight tracking-[-0.02em] sm:text-5xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Tell us about your firm.
            </h2>
          </Reveal>

          <Reveal delay={100} className="mt-10">
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
                  Thank you. Our procurement team will review your FSSAI
                  credentials and catalog, and we will reach out if there is an
                  operational fit.
                </p>
                <Button className="mt-8" onClick={() => go("home")}>
                  Back to home <Arrow />
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-6 rounded-none border border-line bg-cream/50 p-8 lg:p-10"
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
