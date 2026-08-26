import 'server-only';

import { cache } from 'react';

import type { Availability, Order, Product } from './types';

/**
 * Server-side client for the DevsDen Inventory storefront API.
 *
 * The API key must never reach the browser, so everything here runs on the
 * server: pages fetch through it during render, and browser-initiated actions
 * go via the route handlers in app/api.
 */

const BASE = process.env.INVENTORY_API_URL?.replace(/\/$/, '') ?? '';
const KEY = process.env.INVENTORY_API_KEY ?? '';

export class InventoryError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`Inventory API responded ${status}`);
  }
}

export function isConfigured(): boolean {
  return Boolean(BASE && KEY);
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Seconds to cache a GET. 0 disables caching. */
  revalidate?: number;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isConfigured()) {
    throw new InventoryError(0, 'INVENTORY_API_URL and INVENTORY_API_KEY must be set.');
  }

  const { method = 'GET', body, revalidate } = options;
  const response = await fetch(`${BASE}/api/storefront/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    // Writes must never be cached; reads use ISR-style revalidation.
    ...(method === 'GET' && revalidate !== undefined
      ? { next: { revalidate } }
      : { cache: 'no-store' as const }),
  });

  const text = await response.text();
  let parsed: unknown = text;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      // leave as text
    }
  }

  if (!response.ok) throw new InventoryError(response.status, parsed);
  return parsed as T;
}

export const inventory = {
  /** The published catalogue. Cached for a minute — stock badges are refreshed
   *  separately from getAvailability so the page itself need not re-render. */
  getProducts: () =>
    request<{ currency: string; products: Product[] }>('/products/', { revalidate: 60 }),

  getProduct: (slug: string) =>
    request<Product>(`/products/${encodeURIComponent(slug)}/`, { revalidate: 60 }),

  getAvailability: (slugs?: string[]) =>
    request<{ items: Availability[] }>(
      `/availability/${slugs?.length ? `?slugs=${slugs.map(encodeURIComponent).join(',')}` : ''}`,
      { revalidate: 15 },
    ),

  /** Prices and reserves a cart. The returned total is authoritative — it is
   *  what PayFast must be asked to collect. */
  createCheckout: (items: { slug: string; quantity: number }[], idempotencyKey?: string) =>
    request<Order>('/checkouts/', {
      method: 'POST',
      body: { items, idempotency_key: idempotencyKey },
    }),

  getOrder: (reference: string) =>
    request<Order>(`/orders/${encodeURIComponent(reference)}/`),

  /** Called only after a payment notification has been fully verified. */
  confirmOrder: (reference: string, paymentRef: string, amountGrossCents: number) =>
    request<Order>(`/orders/${encodeURIComponent(reference)}/confirm/`, {
      method: 'POST',
      body: { payment_ref: paymentRef, amount_gross_cents: amountGrossCents },
    }),

  cancelOrder: (reference: string) =>
    request<Order>(`/orders/${encodeURIComponent(reference)}/cancel/`, { method: 'POST' }),
};

let warnedUnconfigured = false;

/**
 * The catalogue, or null if it cannot be loaded.
 *
 * Callers render a degraded page rather than an error: neither an unreachable
 * backend nor a half-finished local setup should take the whole site down.
 *
 * Wrapped in React's `cache` so the layout and the page — both of which need
 * the catalogue — share a single call per render rather than each fetching
 * (and each logging) independently.
 */
export const safeGetProducts = cache(async (): Promise<Product[] | null> => {
  // Missing configuration is a setup step, not a failure. Say so once, plainly,
  // instead of throwing a stack trace into the dev overlay on every render.
  if (!isConfigured()) {
    if (!warnedUnconfigured) {
      warnedUnconfigured = true;
      console.warn(
        '[storefront] INVENTORY_API_URL / INVENTORY_API_KEY are not set, so the shop is ' +
          'rendering without products. Copy .env.example to .env.local and fill them in.',
      );
    }
    return null;
  }

  try {
    const { products } = await inventory.getProducts();
    return products;
  } catch (error) {
    console.error('[storefront] could not load products:', error);
    return null;
  }
});
