import { NextResponse } from 'next/server';

import { inventory } from '@/lib/inventory';

/**
 * Stock levels for the browser.
 *
 * A thin proxy so the API key stays on the server. Only availability is exposed
 * — never the catalogue-management or order endpoints.
 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('slugs') ?? '';
  const slugs = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const data = await inventory.getAvailability(slugs.length ? slugs : undefined);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=15, stale-while-revalidate=30' },
    });
  } catch (error) {
    console.error('[storefront] availability lookup failed:', error);
    // An empty list leaves the cart showing its cached figures rather than
    // wrongly reporting everything as sold out.
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
