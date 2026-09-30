"use client";

import { useEffect, useRef, type RefObject } from "react";

interface TechSelectBoxProps {
  /** The positioned ancestor to search for `[data-glyph="true"]` letter spans. */
  containerRef: RefObject<HTMLElement | null>;
  /** Only tracks the cursor once true (e.g. after a decrypt effect finishes). */
  active: boolean;
  className?: string;
}

interface BoxState {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
}

/** Exponential smoothing — same shape as reactbits' spring "approach" helper. */
const approach = (current: number, target: number, dt: number, seconds: number) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

const POSITION_SMOOTHING = 0.1; // seconds — lower = snappier chase
const OPACITY_SMOOTHING = 0.12;
// Gap between the dashed box and the glyph's own ink bounds, so the line
// clears the letterform instead of cutting through it.
const OUTSET = 5;
const HOLLOW_CLASS = "tech-select-box__glyph-hollow";

/**
 * A CAD/blueprint-style selection box that chases whichever letter the
 * cursor is nearest to with spring-damped motion (not a linear CSS ease),
 * with a dimension readout — the fluid-motion part of reactbits.dev's
 * "Tech Text" hover effect, reimplemented in DOM/CSS instead of canvas so
 * it can sit over real (color-font) heading text without a duplicate
 * canvas-rendered text layer.
 */
export default function TechSelectBox({
  containerRef,
  active,
  className = "",
}: TechSelectBoxProps) {
  const boxElRef = useRef<HTMLDivElement>(null);
  const labelElRef = useRef<HTMLSpanElement>(null);
  const current = useRef<BoxState>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
  const target = useRef<BoxState>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
  const hasAppeared = useRef(false);
  const activeGlyph = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !active) return;

    const glyphs = Array.from(
      container.querySelectorAll<HTMLElement>('[data-glyph="true"]')
    );

    // getBoundingClientRect() on an inline character span reports the line
    // box height, which is identical for every character on the line — that
    // gave a box whose height never changed. Measure each glyph's actual ink
    // height with canvas text metrics instead, same as reactbits' own
    // approach, and cache per character+font.
    const measureCanvas = document.createElement("canvas");
    const measureCtx = measureCanvas.getContext("2d");
    const inkHeightCache = new Map<string, number>();

    const getInkHeight = (el: HTMLElement, char: string, fallback: number) => {
      if (!measureCtx || !char.trim()) return fallback;
      const style = getComputedStyle(el);
      const key = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}|${char}`;
      const cached = inkHeightCache.get(key);
      if (cached !== undefined) return cached;
      measureCtx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const metrics = measureCtx.measureText(char);
      const height =
        (metrics.actualBoundingBoxAscent ?? 0) + (metrics.actualBoundingBoxDescent ?? 0);
      const resolved = height > 0 ? height : fallback;
      inkHeightCache.set(key, resolved);
      return resolved;
    };

    const handleMove = (e: MouseEvent) => {
      if (glyphs.length === 0) return;
      const containerRect = container.getBoundingClientRect();

      let nearest: HTMLElement | null = null;
      let nearestDistance = Infinity;
      for (const glyph of glyphs) {
        const rect = glyph.getBoundingClientRect();
        const dx =
          e.clientX < rect.left
            ? rect.left - e.clientX
            : e.clientX > rect.right
              ? e.clientX - rect.right
              : 0;
        const dy =
          e.clientY < rect.top
            ? rect.top - e.clientY
            : e.clientY > rect.bottom
              ? e.clientY - rect.bottom
              : 0;
        const distance = Math.hypot(dx, dy);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = glyph;
        }
      }

      const selected = !nearest || nearestDistance > 120 ? null : nearest;

      if (selected !== activeGlyph.current) {
        activeGlyph.current?.classList.remove(HOLLOW_CLASS);
        selected?.classList.add(HOLLOW_CLASS);
        activeGlyph.current = selected;
      }

      if (!selected) {
        target.current.opacity = 0;
        return;
      }

      const rect = selected.getBoundingClientRect();
      const inkHeight = getInkHeight(selected, selected.textContent ?? "", rect.height);
      target.current = {
        left: rect.left - containerRect.left - OUTSET,
        top: rect.top - containerRect.top + (rect.height - inkHeight) / 2 - OUTSET,
        width: rect.width + OUTSET * 2,
        height: inkHeight + OUTSET * 2,
        opacity: 1,
      };

      // Snap position on first appearance instead of sliding in from (0, 0);
      // only the chase between letters should visibly ease.
      if (!hasAppeared.current) {
        hasAppeared.current = true;
        current.current.left = target.current.left;
        current.current.top = target.current.top;
        current.current.width = target.current.width;
        current.current.height = target.current.height;
      }
    };

    const handleLeave = () => {
      target.current.opacity = 0;
      hasAppeared.current = false;
      activeGlyph.current?.classList.remove(HOLLOW_CLASS);
      activeGlyph.current = null;
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);

    let rafId: number;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const cur = current.current;
      const tgt = target.current;
      cur.left = approach(cur.left, tgt.left, dt, POSITION_SMOOTHING);
      cur.top = approach(cur.top, tgt.top, dt, POSITION_SMOOTHING);
      cur.width = approach(cur.width, tgt.width, dt, POSITION_SMOOTHING);
      cur.height = approach(cur.height, tgt.height, dt, POSITION_SMOOTHING);
      cur.opacity = approach(cur.opacity, tgt.opacity, dt, OPACITY_SMOOTHING);

      const el = boxElRef.current;
      if (el) {
        el.style.transform = `translate(${cur.left}px, ${cur.top}px)`;
        el.style.width = `${cur.width}px`;
        el.style.height = `${cur.height}px`;
        el.style.opacity = cur.opacity < 0.01 ? "0" : String(cur.opacity);
      }
      if (labelElRef.current && tgt.opacity > 0) {
        labelElRef.current.textContent = `${Math.round(tgt.width)}×${Math.round(tgt.height)}`;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafId);
      activeGlyph.current?.classList.remove(HOLLOW_CLASS);
      activeGlyph.current = null;
    };
  }, [containerRef, active]);

  if (!active) return null;

  return (
    <div ref={boxElRef} aria-hidden="true" className={`tech-select-box ${className}`.trim()}>
      <span ref={labelElRef} className="tech-select-box__label" />
      <span className="tech-select-box__corner tech-select-box__corner--tl" />
      <span className="tech-select-box__corner tech-select-box__corner--tr" />
      <span className="tech-select-box__corner tech-select-box__corner--bl" />
      <span className="tech-select-box__corner tech-select-box__corner--br" />
    </div>
  );
}
