"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "@/lib/useMediaQuery";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// Spring for the corners snapping onto a target. Lower stiffness / higher mass
// = slower, softer snap.
const SNAP = { stiffness: 500, damping: 38, mass: 0.7 };
const FREE_SIZE = 28; // side of the little spinning cursor box
const FREE_ARM = 8; // corner length while it's the cursor
const LOCK_ARM = 16; // corner length once locked onto a card
const PAD = 8; // how far outside the target the corners sit
const SNAP_DISTANCE = 90; // px: how close the pointer must be to lock on

/**
 * A "target cursor" for mouse users, in the style of reactbits.dev's Target
 * Cursor. While the pointer is inside `containerRef` (add the cursor-none
 * class to it) the normal cursor is replaced by four small corner brackets
 * that spin around a centre dot. When the pointer comes near an item that
 * matches `itemSelector`, the brackets stop spinning and stretch out to
 * frame that item (the dot stays on the pointer); move away and they shrink
 * back into the spinning cursor. `onLock(index)` fires when the locked item
 * changes (null when none) so the item can light up. Touch is ignored.
 */
export default function TargetLockLayer({
  containerRef,
  itemSelector,
  onLock,
}: {
  containerRef: RefObject<HTMLElement | null>;
  itemSelector: string;
  onLock: (index: number | null) => void;
}) {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");
  // Rendered into <body> so no transformed / clipped ancestor can offset or
  // cut the fixed-position cursor.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const onLockRef = useRef(onLock);
  useEffect(() => {
    onLockRef.current = onLock;
  });

  const x = useSpring(0, SNAP);
  const y = useSpring(0, SNAP);
  const w = useSpring(FREE_SIZE, SNAP);
  const h = useSpring(FREE_SIZE, SNAP);
  const arm = useSpring(FREE_ARM, { stiffness: 320, damping: 30 });
  const rot = useMotionValue(0);
  // Bottom edge of the corner box, where the name tag sits.
  const labelY = useTransform([y, h], ([yy, hh]: number[]) => yy + hh);
  const px = useMotionValue(-100);
  const py = useMotionValue(-100);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Only for devices with a real, hover-capable pointer.
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;
    const reduceMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    let inside = false;
    let first = true;
    let index = -1; // locked item, -1 = free cursor
    let spin: { stop: () => void } | null = null;
    let raf = 0;
    const last = { x: 0, y: 0 };

    const startSpin = () => {
      if (reduceMotion) return;
      spin?.stop();
      rot.set(0);
      spin = animate(rot, 360, {
        duration: 2.6,
        ease: "linear",
        repeat: Infinity,
      });
    };
    const stopSpin = () => {
      spin?.stop();
      spin = null;
      // Take the shortest way back to upright.
      const wrapped = (((rot.get() % 360) + 540) % 360) - 180;
      rot.set(wrapped);
      animate(rot, 0, { type: "spring", stiffness: 190, damping: 25 });
    };

    const place = (rect: { l: number; t: number; w: number; h: number }) => {
      if (first) {
        x.jump(rect.l);
        y.jump(rect.t);
        w.jump(rect.w);
        h.jump(rect.h);
        first = false;
      } else {
        x.set(rect.l);
        y.set(rect.t);
        w.set(rect.w);
        h.set(rect.h);
      }
    };

    const update = () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(itemSelector));
      let best = -1;
      let bestDist = Infinity;
      items.forEach((item, i) => {
        const r = item.getBoundingClientRect();
        const dx = Math.max(r.left - last.x, 0, last.x - r.right);
        const dy = Math.max(r.top - last.y, 0, last.y - r.bottom);
        const d = Math.hypot(dx, dy);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });

      if (best >= 0 && bestDist <= SNAP_DISTANCE) {
        const r = items[best].getBoundingClientRect();
        place({
          l: r.left - PAD,
          t: r.top - PAD,
          w: r.width + PAD * 2,
          h: r.height + PAD * 2,
        });
        arm.set(LOCK_ARM);
        if (best !== index) {
          if (index === -1) stopSpin();
          index = best;
          setLabel(
            `TGT ${String(best + 1).padStart(2, "0")} · ${items[best].dataset.targetName ?? ""}`,
          );
          onLockRef.current(best);
        }
      } else {
        place({
          l: last.x - FREE_SIZE / 2,
          t: last.y - FREE_SIZE / 2,
          w: FREE_SIZE,
          h: FREE_SIZE,
        });
        arm.set(FREE_ARM);
        if (index !== -1) {
          index = -1;
          startSpin();
          onLockRef.current(null);
        }
      }
    };

    // Keeps the corners glued to the card while it lifts / the page scrolls.
    const loop = () => {
      if (!inside) return;
      update();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      last.x = e.clientX;
      last.y = e.clientY;
      px.set(e.clientX);
      py.set(e.clientY);
      if (!inside) {
        inside = true;
        first = true;
        index = -1;
        startSpin();
        setActive(true);
        raf = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => {
      inside = false;
      index = -1;
      spin?.stop();
      spin = null;
      cancelAnimationFrame(raf);
      setActive(false);
      onLockRef.current(null);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      spin?.stop();
      cancelAnimationFrame(raf);
    };
  }, [containerRef, itemSelector, x, y, w, h, arm, rot, px, py]);

  if (!mounted) return null;

  const corner = "absolute border-brand-red";
  return createPortal(
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[90] transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
    >
      {/* The four corner brackets: the cursor itself, or the frame around a target */}
      <motion.div
        className="absolute left-0 top-0 drop-shadow-[0_0_6px_rgba(255,0,44,0.9)]"
        style={{ x, y, width: w, height: h, rotate: rot }}
      >
        <motion.span
          className={`${corner} left-0 top-0 border-l-2 border-t-2`}
          style={{ width: arm, height: arm }}
        />
        <motion.span
          className={`${corner} right-0 top-0 border-r-2 border-t-2`}
          style={{ width: arm, height: arm }}
        />
        <motion.span
          className={`${corner} bottom-0 left-0 border-b-2 border-l-2`}
          style={{ width: arm, height: arm }}
        />
        <motion.span
          className={`${corner} bottom-0 right-0 border-b-2 border-r-2`}
          style={{ width: arm, height: arm }}
        />
      </motion.div>

      {/* Name tag under the locked target */}
      <motion.div className="absolute left-0 top-0" style={{ x, y: labelY }}>
        <span
          className={`mt-1.5 block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-brand-red transition-opacity duration-150 ${label ? "opacity-100" : "opacity-0"}`}
        >
          {label}
        </span>
      </motion.div>

      {/* Centre dot: always exactly on the pointer */}
      <motion.span
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-brand-red shadow-[0_0_6px_rgba(255,0,44,0.9)]"
        style={{ x: px, y: py }}
      />
    </div>,
    document.body,
  );
}
