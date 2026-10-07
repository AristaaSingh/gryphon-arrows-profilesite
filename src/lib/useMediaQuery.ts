"use client";

import { useSyncExternalStore } from "react";

/** Media queries the site cares about, in one place. */
export const TOUCH_QUERY = "(hover: none)"; // phones / tablets: no hover
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)"; // mouse / trackpad
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Live "does this media query match?" for components. Always false on the
 * server and during hydration, then corrects itself on the client, so the
 * first render never mismatches the server HTML.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
