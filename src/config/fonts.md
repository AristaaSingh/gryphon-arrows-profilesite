# Fonts

All site fonts are defined in one file, [`fonts.ts`](./fonts.ts), by **role**.
Components never name a font; they use the role's Tailwind class.

| Role    | Class          | Font      | Used for                                            |
| ------- | -------------- | --------- | --------------------------------------------------- |
| Heading | `font-display` | Gajraj One | Big headings, section titles, card titles           |
| Mono    | `font-mono`    | Space Mono | Small labels, nav, "Sec. 02"-style drawing tags     |
| Body    | `font-body`    | Exo 2      | Paragraph text                                      |

All three are open source (Google Fonts, SIL Open Font License): free for any
use, no attribution required. They load through `next/font/google`, which
self-hosts them at build time (no runtime request to Google).

## How to change a font

1. Pick a font on <https://fonts.google.com> and note its name (e.g. `Inter`).
   Names with spaces use an underscore in code: `Open Sans` → `Open_Sans`.
2. In `fonts.ts`, change the import on the `import { … } from "next/font/google"`
   line and the matching `headingFont` / `monoFont` / `bodyFont` line.
3. If the font has several weights, add `weight: ["400", "700"]`
   (see `monoFont`). Variable fonts like Exo 2 need no `weight`.

Nothing else needs touching; every component picks up the new font.

## Things to know

- **The animated "Gryphon / Arrows" heading** draws on a canvas and reads the
  heading font from the page. It follows a swap automatically, but a much
  wider or narrower heading font can change the letter widths, so re-check the
  sizing after changing `headingFont`.
- **Colour (COLR) fonts don't work** in that canvas heading. Rubik 80s Fade was
  dropped for this reason (it also washed out at small sizes). Stick to
  ordinary fonts for the heading role.
- **History:** the heading font went Rubik 80s Fade → Anta → Gajraj One. Other
  candidates compared along the way: Space Grotesk, Chakra Petch, Rajdhani,
  Aldrich, Big Shoulders Display, Gugi, ZCOOL QingKe HuangYou, Titillium Web,
  Overpass, Saira, Share Tech.
