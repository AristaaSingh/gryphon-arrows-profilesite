# Design notes

## Typography

Chosen 2026-09-30, compared via an interactive type specimen against
technical/engineer-core candidates (Space Grotesk, Chakra Petch, Rajdhani,
Aldrich, Big Shoulders Display, Anta, Gugi, ZCOOL QingKe HuangYou, Titillium
Web, Overpass, Exo 2, Saira, Share Tech, and others).

| Role    | Font             | Notes                                               |
| ------- | ---------------- | ---------------------------------------------------- |
| Display | Gajraj One        | Headings. Went Rubik 80s Fade -> Anta -> Gajraj One (2026-09-30). Rubik 80s Fade's grainy COLR color-font rendering caused problems (washed out at small sizes, incompatible with canvas-drawn hover effects); Anta was a plain fallback while fixing those. |
| Mono    | Space Mono        | Labels, eyebrows, spec-sheet data lines, nav.        |
| Body    | Exo 2             | Paragraph text.                                       |

The "GRYPHON ARROWS" heading is two separate words (two `DecryptedText`
instances) rather than one string with literal spaces between every
letter — `letter-spacing` (`tracking-[0.2em]` on the `<h1>`) gives the
within-word letter spacing, and a flex `gap` gives the word gap its own,
wider value. Literal space characters would also break `TechSelectBox`'s
letter-detection and word-gap handling, which already treats `" "` as a
non-glyph separator.

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
