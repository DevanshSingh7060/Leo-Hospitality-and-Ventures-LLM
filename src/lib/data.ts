import { IMG } from "./ui"
import type { PageId } from "./pages"

export interface Venture {
  id: string
  tag: string
  name: string
  tagline: string
  copy: string
  points: string[]
  images: [string, string]
  floatingAsset: {
    type: "svg" | "image"
    src?: string
    svgPath?: string
    style: React.CSSProperties
  }[]
  cta?: PageId
}

export const VENTURES_DATA: Venture[] = [
  {
    id: "bodhi-tree",
    tag: "Café · Restaurant",
    name: "Café Bodhi Tree",
    tagline: "Ambience-led café and restaurant experience.",
    copy: "A premium all-day dining space designed around warm, welcoming aesthetics and detail-oriented operational standards. Featuring speciality coffee and ingredient-led menus that cultivate a loyal local community.",
    points: [
      "All-day café & light restaurant format",
      "Speciality coffee programme",
      "Seasonal, ingredient-led menu",
      "Designed for community & regulars",
    ],
    images: [IMG.bodhiTree, IMG.latteArt],
    floatingAsset: [
      {
        type: "svg",
        // Leaf motif SVG path
        svgPath:
          "M12 2C11.5 2 6 6 6 12C6 15.3 8.7 18 12 18C15.3 18 18 15.3 18 12C18 6 12.5 2 12 2ZM12 16C9.8 16 8 14.2 8 12C8 9.5 11 6.2 12 5.2C13 6.2 16 9.5 16 12C16 14.2 14.2 16 12 16Z",
        style: {
          top: "15%",
          right: "12%",
          width: "90px",
          height: "90px",
          opacity: 0.85,
          color: "var(--color-bronze)",
        },
      },
      {
        type: "svg",
        // Coffee cup outline SVG path
        svgPath:
          "M2 5v8c0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4V5H2zm14 3h1.5c1.4 0 2.5-1.1 2.5-2.5S18.9 3 17.5 3H16v5zm-14 11h16v2H2v-2z",
        style: {
          bottom: "25%",
          left: "8%",
          width: "80px",
          height: "80px",
          opacity: 0.7,
          color: "var(--color-forest)",
        },
      },
    ],
  },
  {
    id: "ryvive-roots",
    tag: "Cloud Kitchen · Franchise-ready",
    name: "Ryvive Roots Cloud Kitchen",
    tagline: "Operational delivery-first kitchen ventures built for scale.",
    copy: "A standardized cloud kitchen operation engineered for consistent food preparation, rapid delivery logistics, and clean franchise expansion playbooks across cities.",
    points: [
      "Standardised recipes & prep systems",
      "Multi-aggregator delivery operations",
      "Turnkey franchise & partnership model",
      "Unit economics designed for scale",
    ],
    images: [IMG.deliveryBag, IMG.containers],
    floatingAsset: [
      {
        type: "svg",
        // Plate and fork/spoon chef motif SVG path
        svgPath:
          "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z",
        style: {
          top: "20%",
          left: "10%",
          width: "100px",
          height: "100px",
          opacity: 0.7,
          color: "var(--color-bronze)",
        },
      },
      {
        type: "svg",
        // Chef hat silhouette path
        svgPath:
          "M12 3a6 6 0 0 0-5.9 5 3 3 0 0 0-2.1 2.8c0 1.2.7 2.2 1.7 2.7A2 2 0 0 0 7 17h10a2 2 0 0 0 1.3-3.5c1-.5 1.7-1.5 1.7-2.7a3 3 0 0 0-2.1-2.8A6 6 0 0 0 12 3zm0 2c2.2 0 4 1.8 4 4H8c0-2.2 1.8-4 4-4z",
        style: {
          bottom: "18%",
          right: "10%",
          width: "90px",
          height: "90px",
          opacity: 0.8,
          color: "var(--color-forest)",
        },
      },
    ],
    cta: "franchise",
  },
]

export interface Project {
  number: string
  name: string
  loc: string
  type: string
  img: string
  description: string
}

