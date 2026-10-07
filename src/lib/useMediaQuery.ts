"use client";

import { useSyncExternalStore } from "react";

/** Media queries the site cares about, in one place. */
// Phones / tablets. Either "can't hover" or "main pointer is a finger", so a
// device that reports one oddly still counts (a laptop with a touchscreen keeps
// its mouse as the main pointer, so it stays in mouse mode).
export const TOUCH_QUERY = "(hover: none), (pointer: coarse)";
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
