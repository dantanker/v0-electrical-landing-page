# VoltGuard — Metadata & Social Preview Implementation Plan

> **Status:** Planning only — no code changes yet  
> **Goal:** Replace placeholder/logo-based social previews with a **real website snapshot**, and ship **complete, production-grade metadata** for search engines and social platforms.  
> **Scope:** Single-page marketing site (`app/page.tsx`) — desktop layout preserved; metadata applies globally via Next.js App Router.

---

## 1. Current State (Audit)

### What exists today

| Area | File | Current behavior | Issue |
|------|------|------------------|-------|
| Global metadata | `app/layout.tsx` | Inline `export const metadata` | Monolithic, hard to maintain, inconsistent copy |
| `metadataBase` | `https://voltguard.com` | Hard-coded | Must align with actual deploy URL (Vercel preview vs production) |
| Open Graph image | `/voltguard-logo-white-no-tagline.png` | Logo only, declared as 1280×384 | **Not a site snapshot**; dimensions likely wrong for OG (recommended 1200×630) |
| Twitter card | `summary_large_image` | Same logo | Poor preview on X, iMessage, Slack, LinkedIn |
| Favicon / Apple touch | Same logo PNG | Reused for all icon sizes | Not ideal for browser tabs or iOS home screen |
| Keywords | Static array in layout | Legacy `keywords` meta | Low SEO value in 2026; optional, not harmful |
| `generator: 'v0.app'` | Present | Exposes build tool | Should remove for production polish |
| Structured data (JSON-LD) | **Missing** | — | No LocalBusiness / Electrician rich results |
| `robots.txt` | **Missing** | — | Crawlers use defaults |
| `sitemap.xml` | **Missing** | — | No explicit sitemap for Google Search Console |
| Central SEO constants | Partial | `lib/constants.ts` has brand copy | Title/description duplicated vs layout |

### Business facts already in codebase (reuse)

From `lib/constants.ts`:

- **Brand:** VoltGuard Electrical  
- **Tagline:** Power Done Right  
- **Subheadline:** Safely powering Chicagoland homes and businesses for 20+ years.  
- **Phone:** (555) 019-2834  
- **Address:** 6 W Busse Ave, Mt Prospect, IL 60056  
- **Service area:** Arlington Heights, Schaumburg, Palatine, Hoffman Estates  
- **Social links:** Google, Yelp, Facebook, Instagram, LinkedIn, Nextdoor (URLs are placeholders — must confirm real profiles before launch)

---

## 2. Target Outcome

When someone shares `https://voltguard.com` on **Google, Facebook, LinkedIn, X (Twitter), iMessage, Slack, or WhatsApp**, they should see:

1. **A polished screenshot of the live homepage** (hero + brand visible), not a logo on empty background  
2. **Consistent title and description** aligned with on-site copy  
3. **Correct absolute URLs** for all images and canonical link  
4. **Rich local business signals** for “electrician near me” / Chicagoland searches (JSON-LD)

---

## 3. Website Snapshot Strategy (OG / Social Image)

### Recommended asset

| Property | Value |
|----------|--------|
| Filename | `public/og/voltguard-og.png` (and optional `voltguard-og.jpg` fallback) |
| Dimensions | **1200 × 630 px** (Facebook/LinkedIn/X standard) |
| Safe zone | Keep logo + headline + CTA inside center 80% (some platforms crop edges) |
| Format | PNG (sharp text) or JPEG (smaller file; &lt; 300 KB target) |
| Alt text | `VoltGuard Electrical — Power Done Right — Chicagoland electrician` |

### How to capture the snapshot (choose one approach)

#### Option A — Automated capture at build time (recommended)

1. Add a dev script (e.g. `scripts/capture-og.mjs`) using **Playwright** or **Puppeteer**  
2. Start production build or `next start` locally  
3. Viewport: **1200×630** (or capture 1200×630 viewport of hero above the fold)  
4. Save to `public/og/voltguard-og.png`  
5. Optional: run script in CI on release or as `npm run og:capture` before deploy  

**Pros:** Always matches current UI; repeatable after design changes  
**Cons:** Requires headless browser in dev/CI

#### Option B — Manual capture (fastest for v1)

