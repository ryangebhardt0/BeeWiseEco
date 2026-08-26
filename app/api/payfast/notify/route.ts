import { NextResponse } from 'next/server';

import { inventory } from '@/lib/inventory';
import {
  amountCentsFrom,
  verifyAmount,
  verifySignature,
  verifySourceIp,
  verifyWithPayfast,
} from '@/lib/payfast';

/**
 * PayFast ITN receiver.
 *
 * PayFast expects a bare 200 whatever happens — a non-200 makes it retry, and
 * retrying will not fix a forged or malformed notification. So every rejection
 * below is logged and answered 200 without touching the order, which stays
 * PENDING_PAYMENT and eventually expires on its own.
 *
 * Four checks must all pass before the order is confirmed: signature, source IP,
 * amount, and PayFast's own server-to-server confirmation.
 */

const OK = () => new NextResponse('', { status: 200 });

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null;
  return request.headers.get('x-real-ip');
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const data: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(rawBody)) data[key] = value;

  const reference = data.m_payment_id;
  if (!reference) {
    console.warn('[payfast] notification with no m_payment_id');
    return OK();
  }

  // 1. Signature, computed over the raw body so field order is preserved.
  if (!verifySignature(rawBody)) {
    console.warn(`[payfast] bad signature for ${reference}`);
    return OK();
  }

  // 2. Source IP.
  if (!(await verifySourceIp(clientIp(request)))) {
    console.warn(`[payfast] notification for ${reference} from an unrecognised host`);
    return OK();
  }

  // 3. Amount, checked against what the inventory system actually reserved
  //    rather than anything the notification itself claims.
  let order;
  try {
    order = await inventory.getOrder(reference);
  } catch (error) {
    console.error(`[payfast] could not load order ${reference}:`, error);
    return OK();
  }

  if (!verifyAmount(data.amount_gross ?? '0', order.total_cents)) {
    console.warn(
      `[payfast] amount mismatch for ${reference}: paid ${data.amount_gross}, expected ${order.total_cents} cents`,
    );
    return OK();
  }

  // 4. PayFast confirms it sent this.
  if (!(await verifyWithPayfast(rawBody))) {
    console.warn(`[payfast] PayFast did not validate the notification for ${reference}`);
    return OK();
  }

  if (data.payment_status !== 'COMPLETE') {
    console.info(`[payfast] ${reference} reported ${data.payment_status}; leaving it pending`);
    return OK();
  }

  try {
    // Safe to repeat: confirmation is idempotent on the inventory side, which
    // matters because PayFast retries until it gets a 200 it likes.
    await inventory.confirmOrder(reference, data.pf_payment_id ?? '', amountCentsFrom(data));
    console.info(`[payfast] ${reference} confirmed`);
  } catch (error) {
    console.error(`[payfast] could not confirm ${reference}:`, error);
  }

  return OK();
}
