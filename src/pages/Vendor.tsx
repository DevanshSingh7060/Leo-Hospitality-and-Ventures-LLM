import { useState, useRef, useEffect } from "react"
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

/* -------------------------------------------------------------------------- */
/*                                CONSTANTS                                   */
/* -------------------------------------------------------------------------- */

const FIRM_TYPES = [
  "Proprietorship",
  "Partnership",
  "Pvt. Ltd.",
  "Public Ltd.",
  "Others",
]

const VENDOR_CATS = [
  "Food & Dry Grocery Suppliers",
  "Vegetable & Fresh Farm Produce",
  "Dairy & Frozen Products",
  "Beverages & Mixers",
  "Speciality Coffee & Tea Consumables",
  "Meat, Poultry & Seafood",
  "Bakery & Confectionery Ingredients",
  "Packaging, Disposables & Chemicals",
  "Kitchen Equipment & Maintenance",
  "Other F&B Raw Materials",
]

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi (NCT)",
  "Gujarat",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Goa",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Punjab",
  "Haryana",
  "Kerala",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "Bihar",
  "Chhattisgarh",
  "Himachal Pradesh",
  "Jharkhand",
  "Odisha",
  "Uttarakhand",
  "Assam",
  "Chandigarh",
  "Other Union Territory",
]

const MAJOR_BANKS = [
  "HDFC Bank",
  "State Bank of India (SBI)",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Bank of Baroda",
  "Punjab National Bank",
  "Canara Bank",
  "Union Bank of India",
  "IndusInd Bank",
  "IDFC FIRST Bank",
  "Federal Bank",
  "Yes Bank",
  "Other Bank",
]

const VENDOR_CATEGORY_CARDS = [
  {
    t: "Food & Dry Grocery",
    d: "Staples, gourmet ingredients, condiments, and packaged culinary goods.",
    icon: "M3 7h18M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9 4h6a1 1 0 0 1 1 1v2H8V5a1 1 0 0 1 1-1z",
  },
  {
    t: "Fresh Farm Produce",
    d: "Daily-harvested farm vegetables, microgreens, and seasonal exotic fruits.",
    icon: "M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-4 3-5 4-8zM12 22v-6",
  },
  {
    t: "Beverages & Mixers",
    d: "Artisanal tonics, cold-pressed juices, syrups, and craft soda provisions.",
    icon: "M7 3h10l-1 5v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8L7 3zM7.5 8h9",
  },
  {
    t: "Speciality Coffee",
    d: "Single-origin beans, estate roasts, and café brewing consumables.",
    icon: "M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8zm13 1h1.5a2.5 2.5 0 0 1 0 5H17M6 3v2m4-2v2m4-2v2",
  },
  {
    t: "Dairy & Proteins",
    d: "Fresh cheeses, organic dairy, eggs, and quality-tested seafood & poultry.",
    icon: "M12 3v18m-9-9h18",
  },
  {
    t: "Packaging & Supplies",
    d: "Eco-friendly delivery containers, hygiene sanitizers, and pantry stores.",
    icon: "M3 9l9-5 9 5-9 5-9-5zm0 0v6l9 5 9-5V9",
  },
]

const VENDOR_BENEFITS = [
  "Predictable, high-volume recurring demand across all venues and cloud kitchens",
  "Transparent, structured payment cycles with digital KYC invoice clearances",
  "Dedicated procurement executive desk for prompt order logistics & queries",
  "Rapid expansion opportunities across prime Tier-1 & luxury hospitality hubs",
]

/* -------------------------------------------------------------------------- */
/*                                INTERFACES                                  */
/* -------------------------------------------------------------------------- */

interface VendorFormData {
  // Step 1: Firm Profile (from FORM sheet)
  partyName: string
  firmType: string
  category: string
  contactPerson: string
  designation: string
  phone: string
  alternatePhone: string
  email: string
  address1: string
  address2: string
  city: string
  state: string
  pinCode: string

  // Step 2: Statutory Identifiers (from FORM & GST Details sheets)
  panNumber: string
  aadhaarNumber: string
  gstNumber: string
  additionalGstNumber: string
  fssaiNumber: string
  hsnCode: string
  productDescription: string

  // Step 3: Bank Details (from FORM sheet Bank Details)
  bankName: string
  customBankName: string
  branchName: string
  accountType: "Current" | "Savings"
  accountNumber: string
  confirmAccountNumber: string
  ifscCode: string

  // Step 4: Statutory Declarations (from E-invoicing & 206AB sheets)
  einvoicingApplicable: "applicable" | "not_applicable" | ""
  einvoicingUndertaking: boolean
  section206abConfirmed: boolean
  itrAck1: string // AY 2023-24
  itrDate1: string
  itrAck2: string // AY 2024-25
  itrDate2: string
  signatoryName: string
  signatoryDesignation: string
  declarationPlace: string
  declarationDate: string
  finalConsent: boolean
}

interface UploadedFileRecord {
  file: File | null
  name: string
  size: string
  progress: number
  uploaded: boolean
  error?: string
}

