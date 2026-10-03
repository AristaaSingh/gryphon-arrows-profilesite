/**
 * ──────────────────────────────────────────────────────────────
 *  SITE FONTS — the one place to change them
 * ──────────────────────────────────────────────────────────────
 *
 *  The whole website uses just THREE font "roles". Every component asks
 *  for a role (Tailwind class `font-display`, `font-mono` or `font-body`),
 *  never for a specific font name. So to swap a font site-wide, change it
 *  here and nowhere else.
 *
 *    headingFont → font-display → big headings, section titles
 *    monoFont    → font-mono    → small labels, nav, "Sec. 02"-style tags
 *    bodyFont    → font-body    → normal paragraph text
 *
 *  To change one (e.g. the body text):
 *    1. Find the font on https://fonts.google.com and note its name,
 *       e.g. "Inter" or "Open Sans" (for names with spaces use an
 *       underscore: Open_Sans).
 *    2. Edit the import line below and the matching `bodyFont = ...( )`
 *       line, replacing the old font name with the new one.
 *    3. If the new font has several weights, you may need to add
 *       `weight: ["400", "700"]` (look at monoFont for an example).
 *
 *  Nothing else needs touching. See DESIGN.md for the current choices.
 */
import { Gajraj_One, Space_Mono, Exo_2 } from "next/font/google";

// Role: headings (font-display)
export const headingFont = Gajraj_One({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

// Role: small labels / nav (font-mono)
export const monoFont = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Role: paragraph text (font-body)
export const bodyFont = Exo_2({
  variable: "--font-body",
  subsets: ["latin"],
});
