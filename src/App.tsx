import { useEffect, useState, type ReactElement } from "react"
import type { PageId } from "./lib/pages"
import { Nav } from "./components/Nav"
import { Footer } from "./components/Footer"
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

  const go = (p: PageId) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  useEffect(() => {
    document.title = "Leo Hospitality & Ventures LLP — Creating Experiences"
  }, [])

  const overHero = page === "home"

  const PAGES: Record<PageId, ReactElement> = {
    home: <Home go={go} />,
    about: <About go={go} />,
    ventures: <Ventures go={go} />,
    services: <Services go={go} />,
    experience: <Experience go={go} />,
    gallery: <Gallery go={go} />,
    franchise: <Franchise go={go} />,
    careers: <Careers go={go} />,
    vendor: <Vendor go={go} />,
    contact: <Contact go={go} />,
  }

  return (
    <div className="min-h-full bg-cream">
      <Nav page={page} go={go} overHero={overHero} />
      <main>{PAGES[page]}</main>
      <Footer go={go} />
    </div>
  )
}
