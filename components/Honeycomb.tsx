'use client';

import { useEffect, useRef } from 'react';

/**
 * The animated honeycomb behind the hero.
 *
 * A grid of pointy-top hexagons with a sine wave radiating out from the centre:
 * each cell's opacity and scale track the wave's height where it sits, so the
 * comb appears to breathe outwards. Ported from the original site's
 * initHoneycomb().
 *
 * The cells are rendered in JSX rather than built in an effect, so the pattern
 * is in the server-rendered HTML and there is no blank hero on first paint. The
 * animation then mutates SVG attributes directly through refs — at 60fps for
 * 180 cells, driving that through React state would be far too much work per
 * frame.
 */

const COLS = 18;
const ROWS = 10;
const CELL = 64;
const SPEED = 1.0;

const HONEY = '#FFC629';
const INK = '#111111';

// Pointy-top hex geometry.
const WIDTH = Math.sqrt(3) * CELL;
const HEIGHT = 2 * CELL;
const X_STEP = WIDTH;
const Y_STEP = HEIGHT * 0.75;

const VIEW_W = COLS * X_STEP + X_STEP / 2;
const VIEW_H = ROWS * CELL * 1.5 + CELL * 0.5;

/** One hexagon, centred on the origin so a scale transform grows it in place. */
const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 2;
  return `${(Math.cos(angle) * CELL * 0.92).toFixed(3)},${(Math.sin(angle) * CELL * 0.92).toFixed(3)}`;
}).join(' ');

const CENTRE_X = VIEW_W / 2;
const CENTRE_Y = VIEW_H / 2;

// Distance from centre never changes, so it is computed once here rather than
// recalculated for every cell on every frame.
const CELLS = (() => {
  const cells: { x: number; y: number; distance: number }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * X_STEP + (row % 2 === 1 ? X_STEP / 2 : 0) + X_STEP / 2;
      const y = row * Y_STEP + HEIGHT / 2;
      const dx = x - CENTRE_X;
      const dy = y - CENTRE_Y;
      cells.push({ x, y, distance: Math.sqrt(dx * dx + dy * dy) });
    }
  }
  return cells;
})();

const fillOpacityFor = (intensity: number) => (0.06 + intensity * 0.94).toFixed(3);
const scaleFor = (intensity: number) => (0.92 + intensity * 0.08).toFixed(3);

export default function Honeycomb() {
  const polygons = useRef<(SVGPolygonElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      // Hold the wave still, part-way up, so the texture is there without movement.
      const intensity = 0.3;
      polygons.current.forEach((polygon, i) => {
        const cell = CELLS[i];
        if (!polygon || !cell) return;
        polygon.setAttribute('fill-opacity', fillOpacityFor(intensity));
        polygon.setAttribute('transform', `translate(${cell.x},${cell.y}) scale(${scaleFor(intensity)})`);
      });
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      for (let i = 0; i < CELLS.length; i++) {
        const polygon = polygons.current[i];
        const cell = CELLS[i];
        if (!polygon || !cell) continue;
        const wave = Math.sin(cell.distance / 80 - elapsed * 1.5 * SPEED);
        // Bias towards the dim end so the bright crest reads as a moving pulse
        // rather than the whole comb glowing at once.
        const intensity = Math.pow((wave + 1) / 2, 1.6);
        polygon.setAttribute('fill-opacity', fillOpacityFor(intensity));
        polygon.setAttribute('transform', `translate(${cell.x},${cell.y}) scale(${scaleFor(intensity)})`);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <radialGradient id="hc-vignette" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {CELLS.map((cell, i) => (
        <polygon
          key={`${cell.x}-${cell.y}`}
          ref={(el) => {
            polygons.current[i] = el;
          }}
          points={HEX_POINTS}
          fill={HONEY}
          stroke={INK}
          strokeWidth="1.2"
          strokeOpacity="0.18"
          fillOpacity="0.1"
          transform={`translate(${cell.x},${cell.y})`}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}

      <rect width={VIEW_W} height={VIEW_H} fill="url(#hc-vignette)" pointerEvents="none" />
    </svg>
  );
}
