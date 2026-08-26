'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Refreshes the order page until payment lands.
 *
 * The shopper returns from PayFast at roughly the same moment PayFast posts its
 * notification server-to-server, so the first render often shows the order as
 * still pending. Polling for a short window covers that gap without making the
 * page dynamic forever.
 */
const INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 20;

export default function OrderStatusPoller({ reference }: { reference: string }) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) return;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/order/${encodeURIComponent(reference)}`);
        if (response.ok) {
          const { status } = (await response.json()) as { status: string };
          if (status !== 'PENDING_PAYMENT') {
            router.refresh();
            return;
          }
        }
      } catch {
        // transient; the next tick will try again
      }
      setAttempts((n) => n + 1);
    }, INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [attempts, reference, router]);

  if (attempts >= MAX_ATTEMPTS) {
    return (
      <p className="checkout__fineprint">
        Still nothing from the payment gateway. If you completed payment, call us on 081 305 4398
        with reference <strong>{reference}</strong> and we will sort it out.
      </p>
    );
  }

  return <p className="checkout__fineprint">Checking… ({attempts + 1})</p>;
}
