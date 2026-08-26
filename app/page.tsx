import Link from 'next/link';

import ContactForm from '@/components/ContactForm';
import Honeycomb from '@/components/Honeycomb';
import ProductGrid from '@/components/ProductGrid';
import { safeGetProducts } from '@/lib/inventory';

// Re-rendered at most once a minute; stock badges refresh client-side from
// /api/availability so a cached page still shows current availability.
export const revalidate = 60;

const EQUIPMENT = [
  ['Full Bee Suit', 'Ventilated suit with integrated veil and gloves'],
  ['Smoker', 'Stainless steel bellow smoker for colony inspection'],
  ['Hive Tool', 'Stainless J-hive tool for frame separation'],
  ['Langstroth Hive Box', '10-frame deep or medium super box sets'],
  ['Foundation Frames', 'Beeswax or plastic foundation in wooden frames'],
  ['Queen Excluder', 'Metal or plastic excluder for brood management'],
  ['Bee Brush', 'Natural bristle brush for gentle bee removal'],
];

export default async function HomePage() {
  const products = await safeGetProducts();

  return (
    <>
      <section className="hero hero--centered">
        <div className="hero__centered-bg">
          <Honeycomb />
        </div>
        <div className="hero__centered-veil" />
        <div className="wrap hero__centered-content">
          <span className="eyebrow">Eco Services · Gauteng, South Africa</span>
          <h1 className="hero__title hero__title--mega">
            Bee Wise.
            <br />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero__title-bee" src="/assets/bee-hero.png" alt="" />
          </h1>
          <p className="hero__lede" style={{ maxWidth: 580, margin: '24px auto 32px' }}>
            Professional pollination services · ethical bee removals &amp; relocations · raw honey,
            beeswax &amp; propolis from South Africa&rsquo;s urban apiarists.
          </p>
          <div className="hero__ctas hero__ctas--center">
            <Link href="#shop" className="btn honey">
              Shop the hive →
            </Link>
            <Link href="/removals" className="btn ghost">
              Book a removal
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="wrap">
          <div className="stats__grid">
            <div className="stat">
              <div className="stat__num">8</div>
              <div className="stat__label">Provinces served</div>
            </div>
            <div className="stat">
              <div className="stat__num">30%</div>
              <div className="stat__label">Max crop yield boost</div>
            </div>
            <div className="stat">
              <div className="stat__num">{products?.length ?? 12}</div>
              <div className="stat__label">Natural bee products</div>
            </div>
            <div className="stat">
              <div className="stat__num" style={{ color: 'var(--coral)' }}>
                0
              </div>
              <div className="stat__label">Needless exterminations</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section-pad services">
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow">Services</span>
            <h2 className="section-title">
              Got a swarm? Need a pollinator?
              <br />
              <em style={{ color: 'var(--coral)', fontStyle: 'italic' }}>We&rsquo;re on it.</em>
            </h2>
          </header>
          <div className="services__grid">
            <article className="service-card">
              <div className="service-card__hex">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2C7 8 5 12 5 16a7 7 0 0014 0c0-4-2-8-7-14z" />
                </svg>
              </div>
              <h3>Pollination Services</h3>
              <p>
                Hive deployment across South Africa to boost crop yields, improve fruit &amp; nut
                production, and increase agricultural productivity.
              </p>
              <ul>
                <li>Managed African honey bee colonies</li>
                <li>Placed, monitored &amp; collected by our team</li>
                <li>All provinces except the Western Cape</li>
              </ul>
              <Link href="/pollination" className="service-card__cta">
                Explore pollination services →
              </Link>
            </article>
            <article className="service-card">
              <div className="service-card__hex">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>Bee Removals</h3>
              <p>
                Safe, ethical removal and relocation of bee colonies from homes, businesses, and
                urban spaces — without extermination.
              </p>
              <ul>
                <li>Relocation, not extermination</li>
                <li>Residential, commercial &amp; municipal</li>
                <li>Prompt response for urgent removals</li>
              </ul>
              <Link href="/removals" className="service-card__cta">
                Explore bee removals →
              </Link>
            </article>
          </div>

          <div className="equipment" id="equipment">
            <h3 className="equipment__title">Equipment &amp; Supplies</h3>
            <p className="equipment__lede">
              We supply a full range of professional beekeeping equipment for hobbyists and
              commercial operations alike.
            </p>
            <div className="equipment__grid">
              {EQUIPMENT.map(([name, detail]) => (
                <div className="supply-item" key={name}>
                  <strong>{name}</strong>
                  {detail}
                </div>
              ))}
            </div>
            <p style={{ marginTop: 24 }}>
              <Link href="#contact" className="service-card__cta">
                Ask about equipment →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section id="shop" className="section-pad shop">
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow">The Shop</span>
            <h2 className="section-title">
              Sweet stuff,
              <br />
              straight from the hive.
            </h2>
            <p className="section-lede">
              Raw honey, beeswax goods, and propolis health products — pure, natural, and harvested
              with care — plus concrete Langstroth hives built to last.
            </p>
          </header>

          <div className="shop__cat" id="shop-honey">
            <h3 className="shop__cat-title">Honey</h3>
            <p className="shop__cat-lede">
              Pure, raw honey harvested from African honey bee hives across the Highveld. No heating,
              no filtering, no additives — just honey exactly as nature intended.
            </p>
            <ProductGrid products={products} category="honey" />
          </div>

          <div className="shop__cat" id="shop-beeswax">
            <h3 className="shop__cat-title">Beeswax</h3>
            <p className="shop__cat-lede">
              Natural beeswax products crafted in small batches — from nourishing skincare to
              hand-poured candles and hive supplies. Clean, pure, and sustainably sourced.
            </p>
            <ProductGrid products={products} category="beeswax" />
          </div>

          <div className="shop__cat" id="shop-propolis">
            <h3 className="shop__cat-title">Propolis</h3>
            <p className="shop__cat-lede">
              Propolis is a resinous compound bees collect from tree buds and sap flows, used to
              seal, sterilise and protect the hive — prized for its antimicrobial, anti-inflammatory,
              antifungal and antioxidant properties.
            </p>
            <ProductGrid products={products} category="propolis" />
            <div className="note-box">
              <strong>Important safety information</strong>
              Propolis may cause allergic reactions in individuals sensitive to bee products, tree
              resins, or certain plants. Do not use propolis products if you are allergic to honey,
              beeswax, or pollen. Consult a qualified healthcare provider before using propolis
              supplements, particularly if you are pregnant, breastfeeding, taking medication, or
              managing a medical condition. These products are not intended to diagnose, treat, cure,
              or prevent any disease.
            </div>
          </div>

          <div className="shop__cat" id="shop-concrete-hives">
            <h3 className="shop__cat-title">Concrete Hives</h3>
            <p className="shop__cat-lede">
              Engineered for climate resilience and ultimate apiary security across South Africa. Our
              permanent, lightweight-concrete Langstroth hives offer maximum insulation and unmatched
              protection against elements, pests, and theft.
            </p>
            <ProductGrid products={products} category="concrete hives" />
            <div className="cat-feature">
              <h4 className="cat-feature__title">
                Built to outlast timber.
                <br />
                Formulated to protect your swarm.
              </h4>
              <p>
                Traditional wooden bee boxes face tough challenges in South African conditions —
                from scorching Highveld sun and sudden veld fires to wood rot, vandalism, and honey
                badgers. Our Concrete Langstroth Hive is the ultimate, low-maintenance alternative
                engineered to give your colonies a permanent, highly secure, and thermally stable
                home.
              </p>
              <p>
                Crafted from a specialized lightweight, steel-reinforced concrete mix, this hive
                matches industry-standard Langstroth dimensions. It seamlessly integrates with your
                existing 10-frame setups, queen excluders, and supers, meaning you can upgrade your
                apiary&rsquo;s security without changing your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-pad about">
        <div className="wrap about__grid">
          <div className="about__media">
            <div className="about__media-label"># the-bee-wise-team.jpg</div>
          </div>
          <div className="about__copy">
            <span className="eyebrow">Who We Are</span>
            <h2>
              South Africa&rsquo;s
              <br />
              urban apiarists.
            </h2>
            <p>
              Bee Wise Eco Services operates daily throughout <strong>Gauteng, South Africa</strong>,
              bringing expert, ethical beekeeping to urban and peri-urban environments. Our team of
              passionate apiarists is dedicated to the conservation and responsible management of the
              African honey bee.
            </p>
            <p>
              We offer professional pollination services, humane bee removals &amp; relocations, and
              a curated range of natural bee-derived products — all with the utmost respect for bees
              and the ecosystems they sustain.
            </p>
            <div className="about__sig">— The Bee Wise team</div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-pad contact">
        <div className="wrap contact__grid">
          <div>
            <span className="eyebrow">Get in touch</span>
            <h2 className="section-title">
              Say buzz.
              <br />
              We respond promptly.
            </h2>
            <p className="contact__lede">
              For urgent removals or quotations, call us — we respond promptly. Pollination bookings,
              product orders and equipment enquiries also welcome.
            </p>
            <div className="contact__info">
              <div className="contact__info-row">
                <span className="icon">☎</span>
                <span>081 305 4398</span>
              </div>
              <div className="contact__info-row">
                <span className="icon">✉</span>
                <span>ryangebhardt0@gmail.com</span>
              </div>
              <div className="contact__info-row">
                <span className="icon">⌖</span>
                <span>Gauteng, South Africa</span>
              </div>
              <div className="contact__info-row">
                <span className="icon">◎</span>
                <span>
                  <a href="https://instagram.com/beewiseeco" target="_blank" rel="noopener">
                    @beewiseeco
                  </a>
                </span>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
