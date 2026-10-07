"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SNAP = { stiffness: 900, damping: 45, mass: 0.5 };
const PAD = 8; // how far outside the target the brackets sit

/**
 * A "target lock" cursor for mouse users. While the pointer is anywhere inside
 * `containerRef`, the normal cursor is hidden (add the cursor-none class to
 * the container) and replaced by:
 *   - a small crosshair that follows the pointer exactly, and
 *   - red corner brackets that snap onto the NEAREST item matching
 *     `itemSelector`, hopping to a new item as the pointer moves between them.
 * `onLock(index)` is called when the locked item changes (null when the
 * pointer leaves) so the item itself can light up. Touch screens are ignored.
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
  // Rendered into <body> so no transformed / clipped ancestor can offset or
  // cut the fixed-position reticle.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [label, setLabel] = useState("");
  const onLockRef = useRef(onLock);
  useEffect(() => {
    onLockRef.current = onLock;
  });

  const x = useSpring(0, SNAP);
  const y = useSpring(0, SNAP);
  const w = useSpring(0, SNAP);
  const h = useSpring(0, SNAP);
  const px = useMotionValue(-100);
  const py = useMotionValue(-100);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Only for devices with a real, hover-capable pointer.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    let inside = false;
    let first = true;
    let index = -1;
    let raf = 0;
    const last = { x: 0, y: 0 };

    const update = () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(itemSelector));
      if (!items.length) return;
      let best = 0;
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
      const r = items[best].getBoundingClientRect();
      const set = first
        ? {
            x: (v: number) => x.jump(v),
            y: (v: number) => y.jump(v),
            w: (v: number) => w.jump(v),
            h: (v: number) => h.jump(v),
          }
        : {
            x: (v: number) => x.set(v),
            y: (v: number) => y.set(v),
            w: (v: number) => w.set(v),
            h: (v: number) => h.set(v),
          };
      set.x(r.left - PAD);
      set.y(r.top - PAD);
      set.w(r.width + PAD * 2);
      set.h(r.height + PAD * 2);
      first = false;
      if (best !== index) {
        index = best;
        setLabel(
          `TGT ${String(best + 1).padStart(2, "0")} · ${items[best].dataset.targetName ?? ""}`,
        );
        onLockRef.current(best);
      }
    };

    // Keeps the brackets glued to the card while it lifts / the page scrolls.
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
        setActive(true);
        raf = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => {
      inside = false;
      index = -1;
      cancelAnimationFrame(raf);
      setActive(false);
      onLockRef.current(null);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [containerRef, itemSelector, x, y, w, h, px, py]);

  const corner = "absolute h-4 w-4 border-[#ff002c]";
  if (!mounted) return null;
  return createPortal(
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[90] transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
    >
      {/* Brackets around the nearest target */}
      <motion.div
        className="absolute left-0 top-0 drop-shadow-[0_0_6px_rgba(255,0,44,0.9)]"
        style={{ x, y, width: w, height: h }}
      >
        <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
        <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
        <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
        <span className="absolute left-0 top-full mt-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff002c]">
          {label}
        </span>
      </motion.div>

      {/* Crosshair on the real pointer position */}
      <motion.div className="absolute left-0 top-0" style={{ x: px, y: py }}>
        <span className="absolute -left-2.5 top-0 h-px w-5 bg-white" />
        <span className="absolute left-0 -top-2.5 h-5 w-px bg-white" />
        <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-[#ff002c]" />
      </motion.div>
    </div>,
    document.body,
  );
}
