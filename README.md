# IONA Storefront

Small e-commerce demo built with Next.js, TypeScript, and commercetools. Three pages: product list, product detail, and cart.

## What you need

- **Node.js 20+** ([nodejs.org](https://nodejs.org/))
- **commercetools API keys.** They are not in the repo. I will send them separately so you can run the app.

## Run locally

**1. Install**

```bash
npm install
```

**2. Set up environment**

Copy the example file:

```bash
cp .env.example .env.local
```

Open `.env.local` and paste the commercetools values:

- `CT_PROJECT_KEY`
- `CT_CLIENT_ID`
- `CT_CLIENT_SECRET`
- `CT_API_URL`
- `CT_AUTH_URL`
- `CT_SCOPES`

**3. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000/en-US](http://localhost:3000/en-US).

## Other commands

```bash
npm run build   # check production build
npm run start   # run production build locally
npm run lint
```

### What works

**PLP** (`/{locale}`, e.g. `/en-US`)

- Server-rendered product grid from commercetools
- Hero with translated title and subtitle
- Category filters (`?category={slug}`) and sort (`?sort=name|price|newest`)
- Product cards: image, name, locale price, link to PDP
- Quick-add icon on each card (first variant; toast with “View cart”)
- Empty state and loading skeleton
- Shows up to 24 products. No pagination or search.

**PDP** (`/{locale}/products/{slug}`)

- Server-rendered detail. Returns 404 if the product is missing.
- Image, name, description, locale price (strikethrough when discounted in commercetools)
- Variant selector when the product has more than one variant
- Add to cart (quantity 1) with success toast
- Not built: quantity picker, image gallery, stock UI, related products

**Cart** (`/{locale}/cart`)

- Server-rendered from commercetools. Cart ID lives in an HTTP-only cookie.
- Line items: thumbnail, name (links to PDP), unit price, line total
- Change quantity or remove items via server actions
- Empty cart state, live header count (e.g. “Cart (3)”), subtotal in order summary
- Sticky summary panel on desktop
- One shared cart across locales. Currency is set when the cart is first created. Switching locale after adding items can error if the new locale’s currency does not match the cart.

**Locales** (always in the URL)

| Locale | URL | Language | Currency |
|--------|-----|----------|----------|
| `fi-FI` | `/fi-FI` | Finnish | EUR |
| `en-US` | `/en-US` | English (US) | USD |
| `en-GB` | `/en-GB` | English (UK) | GBP |
| `de-DE` | `/de-DE` | German | EUR |

Header locale switcher keeps you on the same page. UI copy comes from `messages/{locale}.json`. Product names and descriptions come from commercetools. Prices match each locale’s currency. `/` redirects to `/en-US`.

**Promo code** (cart summary, demo only)

- Code: **`IONA-PAUL`** (case-insensitive). Shows **40% off** the displayed subtotal.
- Apply and remove with toast feedback. Invalid codes show an inline error.
- Client-side only. Not saved on refresh and not sent to commercetools.

**Layout and polish**

- Header: logo (home), locale switcher, Home and Cart pills with active state
- Sticky footer layout, responsive PLP and cart grids
- Warm minimal palette (cream / terra / sage), shadcn/ui, Sonner toasts
- Semantic landmarks, keyboard-friendly locale switcher, `aria-live` on cart totals, localized error boundary

### Placeholders

These look real but only show an info toast. No backend flow behind them.

| Control | Where | What happens |
|---------|-------|--------------|
| Proceed to checkout | Cart summary | “Checkout coming soon” toast |
| Footer links | Shop and Customer care columns | Toast only |
| Shipping / taxes | Cart summary | “Calculated at checkout” (not computed) |
| Trust row | PDP | “Free shipping”, “30-day returns”, etc. (copy only) |

The **Cart** nav pill is real. It links to `/cart` and shows the live item count.

### Known limits

- Assignment scope only: no checkout, account, orders, or wishlist
- Promo code is a UI demo, not a commercetools discount
- PLP quick-add always uses the first variant; PDP always adds quantity 1
- No stock enforcement, breadcrumbs, search, or pagination beyond 24 products
