/** Shapes returned by the DevsDen Inventory storefront API. */

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface Product {
  slug: string;
  /** The Xero item code. */
  sku: string;
  title: string;
  blurb: string;
  size_label: string;
  category: string;
  currency: string;
  price_cents: number;
  compare_at_cents: number | null;
  tag: string;
  images: ProductImage[];
  stock_status: StockStatus;
  /** Hard cap for the quantity picker. */
  max_orderable: number;
  sort_order: number;
  updated_at: string;
}

export interface Availability {
  slug: string;
  sku: string;
  stock_status: StockStatus;
  max_orderable: number;
  price_cents: number;
}

export interface OrderLine {
  slug: string;
  code: string;
  name: string;
  size_label: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PICKING'
  | 'FULFILLED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'NEEDS_REVIEW';

export interface Order {
  reference: string;
  status: OrderStatus;
  currency: string;
  lines: OrderLine[];
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  expires_at: string | null;
  paid_at: string | null;
  created_at: string;
}

/** A line in the browser-side cart. Only slug and quantity are trusted; the
 *  rest is display detail refreshed from the API. */
export interface CartLine {
  slug: string;
  quantity: number;
}
