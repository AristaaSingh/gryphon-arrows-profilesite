# Design notes

## Typography

Chosen 2026-09-30, compared via an interactive type specimen against
technical/engineer-core candidates (Space Grotesk, Chakra Petch, Rajdhani,
Aldrich, Big Shoulders Display, Anta, Gugi, ZCOOL QingKe HuangYou, Titillium
Web, Overpass, Exo 2, Saira, Share Tech, and others).

| Role    | Font             | Notes                                               |
| ------- | ---------------- | ---------------------------------------------------- |
| Display | Anta              | Headings. Switched from Rubik 80s Fade 2026-09-30 — that font's grainy halftone texture and COLR color-font rendering caused problems (washed out at small sizes, incompatible with canvas-drawn hover effects). |
| Mono    | Space Mono        | Labels, eyebrows, spec-sheet data lines, nav.        |
| Body    | Exo 2             | Paragraph text.                                       |

Loaded via `next/font/google` in `src/app/layout.tsx` (self-hosted at build
time, no runtime request to Google Fonts), exposed as CSS variables
`--font-display`, `--font-mono`, `--font-body`, and wired into Tailwind as
`font-display` / `font-mono` / `font-body` utility classes via
`src/app/globals.css`.

All three fonts are open source (Google Fonts, SIL Open Font License), free
for any use, no attribution required.

## Color (placeholder page, subject to revision)

- Background: black (`#000000`)
- Accent: `#e02828` (team red), as `--accent-rgb` in `globals.css`
- Subtle blueprint-style grid overlay at 15% opacity, 48px grid
