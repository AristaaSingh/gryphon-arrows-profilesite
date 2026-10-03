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

The "GRYPHON ARROWS" intro is two separate words (two `DecryptedText`
instances) rather than one string with literal spaces between every
letter — `letter-spacing` (`tracking-[0.2em]` on the `<h1>`) gives the
within-word letter spacing, and a flex `gap` gives the word gap its own,
wider value.

Once both words finish decrypting, the heading swaps to
`TechText` (`src/components/TechText.jsx` + `.css`) — reactbits.dev's
actual "Tech Text" component (hover-triggered dashed-outline reveal,
draggable letters, idle sweep, particle "specks"), copied verbatim from
https://reactbits.dev/text-animations/tech-text rather than reimplemented,
since it's distributed as copy-paste source (no real npm package exists;
their own CLI does the same copy). This only became viable after dropping
Rubik 80s Fade — TechText renders via Canvas, and canvas text painting
doesn't support COLR color fonts.

**To change a font, edit `src/config/fonts.ts`** — it is the single place
fonts are defined, organised by role (heading / mono / body), with
step-by-step instructions at the top. Components only ever use the role
classes (`font-display`, `font-mono`, `font-body`), never a font name.

Loaded via `next/font/google` in `src/config/fonts.ts` (self-hosted at build
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
