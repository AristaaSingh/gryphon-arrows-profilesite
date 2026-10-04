# Gryphon Arrows website

Single-page outreach site for the Gryphon Arrows UAS Challenge team.
Built with Next.js, Tailwind and Framer Motion; deployed on Vercel (every push
to `main` goes live automatically).

```bash
npm install
npm run dev     # http://localhost:3000
```

> This is a recent Next.js with breaking changes from older versions. Check
> `node_modules/next/dist/docs/` before relying on older habits.

## Where to edit what

The page (`src/app/page.tsx`) is just a list of sections in order. **Each
section is its own file** and has an `EDIT HERE` block at the top with its text.

| I want to change…                      | Edit this file                                  |
| -------------------------------------- | ----------------------------------------------- |
| Landing text / button label            | `src/components/sections/LandingSection.tsx`    |
| Sponsors (add a logo)                  | `src/components/sections/SponsorsSection.tsx`   |
| About Us text / team photo             | `src/components/sections/AboutSection.tsx`      |
| Stuff We Do / Experience You Gain cards | `src/components/sections/OfferSection.tsx`      |
| The Challenge text / logo              | `src/components/sections/ChallengeSection.tsx`  |
| **Join form link, social links, contact-form key** | `src/content/site-links.ts`        |
| Contact pop-up form                    | `src/components/contact/ContactModal.tsx`       |
| **Fonts** (see `src/config/fonts.md`)  | `src/config/fonts.ts`                           |
| Side menu entries, "Sheet x/N" total   | `src/content/sections.ts`                       |
| Top menu / footer                      | `src/components/layout/SiteNav.tsx`, `SiteFooter.tsx` (shared links in `navLinks.ts`) |
| Images                                 | `public/` (`sponsors/`, `team/`, `challenge/`)  |

## Folder map

```
src/
  app/            page.tsx (section order), layout.tsx, globals.css
  components/
    sections/     one file per page section
    layout/       top menu, footer, side contents menu
    ui/           small reusable pieces (scroll fade, blurred divider,
                  drawing-sheet parts, standard text block)
    effects/      fancy animated components (threads, decrypt text, button
                  shine). Several are copied from reactbits.dev; leave alone.
  content/        links and section list
  config/         fonts
public/           images
```

## Adding a section

1. Create `src/components/sections/YourSection.tsx` (copy `AboutSection.tsx` as a start).
2. Add it to the list in `src/app/page.tsx`.
3. Add its `id` and label to `src/content/sections.ts` and bump `SHEET_TOTAL`.