type DocKey = "pan" | "gst" | "cheque" | "fssai" | "signedForm"

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export function Vendor({ go }: { go: (p: PageId) => void }) {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [pageSheen, setPageSheen] = useState<boolean>(false)
  const [completedStepRipple, setCompletedStepRipple] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [greetingOpen, setGreetingOpen] = useState<boolean>(false)
  const [submissionId, setSubmissionId] = useState<string>("")
  const [copiedId, setCopiedId] = useState<boolean>(false)
  const [honeypot, setHoneypot] = useState<string>("")

  // Form State initialized with all fields from Excel
  const [form, setForm] = useState<VendorFormData>({
    partyName: "",
    firmType: "Proprietorship",
    category: "",
    contactPerson: "",
    designation: "Proprietor / Partner / Director",
    phone: "",
    alternatePhone: "",
    email: "",
    address1: "",
    address2: "",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "",

    panNumber: "",
    aadhaarNumber: "",
    gstNumber: "",
    additionalGstNumber: "",
    fssaiNumber: "",
    hsnCode: "",
    productDescription: "",

    bankName: "HDFC Bank",
    customBankName: "",
    branchName: "",
    accountType: "Current",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",

    einvoicingApplicable: "not_applicable",
    einvoicingUndertaking: true,
    section206abConfirmed: true,
    itrAck1: "",
    itrDate1: "",
    itrAck2: "",
    itrDate2: "",
    signatoryName: "",
    signatoryDesignation: "",
    declarationPlace: "Mumbai",
    declarationDate: new Date().toISOString().split("T")[0],
    finalConsent: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Document Uploads State with animated upload progress
  const [docs, setDocs] = useState<Record<DocKey, UploadedFileRecord>>({
    pan: { file: null, name: "", size: "", progress: 0, uploaded: false },
    gst: { file: null, name: "", size: "", progress: 0, uploaded: false },
    cheque: { file: null, name: "", size: "", progress: 0, uploaded: false },
    fssai: { file: null, name: "", size: "", progress: 0, uploaded: false },
    signedForm: { file: null, name: "", size: "", progress: 0, uploaded: false },
  })

  // Autofill signatory name from contact person if blank
  useEffect(() => {
    if (form.contactPerson && !form.signatoryName) {
      setForm((prev) => ({ ...prev, signatoryName: form.contactPerson }))
    }
  }, [form.contactPerson, form.signatoryName])

  // Field change handler with automatic formatting
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    let formattedValue = value

    // Formatting rules
    if (name === "panNumber") {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)
    } else if (name === "gstNumber" || name === "additionalGstNumber") {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15)
    } else if (name === "ifscCode") {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11)
    } else if (name === "aadhaarNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 12)
    } else if (name === "pinCode") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6)
    } else if (name === "fssaiNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 14)
    } else if (name === "phone" || name === "alternatePhone") {
      formattedValue = value.replace(/[^\d+-\s]/g, "").slice(0, 15)
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }))

    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Handle simulated animated file upload
  const handleFileUpload = (key: DocKey, file: File | null) => {
    if (!file) {
      setDocs((prev) => ({
        ...prev,
        [key]: { file: null, name: "", size: "", progress: 0, uploaded: false },
      }))
      return
    }

    // Check size (Max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [key]: "File size exceeds 8MB limit." }))
      return
    }

    const fileSizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    // Start upload simulation
    setDocs((prev) => ({
      ...prev,
      [key]: {
        file,
        name: file.name,
        size: fileSizeStr,
        progress: 25,
        uploaded: false,
      },
    }))

    // Clear any previous error
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })

    // Progress animation
    setTimeout(() => {
      setDocs((prev) => ({
        ...prev,
        [key]: { ...prev[key], progress: 65 },
      }))
      setTimeout(() => {
        setDocs((prev) => ({
          ...prev,
          [key]: { ...prev[key], progress: 100, uploaded: true },
        }))
      }, 250)
    }, 200)
  }

  // Validate current step before advancing
  const validateStep = (stepNumber: number): boolean => {
    const stepErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!form.partyName.trim()) stepErrors.partyName = "Party / Legal Firm Name is required."
      if (!form.category) stepErrors.category = "Please select a vendor category."
      if (!form.contactPerson.trim()) stepErrors.contactPerson = "Contact Person name is required."
      if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) {
        stepErrors.phone = "Valid 10-digit phone number is required."
      }
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
        stepErrors.email = "Valid corporate email address is required."
      }
      if (!form.address1.trim()) stepErrors.address1 = "Address Line 1 is required."
      if (!form.city.trim()) stepErrors.city = "City is required."
      if (!form.pinCode.trim() || form.pinCode.length < 6) {
        stepErrors.pinCode = "Valid 6-digit PIN code is required."
      }
    } else if (stepNumber === 2) {
      if (!form.panNumber.trim() || form.panNumber.length !== 10) {
        stepErrors.panNumber = "Valid 10-character PAN number is required (e.g. ABCDE1234F)."
      }
      if (!form.gstNumber.trim() || form.gstNumber.length !== 15) {
        stepErrors.gstNumber = "Valid 15-character GSTIN is required (or 15 zeros if unregistered)."
      }
      if (form.aadhaarNumber && form.aadhaarNumber.length !== 12) {
        stepErrors.aadhaarNumber = "Aadhaar number must be 12 digits."
      }
      if (form.fssaiNumber && form.fssaiNumber.length !== 14) {
        stepErrors.fssaiNumber = "FSSAI license must be exactly 14 numeric digits."
      }
    } else if (stepNumber === 3) {
      if (!form.bankName) stepErrors.bankName = "Please select your bank."
      if (form.bankName === "Other Bank" && !form.customBankName.trim()) {
        stepErrors.customBankName = "Please specify your bank name."
      }
      if (!form.branchName.trim()) stepErrors.branchName = "Branch name is required."
      if (!form.accountNumber.trim()) stepErrors.accountNumber = "Bank account number is required."
      if (form.accountNumber !== form.confirmAccountNumber) {
        stepErrors.confirmAccountNumber = "Account numbers do not match."
      }
      if (!form.ifscCode.trim() || form.ifscCode.length !== 11) {
        stepErrors.ifscCode = "Valid 11-character IFSC code is required (e.g. HDFC0001234)."
      }
    } else if (stepNumber === 4) {
      if (!docs.pan.uploaded) stepErrors.pan = "Scanned copy of PAN card is required."
      if (!docs.gst.uploaded) stepErrors.gst = "Scanned copy of GST certificate is required."
      if (!docs.cheque.uploaded) stepErrors.cheque = "Scanned copy of Cancelled Cheque is required."
      if (!form.einvoicingApplicable) {
        stepErrors.einvoicingApplicable = "Please declare whether E-invoicing applies to your firm."
      }
      if (!form.signatoryName.trim()) {
        stepErrors.signatoryName = "Authorized Signatory Name is required."
      }
    } else if (stepNumber === 5) {
      if (!form.finalConsent) {
        stepErrors.finalConsent = "You must confirm the statutory accuracy of this registration."
      }
    }

    setErrors(stepErrors)

    if (Object.keys(stepErrors).length > 0) {
      const firstField = Object.keys(stepErrors)[0]
      const el = document.getElementsByName(firstField)[0]
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        el.focus()
      }
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setDirection("forward")
      setPageSheen(true)
      setCompletedStepRipple(currentStep)
      setCurrentStep((prev) => Math.min(prev + 1, 5))

      const formCard = document.getElementById("kyc-form-card")
      if (formCard) {
        formCard.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      setTimeout(() => {
        setPageSheen(false)
      }, 950)
    }
  }

  const handlePrevStep = () => {
    setDirection("backward")
    setPageSheen(true)
    setCurrentStep((prev) => Math.max(prev - 1, 1))

    const formCard = document.getElementById("kyc-form-card")
    if (formCard) {
      formCard.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    setTimeout(() => {
      setPageSheen(false)
    }, 950)
  }

  const handleJumpToStep = (targetStep: number) => {
    if (targetStep < currentStep) {
      setDirection("backward")
      setPageSheen(true)
      setCurrentStep(targetStep)

      const formCard = document.getElementById("kyc-form-card")
      if (formCard) {
        formCard.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      setTimeout(() => {
        setPageSheen(false)
      }, 950)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (honeypot !== "") {
      console.warn("Spam submission intercepted.")
      return
    }

    if (!validateStep(5)) return

    setIsSubmitting(true)

    // Simulate backend KYC processing & generation of tracking token
    setTimeout(() => {
      const randomToken = `LHV-KYC-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`
      setSubmissionId(randomToken)
      setIsSubmitting(false)
      setIsSubmitted(true)
      setGreetingOpen(true)
      window.scrollTo({ top: 300, behavior: "smooth" })
    }, 1400)
  }

  const handleCopyId = () => {
    if (navigator.clipboard && submissionId) {
      navigator.clipboard.writeText(submissionId)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  return (
    <>
      {greetingOpen && (
        <SuccessModal
          kicker="Vendor KYC Received"
          title={`Thank you${form.partyName ? `, ${form.partyName}` : ""}!`}
          message={
            <>
              Your vendor registration has been securely logged in our central
              procurement queue for compliance verification. Verified suppliers
              receive recurring procurement orders across our restaurants, cafes
              and cloud kitchens.
            </>
          }
          summary={[
            { label: "Tracking ID", value: submissionId, accent: true },
            ...(form.category
              ? [{ label: "Category", value: form.category }]
              : []),
            { label: "Routing", value: "Procurement Desk" },
          ]}
          primaryLabel="Return Home"
          onPrimary={() => go("home")}
          secondaryLabel="View Receipt"
          onSecondary={() => setGreetingOpen(false)}
          onClose={() => setGreetingOpen(false)}
        />
      )}
      <PageHero
        kicker="Supplier & Partner Network"
        title={
          <>
            New Vendor <span className="italic text-forest">KYC Registration.</span>
          </>
        }
        lead="Complete the official Leo Hospitality & Ventures vendor onboarding questionnaire. Verified suppliers receive recurring procurement orders across our restaurants, cafes, and cloud kitchens."
        image={IMG.chefSink}
      />

      {/* CATEGORIES SECTION */}
      <Section className="py-14 lg:py-20 border-b border-line/40">
        <Reveal className="max-w-3xl">
          <Kicker>Procurement Disciplines</Kicker>
          <h2
            className="mt-5 text-3xl leading-tight tracking-[-0.02em] text-ink sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Supply categories currently{" "}
            <span className="italic text-forest">onboarding.</span>
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            We partner with certified producers and distributors who adhere to
            strict hygiene, packaging, and timely cold-chain transport.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VENDOR_CATEGORY_CARDS.map((c, i) => (
            <Reveal
              key={c.t}
              delay={i * 60}
              className="group flex flex-col justify-between rounded-none border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-forest hover:shadow-[0_16px_40px_-24px_rgba(32,29,24,0.35)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-forest transition-all duration-300 group-hover:border-forest group-hover:bg-forest/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={c.icon} />
                    </svg>
                  </span>
                  <span className="font-display text-xl text-line transition-colors duration-300 group-hover:text-bronze">
                    0{i + 1}
                  </span>
                </div>
                <h3
                  className="mt-5 text-lg font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-forest"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {c.t}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {c.d}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-forest opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>Active Demand</span>
                <span>→</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* INTERACTIVE KYC ONBOARDING PORTAL */}
      <section className="relative overflow-hidden bg-[#faf8f4] py-16 lg:py-24" id="kyc-form-card">
        {/* Subtle decorative background gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-forest/[0.04] blur-3xl"
        />

        <div className="mx-auto max-w-[1240px] px-6 lg:px-12">
          {/* Header banner */}
          <div className="mb-10 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze font-semibold">
              Official KYC Portal
            </span>
            <h2
              className="mt-2 text-3xl sm:text-4xl text-ink"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Vendor Empanelment Application
            </h2>
            <p className="mt-3 text-sm text-ink-soft max-w-xl mx-auto">
              Compliant with Section 206AB of the Income Tax Act, 1961, GSTIN verification protocols, and FSSAI Food Safety Standards.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          {!isSubmitted && (
            <div className="mb-10">
              <div className="relative mx-auto max-w-3xl">
                {/* Background Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-line/60 -z-0" />
                {/* Active Filled Line with smooth transition */}
                <div
                  className="absolute top-5 left-0 h-0.5 bg-forest transition-all duration-500 ease-out -z-0"
                  style={{
                    width: `${((currentStep - 1) / 4) * 100}%`,
                  }}
                />

                {/* Step Pills */}
                <div className="relative z-10 flex justify-between">
                  {[
                    { n: 1, label: "Firm Profile" },
                    { n: 2, label: "Statutory & Tax" },
                    { n: 3, label: "Bank KYC" },
                    { n: 4, label: "Declarations" },
                    { n: 5, label: "Review & Sign" },
                  ].map((s) => {
                    const isDone = currentStep > s.n
                    const isCurrent = currentStep === s.n
                    return (
                      <button
                        key={s.n}
                        type="button"
                        onClick={() => handleJumpToStep(s.n)}
                        disabled={s.n > currentStep}
                        className={`group flex flex-col items-center focus:outline-none transition-transform duration-300 ${
                          s.n <= currentStep ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-70"
                        }`}
                      >
                        <div
                          className={`relative flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 shadow-sm ${
                            isDone
                              ? "bg-forest text-paper ring-4 ring-forest/15"
                              : isCurrent
                              ? "bg-paper text-forest ring-4 ring-forest/30 border-2 border-forest"
                              : "bg-paper text-ink-soft border border-line"
                          } ${completedStepRipple === s.n ? "animate-step-ripple" : ""}`}
                        >
                          {isDone ? (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            s.n
                          )}
                        </div>
                        <span
                          className={`mt-2 text-[11px] font-medium tracking-wide transition-colors ${
                            isCurrent
                              ? "text-forest font-semibold"
                              : isDone
                              ? "text-ink"
                              : "text-ink-soft/70"
                          }`}
                        >
                          {s.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* FORM CONTAINER WITH 3D BOOK FOLIO BINDING & TURNING ANIMATION */}
          <div className="relative mx-auto max-w-4xl" style={{ perspective: "1400px" }}>
            {/* Physical Leather/Spine Edge on left */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-2.5 top-0 bottom-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent rounded-l-xs z-30 hidden sm:block"
            />

            {/* Folio Corner Bookmark / Turned Page Ribbon */}
            {!isSubmitted && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 right-6 z-30 flex items-center gap-2 rounded-b-md bg-[#23452b] px-3.5 py-1 text-[10.5px] font-mono uppercase tracking-widest text-[#f5ebd7] shadow-md border-b border-x border-[#d8c29d]/40"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d8c29d] animate-pulse" />
                <span>FOLIO 0{currentStep} / 05</span>
              </div>
            )}

            {/* Golden Sheen Sweep Effect on Page Turn */}
            {pageSheen && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-40 overflow-hidden rounded-none"
              >
                <div className="h-full w-56 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-golden-sheen" />
              </div>
            )}

            {/* The Main Turning Page */}
            <div
              key={currentStep}
              className={`rounded-none border border-line bg-paper shadow-[0_25px_60px_-25px_rgba(22,51,31,0.14)] relative overflow-hidden transition-all duration-500 ${
                !isSubmitted
                  ? direction === "forward"
                    ? "animate-book-page-forward"
                    : "animate-book-page-backward"
                  : "animate-fadeIn"
              }`}
            >
              {/* Subtle Book Spine crease line on left side */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-[6px] border-r border-line/70 bg-gradient-to-r from-stone-200/50 to-transparent z-20 hidden sm:block"
              />
            {isSubmitted ? (
              /* SUCCESS RECEIPT STATE */
              <div className="p-8 sm:p-14 text-center animate-fadeIn">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 text-forest text-4xl shadow-inner">
                  ✓
                </div>

                <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze font-semibold">
                  Application Transmitted
                </span>
                <h3
                  className="mt-2 text-3xl sm:text-4xl text-forest"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  KYC Form Successfully Submitted
                </h3>

                <p className="mx-auto mt-4 max-w-lg text-sm text-ink-soft leading-relaxed">
                  Thank you, <span className="font-semibold text-ink">{form.partyName}</span>. Your vendor registration file has been safely logged in our central procurement queue for compliance verification.
                </p>

                {/* Reference ID Card */}
                <div className="my-8 mx-auto max-w-md rounded-none border border-line bg-cream/70 p-6 shadow-xs">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                    Submission Tracking ID
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-forest">
                      {submissionId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink hover:border-forest transition-colors flex items-center gap-1"
                    >
                      {copiedId ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-ink-soft border-t border-line/60 pt-3 flex justify-between">
                    <span>Registered Category:</span>
                    <span className="font-semibold text-ink">{form.category}</span>
                  </div>
                  <div className="mt-1 text-xs text-ink-soft flex justify-between">
                    <span>GSTIN Provided:</span>
                    <span className="font-mono text-ink">{form.gstNumber}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button onClick={() => window.print()} variant="secondary">
                    Print / Save Receipt
                  </Button>
                  <Button onClick={() => go("home")}>
                    Return to Homepage <Arrow />
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10 lg:p-12">
                {/* Honeypot field */}
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

                {/* -------------------------------------------------------- */}
                {/* STEP 1: FIRM PROFILE & CONTACT KYC                        */}
                {/* -------------------------------------------------------- */}
                {currentStep === 1 && (
                  <div className="animate-fadeIn space-y-7">
                    <div className="border-b border-line pb-4 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-bronze font-semibold">
                          Step 01 of 05
                        </span>
                        <h3
                          className="mt-1 text-2xl text-ink font-normal"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Party / Firm Information
                        </h3>
                      </div>
                      <span className="text-xs text-ink-soft hidden sm:block">
                        * Indicates mandatory field
                      </span>
                    </div>

                    {/* Firm Type Selector */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink">
                        Type of Firm <span className="text-bronze">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {FIRM_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, firmType: type }))}
                            className={`rounded-none border px-3 py-2.5 text-xs font-medium transition-all ${
                              form.firmType === type
                                ? "border-forest bg-forest text-paper shadow-xs"
                                : "border-line bg-paper text-ink hover:border-forest/50"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Party Name (Legal Entity Name)" required>
                        <Input
                          name="partyName"
                          required
                          value={form.partyName}
                          onChange={handleInputChange}
                          placeholder="e.g. Royal Fresh Produce LLP"
                        />
                        {errors.partyName && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.partyName}
                          </p>
                        )}
                      </Field>

                      <Field label="Primary Supply Category" required>
                        <Select
                          name="category"
                          required
                          value={form.category}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Select procurement category
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

                      <Field label="Contact Person" required>
                        <Input
                          name="contactPerson"
                          required
                          value={form.contactPerson}
                          onChange={handleInputChange}
                          placeholder="Full legal name"
                        />
                        {errors.contactPerson && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.contactPerson}
                          </p>
                        )}
                      </Field>

                      <Field label="Designation / Role" required>
                        <Input
                          name="designation"
                          required
                          value={form.designation}
                          onChange={handleInputChange}
                          placeholder="e.g. Managing Partner / Director"
                        />
                      </Field>

                      <Field label="Primary Mobile / Phone No." required hint="10-digit registered number">
                        <Input
                          name="phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98200 12345"
                        />
                        {errors.phone && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.phone}
                          </p>
                        )}
                      </Field>

                      <Field label="Alternate Phone No. (Optional)">
                        <Input
                          name="alternatePhone"
                          type="tel"
                          value={form.alternatePhone}
                          onChange={handleInputChange}
                          placeholder="Office landline or alternate"
                        />
                      </Field>

                      <Field label="Corporate Email ID" required>
                        <Input
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleInputChange}
                          placeholder="procurement@vendorfirm.com"
                        />
                        {errors.email && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.email}
                          </p>
                        )}
                      </Field>

                      <Field label="State" required>
                        <Select
                          name="state"
                          required
                          value={form.state}
                          onChange={handleInputChange}
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Address Line 1" required>
                        <Input
                          name="address1"
                          required
                          value={form.address1}
                          onChange={handleInputChange}
                          placeholder="Unit, Building, Estate / Area"
                        />
                        {errors.address1 && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.address1}
                          </p>
                        )}
                      </Field>

                      <Field label="Address Line 2 (Optional)">
                        <Input
                          name="address2"
                          value={form.address2}
                          onChange={handleInputChange}
                          placeholder="Landmark, Street, Industrial Area"
                        />
                      </Field>

                      <Field label="City" required>
                        <Input
                          name="city"
                          required
                          value={form.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Mumbai"
                        />
                        {errors.city && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.city}
                          </p>
                        )}
                      </Field>

                      <Field label="Pin Code" required hint="6-digit postal code">
                        <Input
                          name="pinCode"
                          required
                          value={form.pinCode}
                          onChange={handleInputChange}
                          placeholder="e.g. 400013"
                        />
                        {errors.pinCode && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.pinCode}
                          </p>
                        )}
                      </Field>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 2: STATUTORY & TAX IDENTIFIERS                       */}
                {/* -------------------------------------------------------- */}
                {currentStep === 2 && (
                  <div className="animate-fadeIn space-y-7">
                    <div className="border-b border-line pb-4 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-bronze font-semibold">
                          Step 02 of 05
                        </span>
                        <h3
                          className="mt-1 text-2xl text-ink font-normal"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Statutory &amp; Tax KYC
                        </h3>
                      </div>
                      <span className="text-xs text-ink-soft hidden sm:block">
                        Extracted from GST &amp; KYC sheets
                      </span>
                    </div>

                    <div className="rounded-none border border-line/80 bg-cream/50 p-4 text-xs text-ink-soft flex items-start gap-3">
                      <svg className="h-4 w-4 shrink-0 text-forest mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        All tax identification numbers are verified directly via the GSTN portal and TRACES before purchase orders are generated.
                      </span>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="PAN No. OF THE OWNER / FIRM" required hint="10-digit Permanent Account Number">
                        <Input
                          name="panNumber"
                          required
                          value={form.panNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. ABCDE1234F"
                          className="font-mono uppercase"
                        />
                        {errors.panNumber && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.panNumber}
                          </p>
                        )}
                      </Field>

                      <Field label="GST CERTIFICATE (GSTIN Number)" required hint="15-character Goods & Services Tax ID">
                        <Input
                          name="gstNumber"
                          required
                          value={form.gstNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 27ABCDE1234F1Z5"
                          className="font-mono uppercase"
                        />
                        {errors.gstNumber && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.gstNumber}
                          </p>
                        )}
                      </Field>

                      <Field label="Aadhaar Number of the Owner (Proprietor / Key Partner)" hint="12 digits — required for proprietorship firms">
                        <Input
                          name="aadhaarNumber"
                          value={form.aadhaarNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 123456789012"
                          className="font-mono"
                        />
                        {errors.aadhaarNumber && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.aadhaarNumber}
                          </p>
                        )}
                      </Field>

                      <Field label="FSSAI LICENSE" hint="14 digits — mandatory for Food, Dairy, Bakery & Fresh Produce">
                        <Input
                          name="fssaiNumber"
                          value={form.fssaiNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 11520000000000"
                          className="font-mono"
                        />
                        {errors.fssaiNumber && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.fssaiNumber}
                          </p>
                        )}
                      </Field>

                      <Field label="HSN / SAC Code for Product / Service" hint="Primary 4 to 8 digit tariff code">
                        <Input
                          name="hsnCode"
                          value={form.hsnCode}
                          onChange={handleInputChange}
                          placeholder="e.g. 0401 (Dairy), 2106 (Food Prep), 0709"
                        />
                      </Field>

                      <Field label="Secondary / Additional GSTIN (Optional)">
                        <Input
                          name="additionalGstNumber"
                          value={form.additionalGstNumber}
                          onChange={handleInputChange}
                          placeholder="Additional state registration if applicable"
                          className="font-mono uppercase"
                        />
                      </Field>
                    </div>

                    <Field label="Product / Service Catalogue Summary">
                      <Textarea
                        name="productDescription"
                        value={form.productDescription}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="List specific brands, key SKUs, daily delivery capacity, or pack sizes."
                      />
                    </Field>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 3: BANK & REMITTANCE KYC                             */}
                {/* -------------------------------------------------------- */}
                {currentStep === 3 && (
                  <div className="animate-fadeIn space-y-7">
                    <div className="border-b border-line pb-4 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-bronze font-semibold">
                          Step 03 of 05
                        </span>
                        <h3
                          className="mt-1 text-2xl text-ink font-normal"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Bank Remittance Details
                        </h3>
                      </div>
                      <span className="text-xs text-ink-soft hidden sm:block">
                        Direct NEFT / RTGS Settlement
                      </span>
                    </div>

                    <div className="rounded-none border border-line bg-cream/40 p-4 text-xs text-ink-soft">
                      <span className="font-semibold text-ink">Remittance Policy:</span> The bank account name must exactly match the registered Legal Entity / Party Name provided in Step 1.
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Name of the Bank" required>
                        <Select
                          name="bankName"
                          required
                          value={form.bankName}
                          onChange={handleInputChange}
                        >
                          {MAJOR_BANKS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </Select>
                      </Field>

                      {form.bankName === "Other Bank" && (
                        <Field label="Specify Bank Name" required>
                          <Input
                            name="customBankName"
                            required
                            value={form.customBankName}
                            onChange={handleInputChange}
                            placeholder="Enter bank name"
                          />
                          {errors.customBankName && (
                            <p className="field-error mt-1 text-xs text-red-600 font-medium">
                              {errors.customBankName}
                            </p>
                          )}
                        </Field>
                      )}

                      <Field label="Name of the Branch" required>
                        <Input
                          name="branchName"
                          required
                          value={form.branchName}
                          onChange={handleInputChange}
                          placeholder="e.g. Fort Branch, Mumbai"
                        />
                        {errors.branchName && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.branchName}
                          </p>
                        )}
                      </Field>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink">
                          Account Type <span className="text-bronze">*</span>
                        </label>
                        <div className="flex gap-4">
                          {(["Current", "Savings"] as const).map((type) => (
                            <label
                              key={type}
                              className={`flex flex-1 cursor-pointer items-center justify-center rounded-none border px-4 py-3 text-xs font-medium transition-all ${
                                form.accountType === type
                                  ? "border-forest bg-forest text-paper shadow-xs"
                                  : "border-line bg-paper text-ink hover:border-forest/50"
                              }`}
                            >
                              <input
                                type="radio"
                                name="accountType"
                                value={type}
                                checked={form.accountType === type}
                                onChange={() => setForm((prev) => ({ ...prev, accountType: type }))}
                                className="sr-only"
                              />
                              {type} Account
                            </label>
                          ))}
                        </div>
                      </div>

                      <Field label="Account Number" required>
                        <Input
                          name="accountNumber"
                          type="password"
                          required
                          value={form.accountNumber}
                          onChange={handleInputChange}
                          placeholder="Enter account number"
                          className="font-mono"
                        />
                        {errors.accountNumber && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.accountNumber}
                          </p>
                        )}
                      </Field>

                      <Field label="Confirm Account Number" required>
                        <Input
                          name="confirmAccountNumber"
                          required
                          value={form.confirmAccountNumber}
                          onChange={handleInputChange}
                          placeholder="Re-enter account number"
                          className="font-mono"
                        />
                        {errors.confirmAccountNumber && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.confirmAccountNumber}
                          </p>
                        )}
                      </Field>

                      <Field label="IFSC Code (NEFT / RTGS)" required hint="11-character alphanumeric code">
                        <Input
                          name="ifscCode"
                          required
                          value={form.ifscCode}
                          onChange={handleInputChange}
                          placeholder="e.g. HDFC0000060"
                          className="font-mono uppercase"
                        />
                        {errors.ifscCode && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.ifscCode}
                          </p>
                        )}
                      </Field>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 4: STATUTORY DECLARATIONS & UPLOADS                  */}
                {/* -------------------------------------------------------- */}
                {currentStep === 4 && (
                  <div className="animate-fadeIn space-y-8">
                    <div className="border-b border-line pb-4 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-bronze font-semibold">
                          Step 04 of 05
                        </span>
                        <h3
                          className="mt-1 text-2xl text-ink font-normal"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Compliance Undertakings &amp; Documents
                        </h3>
                      </div>
                      <span className="text-xs text-ink-soft hidden sm:block">
                        E-Invoicing &amp; Sec 206AB Declarations
                      </span>
                    </div>

                    {/* E-Invoicing Declaration Accordion / Box */}
                    <div className="rounded-none border border-line bg-cream/30 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-forest">
                          1. E-Invoicing Declaration under GST Act
                        </span>
                        <span className="font-mono text-[11px] text-ink-soft">Rule 48(4)</span>
                      </div>
                      <p className="text-xs leading-relaxed text-ink-soft">
                        I, <span className="font-semibold text-ink">{form.contactPerson || "Authorized Signatory"}</span>, being authorized signatory of <span className="font-semibold text-ink">{form.partyName || "the Vendor"}</span> holding GSTIN <span className="font-mono text-ink">{form.gstNumber || "pending"}</span>, declare whether e-invoicing provisions are applicable on us.
                      </p>

                      <div className="grid grid-cols-2 gap-3 max-w-sm">
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, einvoicingApplicable: "not_applicable" }))}
                          className={`rounded-none border px-4 py-2.5 text-xs font-medium transition-all ${
                            form.einvoicingApplicable === "not_applicable"
                              ? "border-forest bg-forest text-paper shadow-xs"
                              : "border-line bg-paper text-ink hover:border-forest/50"
                          }`}
                        >
                          Not Applicable
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, einvoicingApplicable: "applicable" }))}
                          className={`rounded-none border px-4 py-2.5 text-xs font-medium transition-all ${
                            form.einvoicingApplicable === "applicable"
                              ? "border-forest bg-forest text-paper shadow-xs"
                              : "border-line bg-paper text-ink hover:border-forest/50"
                          }`}
                        >
                          Applicable
                        </button>
                      </div>
                      {errors.einvoicingApplicable && (
                        <p className="field-error text-xs text-red-600 font-medium">
                          {errors.einvoicingApplicable}
                        </p>
                      )}
                    </div>

                    {/* Section 206AB Declaration */}
                    <div className="rounded-none border border-line bg-cream/30 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-forest">
                          2. Declaration for Section 206AB (Income Tax Act, 1961)
                        </span>
                        <span className="font-mono text-[11px] text-ink-soft">TDS Compliance</span>
                      </div>
                      <p className="text-xs leading-relaxed text-ink-soft">
                        Confirmation regarding filing returns of income for the last two financial years to avoid higher rate of TDS under Section 206AB.
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-none border border-line/70 bg-paper p-3 space-y-2">
                          <span className="text-[11px] font-semibold text-ink">AY 2023-24 (FY 2022-23)</span>
                          <Input
                            name="itrAck1"
                            value={form.itrAck1}
                            onChange={handleInputChange}
                            placeholder="ITR Ack Number"
                            className="text-xs"
                          />
                          <Input
                            name="itrDate1"
                            type="date"
                            value={form.itrDate1}
                            onChange={handleInputChange}
                            className="text-xs"
                          />
                        </div>

                        <div className="rounded-none border border-line/70 bg-paper p-3 space-y-2">
                          <span className="text-[11px] font-semibold text-ink">AY 2024-25 (FY 2023-24)</span>
                          <Input
                            name="itrAck2"
                            value={form.itrAck2}
                            onChange={handleInputChange}
                            placeholder="ITR Ack Number"
                            className="text-xs"
                          />
                          <Input
                            name="itrDate2"
                            type="date"
                            value={form.itrDate2}
                            onChange={handleInputChange}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document Uploads Checklist (From Excel Note 1) */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                        3. Required KYC Documents Checklist (Note 1 in Form)
                      </h4>
                      <p className="text-xs text-ink-soft mb-4">
                        Upload clear scanned PDFs or high-resolution images (max 8MB each).
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* PAN Card */}
                        <div className="rounded-none border border-dashed border-line bg-cream/20 p-4 transition-colors hover:border-forest">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-ink">
                              Scanned copy of PAN Card <span className="text-bronze">*</span>
                            </span>
                            {docs.pan.uploaded && (
                              <span className="text-[11px] text-forest font-semibold flex items-center gap-1">
                                ✓ Uploaded
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            id="upload-pan"
                            className="sr-only"
                            onChange={(e) => handleFileUpload("pan", e.target.files?.[0] || null)}
                          />
                          <label
                            htmlFor="upload-pan"
                            className="cursor-pointer flex items-center justify-between rounded-none border border-line bg-paper px-3 py-2 text-xs text-ink hover:border-forest"
                          >
                            <span className="truncate max-w-[180px]">
                              {docs.pan.name || "Choose PAN File (PDF/Image)"}
                            </span>
                            <span className="text-forest font-semibold">Browse</span>
                          </label>
                          {docs.pan.size && (
                            <div className="mt-1 text-[10px] text-ink-soft">Size: {docs.pan.size}</div>
                          )}
                          {errors.pan && (
                            <p className="field-error mt-1 text-xs text-red-600 font-medium">
                              {errors.pan}
                            </p>
                          )}
                        </div>

                        {/* GST Certificate */}
                        <div className="rounded-none border border-dashed border-line bg-cream/20 p-4 transition-colors hover:border-forest">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-ink">
                              GST Registration Certificate <span className="text-bronze">*</span>
                            </span>
                            {docs.gst.uploaded && (
                              <span className="text-[11px] text-forest font-semibold flex items-center gap-1">
                                ✓ Uploaded
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            id="upload-gst"
                            className="sr-only"
                            onChange={(e) => handleFileUpload("gst", e.target.files?.[0] || null)}
                          />
                          <label
                            htmlFor="upload-gst"
                            className="cursor-pointer flex items-center justify-between rounded-none border border-line bg-paper px-3 py-2 text-xs text-ink hover:border-forest"
                          >
                            <span className="truncate max-w-[180px]">
                              {docs.gst.name || "Choose GST File (PDF/Image)"}
                            </span>
                            <span className="text-forest font-semibold">Browse</span>
                          </label>
                          {docs.gst.size && (
                            <div className="mt-1 text-[10px] text-ink-soft">Size: {docs.gst.size}</div>
                          )}
                          {errors.gst && (
                            <p className="field-error mt-1 text-xs text-red-600 font-medium">
                              {errors.gst}
                            </p>
                          )}
                        </div>

                        {/* Cancelled Cheque */}
                        <div className="rounded-none border border-dashed border-line bg-cream/20 p-4 transition-colors hover:border-forest">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-ink">
                              Scanned Cancelled Cheque <span className="text-bronze">*</span>
                            </span>
                            {docs.cheque.uploaded && (
                              <span className="text-[11px] text-forest font-semibold flex items-center gap-1">
                                ✓ Uploaded
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            id="upload-cheque"
                            className="sr-only"
                            onChange={(e) => handleFileUpload("cheque", e.target.files?.[0] || null)}
                          />
                          <label
                            htmlFor="upload-cheque"
                            className="cursor-pointer flex items-center justify-between rounded-none border border-line bg-paper px-3 py-2 text-xs text-ink hover:border-forest"
                          >
                            <span className="truncate max-w-[180px]">
                              {docs.cheque.name || "Choose Cheque File (PDF/Image)"}
                            </span>
                            <span className="text-forest font-semibold">Browse</span>
                          </label>
                          {docs.cheque.size && (
                            <div className="mt-1 text-[10px] text-ink-soft">Size: {docs.cheque.size}</div>
                          )}
                          {errors.cheque && (
                            <p className="field-error mt-1 text-xs text-red-600 font-medium">
                              {errors.cheque}
                            </p>
                          )}
                        </div>

                        {/* FSSAI / Signed Form */}
                        <div className="rounded-none border border-dashed border-line bg-cream/20 p-4 transition-colors hover:border-forest">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-ink">
                              FSSAI Certificate or Registration Form
                            </span>
                            {docs.fssai.uploaded && (
                              <span className="text-[11px] text-forest font-semibold flex items-center gap-1">
                                ✓ Uploaded
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            id="upload-fssai"
                            className="sr-only"
                            onChange={(e) => handleFileUpload("fssai", e.target.files?.[0] || null)}
                          />
                          <label
                            htmlFor="upload-fssai"
                            className="cursor-pointer flex items-center justify-between rounded-none border border-line bg-paper px-3 py-2 text-xs text-ink hover:border-forest"
                          >
                            <span className="truncate max-w-[180px]">
                              {docs.fssai.name || "Optional / FSSAI (PDF/Image)"}
                            </span>
                            <span className="text-forest font-semibold">Browse</span>
                          </label>
                          {docs.fssai.size && (
                            <div className="mt-1 text-[10px] text-ink-soft">Size: {docs.fssai.size}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Signatory Details */}
                    <div className="grid gap-5 sm:grid-cols-2 pt-4 border-t border-line">
                      <Field label="Authorized Signatory Name" required>
                        <Input
                          name="signatoryName"
                          required
                          value={form.signatoryName}
                          onChange={handleInputChange}
                          placeholder="Legal signatory"
                        />
                        {errors.signatoryName && (
                          <p className="field-error mt-1 text-xs text-red-600 font-medium">
                            {errors.signatoryName}
                          </p>
                        )}
                      </Field>

                      <Field label="Signatory Designation" required>
                        <Input
                          name="signatoryDesignation"
                          required
                          value={form.signatoryDesignation || form.designation}
                          onChange={handleInputChange}
                          placeholder="e.g. Partner / Director"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 5: REVIEW & DIGITAL SIGN-OFF                         */}
                {/* -------------------------------------------------------- */}
                {currentStep === 5 && (
                  <div className="animate-fadeIn space-y-7">
                    <div className="border-b border-line pb-4 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-bronze font-semibold">
                          Step 05 of 05
                        </span>
                        <h3
                          className="mt-1 text-2xl text-ink font-normal"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Review &amp; Digital Authorization
                        </h3>
                      </div>
                      <span className="text-xs text-ink-soft hidden sm:block">
                        Final Confirmation
                      </span>
                    </div>

                    {/* KYC Summary Card */}
                    <div className="rounded-none border border-line bg-cream/40 p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-line/60 pb-3">
                        <div>
                          <span className="text-xs font-mono uppercase tracking-wider text-bronze">Entity</span>
                          <h4 className="text-lg font-semibold text-ink">{form.partyName || "Not Provided"}</h4>
                          <p className="text-xs text-ink-soft">{form.firmType} &bull; {form.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-xs font-semibold text-forest hover:underline"
                        >
                          Edit Profile
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 text-xs">
                        <div>
                          <span className="text-ink-soft block">PAN Number:</span>
                          <span className="font-mono font-semibold text-ink">{form.panNumber}</span>
                        </div>
                        <div>
                          <span className="text-ink-soft block">GSTIN:</span>
                          <span className="font-mono font-semibold text-ink">{form.gstNumber}</span>
                        </div>
                        <div>
                          <span className="text-ink-soft block">FSSAI License:</span>
                          <span className="font-mono font-semibold text-ink">{form.fssaiNumber || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-ink-soft block">Bank:</span>
                          <span className="font-semibold text-ink">{form.bankName === "Other Bank" ? form.customBankName : form.bankName}</span>
                        </div>
                        <div>
                          <span className="text-ink-soft block">IFSC Code:</span>
                          <span className="font-mono font-semibold text-ink">{form.ifscCode}</span>
                        </div>
                        <div>
                          <span className="text-ink-soft block">Account:</span>
                          <span className="font-mono font-semibold text-ink">
                            •••• {form.accountNumber.slice(-4)} ({form.accountType})
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                        <span className="text-ink-soft">Uploaded KYC Verification Documents:</span>
                        <span className="font-semibold text-forest">
                          {[docs.pan.uploaded, docs.gst.uploaded, docs.cheque.uploaded].filter(Boolean).length} of 3 Mandatory Attached
                        </span>
                      </div>
                    </div>

                    {/* Statutory Undertaking Checkbox */}
                    <div className="rounded-none border border-line bg-paper p-5 space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="finalConsent"
                          checked={form.finalConsent}
                          onChange={(e) => {
                            setForm((prev) => ({ ...prev, finalConsent: e.target.checked }))
                            if (errors.finalConsent) {
                              setErrors((prev) => {
                                const next = { ...prev }
                                delete next.finalConsent
                                return next
                              })
                            }
                          }}
                          className="mt-1 h-4 w-4 rounded-none border-line text-forest focus:ring-forest"
                        />
                        <span className="text-xs leading-relaxed text-ink-soft">
                          <strong className="text-ink">Authorised Signatory Undertaking:</strong> I hereby certify that the information, bank credentials, and tax declarations furnished above are true, complete, and legally binding under applicable GST, FSSAI, and Section 206AB Income Tax statutes. I authorize Leo Hospitality &amp; Ventures LLP to verify these records for vendor code creation and automated payment remittance.
                        </span>
                      </label>
                      {errors.finalConsent && (
                        <p className="field-error text-xs text-red-600 font-medium pl-7">
                          {errors.finalConsent}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* NAVIGATION CONTROLS */}
                <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handlePrevStep}
                      disabled={isSubmitting}
                    >
                      ← Previous Step
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 5 ? (
                    <Button type="button" onClick={handleNextStep} className="group">
                      Turn Page to Folio 0{currentStep + 1}
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 ml-1 font-sans">📖 →</span>
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-paper" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Verifying &amp; Registering KYC...
                        </span>
                      ) : (
                        <>
                          Transmit Official KYC Form <Arrow />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            )}
            </div>
          </div>

          {/* Trust and Why Partner Banner */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-none border border-line bg-forest-deep p-8 text-paper">
              <h3 className="font-display text-2xl text-bronze">
                Empanelment Standards
              </h3>
              <p className="mt-2 text-xs text-paper/70 leading-relaxed">
                All submitted vendor dossiers are processed by our internal compliance team within 3 to 5 business days. Approved partners receive vendor codes for centralized ERP invoicing.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-paper/90">
                <li className="flex items-center gap-2">
                  <span className="text-bronze">✓</span> Daily purchase orders with direct kitchen tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-bronze">✓</span> Strict compliance with FSSAI hygiene standards
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-bronze">✓</span> Scheduled bi-weekly &amp; monthly NEFT remittance
                </li>
              </ul>
            </div>

            <div className="rounded-none border border-line bg-paper p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-bronze">Direct Assistance</span>
                <h3
                  className="mt-1 text-2xl text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Vendor Desk Support
                </h3>
                <p className="mt-2 text-xs text-ink-soft leading-relaxed">
                  Have questions regarding your GST filing, volume supply capabilities, or document requirements? Reach our vendor relations desk directly.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-forest">
                <a
                  href="mailto:connect@leohospitality.in"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  connect@leohospitality.in →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Vendor
