# Code Audit — Leo Hospitality & Ventures LLP Website

Date: 2026-09-02
Stack: React 19 · Vite 8 · Tailwind CSS v4 · TypeScript 5.7 · GSAP ScrollTrigger

## How this was verified

- `npx tsc --noEmit` — type check (**fails**, see below)
- `npx vite build` — production build (**passes** in 554 ms; esbuild strips/ignores the type errors, so the site still bundles and runs)
- Manual read of every file in `src/`

Key takeaway: **the app builds and runs, but type-checking is broken and there are several real functional, accessibility, and architecture flaws.** Because Vite uses esbuild (which does not type-check), these defects are invisible at build time and will only surface in the editor, in CI, in `oxfmt`/lint tooling, and as runtime misbehavior.

---

## 1. Critical — Breaks type-checking / genuine bugs

### 1.1 Syntax error in `Nav.tsx` (hard parse error)
`src/components/Nav.tsx:5`
```ts
export const NAV_ITEMS: { id: PageId label: string }[] = [
```
Missing separator between members. `tsc` reports `TS1005: ';' expected` and stops. esbuild tolerates it, which is why the build still passes.

Fix:
```ts
export const NAV_ITEMS: { id: PageId; label: string }[] = [
```

### 1.2 Wrong type on `requiredFields` in every form page
`Franchise.tsx:104`, `Careers.tsx:103`, `Contact.tsx:85`, `Vendor.tsx:115`
```ts
const requiredFields: keyof typeof form[] = [ "name", ... ]
```
`keyof typeof form[]` parses as `keyof (typeof form)[]` — the keys of an *array* (`number | "length" | "push" | ...`), not the keys of the form object. This produces a cascade of errors (`TS2322`, `TS2339 forEach does not exist`, `TS7006`, `TS7053`). It happens to work at runtime only because the literal array is still a real array.

Fix (parenthesize):
```ts
const requiredFields: (keyof typeof form)[] = [ "name", ... ]
```

### 1.3 `disabled` attribute on `<div>` — type error **and** functional bug
`Franchise.tsx:244`, `Careers.tsx:234,315,339`, `Contact.tsx:244`, `Vendor.tsx:485`
```tsx
<div className="grid gap-5 sm:grid-cols-2" disabled={submitting}> ... </div>
```
`<div>` does not support `disabled`. TypeScript flags it (`Property 'disabled' does not exist...`), and at runtime **it does nothing** — the wrapped inputs are *not* disabled during the 1.5 s "submitting" window, so a user can keep editing or double-submit. (Note: `Vendor.tsx` correctly uses `<fieldset disabled>` in most places, which *does* propagate; only its stray `<div ... disabled>` at line 485 is broken.)

Fix: wrap the fields in `<fieldset disabled={submitting}>` (a fieldset natively disables its descendants) or drive disabling per-input.

### 1.4 Ref callback returns a value — `Home.tsx:285`
```tsx
ref={(el) => (tabRefs.current[idx] = el)}
```
The arrow implicitly returns the assigned element. In React 19 a ref callback may return a *cleanup function*; returning a non-function (`TS2322` here) is invalid and triggers dev warnings.

Fix (use a block body so it returns `void`):
```tsx
ref={(el) => { tabRefs.current[idx] = el }}
```

### 1.5 `go(cta)` passes a plain `string` where `PageId` is required — `Ventures.tsx:93`
```tsx
{cta && <Button onClick={() => go(cta)}>...</Button>}
```
`venture.cta` is typed `string` in `data.ts`, but `go` expects `PageId` (`TS2345`). `Home.tsx` already works around this with `go(venture.cta as PageId)`.

Fix: type `cta?: PageId` on the `Venture` interface in `src/lib/data.ts`, or narrow before calling.

> After applying 1.1–1.5, `tsc --noEmit` should pass. These are the complete set of type errors currently reported.

---

## 2. Functional flaws (build passes, behavior wrong)

### 2.1 `animate-fadeIn` class does nothing
Used in `Home.tsx:315` and in the success panels of `Contact`, `Vendor`, `Franchise`, `Careers`. There is **no `@keyframes fadeIn` and no `.animate-fadeIn` utility** anywhere (`index.css` only defines `kenburns`). Tailwind v4 has no built-in `animate-fadeIn`. The intended fade-in on tab-switch and on form success never plays.