1. Run site locally or on staging at desktop width (~1280px)  
2. Capture **above-the-fold hero** (logo, headline, subheadline, CTA, hero image)  
3. Crop/resize to 1200×630 in Figma, Canva, or Screenshot tool  
4. Export to `public/og/voltguard-og.png`  

**Pros:** No new dependencies; full visual control  
**Cons:** Must re-capture manually after major hero redesign

#### Option C — Designed composite (not a literal screenshot)

Design a 1200×630 marketing card: hero photo + logo + tagline + orange/navy brand frame.

**Pros:** Perfect legibility at small preview sizes  
**Cons:** Not a literal “snapshot”; more design work

### Recommendation

**Phase 1:** Option B (manual) to ship quickly  
**Phase 2:** Option A (Playwright script) for maintainability  

### Snapshot content guidelines

- Use **desktop** layout (user requirement: mobile layout differs; OG should reflect primary brand experience)  
- Include: VoltGuard logo, “Power Done Right”, subheadline, visible hero background  
- Avoid: cut-off hamburger menu, mobile-only affiliate strip, scroll mid-page  
- Dark navy background should match `#0f172a` site theme for seamless preview

---

## 4. Metadata Architecture (Code Structure)

### Proposed files (implementation phase)

```
lib/
  site-metadata.ts      # Single source of truth: titles, descriptions, URLs, OG config
  structured-data.ts    # JSON-LD builders (LocalBusiness, WebSite, optional FAQ)

app/
  layout.tsx            # Imports siteMetadata; minimal export
  opengraph-image.tsx   # Optional: dynamic OG via Next.js (Phase 2+)
  twitter-image.tsx     # Optional: alias to same image
  robots.ts             # robots.txt
  sitemap.ts            # sitemap.xml

public/
  og/
    voltguard-og.png    # Primary social preview (1200×630)
  icons/
    favicon.ico           # Multi-size favicon
    icon-192.png          # PWA / Android
    icon-512.png          # PWA
    apple-touch-icon.png  # 180×180
```

### Environment variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL | `https://voltguard.com` |
| `NEXT_PUBLIC_OG_IMAGE_PATH` | Override OG path (optional) | `/og/voltguard-og.png` |

Use `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://voltguard.com')` so previews work on Vercel preview URLs when needed.

---

## 5. Complete Metadata Specification

### 5.1 Core HTML / Next.js Metadata API

```ts
// Conceptual — to be implemented in lib/site-metadata.ts
{
  metadataBase,
  title: {
    default: "VoltGuard Electrical | Power Done Right | Chicago NW Suburbs",
    template: "%s | VoltGuard Electrical",
  },
  description: "Licensed Chicagoland electrician serving Arlington Heights, Schaumburg, Palatine & Hoffman Estates. 24/7 emergency service, panel upgrades, EV chargers & more. Free quotes.",
  applicationName: "VoltGuard Electrical",
  authors: [{ name: "VoltGuard Electrical" }],
  creator: "VoltGuard Electrical",
  publisher: "VoltGuard Electrical",
  category: "Home Services",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}
```

**Remove:** `generator: 'v0.app'`

### 5.2 Open Graph (Facebook, LinkedIn, iMessage, Slack, WhatsApp)

| Field | Value |
|-------|--------|
| `og:type` | `website` |
| `og:locale` | `en_US` |
| `og:site_name` | `VoltGuard Electrical` |
| `og:url` | Canonical homepage URL |
| `og:title` | `VoltGuard Electrical \| Power Done Right` |
| `og:description` | Same as meta description (or slightly shorter) |
| `og:image` | Absolute URL to `/og/voltguard-og.png` |
| `og:image:width` | `1200` |
| `og:image:height` | `630` |
| `og:image:alt` | Descriptive alt (see §3) |

Optional for local business:

- `og:street-address`, `og:locality`, `og:region`, `og:postal-code`, `og:country-name` — **prefer JSON-LD instead** (cleaner in Next.js)

### 5.3 Twitter / X Cards

| Field | Value |
|-------|--------|
| `twitter:card` | `summary_large_image` |
| `twitter:title` | Match OG title |
| `twitter:description` | Match OG description |
| `twitter:image` | Same `/og/voltguard-og.png` |
| `twitter:image:alt` | Same as OG alt |

