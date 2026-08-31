import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react"

/* ---------- Imagery ---------- */
const u = (id: string, w = 1400, h = 1000) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

export const IMG = {
  heroInterior: u("photo-1667388969250-1c7220bf3f37", 2000, 1300),
  bodhiTree: u("photo-1636405189493-181ecf851006", 1200, 1500),
  diningRoom: u("photo-1679312061521-d7d619a8cfb7", 1200, 1500),
  lamps: u("photo-1552960226-639240203497", 1600, 1000),
  woodTable: u("photo-1602232037779-30b01ac3c457", 1200, 1500),
  breakfast: u("photo-1782852364023-16bac0b4b664", 1200, 1400),
  souffle: u("photo-1762631934838-b13725dc85e5", 1400, 1000),
  latteArt: u("photo-1760306081298-93e10f2be897", 1200, 1500),
  pieLatte: u("photo-1770820768473-4ab1bfc87a93", 1200, 1500),
  dessertPlatter: u("photo-1774921664989-8b414d43407f", 1400, 1000),
  coffeeHand: u("photo-1770199062670-c76b46db2f25", 1200, 1500),
  deliveryBag: u("photo-1600728619239-d2a73f7aa541", 1400, 1000),
  containers: u("photo-1580680849701-fb0eebfb2c28", 1200, 1500),
  chefBoard: u("photo-1622021142947-da7dedc7c39a", 1600, 1000),
  chefBowl: u("photo-1581349485608-9469926a8e5e", 1200, 1500),
  chefPrep: u("photo-1577219492769-b63a779fac28", 1200, 1500),
  chefKnife: u("photo-1566554273541-37a9ca77b91f", 1200, 1500),
  chefSink: u("photo-1629407119384-d42320c3e576", 1600, 1000),
  eventDessert: u("photo-1729875749490-cb5984d780ec", 1400, 1000),
  cupcakes: u("photo-1583331030773-1ac64d1d00db", 1200, 1500),
}

/* ---------- Reveal on scroll ---------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: any
}) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag
      ref={ref as any}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${seen ? "in" : ""} ${className}`}
    >
      {children}
    </Tag>
  )
}

/* ---------- Buttons ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "light"
}
export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: BtnProps) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest focus-visible:ring-offset-cream disabled:opacity-50"
  const styles: Record<string, string> = {
    primary:
      "btn-wipe-primary text-paper shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]",
    secondary: "btn-wipe-secondary text-ink",
    ghost: "text-ink hover:text-forest",
    light: "btn-wipe-light text-paper backdrop-blur-sm",
  }
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function Arrow() {
  return (
    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  )
}

/* ---------- Section label ---------- */
export function Kicker({
  children,
  tone = "forest",
}: {
  children: ReactNode
  tone?: "forest" | "bronze" | "light"
}) {
  const c =
    tone === "light"
      ? "text-paper/70"
      : tone === "bronze"
        ? "text-bronze"
        : "text-forest"
  return (
    <span className={`kicker flex items-center gap-3 ${c}`}>
      <span className="h-px w-8 bg-current opacity-60" />
      {children}
    </span>
  )
}

/* ---------- Form fields ---------- */
export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline gap-1 text-[0.82rem] font-medium tracking-wide text-ink-soft">
        {label}
        {required && <span className="text-bronze">*</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs text-ink-soft/80">{hint}</span>
      )}
    </label>
  )
}

const inputCls =
  "w-full rounded-none border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 transition-colors duration-200 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const id = props.id || props.name || undefined
  return <input id={id} className={inputCls} {...props} />
}
export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const id = props.id || props.name || undefined
  return (
    <textarea id={id} rows={4} className={`${inputCls} resize-y`} {...props} />
  )
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = props.id || props.name || undefined
  return (
    <select
      id={id}
      className={`${inputCls} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%235b544a%22 stroke-width=%221.6%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}
      {...props}
    />
  )
}

export function FileField({
  label,
  required,
  hint,
  name,
  onChangeFile,
}: {
  label: string
  required?: boolean
  hint?: string
  name: string
  onChangeFile?: (file: File | null, error: string | null) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    if (!selected) {
      setFile(null)
      setError(null)
      if (onChangeFile) onChangeFile(null, null)
      return
    }

    // Type check (accept PDF, JPG, JPEG, PNG)
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ]
    if (
      !allowedTypes.includes(selected.type) &&
      !selected.name.toLowerCase().endsWith(".pdf") &&
      !selected.name.toLowerCase().endsWith(".jpg") &&
      !selected.name.toLowerCase().endsWith(".jpeg") &&
      !selected.name.toLowerCase().endsWith(".png")
    ) {
      const err = "Invalid file type. Please upload a PDF, JPG, or PNG."
      setError(err)
      setFile(null)
      if (onChangeFile) onChangeFile(null, err)
      return
    }

    // Size check (5MB limit)
    if (selected.size > 5 * 1024 * 1024) {
      const err = "File exceeds the 5MB size limit."
      setError(err)
      setFile(null)
      if (onChangeFile) onChangeFile(null, err)
      return
    }

    setError(null)
    setFile(selected)
    if (onChangeFile) onChangeFile(selected, null)
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onChangeFile) onChangeFile(null, null)
  }

  return (
    <div className="block">
      <Field label={label} required={required} hint={hint}>
        <div className="relative">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-none border border-dashed border-line bg-paper px-4 py-3.5 text-sm transition-colors hover:border-forest focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/20">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest font-semibold">
                ↑
              </span>
              <span
                className={file ? "text-ink font-medium" : "text-ink-soft/70"}
              >
                {file ? file.name : "Choose file — PDF, JPG or PNG (Max 5MB)"}
              </span>
            </div>
            {file && (
              <button
                onClick={handleRemoveFile}
                className="p-1 text-xs font-semibold text-bronze hover:text-forest focus:outline-none"
                type="button"
                aria-label="Remove uploaded file"
              >
                Remove
              </button>
            )}
            <input
              type="file"
              id={name}
              ref={fileInputRef}
              name={name}
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </Field>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}

/* ---------- Prefers Reduced Motion Hook ---------- */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}
