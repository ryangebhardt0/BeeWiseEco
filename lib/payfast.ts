import 'server-only';

import crypto from 'crypto';
import dns from 'dns/promises';

/**
 * PayFast integration.
 *
 * Payment notifications (ITNs) are verified four ways before the order is
 * confirmed, per PayFast's own guidance: signature, source IP, amount, and a
 * server-to-server confirmation. Any one of them failing means we do not treat
 * the payment as real.
 */

const SANDBOX = process.env.PAYFAST_SANDBOX !== 'false';
const HOST = SANDBOX ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';

export const PAYFAST_PROCESS_URL = `https://${HOST}/eng/process`;
const PAYFAST_VALIDATE_URL = `https://${HOST}/eng/query/validate`;

// PayFast posts ITNs from these hosts only. Resolved at request time rather
// than hardcoded, because the underlying addresses change.
const VALID_HOSTS = [
  'www.payfast.co.za',
  'sandbox.payfast.co.za',
  'w1w.payfast.co.za',
  'w2w.payfast.co.za',
];

/** PayFast's encoding: spaces as `+`, everything else percent-encoded. */
const encode = (value: string) => encodeURIComponent(value.trim()).replace(/%20/g, '+');

/**
 * Signature over an ordered list of key/value pairs.
 *
 * PayFast signs parameters in the order they appear, never sorted, so callers
 * must preserve the order they will actually be transmitted or received in.
 */
function md5Signature(pairs: [string, string][], passphrase: string): string {
  let payload = pairs.map(([key, value]) => `${key}=${encode(value)}`).join('&');
  if (passphrase) payload += `&passphrase=${encode(passphrase)}`;
  return crypto.createHash('md5').update(payload).digest('hex');
}

/**
 * Signature for a payment request we are sending.
 *
 * Empty fields are omitted here — that is what PayFast's own request sample
 * does. The ITN rule is different; see itnSignature.
 */
function requestSignature(params: Record<string, string>, passphrase: string): string {
  const pairs = Object.entries(params).filter(([, value]) => value !== '') as [string, string][];
  return md5Signature(pairs, passphrase);
}

/**
 * Signature for an ITN we have received.
 *
 * Deliberately different from requestSignature: PayFast's ITN sample walks the
 * posted fields in order, stops at `signature`, and does NOT skip empty values.
 * Since PayFast routinely posts empty fields (name_last, custom_str1, …),
 * dropping them here would make every genuine notification fail to verify.
 */
function itnSignature(rawBody: string, passphrase: string): string {
  const pairs: [string, string][] = [];
  for (const [key, value] of new URLSearchParams(rawBody)) {
    if (key === 'signature') break;
    pairs.push([key, value]);
  }
  return md5Signature(pairs, passphrase);
}

export interface PaymentRequest {
  reference: string;
  amountCents: number;
  itemName: string;
}

/**
 * The fields to POST to PAYFAST_PROCESS_URL, signature included.
 *
 * Field order matters: PayFast builds its own signature from the order it
 * receives, so this object's insertion order is part of the contract.
 */
export function buildPaymentFields({
  reference,
  amountCents,
  itemName,
}: PaymentRequest): Record<string, string> {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

  const fields: Record<string, string> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID ?? '',
    merchant_key: process.env.PAYFAST_MERCHANT_KEY ?? '',
    return_url: `${site}/order/${reference}`,
    cancel_url: `${site}/checkout?cancelled=${reference}`,
    notify_url: `${site}/api/payfast/notify`,
    // m_payment_id is echoed back on the ITN — it is how we find the order.
    m_payment_id: reference,
    amount: (amountCents / 100).toFixed(2),
    item_name: itemName.slice(0, 100),
  };

  fields.signature = requestSignature(fields, process.env.PAYFAST_PASSPHRASE ?? '');
  return fields;
}

/**
 * 1. The ITN's own signature must match what we compute over its fields.
 *
 * Takes the raw body rather than a parsed object because field order is part of
 * what is signed, and re-serialising a parsed object can reorder it.
 */
export function verifySignature(rawBody: string): boolean {
  const supplied = new URLSearchParams(rawBody).get('signature');
  if (!supplied) return false;
  const expected = itnSignature(rawBody, process.env.PAYFAST_PASSPHRASE ?? '');
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** 2. The request must have come from a PayFast host. */
export async function verifySourceIp(ip: string | null): Promise<boolean> {
  if (!ip) return false;
  const resolved = await Promise.all(
    VALID_HOSTS.map((host) => dns.resolve4(host).catch(() => [] as string[])),
  );
  return resolved.flat().includes(ip);
}

/**
 * 3. The amount paid must match what we asked for.
 *
 * PayFast's own tolerance is a cent either way, which covers their rounding.
 */
export function verifyAmount(paidGross: string, expectedCents: number): boolean {
  const paidCents = Math.round(Number(paidGross) * 100);
  return Number.isFinite(paidCents) && Math.abs(paidCents - expectedCents) <= 1;
}

/** 4. PayFast itself must confirm it sent this notification. */
export async function verifyWithPayfast(rawBody: string): Promise<boolean> {
  try {
    const response = await fetch(PAYFAST_VALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: rawBody,
    });
    const text = await response.text();
    return text.trim().startsWith('VALID');
  } catch (error) {
    console.error('[payfast] validation callback failed:', error);
    return false;
  }
}

export function amountCentsFrom(data: Record<string, string>): number {
  return Math.round(Number(data.amount_gross ?? '0') * 100);
}
