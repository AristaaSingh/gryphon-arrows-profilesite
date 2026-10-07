"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const SNAP = { stiffness: 520, damping: 38, mass: 0.7 };
const PAD = 6; // gap between the field and the brackets
const FIELDS =
  "input:not([type=checkbox]):not([type=hidden]), textarea, select";

/**
 * "Target lock" for form fields: yellow corner brackets that snap around
 * whichever field has keyboard focus, gliding from field to field as you move
 * through the form. Render it as the FIRST child of a `relative` form (so
 * form spacing utilities don't offset it); it listens to that form's focus
 * events. Purely visual; it never takes clicks.
 */
export default function FocusLock() {
  const markerRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const x = useSpring(0, SNAP);
  const y = useSpring(0, SNAP);
  const w = useSpring(0, SNAP);
  const h = useSpring(0, SNAP);

  useEffect(() => {
    const form = markerRef.current?.parentElement;
    if (!form) return;
    let shown = false;

    const lockOn = (field: Element) => {
      const f = field.getBoundingClientRect();
      const o = form.getBoundingClientRect();
      const box = {
        x: f.left - o.left - PAD,
        y: f.top - o.top - PAD,
        w: f.width + PAD * 2,
        h: f.height + PAD * 2,
      };
      // First lock: appear in place instead of flying in from the corner.
      const set = shown ? "set" : "jump";
      x[set](box.x);
      y[set](box.y);
      w[set](box.w);
      h[set](box.h);
      shown = true;
      setVisible(true);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof Element && e.target.matches(FIELDS))
        lockOn(e.target);
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget;
      if (
        next instanceof Element &&
        form.contains(next) &&
        next.matches(FIELDS)
      )
        return;
      shown = false;
      setVisible(false);
    };

    form.addEventListener("focusin", onFocusIn);
    form.addEventListener("focusout", onFocusOut);
    // Already focused when this mounted (e.g. autofocus)?
    if (document.activeElement && form.contains(document.activeElement)) {
      onFocusIn({ target: document.activeElement } as unknown as FocusEvent);
    }
    return () => {
      form.removeEventListener("focusin", onFocusIn);
      form.removeEventListener("focusout", onFocusOut);
    };
  }, [x, y, w, h]);

  const corner = "absolute h-2.5 w-2.5 border-brand-yellow";
  return (
    <span
      ref={markerRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0"
    >
      <motion.span
        className={`absolute left-0 top-0 block drop-shadow-[0_0_5px_rgba(255,193,0,0.9)] transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ x, y, width: w, height: h }}
      >
        <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
        <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
        <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
      </motion.span>
    </span>
  );
}
