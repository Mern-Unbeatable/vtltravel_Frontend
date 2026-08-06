# VTL Travel / Bintan Ferry Tickets — Frontend

React frontend for **VTL Travel** (Bintan / Batam ferry tickets booking UI).  
Built from client Figma designs. This README is a handoff doc so another chat/session can continue without losing context.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

**Node:** `>=20.19.0` (see `package.json` → `engines`)

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Bundler | Vite 6 |
| UI | React 19 (JavaScript, not TypeScript) |
| Routing | `react-router-dom` v7 — `BrowserRouter as Router` + `<Routes>` / `<Route>` |
| Styles | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | `react-icons` (e.g. `IoTicketOutline`), also `lucide-react` installed |
| Forms (ready, not fully wired) | `react-hook-form`, `zod`, `@hookform/resolvers` |
| Data (ready, not fully wired) | `@tanstack/react-query`, `axios` |
| UI extras | `sweetalert2`, `js-cookie` |

---

## Folder structure

```text
vtltravel/
├── public/
│   ├── logo.png
│   ├── cta.png              # Footer CTA illustration
│   ├── hero.jpg             # Hero background (if used)
│   ├── epicSale.png         # Epic sale banner image
│   ├── promo1.png / promo2.png
│   ├── brand1.png … brand9.png
│   └── favicon.svg
├── src/
│   ├── main.jsx             # App entry → AppRouter
│   ├── index.css            # Tailwind + @theme + Inter + brand-rail animation
│   ├── routes/
│   │   └── router.jsx       # All routes
│   ├── layout/
│   │   └── Layout.jsx       # Navbar + <Outlet /> + Footer
│   ├── components/
│   │   ├── Navbar.jsx       # Sticky, responsive, mobile overlay menu
│   │   └── Footer.jsx       # CTA + links + newsletter + socials
│   └── pages/
│       ├── landingpage/     # Ferry landing (default `/`)
│       │   ├── LandingPage.jsx
│       │   ├── components/
│       │   └── sections/
│       ├── home/
│       │   └── Home.jsx     # Hotel-style home (`/home`) — Nav “Home” click
│       ├── About.jsx
│       ├── Destinations.jsx
│       ├── TravelInfo.jsx
│       ├── Contact.jsx
│       └── NotFound.jsx
├── vite.config.js
├── package.json
└── README.md
```

---

## Routing

Defined in `src/routes/router.jsx`:

| Path | Page | Notes |
|------|------|--------|
| `/` | `pages/landingpage/LandingPage.jsx` | Default — ferry landing (logo click) |
| `/home` | `pages/home/Home.jsx` | Nav **Home** — hotel search welcome UI |
| `/about` | `About.jsx` | Navbar label: **Ferry Schedule** |
| `/destinations` | `Destinations.jsx` | Placeholder content |
| `/travel-info` | `TravelInfo.jsx` | Placeholder content |
| `/contact` | `Contact.jsx` | Contact form UI |
| `*` | `NotFound.jsx` | 404 |

Layout wrapper: `src/layout/Layout.jsx` → Navbar + page + Footer.

---

## Home page sections (order)

`src/pages/landingpage/LandingPage.jsx` (route `/`) renders:

1. `HeroSection` — beach hero + ferry booking card UI  
2. `ResortsSection` — resort cards grid + “All Resorts”  
3. `EpicSaleSection` — full-width `/epicSale.png`  
4. `PromotionsSection` — uses `PromotionCard` + `/promo1.png`, `/promo2.png`  
5. `TrustedBySection` — brand logos marquee (`brand*.png`)  
6. `BintanGlanceSection` — “Bintan at a glance” image grid  
7. `GroupToursSection` — Meeting / Incentive / Weddings / Events  
8. `PromotionEventSection` — horizontal scroll cards  
9. `TrustedOperatorSection` — blue gradient ferry story band  
10. `TicketPricesSection` — ticket prices text + image  
11. `OnlineBookingSection` — VTL Travel about + services list  
12. `FaqSection` — 2-column accordion FAQs  

---

## Design tokens

In `src/index.css` (Tailwind v4 `@theme`):

```css
--color-primary: #359DD7;
```

Use classes like: `bg-primary`, `text-primary`, `border-primary`.