Fix: add the keyframe/utility to `index.css`, e.g.
```css
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
@layer utilities { .animate-fadeIn { animation: fadeIn 350ms ease-out both } }
```

### 2.2 Skip link points to a non-existent target and is duplicated
`Ventures.tsx:14` renders `<a href="#main-content">` — but no element has `id="main-content"` (the `<main>` in `App.tsx` has no id). The skip link therefore does nothing. It is also rendered **once per venture section**, so there are multiple identical skip links.

Fix: add `id="main-content"` to `<main>` in `App.tsx`, and render the skip link once at the app root, not inside each `VentureSection`.

### 2.3 Forms don't submit anywhere
Every form (`Contact`, `Franchise`, `Careers`, `Vendor`) and the footer newsletter uses a `setTimeout(...1500)` mock and then shows a success screen. No network request, no email, no persistence — submitted data (including uploaded CV / FSSAI files) is silently discarded. If this is intended for now, fine; otherwise it is a functional gap that will lose real leads.

### 2.4 Placeholder links go nowhere
`href="#"` on all social icons and the Privacy / Terms links (`Footer.tsx:30,129,132`, `Contact.tsx:177`). Clicking them jumps to the top of the page. Wire up real URLs or remove.

### 2.5 Placeholder contact details shipped
`+91 22 0000 0000` and `connect@leohospitality.in` / `partner@leohospitality.in` appear in `Nav`, `Footer`, `Contact`. Verify these are real before launch — the phone number is clearly a placeholder.

### 2.6 Above-the-fold hero image is lazy-loaded (hurts LCP)
`PageHero.tsx` sets `loading="lazy"` on the large hero image, which is the Largest Contentful Paint element on every sub-page. Lazy-loading the LCP image delays it. Use `loading="eager"` (or `fetchpriority="high"`) for hero images and reserve `lazy` for below-the-fold media.

---

## 3. Accessibility

### 3.1 Closed mobile menu stays in the tab order
`Nav.tsx` keeps the mobile overlay mounted and merely slides it off-screen with `translate-x-full`. All 10 nav buttons plus the email/phone links remain focusable when the menu is "closed" — keyboard/screen-reader users tab into invisible off-screen controls. Add `inert` / `aria-hidden={!open}` (and remove from tab order) when closed, or conditionally render.

### 3.2 Lightbox is not a proper modal
`Gallery.tsx` lightbox has `role="dialog"` but no `aria-modal="true"`, no focus trap, and no focus restore on close. Add `aria-modal`, move focus into the dialog on open, trap Tab, and restore focus to the triggering thumbnail on close.

### 3.3 Honeypot wrapper misuses `aria-hidden` as a CSS class
In every form: `className="sr-only aria-hidden pointer-events-none"`. `aria-hidden` is written as a class name (no effect) instead of the attribute. Use `aria-hidden="true"` as an attribute on the wrapper.

### 3.4 Weak/duplicated alt text and empty hero alts
`PageHero` uses `alt=""` (acceptable for purely decorative), but gallery/venture images reuse the category or name as alt for every image. Provide descriptive, unique alt text where images convey information.

---

## 4. Architecture & SEO

### 4.1 No router — state-based "pages"
`App.tsx` swaps pages with `useState<PageId>`. Consequences:
- No URLs per page → **no deep-linking, no bookmarking, no sharing**, browser Back/Forward don't work.
- **Poor SEO**: crawlers see a single route; all page content is client-rendered under `/`.
- `document.title` is set once and never per page.

Recommendation: adopt `react-router` (or the History API) so each page has a real path, and set per-page `<title>`/meta.

### 4.2 All page elements are constructed on every render
`App.tsx` builds the entire `PAGES` record (10 JSX elements) on each render even though only one is displayed. Minor overhead, but combined with 4.1 it means every page component's element tree is created each time. Prefer rendering only the active page (`switch`/lazy import).

### 4.3 Two divergent implementations of the ventures section
`Home.tsx` (`VentureSlide`, CSS `sticky`) and `Ventures.tsx` (`VentureSection`, GSAP `pin`) implement the same feature two different ways, with duplicated markup and copy. This is a maintenance hazard — changes must be made twice. Extract a shared component.

