import { NextResponse } from 'next/server';

import { inventory } from '@/lib/inventory';

/**
 * Order status for the thank-you page's poller.
 *
 * Returns the status only — the full order is already rendered server-side, and
 * an order reference is guessable enough that it should not be a lookup key for
 * anything more than "has this been paid yet".
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  try {
    const order = await inventory.getOrder(reference);
    return NextResponse.json({ status: order.status }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
}
