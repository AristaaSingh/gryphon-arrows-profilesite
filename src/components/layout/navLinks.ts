import { SITE_LINKS } from "@/content/site-links";

/** Links and link styling shared by the top menu and the footer. */

// The "Join Us" link lives in src/content/site-links.ts so it can be edited
// without touching any component.
export const JOIN_HREF = SITE_LINKS.joinForm || "#";
export const JOIN_PROPS = SITE_LINKS.joinForm
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

// Hover / focus / press: a yellow fill wipes in diagonally, from the bottom
// left to the top right, and the text flips to black. The fill is a
// ::before layer behind the text (`isolate` keeps it inside the link): a
// 200%-size gradient that is half transparent / half yellow, slid across.
// WIPE_FILL is the effect alone; the element using it must be positioned
// (relative / absolute) and give itself a shape (rounded-*, padding).
export const WIPE_FILL =
  "no-focus-ring isolate overflow-hidden transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(to_top_right,var(--color-brand-yellow)_50%,transparent_50%)] before:bg-[length:200%_200%] before:bg-[position:100%_0%] before:transition-[background-position] before:duration-400 before:ease-out hover:text-black hover:before:bg-[position:0%_100%] focus-visible:text-black focus-visible:before:bg-[position:0%_100%] active:text-black active:before:bg-[position:0%_100%]";

/** The wipe as a text-sized button: Contact, Join Us, Send… */
export const LINK_HOVER = `relative rounded-sm px-3 py-1.5 ${WIPE_FILL}`;

// Footer links are calmer than the menu's wipe fill: a yellow underline
// slides in on hover/focus, and the text turns yellow while pressed.
export const FOOTER_LINK_HOVER =
  "no-focus-ring relative px-1 py-1 transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-brand-yellow after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 active:text-brand-yellow";

// The frosted-glass look shared by the top menu and the footer.
export const GLASS_BAR =
  "border-white/10 bg-black/20 backdrop-blur-xl backdrop-saturate-150";
