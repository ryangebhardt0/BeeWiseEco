'use client';

import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

/**
 * One category's grid.
 *
 * When the inventory system is unreachable the page passes `products: null`,
 * and the section explains itself rather than rendering an empty shop.
 */
export default function ProductGrid({
  products,
  category,
}: {
  products: Product[] | null;
  category: string;
}) {
  if (products === null) {
    return (
      <div className="product-grid__notice">
        Our product list is briefly unavailable. Please call 081 305 4398 or email
        ryangebhardt0@gmail.com and we will help you order.
      </div>
    );
  }

  const inCategory = products
    .filter((p) => p.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));

  if (inCategory.length === 0) {
    return <div className="product-grid__notice">Nothing in this range at the moment.</div>;
  }

  return (
    <div className="product-grid product-grid--four">
      {inCategory.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
