import Image from 'next/image';

/**
 * The Bee Wise badge. Shared by the nav and the footer so the mark only has to
 * be updated in one place.
 */
export default function BrandMark() {
  return (
    <span className="nav__brand-mark" aria-hidden="true">
      <Image src="/assets/beewise-logo.png" alt="" width={40} height={40} priority />
    </span>
  );
}
