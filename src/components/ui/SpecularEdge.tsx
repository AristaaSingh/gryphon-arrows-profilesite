"use client";

import { useEffect, useRef } from "react";

/**
 * A red "specular" edge light for cards: a streak on the card's rim (and its
 * mirror on the opposite rim), like light catching a bevel. A lightweight CSS
 * version of the Explore button's effect.
 *
 *  - Always on: it drifts slowly around the card by itself (pure CSS).
 *  - Hover: it stops drifting and points at the mouse (this component sets
 *    the angle).
 *  - Keyboard focus: it circles faster and brighter (pure CSS).
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

    // Start each card at a different point in its lap so they don't move in
    // lockstep (set here, not in markup, so server and client HTML match).
    edge.style.animationDelay = `-${(Math.random() * 14).toFixed(1)}s`;

    const pointAt = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      // Direction from the card's centre to the pointer. Conic gradients start
      // at 12 o'clock and run clockwise, so convert from the usual maths angle.
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
      edge.style.setProperty("--spec-angle", `${deg}deg`);
    };

    card.addEventListener("pointerenter", pointAt);
    card.addEventListener("pointermove", pointAt);
    return () => {
      card.removeEventListener("pointerenter", pointAt);
      card.removeEventListener("pointermove", pointAt);
    };
  }, []);

  return <span ref={ref} aria-hidden="true" className="spec-edge" />;
}
