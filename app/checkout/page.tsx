'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useCart } from '@/components/CartProvider';
import { formatRands } from '@/lib/money';
import type { Order } from '@/lib/types';

interface CheckoutResponse {
  order: Order;
  payfast: { action: string; fields: Record<string, string> };
}

interface ShortLine {
  slug: string;
  requested: number;
  available: number;
}

export default function CheckoutPage() {
  const { lines, catalogue, availability, subtotalCents, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [shortLines, setShortLines] = useState<ShortLine[]>([]);
  const [redirecting, setRedirecting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [payfast, setPayfast] = useState<CheckoutResponse['payfast'] | null>(null);

  // Once the PayFast form is rendered with its signed fields, submit it. It has
  // to be a real form POST — PayFast will not accept a fetch.
  useEffect(() => {
    if (payfast && formRef.current) {
      setRedirecting(true);
      formRef.current.submit();
    }
  }, [payfast]);

  const startCheckout = async () => {
    setBusy(true);
    setError('');
    setShortLines([]);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })) }),
      });
      const body = await response.json();

      if (response.status === 409) {
        setShortLines(body.lines ?? []);
        setError(body.message ?? 'Some items are no longer available.');
        return;
      }
      if (!response.ok) {
        setError(body.message ?? 'We could not start your checkout.');
        return;
      }

      // The cart has done its job; the order now lives server-side and holds
      // the stock. Clearing here avoids a duplicate order on the way back.
      clear();
      setPayfast((body as CheckoutResponse).payfast);
    } catch {
      setError('We could not reach the checkout. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  if (redirecting) {
    return (
      <section className="section-pad">
        <div className="wrap checkout">
          <h1 className="section-title">Taking you to PayFast…</h1>
          <p className="section-lede">Please don&rsquo;t close this window.</p>
        </div>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="section-pad">
        <div className="wrap checkout">
          <span className="eyebrow">Checkout</span>
          <h1 className="section-title">Your basket is empty.</h1>
          <p className="section-lede">Nothing to pay for just yet.</p>
          <Link href="/#shop" className="btn honey">
            Back to the shop →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <div className="wrap checkout">
        <span className="eyebrow">Checkout</span>
        <h1 className="section-title">Review your order.</h1>

        <table className="checkout__table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th style={{ textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => {
              const product = catalogue[line.slug];
              const price = availability[line.slug]?.price_cents ?? product?.price_cents ?? 0;
              const short = shortLines.find((s) => s.slug === line.slug);
              return (
                <tr key={line.slug} className={short ? 'checkout__row--short' : undefined}>
                  <td>
                    <strong>{product?.title ?? line.slug}</strong>
                    {product?.size_label && (
                      <span className="checkout__size"> · {product.size_label}</span>
                    )}
                    {short && (
                      <div className="checkout__short">
                        Only {short.available} left — reduce the quantity to continue.
                      </div>
                    )}
                  </td>
                  <td>{line.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatRands(price * line.quantity)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Subtotal</td>
              <td style={{ textAlign: 'right' }}>{formatRands(subtotalCents)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="checkout__note">
                Delivery is added on the next step, once your order is priced.
              </td>
            </tr>
          </tfoot>
        </table>

        {error && <p className="checkout__error">{error}</p>}

        <div className="hero__ctas">
          <button className="btn honey" onClick={startCheckout} disabled={busy}>
            {busy ? 'Reserving your order…' : 'Pay with PayFast →'}
          </button>
          <Link href="/#shop" className="btn ghost">
            Keep shopping
          </Link>
        </div>

        <p className="checkout__fineprint">
          Your stock is held while you pay. If payment isn&rsquo;t completed in time the hold is
          released and the items go back on sale.
        </p>

        {payfast && (
          <form ref={formRef} action={payfast.action} method="post" hidden>
            {Object.entries(payfast.fields).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} readOnly />
            ))}
          </form>
        )}
      </div>
    </section>
  );
}
