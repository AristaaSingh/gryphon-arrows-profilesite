import { SITE_LINKS } from "@/content/site-links";

/** Links and link styling shared by the top menu and the footer. */

// Placeholder: Contact is a separate page that doesn't exist yet (linked
// with "#" so it doesn't 404).
export const PAGES = [{ label: "Contact", href: "#" }];

// The "Join Us" link lives in src/content/site-links.ts so it can be edited
// without touching any component.
export const JOIN_HREF = SITE_LINKS.joinForm || "#";
export const JOIN_PROPS = SITE_LINKS.joinForm
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

// Hover / focus / press: a yellow fill wipes in from the left and the text
// flips to black. The fill is a ::before layer behind the text (`isolate`
// keeps it inside the link).
export const LINK_HOVER =
  "relative isolate overflow-hidden rounded-sm px-3 py-1.5 transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-[#ffc100] before:transition-transform before:duration-300 before:ease-out hover:text-black hover:before:scale-x-100 focus-visible:text-black focus-visible:before:scale-x-100 active:text-black active:before:scale-x-100";

// Footer links are calmer than the menu's wipe fill: a yellow underline
// slides in on hover/focus, and the text turns yellow while pressed.
export const FOOTER_LINK_HOVER =
  "relative px-1 py-1 transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[#ffc100] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 active:text-[#ffc100]";