### 4.4 GSAP `ScrollTrigger` is never refreshed on page change
Because navigation is state-based (not a route change), pinned/scrubbed triggers created in `Home`/`Ventures` compute positions once. After switching pages the layout changes without a `ScrollTrigger.refresh()`, which can leave stale trigger positions. Call `ScrollTrigger.refresh()` after page transitions (and on font load / image load).

### 4.5 Fragile GSAP selector
`Home.tsx` hero parallax uses `trigger: "section"`, which resolves to the *first* `<section>` in the DOM. This is brittle — any markup reshuffle silently rebinds the trigger. Use a ref or a dedicated class/data-attribute.

### 4.6 SEO/meta gaps in `index.html`
`<title>` and `lang` are Figma placeholders (`<!-- figma:title -->`, `lang="<!-- figma:lang -->"`), and there is no meta description, no Open Graph/Twitter tags, and no favicon. Confirm the Figma deploy step fills these; otherwise add them.

---

## 5. Tooling & dependencies

### 5.1 Suspicious/unnecessary `ci` dependency
`package.json` lists `"ci": "^2.3.0"` as a runtime dependency. This package is not imported anywhere in `src/` and looks like an accidental install (`npm ci` mistyped as `npm i ci`). Remove it — unused dependencies are dead weight and a supply-chain risk.

### 5.2 Two lockfiles present
Both `package-lock.json` and `pnpm-lock.yaml` exist. `.mise.toml`/AGENTS.md indicate pnpm. Keep one lockfile (pnpm) and delete the other to avoid drift and confusing installs.

### 5.3 Vite config forward-compat warnings
`vite build` warns:
- `__dirname` used in `vite.config.ts:31` → use `import.meta.dirname`.
- JSON import of `./.figma/make/site.json` without import attributes (`vite.config.ts:6`) → add `with { type: 'json' }`.

These will break under Vite's future native config loader. Update proactively.

### 5.4 No type-check / lint in the pipeline
`package.json` only has `dev`, `build`, `preview`, `format`. There is no `typecheck` script, so the errors in §1 went unnoticed. Add:
```json
"typecheck": "tsc --noEmit"
```
and run it in CI (and ideally as part of the build) so esbuild's leniency can't hide type breaks.

---

## 6. Minor / polish

- `lib/ui.tsx`: `Reveal` uses `as?: any` and `ref={ref as any}`; loosely typed. Consider `ElementType` and a properly typed ref.
- `usePrefersReducedMotion` initializes to `false` and updates in an effect — a one-frame flash of motion is possible on first paint for users who prefer reduced motion.
- `React.StrictMode` double-invokes effects in dev, so GSAP triggers are created/destroyed twice during development; harmless but be aware when debugging.
- Unsplash images are hot-linked with no explicit `width`/`height`, causing layout shift (CLS) and an external runtime dependency (broken images if Unsplash changes/blocks). Host critical imagery locally and set dimensions.
- Multiple "Awaiting Client Photography" placeholders are shipped in the live UI (`Home.tsx`) — remove before launch.
- No error boundary; a render error in any page takes down the whole app.
- `CLAUDE.md` is an 11-byte stub.

---

## Priority order to fix

1. **§1.1–1.5** — restore type-checking (blocks CI/editor; 1.3 is also a real bug). Add `§5.4` typecheck script so it stays fixed.
2. **§2.1, §2.2, §2.6, §3.1, §3.3** — quick, high-value correctness/a11y/perf fixes.
3. **§2.3** — wire forms to a real backend (or confirm mock is intentional).
4. **§4.1** — introduce routing (biggest structural + SEO win).
5. **§5.1, §5.2, §5.3** — dependency and config hygiene.
6. Remaining items in §3, §4, §6 as polish.

## Summary of verification evidence

| Check | Result |
|---|---|
| `tsc --noEmit` (as-is) | Fails at `Nav.tsx:5` `TS1005` |
| `tsc --noEmit` (after temp-fixing Nav) | 21 further errors across `Careers`, `Contact`, `Franchise`, `Vendor`, `Home`, `Ventures` (§1.2–1.5) |
| `vite build` | Succeeds (37 modules, ~391 kB JS / 49 kB CSS) with 2 config warnings (§5.3) |
| Grep: `@keyframes fadeIn` | Not found — `animate-fadeIn` is a no-op (§2.1) |
| Grep: `id="main-content"` | Not found — skip link target missing (§2.2) |
| Grep: `href="#"` | 4 placeholder links (§2.4) |
