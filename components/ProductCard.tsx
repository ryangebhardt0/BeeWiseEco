'use client';

import ProductIcon, { iconFor, swatchFor } from '@/components/ProductIcon';
import { useCart } from '@/components/CartProvider';
import { formatRands } from '@/lib/money';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const { add, availability } = useCart();

  // Prefer the freshly polled figure over the one baked into the cached page.
  const live = availability[product.slug];
  const status = live?.stock_status ?? product.stock_status;
  const maxOrderable = live?.max_orderable ?? product.max_orderable;
  const priceCents = live?.price_cents ?? product.price_cents;

  const soldOut = status === 'out_of_stock' || maxOrderable <= 0;
  const image = product.images[0];

  // "Sold out" outranks a marketing badge — it is the more useful thing to say.
  const badge = soldOut ? 'Sold out' : status === 'low_stock' ? 'Low stock' : product.tag;

  return (
    <article className={`product${soldOut ? ' badge--off' : ''}`} data-id={product.slug}>
      <div className="product__media" style={{ background: swatchFor(product.category) }}>
        {badge && <span className="product__tag">{badge}</span>}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt || product.title}
            width={image.width ?? undefined}
            height={image.height ?? undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="product__icon">
            <ProductIcon kind={iconFor(product.category, product.title)} size={64} />
          </div>
        )}
      </div>

      <div className="product__body">
        <div className="product__head">
          <h3 className="product__name">{product.title}</h3>
          <span className="product__price">{formatRands(priceCents)}</span>
        </div>
        <p className="product__blurb">{product.blurb}</p>
        <div className="product__foot">
          <span className="product__size">{product.size_label}</span>
          <button
            className="product__add"
            onClick={() => add(product.slug)}
            disabled={soldOut}
            aria-label={soldOut ? `${product.title} is sold out` : `Add ${product.title} to cart`}
          >
            {soldOut ? 'Sold out' : 'Add to cart'}
            {!soldOut && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
