import { NextResponse } from 'next/server';

import { InventoryError, inventory } from '@/lib/inventory';
import { PAYFAST_PROCESS_URL, buildPaymentFields } from '@/lib/payfast';

/**
 * Turns a cart into a reserved, priced order plus the PayFast form to pay for it.
 *
 * The browser sends slugs and quantities only. Inventory prices the order, holds
 * the stock and returns the total — so a tampered price in the request changes
 * nothing, and the amount we ask PayFast to collect always matches the order.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  const items = (payload as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: 'Your basket is empty.' }, { status: 400 });
  }

  const cleaned = items
    .map((item) => {
      const { slug, quantity } = (item ?? {}) as { slug?: unknown; quantity?: unknown };
      return typeof slug === 'string' && Number.isInteger(quantity) && (quantity as number) > 0
        ? { slug, quantity: quantity as number }
        : null;
    })
    .filter((item): item is { slug: string; quantity: number } => item !== null);

  if (cleaned.length === 0) {
    return NextResponse.json({ message: 'Your basket is empty.' }, { status: 400 });
  }

  try {
    const order = await inventory.createCheckout(cleaned);
    const itemName = `Bee Wise order ${order.reference}`;

    return NextResponse.json({
      order,
      payfast: {
        action: PAYFAST_PROCESS_URL,
        fields: buildPaymentFields({
          reference: order.reference,
          amountCents: order.total_cents,
          itemName,
        }),
      },
    });
  } catch (error) {
    if (error instanceof InventoryError) {
      const body = error.body as { detail?: string; lines?: unknown; unknown_slugs?: unknown };

      // 409 means stock moved between browsing and checking out; the per-line
      // detail lets the cart correct itself instead of just failing.
      if (error.status === 409) {
        return NextResponse.json(
          {
            message: 'Some items are no longer available in the quantity you wanted.',
            lines: body?.lines ?? [],
          },
          { status: 409 },
        );
      }
      if (error.status === 422) {
        return NextResponse.json(
          {
            message: 'Some items are no longer sold.',
            unknownSlugs: body?.unknown_slugs ?? [],
          },
          { status: 422 },
        );
      }
    }

    console.error('[storefront] checkout failed:', error);
    return NextResponse.json(
      { message: 'We could not start your checkout. Please try again shortly.' },
      { status: 502 },
    );
  }
}
