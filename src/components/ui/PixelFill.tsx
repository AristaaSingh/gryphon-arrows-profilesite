import type { CSSProperties } from "react";

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/**
 * A white "dither" fill: a grid of square-ish pixels that pop on in a
 * dithered (ordered Bayer) pattern, sweeping from the bottom left to the top
 * right. Put it inside an element with the `group` class and `relative` +
 * `overflow-hidden`; it fills when that group is hovered or pressed, and
 * clears again (quickly) afterwards.
 */
export default function PixelFill({
  cols = 24,
  rows = 10,
}: {
  cols?: number;
  rows?: number;
}) {
  const cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // 0 at the bottom left corner, 1 at the top right.
      const diagonal = (x / (cols - 1) + (rows - 1 - y) / (rows - 1)) / 2;
      const dither = BAYER_4[y % 4][x % 4] / 16;
      const delayMs = Math.round(diagonal * 340 + dither * 220);
      cells.push(
        <span
          key={`${x}-${y}`}
          style={{ "--d": `${delayMs}ms` } as CSSProperties}
          className="bg-white opacity-0 shadow-[0_0_0_0.6px_#fff] transition-opacity duration-100 group-hover:opacity-100 group-hover:[transition-delay:var(--d)] group-active:opacity-100 group-active:[transition-delay:var(--d)]"
        />,
      );
    }
  }

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {cells}
    </span>
  );
}
