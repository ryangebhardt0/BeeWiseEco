/**
 * Illustrated product icons, ported from the original site's productIconSvg().
 *
 * Used as the fallback when a product has no photograph in the inventory
 * system, so a newly published item still looks deliberate rather than broken.
 */

const HONEY = '#FFC629';
const INK = '#111111';
const CONCRETE = '#CFD3D8';
const CONCRETE_LIGHT = '#E6E9EC';

export type IconKind =
  | 'jar'
  | 'block'
  | 'dropper'
  | 'comb'
  | 'candle'
  | 'tin'
  | 'capsules'
  | 'spray'
  | 'hive';

/** Picks an icon from the product's category and title. */
export function iconFor(category: string, title: string): IconKind {
  const text = `${category} ${title}`.toLowerCase();
  if (text.includes('hive')) return 'hive';
  if (text.includes('candle')) return 'candle';
  if (text.includes('comb') || text.includes('foundation')) return 'comb';
  if (text.includes('dropper') || text.includes('tincture')) return 'dropper';
  if (text.includes('capsule')) return 'capsules';
  if (text.includes('spray')) return 'spray';
  if (text.includes('balm') || text.includes('cream') || text.includes('moistur')) return 'tin';
  if (text.includes('honey')) return 'jar';
  if (text.includes('wax')) return 'block';
  return 'jar';
}

/** A gradient standing in for a photo, keyed off the category. */
export function swatchFor(category: string): string {
  switch (category.toLowerCase()) {
    case 'propolis':
      return 'linear-gradient(135deg, #8b5a2b 0%, #3a1f10 100%)';
    case 'beeswax':
      return 'linear-gradient(135deg, #ffe08a 0%, #d99c2b 100%)';
    case 'concrete hives':
      return 'linear-gradient(135deg, #9aa1a9 0%, #4b5158 100%)';
    default:
      return 'linear-gradient(135deg, #f4a821 0%, #d97706 100%)';
  }
}

