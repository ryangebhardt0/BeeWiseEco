'use client';

import Link from 'next/link';

import BrandMark from '@/components/BrandMark';
import { useCart } from '@/components/CartProvider';

export function Brand() {
  return (
    <Link href="/" className="nav__brand">
      <BrandMark />
      Bee Wise
    </Link>
  );
}

export default function Nav() {
  const { count, open } = useCart();

  return (
    <nav className="nav" id="nav">
      <div className="wrap nav__inner">
        <Brand />
        <ul className="nav__links">
          <li>
            <Link href="/#services">Services</Link>
          </li>
          <li>
            <Link href="/#shop">Shop</Link>
          </li>
          <li>
            <Link href="/#about">About</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
        </ul>
        <div className="nav__right">
          <Link href="/#contact" className="btn sm ghost">
            Get a quote
          </Link>
          <button className="nav__cart" onClick={open} aria-label={`Open cart (${count})`}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && <span className="nav__cart-count">{count}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
