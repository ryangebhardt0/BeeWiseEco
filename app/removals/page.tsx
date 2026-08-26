import type { Metadata } from 'next';
import Link from 'next/link';

import Honeycomb from '@/components/Honeycomb';

export const metadata: Metadata = {
  title: 'Bee Removals — Bee Wise Eco Services',
  description:
    'Safe, humane, professional removal and relocation of bee colonies across Gauteng and surrounding areas. Relocation, not extermination.',
};

const AUDIENCES = [
  [
    'Residential Properties',
    'Swarms on roof eaves, inside walls, in garden sheds, and in ceiling voids — we safely remove and relocate them.',
  ],
  [
    'Commercial & Business Premises',
    'Colonies in signage, air-conditioning units, factory roofing, and service ducts — handled with minimal disruption to your operations.',
  ],
  [
    'Urban & Peri-Urban Environments',
    'Parks, schools, community spaces — we work with municipalities and property managers to resolve bee conflicts humanely.',
  ],
];

export default function RemovalsPage() {
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
            Bee
            <br />
            Removals
          </h1>
          <p className="hero__lede" style={{ maxWidth: 620, margin: '24px auto 0' }}>
            Safe, humane, and professional removal and relocation of bee colonies across Gauteng and
            surrounding areas.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="wrap svc-article">
          <div>
            <h3>Our approach</h3>
            <p>
              At Bee Wise Eco Services, we believe every bee colony is a precious ecological asset.
              When bees establish themselves in an inconvenient location — inside a wall cavity, under
              a roof, in a tree hollow, or near a building entrance — our first and foremost aim is
              always <strong>safe relocation, not extermination</strong>.
            </p>
            <p>
              Our trained apiarists assess each situation carefully, using ethical live-removal
              techniques to capture the queen, workers, brood, and comb. The colony is then
              transported and re-established in a managed hive at one of our apiaries or a suitable
              alternative location, where it can continue contributing to the environment.
            </p>
          </div>

          <div>
            <h3>Who we serve</h3>
            <div className="benefit-grid">
              {AUDIENCES.map(([title, detail]) => (
                <div className="benefit-card" key={title}>
                  <strong>{title}</strong>
                  {detail}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Why choose relocation over extermination?</h3>
            <p>
              South Africa has seen significant colony loss over recent years due to pesticide use,
              habitat destruction, and disease. Every colony we save and relocate is one more working
              unit benefiting our agricultural ecosystem. African honey bees are tenacious,
              disease-resistant, and extraordinarily effective pollinators — they deserve to live.
            </p>
            <p>
              When extermination is the only viable option (extremely rare cases involving risk to
              human life), we handle it responsibly, safely, and only as a last resort.
            </p>
          </div>

          <div className="svc-cta">
            <h3>Got bees where they shouldn&rsquo;t be?</h3>
            <p>For urgent removals or quotations, get in touch — we respond promptly.</p>
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