export default function ProductIcon({ kind, size = 64 }: { kind: IconKind; size?: number }) {
  const common = { viewBox: '0 0 100 100', width: size, height: size, 'aria-hidden': true } as const;

  if (kind === 'jar') {
    return (
      <svg {...common}>
        <rect x="30" y="15" width="40" height="8" rx="2" fill={INK} />
        <path
          d="M28 28 L72 28 L70 80 Q70 88 62 88 L38 88 Q30 88 30 80 Z"
          fill={HONEY}
          stroke={INK}
          strokeWidth="2.5"
        />
        <rect x="36" y="48" width="28" height="18" rx="2" fill="#fff" stroke={INK} strokeWidth="1.5" />
        <text
          x="50"
          y="61"
          fontFamily="Bricolage Grotesque"
          fontWeight="700"
          fontSize="9"
          textAnchor="middle"
          fill={INK}
        >
          HONEY
        </text>
      </svg>
    );
  }

  if (kind === 'block') {
    return (
      <svg {...common}>
        <polygon points="50,18 78,32 78,68 50,82 22,68 22,32" fill={HONEY} stroke={INK} strokeWidth="2.5" />
        <polygon points="50,18 78,32 50,46 22,32" fill="#fff7d8" stroke={INK} strokeWidth="2" />
        <line x1="50" y1="46" x2="50" y2="82" stroke={INK} strokeWidth="1.5" opacity="0.4" />
      </svg>
    );
  }

  if (kind === 'dropper') {
    return (
      <svg {...common}>
        <rect x="36" y="14" width="28" height="10" rx="2" fill={INK} />
        <rect x="40" y="6" width="20" height="10" rx="2" fill={INK} />
        <path
          d="M34 26 L66 26 L64 80 Q64 88 56 88 L44 88 Q36 88 36 80 Z"
          fill="#8B5A2B"
          stroke={INK}
          strokeWidth="2.5"
        />
        <rect x="42" y="50" width="16" height="22" fill="#3a1f10" opacity="0.5" />
      </svg>
    );
  }

  if (kind === 'comb') {
    const cells: [number, number][] = [
      [28, 30], [50, 30], [72, 30], [28, 55], [50, 55],
      [72, 55], [39, 42], [61, 42], [39, 67], [61, 67],
    ];
    return (
      <svg {...common}>
        {cells.map(([x, y]) => (
          <polygon
            key={`${x}-${y}`}
            points={`${x},${y - 12} ${x + 10.4},${y - 6} ${x + 10.4},${y + 6} ${x},${y + 12} ${x - 10.4},${y + 6} ${x - 10.4},${y - 6}`}
            fill={HONEY}
            stroke={INK}
            strokeWidth="1.8"
          />
        ))}
      </svg>
    );
  }

  if (kind === 'candle') {
    return (
      <svg {...common}>
        <rect x="22" y="40" width="18" height="42" rx="2" fill={HONEY} stroke={INK} strokeWidth="2" />
        <rect x="42" y="32" width="18" height="50" rx="2" fill={HONEY} stroke={INK} strokeWidth="2" />
        <rect x="62" y="46" width="18" height="36" rx="2" fill={HONEY} stroke={INK} strokeWidth="2" />
        <path d="M31 40 q-2 -6 0 -10 q2 4 0 10" fill="#F26B38" />
        <path d="M51 32 q-2 -6 0 -10 q2 4 0 10" fill="#F26B38" />
        <path d="M71 46 q-2 -6 0 -10 q2 4 0 10" fill="#F26B38" />
      </svg>
    );
  }

  if (kind === 'tin') {
    return (
      <svg {...common}>
        <rect x="24" y="28" width="52" height="14" rx="7" fill="#fff7d8" stroke={INK} strokeWidth="2.5" />
        <rect x="20" y="42" width="60" height="36" rx="6" fill={HONEY} stroke={INK} strokeWidth="2.5" />
        <rect x="34" y="52" width="32" height="16" rx="2" fill="#fff" stroke={INK} strokeWidth="1.5" />
      </svg>
    );
  }

  if (kind === 'capsules') {
    return (
      <svg {...common}>
        <rect x="36" y="12" width="28" height="12" rx="3" fill={INK} />
        <path
          d="M32 28 L68 28 L68 78 Q68 86 60 86 L40 86 Q32 86 32 78 Z"
          fill="#8B5A2B"
          stroke={INK}
          strokeWidth="2.5"
        />
        <rect x="38" y="44" width="24" height="16" rx="2" fill="#fff" stroke={INK} strokeWidth="1.5" />
        <rect x="40" y="68" width="12" height="6" rx="3" fill={HONEY} stroke={INK} strokeWidth="1.5" />
        <rect x="50" y="74" width="12" height="6" rx="3" fill={HONEY} stroke={INK} strokeWidth="1.5" />
      </svg>
    );
  }

  if (kind === 'hive') {
    return (
      <svg {...common}>
        <rect x="16" y="16" width="68" height="11" rx="2" fill={CONCRETE} stroke={INK} strokeWidth="2.5" />
        <rect x="24" y="27" width="52" height="17" fill={CONCRETE_LIGHT} stroke={INK} strokeWidth="2.5" />
        <rect x="24" y="44" width="52" height="17" fill={CONCRETE} stroke={INK} strokeWidth="2.5" />
        <rect x="24" y="61" width="52" height="19" fill={CONCRETE_LIGHT} stroke={INK} strokeWidth="2.5" />
        <rect x="40" y="70" width="20" height="5" rx="2" fill={INK} />
        <polygon points="24,80 76,80 84,88 16,88" fill={HONEY} stroke={INK} strokeWidth="2.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="40" y="8" width="14" height="12" rx="2" fill={INK} />
      <rect x="54" y="10" width="12" height="7" rx="3" fill={INK} />
      <rect x="36" y="20" width="22" height="10" rx="2" fill={INK} opacity="0.85" />
      <path
        d="M32 34 L62 34 L60 80 Q60 88 52 88 L40 88 Q32 88 32 80 Z"
        fill="#96602C"
        stroke={INK}
        strokeWidth="2.5"
      />
      <rect x="38" y="50" width="18" height="16" rx="2" fill="#fff" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}
