"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/useMediaQuery";

const SCROLL_FADE_MS = 700; // how long the light lingers after scrolling stops

/**
 * A red "specular" edge light for cards: a bright streak on the card's rim
 * (and its mirror on the opposite rim), like light catching a bevel. A
 * lightweight CSS version of the Explore button's effect.
 *
 * Three things drive it:
 *  - hover: the streak points at the mouse,
 *  - scrolling: while the page scrolls past the card the streak sweeps around
 *    it automatically (one full turn as the card crosses the screen), then
 *    fades out shortly after scrolling stops. Works on touch screens too,
 *  - keyboard focus: the streak circles the card (pure CSS).
 *
 * Put it inside a `relative` element with the `group` class and rounded
 * corners. Styles are in globals.css under .spec-edge.
 */
export default function SpecularEdge() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const edge = ref.current;
    const card = edge?.parentElement;
    if (!edge || !card) return;
    const reduceMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    let hovering = false;
    let fadeTimer = 0;

    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      // Direction from the card's centre to the pointer. Conic gradients start
      // at 12 o'clock and run clockwise, so convert from the usual maths angle.
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
      edge.style.setProperty("--spec-angle", `${deg}deg`);
    };

    const onScroll = () => {
      if (reduceMotion || hovering) return;
      const r = card.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return; // off screen
      // 1 as the card enters at the bottom, 0 as it leaves at the top.
      const progress = (r.top + r.height) / (vh + r.height);
      edge.style.setProperty("--spec-angle", `${(1 - progress) * 360}deg`);
      edge.dataset.scrolling = "true";
      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(() => {
        edge.dataset.scrolling = "false";
      }, SCROLL_FADE_MS);
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(fadeTimer);
    };
  }, []);

  return <span ref={ref} aria-hidden="true" className="spec-edge" />;
}
