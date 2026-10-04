"use client";

import type { ReactNode } from "react";
import { useContact } from "@/components/contact/ContactProvider";

/** A button that opens the contact pop-up. Style it with `className` the same
 *  way as the other menu / footer links. */
export default function ContactLink({
  className = "",
  children = "Contact",
  onClick,
}: {
  className?: string;
  children?: ReactNode;
  /** Runs before the pop-up opens, e.g. to close the mobile menu. */
  onClick?: () => void;
}) {
  const { open } = useContact();
  return (
    <button
      type="button"
      // Tailwind resets buttons to lowercase / default cursor, so restore them.
      className={`cursor-pointer uppercase ${className}`}
      onClick={() => {
        onClick?.();
        open();
      }}
    >
      {children}
    </button>
  );
}
