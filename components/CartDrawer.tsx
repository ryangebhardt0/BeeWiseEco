'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCart } from '@/components/CartProvider';
import ProductIcon, { iconFor, swatchFor } from '@/components/ProductIcon';
import { formatRands } from '@/lib/money';

export default function CartDrawer() {
  const router = useRouter();
  const { lines, catalogue, availability, isOpen, isSyncing, subtotalCents, setQuantity, close } =
    useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    setError('');
    setBusy(true);
    close();
    router.push('/checkout');
    setBusy(false);
  };

  return (
    <>
      <div className={`cart-scrim${isOpen ? ' open' : ''}`} onClick={close} />
      <aside
        className={`cart-drawer${isOpen ? ' open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Shopping basket"
      >
        <header className="cart-drawer__head">
          <h3>Your basket</h3>
          <button className="cart-close" onClick={close} aria-label="Close cart">
            ✕
          </button>
        </header>

        <div className="cart-drawer__body">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__hex">⬢</div>
              <p>
                Nothing in here yet.
                <br />
                Go grab some honey.
              </p>
            </div>
          ) : (
            <ul className="cart-list">
              {lines.map((line) => {
                const product = catalogue[line.slug];
                const stock = availability[line.slug];
                const price = stock?.price_cents ?? product?.price_cents ?? 0;
                const cap = stock?.max_orderable ?? product?.max_orderable ?? 0;
                const atCap = line.quantity >= cap;

                return (
                  <li className="cart-item" key={line.slug}>
                    <div
                      className="cart-item__thumb"
                      style={{ background: swatchFor(product?.category ?? '') }}
                    >
                      <ProductIcon
                        kind={iconFor(product?.category ?? '', product?.title ?? '')}
                        size={44}
                      />
                    </div>
                    <div className="cart-item__body">
                      <div className="cart-item__name">{product?.title ?? line.slug}</div>
                      <div className="cart-item__size">{product?.size_label}</div>
                      <div className="cart-item__row">
                        <div className="qty">
                          <button
                            onClick={() => setQuantity(line.slug, line.quantity - 1)}
                            aria-label={`Decrease ${product?.title ?? line.slug}`}
                          >
                            −
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            onClick={() => setQuantity(line.slug, line.quantity + 1)}
                            disabled={atCap}
                            aria-label={`Increase ${product?.title ?? line.slug}`}
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item__price">{formatRands(price * line.quantity)}</span>
                      </div>
                      {atCap && cap > 0 && (
                        <div className="cart-item__limit">Only {cap} left</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="cart-drawer__foot">
          <div className="cart-total">
            <span>Subtotal{isSyncing ? ' (checking stock…)' : ''}</span>
            <strong>{formatRands(subtotalCents)}</strong>
          </div>
          {error && <p className="cart-error">{error}</p>}
          <button
            className="btn honey"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={lines.length === 0 || busy}
            onClick={handleCheckout}
          >
            Checkout →
          </button>
          <p className="cart-note">
            Delivery is calculated at checkout. Free pickup from our Gauteng location.
          </p>
        </footer>
      </aside>
    </>
  );
}