export const PROJECTS_DATA: Project[] = [
  {
    number: "01",
    name: "Lord of the Drinks",
    loc: "Mumbai",
    type: "Restaurant & Bar",
    img: IMG.lamps,
    description:
      "Operated high-volume service corridors with rigorous cost management, setting new local benchmarks for beverage logistics and premium crowd handling.",
  },
  {
    number: "02",
    name: "Tea Villa Café",
    loc: "Juhu & Malad",
    type: "Café — Multi-outlet",
    img: IMG.pieLatte,
    description:
      "Standardised menu preparation timelines and service blueprints across multiple prime properties, boosting average customer ticket size by 24%.",
  },
  {
    number: "03",
    name: "M&S Food Factory",
    loc: "Operations",
    type: "Restaurant & Kitchen",
    img: IMG.woodTable,
    description:
      "Designed back-of-house assembly layouts that expedited order dispatch during heavy peak dining hours while preserving strict culinary plating standards.",
  },
  {
    number: "04",
    name: "M&S Dessert Factory",
    loc: "Operations",
    type: "Dessert Concept",
    img: IMG.souffle,
    description:
      "Introduced cold-chain inventory protocols and a signature pastry lineup that improved customer retention rates and minimized ingredient shrinkage.",
  },
  {
    number: "05",
    name: "Belge Cakes",
    loc: "Events",
    type: "Event Catering & Retail",
    img: IMG.eventDessert,
    description:
      "Engineered bespoke celebration setups and catered high-profile corporate events, combining visual showmanship with kitchen precision.",
  },
]

export interface Service {
  n: string
  t: string
  d: string
  caps: string[]
  svgIcon: string // SVG path or path components
}

export const SERVICES_DATA: Service[] = [
  {
    n: "01",
    t: "Restaurant & Café Management",
    d: "Full operational ownership of your venue — from the pass to the P&L.",
    caps: [
      "Daily operations & service standards",
      "Staffing, recruitment & training",
      "Cost control & P&L management",
      "Vendor & inventory management",
      "Guest experience & feedback loops",
    ],
    // clipboard/checklist icon
    svgIcon:
      "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9h4m-4 4h6",
  },
  {
    n: "02",
    t: "Concept & Menu Development",
    d: "Positioning and culinary identity that give a venue a reason to exist.",
    caps: [
      "Concept & positioning strategy",
      "Menu engineering & costing",
      "Recipe standardisation & training",
      "Beverage & coffee programmes",
      "Food styling & menu direction",
    ],
    // knife/fork/culinary signature icon
    svgIcon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
  {
    n: "03",
    t: "Pre-Opening & Setup",
    d: "Everything between a bare shell and a confident opening night.",
    caps: [
      "Site assessment & kitchen planning",
      "Equipment & supplier sourcing",
      "Licensing & compliance support",
      "Recruitment & pre-opening training",
      "Soft-launch & launch choreography",
    ],
    // building/compass icon
    svgIcon: "M12 22V12m0 0 4-4m-4 4-4-4M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0z",
  },
  {
    n: "04",
    t: "Cloud Kitchen Operations",
    d: "Delivery-first kitchens built for consistency, speed and scale.",
    caps: [
      "Delivery-optimised kitchen layout",
      "Aggregator onboarding & strategy",
      "Packaging & food-safety systems",
      "Multi-brand kitchen operations",
      "Performance & rating management",
    ],
    // kitchen stove / network icon
    svgIcon: "M4 4h16v16H4V4zm4 4h8v8H8V8z",
  },
  {
    n: "05",
    t: "Business Partnerships",
    d: "Franchise, JV and management models that align everyone's interests.",
    caps: [
      "Franchise structuring & playbooks",
      "Management & revenue-share models",
      "Joint ventures & investments",
      "Multi-outlet expansion strategy",
      "Ongoing partner support",
    ],
    // handshake icon
    svgIcon:
      "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m16-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
]

export const GALLERY_PHOTOS_DATA = [
  { src: IMG.diningRoom, cat: "Restaurants & Cafés" as const, span: true },
  { src: IMG.latteArt, cat: "Food & Beverages" as const },
  { src: IMG.chefKnife, cat: "Behind the Scenes" as const },
  { src: IMG.eventDessert, cat: "Events" as const, span: true },
  { src: IMG.souffle, cat: "Food & Beverages" as const },
  { src: IMG.chefBoard, cat: "Team & Operations" as const },
  { src: IMG.bodhiTree, cat: "Restaurants & Cafés" as const },
  { src: IMG.containers, cat: "Projects" as const },
  { src: IMG.cupcakes, cat: "Events" as const },
  { src: IMG.chefBowl, cat: "Team & Operations" as const },
  { src: IMG.pieLatte, cat: "Food & Beverages" as const, span: true },
  { src: IMG.chefSink, cat: "Behind the Scenes" as const },
  { src: IMG.woodTable, cat: "Restaurants & Cafés" as const },
  { src: IMG.deliveryBag, cat: "Projects" as const },
  { src: IMG.dessertPlatter, cat: "Food & Beverages" as const },
]

export const STATS_DATA = [
  { value: 10, label: "Years of Experience", suffix: "+" },
  { value: 15, label: "Ventures Managed", suffix: "+" },
  { value: 5, label: "Cities & Locations", suffix: "+" },
]