Optional (when handles exist):

- `twitter:site` — e.g. `@VoltGuard`  
- `twitter:creator` — business or owner handle  

**Action item:** Confirm real X handle or omit until available.

### 5.4 Icons & PWA manifest (lightweight)

| Asset | Size | Purpose |
|-------|------|---------|
| `favicon.ico` | 16, 32, 48 | Browser tab |
| `apple-touch-icon.png` | 180×180 | iOS bookmark |
| `icon-192.png` / `icon-512.png` | PWA | Add-to-home-screen (optional) |

**Do not** reuse the wide horizontal logo for favicon — use a **square crop** of the bolt/shield mark or a simplified “VG” mark.

Optional: `app/manifest.ts` with `name`, `short_name`, `theme_color` (`#f97316` orange), `background_color` (`#0f172a`).

### 5.5 JSON-LD Structured Data (high value for local SEO)

Inject in `app/layout.tsx` or a dedicated `<JsonLd />` component:

#### Primary: `Electrician` / `LocalBusiness`

Include:

- `@type`: `Electrician` (or `HomeAndConstructionBusiness`)  
- `name`, `description`, `url`, `telephone`, `image` (OG snapshot URL)  
- `address` (PostalAddress from `SHOP_ADDRESS`)  
- `geo` (lat/lng — geocode Mt Prospect address)  
- `areaServed`: cities from `SERVICE_AREA_CITIES`  
- `openingHoursSpecification` (Mon–Sat 7 AM – 9 PM + 24/7 emergency note)  
- `priceRange`: `$$`  
- `aggregateRating` (optional — **only if legally accurate**; site shows 4.9 testimonials)  
- `sameAs`: array of real social profile URLs from `SOCIAL_LINKS`

#### Secondary: `WebSite`

- `name`, `url`, `potentialAction` → `SearchAction` (optional, low priority for single-page site)

#### Optional: `FAQPage`

- Map `FAQS` from `lib/constants.ts` to FAQ schema if we want FAQ rich snippets

### 5.6 robots.txt & sitemap

**`app/robots.ts`**

```
User-agent: *
Allow: /
Sitemap: https://voltguard.com/sitemap.xml
```

**`app/sitemap.ts`**

- Single entry: `/` with `lastModified`, `changeFrequency: 'weekly'`, `priority: 1.0`  
- Expand when adding blog, service pages, or city landing pages

---

## 6. Social Media Alignment Checklist

Before launch, replace placeholder URLs in `SOCIAL_LINKS` and wire into metadata:

