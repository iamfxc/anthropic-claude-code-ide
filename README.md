# Vape Shop Gravesend — concept site

A premium, mobile-first React/Vite/Tailwind concept for an adult-only (18+)
local vape retailer at **146 Parrock St, Gravesend DA12 1EY** (`07838 408518`).

This is a product-discovery and local-enquiry website, not a checkout site.
All product, price and stock data is placeholder content — confirm directly
with the store.

## What's inside

- **18+ age gate** persisted in `localStorage`
- **Sticky header** with desktop + mobile nav, call & message CTAs
- **Hero** with trust bar and "Today's Hot Pick" preview card
- **Deals & Best Sellers** horizontal carousel
- **Category hub** (8 categories) → drives the product grid
- **Product discovery grid** with multi-filter (level, category, flavour, nicotine, budget, use)
- **Flavour Finder** — interactive recommendation engine over the mock catalogue
- **AI Shop Assistant ("Vape Guide")** — mock intent router, plus a floating chat bubble
- **Scaling section** explaining bulk import, Shopify-readiness, AI descriptions
- **Local trust** section with map placeholder, hours, call/WhatsApp/Maps CTAs
- **FAQ** with compliant, plain-English answers
- **Phase plan** for the owner — Phase 1 → Phase 5 roadmap
- **Footer** with full compliance copy

## Compliance

- 18+ messaging in header, footer, hero and age gate
- "We only sell to customers aged 18+. Valid ID may be required in-store. Single-use disposable vapes are not sold." appears in age gate and footer
- "Product availability, prices and age verification requirements must be confirmed directly with the store." appears in the hero
- No single-use disposable vapes are listed anywhere in the catalogue
- Tone is adult, calm and informative — no candy, neon or youth-oriented styling

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (default: http://localhost:5173).

## Build

```bash
npm run build      # outputs to ./dist
npm run preview    # serves the production build locally
```

## Deploy to GitHub Pages

This repo hosts **multiple site previews** (one per branch) on a shared
`gh-pages` branch. Each branch is published to its own subfolder so different
client previews can co-exist.

The workflow at `.github/workflows/deploy.yml` runs on every push to `main`
or any `claude/**` branch. It:

1. Reads `.github/site-config.json` to find the slug + label for the current branch.
2. Builds the site (Vite if `package.json` exists, otherwise copies the static
   `index.html` / `script.js` / `styles.css`).
3. Publishes to `gh-pages/<slug>/` with `keep_files: true`, so other previews
   on `gh-pages` are preserved.
4. Regenerates the landing page at `gh-pages/index.html` listing every preview.

### One-time GitHub setup

1. Push this branch — the first run creates the `gh-pages` branch automatically.
2. **Settings → Pages → Source:** *Deploy from a branch* → **Branch:** `gh-pages`
   → **Folder:** `/ (root)` → **Save**.
3. (Optional) **Settings → Environments → github-pages** is no longer required;
   you can remove the branch protection rule you added earlier.

### Live URLs

- Landing page (auto-generated): `https://iamfxc.github.io/anthropic-claude-code-ide/`
- ZAM CALL phone store (`main`): `…/zam-call-phone-store/`
- Vape Shop Gravesend (this branch): `…/vape-shop-gravesend/`

### Adding a new site preview

1. Create a new branch (any `claude/<name>` works) and put the site in the repo root.
2. Optionally add an entry to `.github/site-config.json` to give it a nicer slug
   and display label:
   ```json
   {
     "branches": {
       "claude/my-new-site": { "slug": "my-new-site", "label": "My New Site" }
     }
   }
   ```
3. Push. The workflow builds and publishes to `…/<slug>/`, and the landing page
   updates automatically.

## Where to wire real integrations later

| Integration | Where to start |
|---|---|
| **Shopify product sync** | Replace `src/data/products.js` with a fetch from the Storefront API. Product fields already match Shopify shape (id, title, tags, vendor-equivalent fields). |
| **CSV product upload** | Add a `/admin` page that parses a CSV with PapaParse and writes JSON to `src/data/products.js` (or a CMS). |
| **Real AI assistant API** | In `src/components/AIAssistant.jsx` and `FloatingAssistant.jsx`, swap `routeMessage()` for a `fetch('/api/assistant', ...)` call to a server endpoint that proxies OpenAI / Anthropic. |
| **Age verification provider** | Replace the local-storage gate in `src/components/AgeGate.jsx` with Yoti, AgeChecked or 1Account. |
| **Google Analytics** | Add the GA4 snippet in `index.html` and an event hook on key CTAs (call, directions, assistant open). |
| **Google Search Console** | Add the verification meta tag in `index.html`, then submit a `sitemap.xml`. |
| **Google Business Profile link** | Already linked via `business.mapsUrl` in `src/data/business.js`. Add a "View on Google" link in `LocalTrust.jsx` if desired. |
| **WhatsApp Business** | Confirm the number on `business.whatsapp` in `src/data/business.js`. |
| **Email/SMS retention** | Add a Klaviyo / Mailchimp / Twilio form to the footer. |
| **Loyalty programme** | Phase 5 — a Smile.io or LoyaltyLion widget plugs in once Shopify is live. |

## File map

```
src/
├── App.jsx                 # Page composition & shared state
├── main.jsx                # Vite entry
├── index.css               # Tailwind layer + design system
├── components/
│   ├── AgeGate.jsx
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── DealsCarousel.jsx
│   ├── CategoryHub.jsx
│   ├── ProductGrid.jsx
│   ├── ProductCard.jsx
│   ├── FlavourFinder.jsx
│   ├── AIAssistant.jsx
│   ├── FloatingAssistant.jsx
│   ├── ScalingSection.jsx
│   ├── LocalTrust.jsx
│   ├── FAQ.jsx
│   ├── PhasePlan.jsx
│   ├── Footer.jsx
│   └── SectionHeading.jsx
└── data/
    ├── business.js
    ├── categories.js
    ├── products.js
    ├── flavours.js
    ├── faqs.js
    └── assistant.js
```
