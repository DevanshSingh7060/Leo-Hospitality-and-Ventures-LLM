import { useEffect, useState } from "react"
import type { PageId } from "./lib/pages"
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

export default function App() {
  const [page, setPage] = useState<PageId>("home")
  // Intro splash is on hold — kept wired but disabled. Flip to `true` to re-enable.
  const [showIntro, setShowIntro] = useState(false) // just to on banner make it true

  const go = (p: PageId) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  useEffect(() => {
    document.title = "Leo Hospitality & Ventures LLP — Creating Experiences"
  }, [])

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
      case "home": return <Home go={go} />
      case "about": return <About go={go} />
      case "ventures": return <Ventures go={go} />
      case "services": return <Services go={go} />
      case "experience": return <Experience go={go} />
      case "gallery": return <Gallery go={go} />
      // case "franchise": return <Franchise go={go} />
      case "careers": return <Careers go={go} />
      case "vendor": return <Vendor go={go} />
      case "contact": return <Contact go={go} />
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