| Platform | Metadata touchpoint | Action |
|----------|---------------------|--------|
| **Facebook** | Open Graph | Verify with [Sharing Debugger](https://developers.facebook.com/tools/debug/) |
| **LinkedIn** | Open Graph | Verify with [Post Inspector](https://www.linkedin.com/post-inspector/) |
| **X (Twitter)** | Twitter Card | Verify with [Card Validator](https://cards-dev.twitter.com/validator) (or X developer tools) |
| **Google Business** | Not in HTML meta | Separate GMB profile; NAP must match JSON-LD |
| **Yelp / Google Reviews** | `sameAs` in JSON-LD | Use real review profile URLs |
| **Instagram / Facebook** | `sameAs` | Business profile links |
| **Nextdoor** | `sameAs` | Local presence link |

**NAP consistency:** Name, Address, Phone in metadata, JSON-LD, footer, and Google Business Profile must match exactly.

---

## 7. Copy Guidelines (Unified Messaging)

Use one canonical description everywhere (meta, OG, Twitter, JSON-LD):

**Title (≤ 60 chars):**  
`VoltGuard Electrical | Power Done Right`

**Meta description (≤ 155 chars):**  
`Licensed electrician in Chicago's NW suburbs. 24/7 emergency service, panel upgrades, EV chargers & smart home wiring. Free quotes — call (555) 019-2834.`

**OG/Twitter description (can match meta or shorten by ~20 chars)**

Pull phone, cities, and tagline from `lib/constants.ts` — **no duplicate hard-coded strings** in `layout.tsx`.

---

## 8. Implementation Phases

### Phase 1 — Snapshot & quick win (1–2 hours)

- [ ] Capture or design `public/og/voltguard-og.png` at 1200×630  
- [ ] Create `lib/site-metadata.ts` with all fields from §5  
- [ ] Refactor `app/layout.tsx` to import centralized metadata  
- [ ] Point `openGraph.images` and `twitter.images` to new OG asset with correct dimensions  
- [ ] Remove `generator: 'v0.app'`  
- [ ] Add `NEXT_PUBLIC_SITE_URL` to `.env.example`

### Phase 2 — SEO infrastructure (2–3 hours)

- [ ] Add `app/robots.ts` and `app/sitemap.ts`  
- [ ] Add JSON-LD (`Electrician` + `WebSite`) via `lib/structured-data.ts`  
- [ ] Geocode shop address for `geo` coordinates  
- [ ] Update `SOCIAL_LINKS` with production URLs; populate `sameAs`

### Phase 3 — Icons & polish (1–2 hours)

- [ ] Generate favicon + apple-touch-icon set from brand mark  
- [ ] Optional: `app/manifest.ts` for theme colors  
- [ ] Validate all platforms (§6 checklist)

### Phase 4 — Automation (optional, maintainability)

- [ ] Playwright script `npm run og:capture`  
- [ ] Document in README: re-run after hero redesign  
- [ ] Optional: Next.js `opengraph-image.tsx` for dynamic generation (only if we want per-route OG later)

---

## 9. Validation & QA

### Manual tests

1. View page source — confirm single canonical, OG tags, Twitter tags, JSON-LD  
2. [opengraph.xyz](https://www.opengraph.xyz/) — paste production URL  
3. Facebook Sharing Debugger — scrape again after deploy  
4. LinkedIn Post Inspector  
5. Slack: paste URL in a channel — confirm large image preview  
6. iMessage: send link to iPhone — confirm image + title  

### Automated (optional)

- Add a smoke test that `metadata.openGraph.images[0].url` resolves and file exists in `public/og/`  
- Lighthouse SEO audit score ≥ 90

---

## 10. Risks & Decisions Needed from Stakeholders

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Production domain | `voltguard.com` vs Vercel subdomain | Confirm DNS; set `NEXT_PUBLIC_SITE_URL` |
| OG image style | Literal screenshot vs designed card | Screenshot for “authentic” preview (user request) |
| Phone in metadata | Display `(555) 019-2834` | Replace with real number before launch if placeholder |
| Aggregate rating in schema | Include 4.9 / 5 | Only if verifiable on Google/Yelp |
| Social handles | Real @ handles | Omit Twitter creator until confirmed |
| Privacy / Terms URLs | Footer links `#` today | Use real pages or remove from schema until live |

---

## 11. Files to Touch (Implementation Reference)

| File | Action |
|------|--------|
| `IMPLEMENTATION_METSDA.md` | This plan |
| `lib/site-metadata.ts` | **Create** — canonical metadata object |
| `lib/structured-data.ts` | **Create** — JSON-LD helpers |
| `app/layout.tsx` | **Update** — import metadata + JSON-LD script |
| `app/robots.ts` | **Create** |
| `app/sitemap.ts` | **Create** |
| `public/og/voltguard-og.png` | **Create** — website snapshot |
| `public/icons/*` | **Create** — favicon set |
| `.env.example` | **Update** — `NEXT_PUBLIC_SITE_URL` |
| `lib/constants.ts` | **Optional** — add `SITE_URL`, `OG_IMAGE` constants |
| `package.json` | **Optional** — `og:capture` script |

**Explicitly out of scope for metadata work:** UI/layout changes, mobile/desktop component refactors, quote modal, gallery.

---

## 12. Success Criteria

- [ ] Social share previews show **homepage snapshot**, not logo-only image  
- [ ] OG image is **1200×630**, under ~300 KB, absolute URL resolves in production  
- [ ] Title/description consistent across Google, Facebook, LinkedIn, X, Slack  
- [ ] JSON-LD validates in [Google Rich Results Test](https://search.google.com/test/rich-results)  
- [ ] `robots.txt` and `sitemap.xml` accessible at site root  
- [ ] Favicon displays correctly in browser tab  
- [ ] No placeholder social URLs in production `sameAs` without stakeholder sign-off  

---

*Document version: 1.0 — Planning phase. Ready for implementation when approved.*
