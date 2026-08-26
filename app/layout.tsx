import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';

import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/components/CartProvider';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { safeGetProducts } from '@/lib/inventory';

import './globals.css';

// Self-hosted at build time, so the site no longer depends on Google's CDN
// being reachable. The CSS variables feed --display / --body in globals.css.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bee Wise Eco Services — Urban Apiarists, Gauteng',
  description:
    'Professional pollination services, ethical bee removals & relocations, and natural bee products — raw honey, beeswax and propolis from urban apiarists in Gauteng, South Africa.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched once at the layout level so the cart drawer can name and price its
  // lines on every page, not only where the shop is rendered.
  const products = await safeGetProducts();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <CartProvider products={products ?? []}>
          <div id="top">
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
