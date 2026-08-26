import Link from 'next/link';
import { notFound } from 'next/navigation';

import OrderStatusPoller from '@/components/OrderStatusPoller';
import { inventory } from '@/lib/inventory';
import { formatRands } from '@/lib/money';
import type { Order } from '@/lib/types';

// PayFast's ITN often lands within a second or two of the shopper returning, so
// this page must never be cached.
export const dynamic = 'force-dynamic';

export default async function OrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  let order: Order;
  try {
    order = await inventory.getOrder(reference);
  } catch {
    notFound();
  }

  const paid = ['PAID', 'PICKING', 'FULFILLED'].includes(order.status);

  return (
    <section className="section-pad">
      <div className="wrap checkout">
        <span className="eyebrow">Order {order.reference}</span>

        {paid ? (
          <>
            <h1 className="section-title">Thank you — payment received.</h1>
            <p className="section-lede">
              We&rsquo;re packing your order now. You&rsquo;ll hear from us about collection or
              delivery shortly.
            </p>
          </>
        ) : order.status === 'PENDING_PAYMENT' ? (
          <>
            <h1 className="section-title">Waiting for payment confirmation…</h1>
            <p className="section-lede">
              This usually takes a few seconds. The page will update on its own.
            </p>
            <OrderStatusPoller reference={order.reference} />
          </>
        ) : order.status === 'NEEDS_REVIEW' ? (
          <>
            <h1 className="section-title">We&rsquo;re checking this one.</h1>
            <p className="section-lede">
              Your payment came through but didn&rsquo;t match the order total exactly, so
              we&rsquo;re reviewing it by hand. We&rsquo;ll be in touch — nothing further is needed
              from you.
            </p>
          </>
        ) : (
          <>
            <h1 className="section-title">This order was not completed.</h1>
            <p className="section-lede">
              The reservation was released, so the items are back on sale. Please order again, or
              call us on 081 305 4398 if something went wrong.
            </p>
          </>
        )}

        <table className="checkout__table">
          <tbody>
            {order.lines.map((line) => (
              <tr key={line.slug}>
                <td>
                  <strong>{line.name}</strong>
                  {line.size_label && <span className="checkout__size"> · {line.size_label}</span>}
                </td>
                <td>{line.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatRands(line.line_total_cents)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Subtotal</td>
              <td style={{ textAlign: 'right' }}>{formatRands(order.subtotal_cents)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Delivery</td>
              <td style={{ textAlign: 'right' }}>
                {order.shipping_cents === 0 ? 'Free' : formatRands(order.shipping_cents)}
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <strong>Total</strong>
              </td>
              <td style={{ textAlign: 'right' }}>
                <strong>{formatRands(order.total_cents)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="hero__ctas">
          <Link href="/#shop" className="btn honey">
            Back to the shop →
          </Link>
        </div>
      </div>
    </section>
  );
}
