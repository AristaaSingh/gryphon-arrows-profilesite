"use client";

import { useEffect, useRef } from "react";

/**
 * A "specular" edge light for cards: a bright yellow streak on the card's rim
 * that points at the mouse (and its mirror on the opposite rim), like light
 * catching a bevel. A lightweight CSS version of the Explore button's effect.
 *
 * Put it inside a `relative` element with the `group` class and rounded
 * corners. It shows while the card is hovered (following the cursor) and,
 * for keyboard users, while it is focused (the streak circles the card).
 * Styles are in globals.css under .spec-edge.
 */
export default function SpecularEdge() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const edge = ref.current;
    const card = edge?.parentElement;
    if (!edge || !card) return;

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

    card.addEventListener("pointermove", onMove);
    return () => card.removeEventListener("pointermove", onMove);
  }, []);

  return <span ref={ref} aria-hidden="true" className="spec-edge" />;
}
