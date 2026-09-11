import { useEffect, useState } from "react"
import { Nav } from "./components/Nav"
import { Footer } from "./components/Footer"
import { IntroSplash } from "./components/IntroSplash"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Ventures } from "./pages/Ventures"
import { Services } from "./pages/Services"
import { Experience } from "./pages/Experience"
import { Gallery } from "./pages/Gallery"
import { Franchise } from "./pages/Franchise"
import { Careers } from "./pages/Careers"
import { Vendor } from "./pages/Vendor"
import { Contact } from "./pages/Contact"

const VALID_PAGES = [
  "home",
  "about",
  "ventures",
  "services",
  "experience",
  "gallery",
  "franchise",
  "careers",
  "vendor",
  "contact",
]

const getPageFromHash = () => {
  if (typeof window === "undefined") return "home"
  const hash = window.location.hash.replace(/^#\/?/, "")
  return VALID_PAGES.includes(hash) ? hash : "home"
}

const PAGE_TITLES = {
  home: "Leo Hospitality & Ventures LLP — Creating Experiences",
  about: "About Us — Leo Hospitality & Ventures LLP",
  ventures: "Our Ventures — Leo Hospitality & Ventures LLP",
  services: "Services & Capabilities — Leo Hospitality & Ventures LLP",
  experience: "Past Projects & Experience — Leo Hospitality & Ventures LLP",
  gallery: "Gallery — Leo Hospitality & Ventures LLP",
  franchise:
    "Franchise & Business Opportunities — Leo Hospitality & Ventures LLP",
  careers: "Careers — Leo Hospitality & Ventures LLP",
  vendor: "Vendor Registration & KYC Portal — Leo Hospitality & Ventures LLP",
  contact: "Contact Executive Desk — Leo Hospitality & Ventures LLP",
}

export default function App() {
  const [page, setPage] = useState(getPageFromHash)
  // Intro splash is on hold — kept wired but disabled. Flip to `true` to re-enable.
  const [showIntro, setShowIntro] = useState(false) // just to on banner make it true

  const go = (p) => {
    setPage(p)
    if (typeof window !== "undefined") {
      const newHash = p === "home" ? "" : `#${p}`
      if (window.location.hash !== newHash) {
        window.history.pushState(
          null,
          "",
          window.location.pathname + (newHash || ""),
        )
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  // Handle browser Back / Forward buttons and manual hash changes in URL
  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromHash())
    }

    window.addEventListener("popstate", handlePopState)
    window.addEventListener("hashchange", handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("hashchange", handlePopState)
    }
  }, [])

  useEffect(() => {
    document.title =
      PAGE_TITLES[page] ||
      "Leo Hospitality & Ventures LLP — Creating Experiences"
  }, [page])

  // Enable full-section scroll-snap only on the Home page.
  useEffect(() => {
    const root = document.documentElement
    if (page === "home") root.classList.add("snap-page")
    else root.classList.remove("snap-page")
    return () => root.classList.remove("snap-page")
  }, [page])

  const overHero = page === "home"

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home go={go} />
      case "about":
        return <About go={go} />
      case "ventures":
        return <Ventures go={go} />
      case "services":
        return <Services go={go} />
      case "experience":
        return <Experience go={go} />
      case "gallery":
        return <Gallery go={go} />
      case "franchise":
        return <Franchise go={go} />
      case "careers":
        return <Careers go={go} />
      case "vendor":
        return <Vendor go={go} />
      case "contact":
        return <Contact go={go} />
    }
  }

  return (
    <div className="min-h-full bg-cream">
      {showIntro && <IntroSplash onEnter={() => setShowIntro(false)} />}
      <Nav page={page} go={go} overHero={overHero} />
      <main id="main-content">
        <div key={page} className="page-enter">
          {renderPage()}
        </div>
      </main>
      <Footer go={go} />
    </div>
  )
}