**Font:** Inter (Google Fonts import + global `font-family` on `html, body`).

**Brand rail animation** (Trusted By logos):

- Classes: `.brand-rail-track`
- Keyframes: `brand-rail` in `index.css`
- Duplicate logo groups for seamless infinite scroll (no empty gap)

---

## Navbar behavior

File: `src/components/Navbar.jsx`

- Sticky: `sticky top-0 z-50`
- Desktop: links + Book Tickets (`IoTicketOutline`)
- Mobile: hamburger → **overlay** menu (does not push content down)
- Open state: hamburger becomes **X** icon
- Backdrop click closes menu
- Route change auto-closes menu

Nav links:

- Home → `/home`
- Ferry Schedule → `/about`
- Destinations → `/destinations`
- Travel Info → `/travel-info`
- Contact → `/contact`
- Book Tickets → `/contact` (for now)

---

## Footer

File: `src/components/Footer.jsx`

- Dark CTA banner + `/cta.png` (left) + promo copy + button  
- Columns: logo / currency / payment icons / Services / Brands / Company / Contact  
- Payment icons from `react-icons/fa`: Visa, Mastercard, PayPal (separate bordered boxes)  
- Newsletter row  
- Copyright + social icons  

---

## Important product / Figma context

Client shared multiple Figma frames. Clarify before mixing ferry + hotel:

### Ferry (current build focus)

- Landing with ocean hero + **Search Ferries** card + Resorts = treat as **Home (`/`)**  
- This is what is largely implemented in `Home.jsx`

### Hotel (not built yet — separate module)

- Figma “Search” (left) + “Map” (right) screens are **hotel** search → results  
- Flow: Hotel search form → navigate to results page (e.g. `/hotels/search`) with query params  
- **Do not** replace ferry home with hotel UI unless client confirms  

### Questions already prepared for client

1. Is ferry landing the main home (`/`)?  
2. Are hotel Search/Map a separate Hotels section?  
3. Ferry vs hotel: same product journey or two services?  
4. Need Navbar “Hotels” link?  
5. Build order: ferry first vs hotel together?  

---

## Coolify / deploy notes (history)

Earlier Coolify failures were due to:

- Vite 8 vs `@vitejs/plugin-react` peer mismatch (project later moved toward Vite 6 + compatible plugin)  
- Native binding / Node engine issues on older Node  

Current lockfile targets Vite 6 + Node `>=20.19.0`. Prefer:

- Build: `npm run build`  
- Static hosting of `dist/` **or** a static server for SPA  
- Ensure production Node matches `engines`

---

## Installed but not fully used yet

These are in `package.json` for future features:

- `react-hook-form` + `zod` — real booking / contact forms  
- `@tanstack/react-query` + `axios` — API calls  
- `sweetalert2` — alerts  
- `js-cookie` — auth/session cookies  
- `lucide-react` — prefer `react-icons` where already used (Book Tickets uses `IoTicketOutline`)

---

## Conventions for future work

1. New homepage blocks → `src/pages/home/sections/SectionName.jsx`, then import in `Home.jsx`  
2. Reusable cards → `src/pages/home/components/` or `src/components/`  
3. New routes → add page under `src/pages/` + register in `router.jsx`  
4. Prefer `bg-primary` / `text-primary` over hard-coded blue hex  
5. Keep ferry home and hotel module on separate routes when hotel work starts  

---

## Suggested next tasks

- [ ] Wire Hero booking form (state / react-hook-form) + search navigation  
- [ ] Real content for About / Destinations / Travel Info / Contact  
- [ ] Confirm with client: ferry home vs hotel Search/Map module  
- [ ] If hotel confirmed: add `/hotels` + `/hotels/search` (map + filters + list)  
- [ ] Connect backend APIs via axios + react-query  
- [ ] Production deploy config (Coolify / static) finalized  

---

## Repo / naming

- npm package name in `package.json`: `vitltravel`  
- Product branding in UI: VTL Travel / Bintan–Batam Ferry Tickets  
- Remote used earlier: `Mern-Unbeatable/vtltravel_Frontend` (verify current remote with `git remote -v`)

---

*Last updated for handoff continuity — ferry landing UI largely in place; hotel Figma module pending client confirmation.*
