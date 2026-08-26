'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Availability, CartLine, Product } from '@/lib/types';

/**
 * The cart.
 *
 * localStorage holds only slugs and quantities. Prices, titles and stock come
 * from the API on every load — the old site stored a full copy of each product
 * in localStorage, so a cart opened weeks later still showed the price from the
 * day it was filled.
 */

const STORAGE_KEY = 'beewise_cart_v2';

interface CartContextValue {
  lines: CartLine[];
  /** Catalogue detail for what is in the cart, keyed by slug. */
  catalogue: Record<string, Product>;
  availability: Record<string, Availability>;
  isOpen: boolean;
  isSyncing: boolean;
  count: number;
  subtotalCents: number;
  add: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is CartLine => typeof l?.slug === 'string' && Number.isInteger(l?.quantity))
      .map((l) => ({ slug: l.slug, quantity: Math.max(1, l.quantity) }));
  } catch {
    return [];
  }
}

export function CartProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [availability, setAvailability] = useState<Record<string, Availability>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const catalogue = useMemo(() => {
    const map: Record<string, Product> = {};
    for (const product of products) map[product.slug] = product;
    return map;
  }, [products]);

  // Restore after mount so the server and first client render agree.
  useEffect(() => {
    setLines(readStored());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage disabled; the cart is simply not persisted
    }
  }, [lines]);

  /** Re-check stock and drop anything that has since sold out or been unlisted. */
  const sync = useCallback(async (current: CartLine[]) => {
    if (current.length === 0) {
      setAvailability({});
      return;
    }
    setIsSyncing(true);
    try {
      const slugs = current.map((l) => l.slug).join(',');
      const response = await fetch(`/api/availability?slugs=${encodeURIComponent(slugs)}`);
      if (!response.ok) return;
      const { items } = (await response.json()) as { items: Availability[] };

      const map: Record<string, Availability> = {};
      for (const item of items) map[item.slug] = item;
      setAvailability(map);

      setLines((existing) =>
        existing
          .map((line) => {
            const stock = map[line.slug];
            // A slug the API no longer returns has been unpublished.
            if (!stock) return null;
            if (stock.max_orderable <= 0) return null;
            return { ...line, quantity: Math.min(line.quantity, stock.max_orderable) };
          })
          .filter((line): line is CartLine => line !== null),
      );
    } catch {
      // Offline or backend down: leave the cart as-is rather than emptying it.
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    void sync(lines);
    // Re-syncing on every quantity nudge would be chatty; the checkout call
    // re-validates server-side anyway, so syncing on cart size is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.length, sync]);

  const add = useCallback(
    (slug: string) => {
      setLines((existing) => {
        const cap = availability[slug]?.max_orderable ?? catalogue[slug]?.max_orderable ?? 0;
        if (cap <= 0) return existing;
        const found = existing.find((l) => l.slug === slug);
        if (!found) return [...existing, { slug, quantity: 1 }];
        return existing.map((l) =>
          l.slug === slug ? { ...l, quantity: Math.min(l.quantity + 1, cap) } : l,
        );
      });
      setIsOpen(true);
    },
    [availability, catalogue],
  );

  const setQuantity = useCallback(
    (slug: string, quantity: number) => {
      setLines((existing) => {
        if (quantity <= 0) return existing.filter((l) => l.slug !== slug);
        const cap = availability[slug]?.max_orderable ?? catalogue[slug]?.max_orderable ?? 0;
        return existing.map((l) =>
          l.slug === slug ? { ...l, quantity: Math.min(quantity, cap) } : l,
        );
      });
    },
    [availability, catalogue],
  );

  const remove = useCallback((slug: string) => {
    setLines((existing) => existing.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  // Indicative only. The server recomputes the real total at checkout.
  const subtotalCents = lines.reduce((sum, line) => {
    const price = availability[line.slug]?.price_cents ?? catalogue[line.slug]?.price_cents ?? 0;
    return sum + price * line.quantity;
  }, 0);

  const value: CartContextValue = {
    lines,
    catalogue,
    availability,
    isOpen,
    isSyncing,
    count,
    subtotalCents,
    add,
    setQuantity,
    remove,
    clear,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider.');
  return context;
}
