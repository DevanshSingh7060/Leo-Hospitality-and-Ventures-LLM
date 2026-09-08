import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import heroInterior from "../assets/heroInterior.jpg"
import bodhiTree from "../assets/bodhiTree.jpg"
import diningRoom from "../assets/diningRoom.jpg"
import lamps from "../assets/lamps.jpg"
import woodTable from "../assets/woodTable.jpg"
import breakfast from "../assets/breakfast.jpg"
import souffle from "../assets/souffle.jpg"
import latteArt from "../assets/latteArt.jpg"
import pieLatte from "../assets/pieLatte.jpg"
import dessertPlatter from "../assets/dessertPlatter.jpg"
import greeting from "../assets/greeting.svg"
import deliveryBag from "../assets/deliveryBag.jpg"
import containers from "../assets/containers.jpg"
import chefBoard from "../assets/chefBoard.jpg"
import chefBowl from "../assets/chefBowl.jpg"
import chefPrep from "../assets/chefPrep.jpg"
import chefKnife from "../assets/chefKnife.jpg"
import chefSink from "../assets/chefSink.jpg"
import eventDessert from "../assets/eventDessert.jpg"
import cupcakes from "../assets/cupcakes.jpg"

gsap.registerPlugin(ScrollTrigger)

/* ---------- Imagery (bundled locally so images load same-origin) ---------- */
export const IMG = {
  heroInterior,
  bodhiTree,
  diningRoom,
  lamps,
  woodTable,
  breakfast,
  souffle,
  latteArt,
  pieLatte,
  dessertPlatter,
  greeting,
  deliveryBag,
  containers,
  chefBoard,
  chefBowl,
  chefPrep,
  chefKnife,
  chefSink,
  eventDessert,
  cupcakes,
}

/* ---------- Reveal on scroll ---------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  style,
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: any
  style?: React.CSSProperties
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
      style={{ transitionDelay: `${delay}ms`, ...style }}
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
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest focus-visible:ring-offset-cream active:scale-[0.97] motion-reduce:active:scale-100 disabled:opacity-50 disabled:active:scale-100"
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
    <label className="group block">
      <span className="mb-2 flex items-baseline gap-1 text-[0.82rem] font-medium tracking-wide text-ink-soft transition-colors duration-200 group-focus-within:text-forest">
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
        <p className="field-error mt-1 text-xs text-red-600 font-medium">{error}</p>
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

/* ---------- Subtle scroll parallax (GSAP, reduced-motion aware) ---------- */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  { amount = 8 }: { amount?: number } = {},
) {
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const anim = gsap.to(el, {
      yPercent: amount,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
    return () => {
      anim.scrollTrigger?.kill()
      anim.kill()
    }
  }, [ref, amount, reduced])
}

/* ---------- Interactive Mouse-Reactive Spotlight Card ---------- */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(169, 129, 79, 0.16)",
  spotlightSize = 380,
  onClick,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: {
  children: ReactNode
  className?: string
  spotlightColor?: string
  spotlightSize?: number
  onClick?: () => void
  style?: React.CSSProperties
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
  [key: string]: any
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true)
    if (onMouseEnter) onMouseEnter(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false)
    if (onMouseLeave) onMouseLeave(e)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      {/* Interactive cursor spotlight */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(${spotlightSize}px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}
      {children}
    </div>
  )
}

