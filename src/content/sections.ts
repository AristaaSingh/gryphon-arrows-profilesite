/**
 * The page's sections, in order. Used by the side contents menu, and by the
 * "Sheet x/N" drawing-sheet labels so the total only needs updating here.
 *
 * Adding a section: create its file in src/components/sections/, add it to
 * src/app/page.tsx, then add a line here (the id must match the section's
 * `id`), and bump SHEET_TOTAL.
 */
export const SHEET_TOTAL = 5;

export const TOC_ITEMS = [
  { id: "home", label: "Home" },
  { id: "sponsors", label: "Our Sponsors" },
  { id: "about", label: "About Us" },
  { id: "stuff", label: "Stuff We Do" },
  { id: "challenge", label: "The Challenge" },
];
