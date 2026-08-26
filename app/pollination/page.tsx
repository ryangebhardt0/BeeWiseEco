import type { Metadata } from 'next';
import Link from 'next/link';

import Honeycomb from '@/components/Honeycomb';

export const metadata: Metadata = {
  title: 'Pollination Services — Bee Wise Eco Services',
  description:
    'Managed African honey bee colonies deployed across South Africa to boost crop yields, fruit and nut quality, and agricultural productivity.',
};

const PROVINCES = [
  'Gauteng',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'KwaZulu-Natal',
  'Northern Cape',
  'Eastern Cape',
];

const BENEFITS = [
  [
    'Improved Crop Yields',
    'Managed pollination increases the percentage of flowers that successfully set seed or fruit, directly boosting your harvest volume.',
  ],
  [
    'Better Fruit & Nut Quality',
    'Thorough pollination leads to more uniformly sized, better-shaped, and more nutritious fruit — commanding higher market prices.',
  ],
  [
    'Increased Agricultural Productivity',
    'Across all pollinator-dependent crops — sunflowers, avocados, macadamias, citrus, berries, and more — managed bee colonies can increase yield by 15–30%.',
  ],
  [
    'Eco-Responsible Practice',
    'Our African bees are robust, locally adapted pollinators. Using them supports biodiversity and reduces reliance on pesticides.',
  ],
];

export default function PollinationPage() {
  return (
    <>
      <section className="hero hero--centered hero--page">
        <div className="hero__centered-bg">
          <Honeycomb />
        </div>
        <div className="hero__centered-veil" />
        <div className="wrap hero__centered-content">
          <span className="eyebrow">Services</span>
          <h1 className="hero__title hero__title--page">
            Pollination
            <br />
            Services
          </h1>
          <p className="hero__lede" style={{ maxWidth: 620, margin: '24px auto 0' }}>
            Helping South African farmers and growers unlock the full potential of their crops
            through managed African honey bee colonies.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="wrap svc-article">
          <div>
            <h3>Service coverage</h3>
            <p>
              We provide professional pollination services across <strong>South Africa</strong>, with
              the exception of the <strong>Western Cape</strong>. This restriction exists to protect
              the ecological balance of the region — we work exclusively with{' '}
              <em>African honey bees (Apis mellifera scutellata)</em>, which are genetically
              incompatible with the Cape honey bee <em>(Apis mellifera capensis)</em> subspecies
              native to the Western Cape. Introducing African bees to that ecosystem could have
              devastating consequences for the local bee population and biodiversity.
            </p>
            <div className="badges">
              {PROVINCES.map((province) => (
                <span className="badge" key={province}>
                  {province}
                </span>
              ))}
              <span className="badge badge--off">Western Cape (not available)</span>
            </div>
          </div>

          <div>
            <h3>What pollination services involve</h3>
            <p>
              Our team delivers managed hives to your farm or orchard at the optimal time in your
              crop&rsquo;s flowering cycle. We place and monitor colonies strategically across your
              land to ensure maximum flower visitation and pollen transfer. Hives are managed
              throughout the deployment period, with regular inspections to ensure colony health and
              productivity. We collect the hives after the flowering period and settle them back at
              our apiaries.
            </p>
          </div>

          <div>
            <h3>Why it matters</h3>
            <div className="benefit-grid">
              {BENEFITS.map(([title, detail]) => (
                <div className="benefit-card" key={title}>
                  <strong>{title}</strong>
                  {detail}
                </div>
              ))}
            </div>
          </div>

          <div className="svc-cta">
            <h3>Interested in a pollination package?</h3>
            <p>Contact us and we&rsquo;ll tailor a solution for your operation.</p>
            <div className="hero__ctas hero__ctas--center">
              <a href="tel:0813054398" className="btn honey">
                Call 081 305 4398
              </a>
              <Link href="/#contact" className="btn ghost">
                Send an enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
