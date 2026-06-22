# IONA Storefront

A small e-commerce demo built with **Next.js**, **TypeScript**, and **commercetools**. It includes a product listing page, product detail page, and shopping cart.

## What you need

- **Node.js 20 or newer** — [download here](https://nodejs.org/) if you do not have it
- **commercetools API keys** — these are **not** in the repo. I will send them separately so you can test the app.

## How to run the app

**1. Get the code**

```bash
git clone <your-repo-url>
cd storefront
```

**2. Install packages**

```bash
npm install
```

**3. Add your environment file**

Copy the example file and rename it:

```bash
cp .env.example .env.local
```

Open `.env.local` in a text editor and paste in the commercetools values I send you. The file needs these fields:

- `CT_PROJECT_KEY`
- `CT_CLIENT_ID`
- `CT_CLIENT_SECRET`
- `CT_API_URL`
- `CT_AUTH_URL`
- `CT_SCOPES`

Save the file. Do not commit `.env.local` — it stays on your machine only.

**4. Start the app**

```bash
npm run dev
```

Then open [http://localhost:3000/en-US](http://localhost:3000/en-US) in your browser.

## Other useful commands

```bash
npm run build   # check that the app builds for production
npm run start   # run the production build locally
npm run lint    # run the linter
```

## Notes for reviewers — What to expect

This is a take-home demo scoped to **PLP, PDP, and Cart**. Below is what is fully wired, what is intentionally a placeholder, and a few things to watch for while testing.

### What works end-to-end

**1. PLP (Product Listing Page)** — `/{locale}` (e.g. `/en-US`)

- Server-rendered product grid from commercetools
- Hero band with translated title and subtitle
- Category filter pills (`?category={slug}`)
- Sort options: name (default), price, newest (`?sort=…`)
- Product cards with image, name, locale-aware price, and link to PDP
- Quick-add cart icon on each card (adds the first variant without leaving the page; toast with “View cart”)
- Empty state when a filter returns no products
- Loading skeleton while the page loads
- **Limit:** up to 24 products shown; no pagination or search

**2. PDP (Product Detail Page)** — `/{locale}/products/{slug}`

- Server-rendered product detail; 404 if the product is missing
- Image, name, description, and locale-aware price (strike-through when commercetools has a discounted price)
- Variant selector when the product has more than one variant
- Add to cart (quantity 1) with success toast and “View cart”
- **Not included:** quantity picker, image gallery, stock/availability UI, related products

**3. Cart** — `/{locale}/cart`

- Server-rendered cart from commercetools (cart ID stored in an HTTP-only cookie)
- Line items with thumbnail, name (links to PDP), unit price, and line total
- Update quantity (+/− stepper) and remove items via server actions
- Empty cart state with “Continue shopping” link
- Live item count in the header nav pill (e.g. “Cart (3)”)
- Order summary with subtotal from the commercetools cart
- Sticky summary panel on desktop
- **Limit:** one shared cart across locales; currency is set when the cart is first created — switching locale after adding items may cause errors if prices do not match the cart currency

**4. Internationalization** — four locales, always in the URL

| Locale | URL | Language | Currency |
|--------|-----|----------|----------|
| `fi-FI` | `/fi-FI` | Suomi (Finnish) | EUR |
| `en-US` | `/en-US` | English (US) | USD |
| `en-GB` | `/en-GB` | English (UK) | GBP |
| `de-DE` | `/de-DE` | Deutsch (German) | EUR |

- Locale switcher in the header preserves the current page and swaps the locale prefix
- UI strings from `messages/{locale}.json`; product names and descriptions from commercetools localized fields
- Prices and money formatting match each locale’s currency and country
- Root `/` redirects to `/en-US`

**5. Promo code** — cart order summary (demo only)

- Valid code: **`IONA-PAUL`** (case-insensitive)
- Applies a **10% discount** to the displayed subtotal
- Apply / remove with toast feedback; invalid codes show an inline error
- **Not persisted** — discount is client-side only and is lost on page refresh; not sent to commercetools

**6. Navigation and layout**

- Header: IONA logo (home), locale switcher, Home and Cart nav pills with active state
- Sticky footer layout (`min-h-dvh`); responsive grids on PLP and cart
- Warm minimal design (cream / terra / sage palette), shadcn/ui components, Sonner toasts for feedback

**7. Accessibility and polish**

- Semantic landmarks (`header`, `main`, `footer`), keyboard-friendly locale switcher, `aria-live` on cart totals
- Localized error boundary with “Try again”
- Add-to-cart, promo, checkout, and footer actions use toasts (top-center)

### Placeholders (intentional stubs)

These controls look real but are **not** wired to backend flows — they show an informational toast instead:

| Control | Location | Behavior |
|---------|----------|----------|
| **Proceed to checkout** | Cart order summary | Toast: checkout coming soon — no payment or order creation |
| **Footer links** | Footer columns | Shop (New arrivals, Bestsellers, Gift ideas) and Customer care (Shipping & returns, Size guide, Contact us) — toast only |
| **Shipping / taxes lines** | Cart order summary | Copy: “Calculated at checkout” — not computed |
| **PDP trust row** | Product page | “Free shipping”, “30-day returns”, “Secure checkout” — marketing copy only |

The **Cart** nav pill is real — it links to `/cart` and shows the live item count. Only checkout and footer destinations are placeholders.

### Architecture (for reviewers)

- Product catalog (PLP/PDP) is fetched on the **server** (Next.js Server Components), not in the browser
- Cart mutations use **server actions**; commercetools SDK runs server-only in `lib/ct/*`
- API keys stay server-side — they are never exposed to the client
- If the product list is empty, the commercetools project may need **published products** with prices for each locale’s currency and country

### Known limitations

- Assignment scope only: no checkout, account, orders, or wishlist
- Promo code is a UI demo, not integrated with commercetools discount codes
- PLP quick-add always uses the first variant
- PDP always adds quantity 1
- No stock enforcement in the UI
- No breadcrumbs, search, or pagination beyond the 24-product cap
