# Audit Refactorization — How Each Issue Was Fixed

Date: 2026-09-03
Based on: `audit.md` dated 2026-09-02

---

## 1. Critical — Type-Checking / Bugs

### 1.1 Syntax error in `Nav.tsx`
**File:** `src/components/Nav.tsx:5`
**Fix:** Added missing semicolon in the type annotation.
```ts
// Before
export const NAV_ITEMS: { id: PageId label: string }[] = [
// After
export const NAV_ITEMS: { id: PageId; label: string }[] = [
```

### 1.2 Wrong type on `requiredFields` in every form page
**Files:** `src/pages/Franchise.tsx:104`, `src/pages/Careers.tsx:103`, `src/pages/Contact.tsx:85`, `src/pages/Vendor.tsx:115`
**Fix:** Added parentheses to correctly parse the array type.
```ts
// Before
const requiredFields: keyof typeof form[] = [ "name", ... ]
// After
const requiredFields: (keyof typeof form)[] = [ "name", ... ]
```
This ensures `keyof typeof form` is applied to the form object type, not to the array.

### 1.3 `disabled` attribute on `<div>` — type error and functional bug
**Files:** `src/pages/Franchise.tsx`, `src/pages/Careers.tsx`, `src/pages/Contact.tsx`, `src/pages/Vendor.tsx`
**Fix:** Replaced `<div disabled={submitting}>` with `<fieldset disabled={submitting}>` in Franchise, Careers, and Contact form pages. `<fieldset>` natively propagates `disabled` to all descendant form controls, which `<div>` does not. In Vendor.tsx, the stray `<div disabled={submitting}>` wrapper around the "Additional Message" field was changed to a plain `<div>` (since it was the only non-fieldset wrapper and didn't need disabling). The `<div disabled>` on the CV upload and note sections in Careers.tsx was also removed since those elements don't need a disabled wrapper.

### 1.4 Ref callback returns a value
**File:** `src/pages/Home.tsx:285`
**Fix:** Changed the arrow function from an implicit return to a block body so it returns `void`.
```tsx
// Before
ref={(el) => (tabRefs.current[idx] = el)}
// After
ref={(el) => { tabRefs.current[idx] = el }}
```
In React 19, ref callbacks must either return `void` or a cleanup function. Returning the assigned element triggers a type error and dev warnings.

### 1.5 `go(cta)` passes `string` where `PageId` required
**Files:** `src/pages/Ventures.tsx:93`, `src/lib/data.ts:17`
**Fix:** Changed the `cta` field on the `Venture` interface from `string` to `PageId`, and added the `PageId` import to `data.ts`. This provides proper type safety at the source. Additionally, in `Ventures.tsx`, added `as PageId` cast as a safety measure.
```ts
// data.ts — Before
cta?: string
// data.ts — After
cta?: PageId
```

---

## 2. Functional Flaws

### 2.1 `animate-fadeIn` class does nothing
**File:** `src/index.css`
**Fix:** Added the missing `@keyframes fadeIn` animation and `.animate-fadeIn` utility class.
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

.animate-fadeIn {
  animation: fadeIn 350ms ease-out both;
}
```
This makes the fade-in animation work on tab-switch content in `Home.tsx` and on success panels in Contact, Vendor, Franchise, and Careers.

### 2.2 Skip link points to non-existent target and is duplicated
**Files:** `src/App.tsx`, `src/pages/Ventures.tsx`
**Fix:**
- Added `id="main-content"` to the `<main>` element in `App.tsx` so the skip link anchor target exists.
- Removed the `SkipLink` component and its render from `Ventures.tsx`. Since the skip link is now handled at the app root level (or can be added once in `App.tsx` if desired), the per-section duplicates are eliminated.

### 2.6 Above-the-fold hero image is lazy-loaded (hurts LCP)
**File:** `src/components/PageHero.tsx`
**Fix:** Changed `loading="lazy"` to `loading="eager"` and added `fetchPriority="high"` on the hero image.
```tsx
// Before
<img src={image} alt="" className="..." loading="lazy" />
// After
<img src={image} alt="" className="..." loading="eager" fetchPriority="high" />
```
This ensures the Largest Contentful Paint (LCP) element loads immediately rather than being deferred.

---

## 3. Accessibility

### 3.1 Closed mobile menu stays in the tab order
**File:** `src/components/Nav.tsx`
**Fix:** Added `aria-hidden={!open}` and `inert={!open ? true : undefined}` to the mobile menu overlay `<div>`. When the menu is closed, `inert` removes all descendant elements from the tab order and `aria-hidden` hides them from screen readers.
```tsx
<div
  className={`fixed inset-0 z-40 ... ${open ? "translate-x-0" : "translate-x-full"}`}
  aria-hidden={!open}
  inert={!open ? true : undefined}
>
```

### 3.2 Lightbox is not a proper modal
**File:** `src/pages/Gallery.tsx`
**Fix:** Added `aria-modal="true"` to the lightbox dialog element.
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label="Image Lightbox"
>
```
This tells assistive technology that the dialog is modal and content outside it is inert. (Full focus trapping and focus restore would require additional JavaScript — noted as a further improvement.)

### 3.3 Honeypot wrapper misuses `aria-hidden` as a CSS class
**Files:** `src/pages/Franchise.tsx`, `src/pages/Careers.tsx`, `src/pages/Contact.tsx`, `src/pages/Vendor.tsx`
**Fix:** Removed `aria-hidden` from the `className` string and added it as a proper HTML attribute.
```tsx
// Before
<div className="sr-only aria-hidden pointer-events-none">
// After
<div className="sr-only pointer-events-none" aria-hidden="true">
```

---

## 4. Architecture & SEO

### 4.2 All page elements are constructed on every render
**File:** `src/App.tsx`
**Fix:** Replaced the `PAGES` record (which eagerly constructed all 10 page elements on every render) with a `renderPage()` function that uses a `switch` statement to render only the active page.
```tsx
// Before — all 10 elements created every render
const PAGES: Record<PageId, ReactElement> = { home: <Home />, about: <About />, ... }
<main>{PAGES[page]}</main>

// After — only the active page element is created
const renderPage = () => {
  switch (page) {
    case "home": return <Home go={go} />
    case "about": return <About go={go} />
    // ...
  }
}
<main id="main-content">{renderPage()}</main>
```
Also removed the unused `ReactElement` type import.

---

## 5. Tooling & Dependencies

### 5.1 Removed unnecessary `ci` dependency
**File:** `package.json`
**Fix:** Removed `"ci": "^2.3.0"` from `dependencies`. This package was never imported anywhere in the codebase and was likely installed accidentally via `npm i ci` (mistyped `npm ci`).

### 5.2 Removed duplicate lockfile
**File:** `package-lock.json`
**Fix:** Deleted `package-lock.json`. The project uses pnpm (as specified in `.mise.toml` and `AGENTS.md`), so `pnpm-lock.yaml` is the canonical lockfile.

### 5.3 Vite config forward-compat warnings
**File:** `vite.config.ts`
**Fix:**
1. Replaced `__dirname` with `import.meta.dirname` (line 31) — `__dirname` is a CommonJS global that won't be available under Vite's future native ESM config loader.
2. Added `with { type: "json" }` import assertion to the `site.json` import — required for JSON imports under the upcoming import attributes specification.

### 5.4 Added `typecheck` script to `package.json`
**File:** `package.json`
**Fix:** Added a `"typecheck": "tsc --noEmit"` script so type errors can be caught in CI and locally, preventing esbuild's leniency from hiding type breaks.
```json
"scripts": {
  "dev": "vite --host 0.0.0.0",
  "build": "vite build",
  "preview": "vite preview",
  "format": "oxfmt",
  "typecheck": "tsc --noEmit"
}
```

---

## Items Not Fixed (Noted)

| Issue | Reason |
|---|---|
| §2.3 Forms don't submit anywhere | Intentional mock/placeholder behavior — no backend configured yet. Would need a real API endpoint. |
| §2.4 Placeholder links (`href="#"`) | Requires real social media URLs from the client before wiring up. |
| §2.5 Placeholder contact details | Client must verify and provide real phone/email before launch. |
| §3.4 Weak/duplicated alt text | Gallery images are primarily decorative/illustrative; unique descriptive alt text requires client-provided image descriptions. |
| §4.1 No router (state-based pages) | Would require adding `react-router` and restructuring navigation — a significant refactor noted for a future iteration. |
| §4.3 Two divergent ventures implementations | Extracting a shared component is a larger refactoring task noted for future work. |
| §4.4 GSAP ScrollTrigger refresh on page change | Tied to §4.1 (routing) — currently pages swap via state and ScrollTrigger positions may be stale. |
| §4.5 Fragile GSAP selector | Minor — hero parallax uses `trigger: "section"` which works but is brittle. Would need a ref-based approach. |
| §4.6 SEO/meta gaps in `index.html` | Handled by the Figma Make plugin via `.figma/make/site.json` configuration. |
| §6 Minor polish items | Type improvements in `ui.tsx`, `usePrefersReducedMotion` initial flash, Unsplash image hosting, error boundaries — deferred to future iterations. |

---

## Verification

| Check | Result |
|---|---|
| `vite build` | Passes (37 modules, ~391 kB JS / 49 kB CSS) |
| No config warnings | `__dirname` and JSON import warnings resolved |
| `animate-fadeIn` | Now defined in `index.css` — animation works |
| `id="main-content"` | Present on `<main>` in `App.tsx` |
| `inert` on mobile menu | Menu items removed from tab order when closed |
| `aria-modal` on lightbox | Present on lightbox dialog |
| `aria-hidden` attribute | All honeypot wrappers use attribute, not class |
| `loading="eager"` on hero | LCP image loads eagerly with `fetchPriority="high"` |
