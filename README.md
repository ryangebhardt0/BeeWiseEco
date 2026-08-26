# Bee Wise Eco Services

The Bee Wise Eco website: marketing pages, a live product catalogue, and PayFast
checkout.

Next.js 15 (App Router) + TypeScript. Products, prices and stock come from
**DevsDen Inventory** over its storefront API — nothing about the catalogue is
hardcoded any more.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

| Variable | What it is |
|---|---|
| `INVENTORY_API_URL` | Inventory backend origin, no trailing slash. |
| `INVENTORY_API_KEY` | From Inventory → Settings → Online storefront → API keys. **Server-side only.** |
| `STOREFRONT_IMAGE_HOST` | Hostname serving product images, so `next/image` will allow it. |
| `PAYFAST_MERCHANT_ID` / `PAYFAST_MERCHANT_KEY` | PayFast credentials. |
| `PAYFAST_PASSPHRASE` | Optional. If set here it must match the PayFast dashboard. |
| `PAYFAST_SANDBOX` | `true` (default) uses sandbox.payfast.co.za. |
| `NEXT_PUBLIC_SITE_URL` | Public origin, used to build PayFast return/cancel/notify URLs. |

`INVENTORY_API_KEY` must never gain a `NEXT_PUBLIC_` prefix — that would ship it
to the browser, and the key can place orders.

## How it fits together

```
browser ──▶ Next.js server (holds the API key + PayFast secrets)
                  │
                  ▼
          DevsDen Inventory storefront API
                  ▲
                  │ confirm order, once the ITN is verified
  /api/payfast/notify ◀── PayFast ITN
```

The browser never talks to the inventory API directly. It gets stock through
`/api/availability`, a thin proxy that exposes availability and nothing else.

- **`lib/inventory.ts`** — server-only client. Marked `server-only`, so importing
  it from a client component is a build error rather than a leaked key.
- **`lib/payfast.ts`** — signature generation and ITN verification.
- **`components/CartProvider.tsx`** — the cart. localStorage holds slugs and
  quantities only; prices and stock are re-fetched on every load. The old site
  stored a full copy of each product, so a cart opened weeks later still showed
  the price from the day it was filled.

## Ordering

1. `POST /api/checkout` sends slugs and quantities. Inventory prices the order,
   reserves the stock and returns the total.
2. The browser posts a signed form to PayFast for **that** total. A tampered
   client-side price changes nothing — the server never reads one.
3. PayFast posts an ITN to `/api/payfast/notify`, verified four ways before the
   order is confirmed: **signature**, **source IP**, **amount**, and PayFast's own
   server-to-server confirmation.
4. Confirmation is idempotent, because PayFast retries.

The handler always answers `200`, even when it rejects a notification — a
non-200 makes PayFast retry, and retrying will not fix a forged one. Rejections
are logged and the order simply stays unpaid until its reservation lapses.

### Local ITN testing

PayFast cannot reach `localhost`, so the source-IP check will fail for anything
you post by hand. To exercise the full path, expose the site through a tunnel
(ngrok or similar), point `NEXT_PUBLIC_SITE_URL` at the tunnel, and pay through
the PayFast sandbox.

## Stock display

Cards render from the catalogue but take their badge from a live availability
poll, so a page cached for a minute still shows current stock:

- `out_of_stock` → "Sold out", add-to-cart disabled, card dimmed via `.badge--off`
- `low_stock` → "Low stock"
- otherwise the product's own marketing badge

If the inventory API is unreachable the shop renders its last good snapshot with
badges hidden, and each grid explains itself rather than appearing empty.

## Deployment

Deploys as a Render web service (`npm run build` / `npm start`) alongside the
other DevsDen apps. Set every variable above, and add the deployed origin to
`NEXT_PUBLIC_SITE_URL` so PayFast's callbacks resolve.

## `legacy/`

The original hand-written static site (`index.html`, `main.js`, the service
pages). Kept for reference during the rebuild — its stylesheet became
`app/globals.css` and its illustrated product icons became
`components/ProductIcon.tsx`. Safe to delete once you're happy.
