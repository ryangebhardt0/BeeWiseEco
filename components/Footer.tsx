import Link from 'next/link';

import BrandMark from '@/components/BrandMark';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <div className="nav__brand">
              <BrandMark />
              Bee Wise
            </div>
            <p className="footer__brand-text">
              Professional pollination services, ethical bee removals &amp; natural bee products.
              Urban apiarists working daily throughout Gauteng, South Africa.
            </p>
          </div>
          <div className="footer__col">
            <h4>Services</h4>
            <ul>
              <li>
                <Link href="/pollination">Pollination Services</Link>
              </li>
              <li>
                <Link href="/removals">Bee Removals</Link>
              </li>
              <li>
                <Link href="/#equipment">Equipment &amp; Supplies</Link>
              </li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Shop</h4>
            <ul>
              <li>
                <Link href="/#shop-honey">Honey</Link>
              </li>
              <li>
                <Link href="/#shop-beeswax">Beeswax</Link>
              </li>
              <li>
                <Link href="/#shop-propolis">Propolis</Link>
              </li>
              <li>
                <Link href="/#shop-concrete-hives">Concrete Hives</Link>
              </li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Visit</h4>
            <ul>
              <li>Gauteng, South Africa</li>
              <li>ryangebhardt0@gmail.com</li>
              <li>081 305 4398</li>
              <li>
                <a href="https://instagram.com/beewiseeco" target="_blank" rel="noopener">
                  @beewiseeco
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Bee Wise Eco Services · All rights reserved</span>
          <span>
            <a href="https://instagram.com/beewiseeco" target="_blank" rel="noopener">
              Instagram: @beewiseeco
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
