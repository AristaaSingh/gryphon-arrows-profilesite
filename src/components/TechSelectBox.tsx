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
// clears the letterform instead of cutting through it. Scales with the
// glyph's own size instead of a fixed px, so it still clears the letter
// at both small and large heading sizes.
const outsetFor = (inkHeight: number) => Math.max(4, inkHeight * 0.1);
const HIDDEN_CLASS = "tech-select-box__glyph-hidden";
const ACCENT = "#e02828";

/**
 * A CAD/blueprint-style selection box that chases whichever letter the
 * cursor is nearest to with spring-damped motion (not a linear CSS ease),
 * with a dimension readout and a hollow-outline swap on the selected
 * letter — reactbits.dev's "Tech Text" hover effect, reimplemented without
 * its canvas/physics engine for the rest of the (real, DOM) heading text.
 * Only the single selected character is ever drawn on canvas, to get a
 * true stroke-only outline on a COLR color font (see drawHollowGlyph).
 */
export default function TechSelectBox({
  containerRef,
  active,
  className = "",
}: TechSelectBoxProps) {
  const boxElRef = useRef<HTMLDivElement>(null);
  const labelElRef = useRef<HTMLSpanElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
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

    // Draws a genuine stroke-only outline of one character on a canvas
    // overlay. Rubik 80s Fade is a COLR color font: DOM text ignores
    // `color`/-webkit-text-fill-color for it, so a CSS-only "hollow" trick
    // just paints a stroke on top of the still-visible color fill. Canvas
    // text painting always ignores COLR palettes and uses strokeStyle only,
    // so hiding the real glyph (opacity, not color) and drawing this instead
    // gives a real hollow letter regardless of font technology.
    const drawHollowGlyph = (glyphEl: HTMLElement, containerRect: DOMRect) => {
      const canvas = canvasElRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(containerRect.width));
      const h = Math.max(1, Math.round(containerRect.height));
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const char = glyphEl.textContent ?? "";
      if (!char.trim()) return;
      const style = getComputedStyle(glyphEl);
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const rect = glyphEl.getBoundingClientRect();
      const metrics = ctx.measureText(char);
      const ascent =
        metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent ?? rect.height * 0.8;
      const x = rect.left - containerRect.left;
      const baselineY = rect.top - containerRect.top + ascent;

      ctx.lineWidth = 1.25;
      ctx.strokeStyle = ACCENT;
      ctx.setLineDash([3, 2]);
      ctx.strokeText(char, x, baselineY);
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
        activeGlyph.current?.classList.remove(HIDDEN_CLASS);
        selected?.classList.add(HIDDEN_CLASS);
        activeGlyph.current = selected;
      }

      if (!selected) {
        target.current.opacity = 0;
        canvasElRef.current
          ?.getContext("2d")
          ?.clearRect(0, 0, canvasElRef.current.width, canvasElRef.current.height);
        return;
      }

      drawHollowGlyph(selected, containerRect);

      const rect = selected.getBoundingClientRect();
      const inkHeight = getInkHeight(selected, selected.textContent ?? "", rect.height);
      const outset = outsetFor(inkHeight);
      target.current = {
        left: rect.left - containerRect.left - outset,
        top: rect.top - containerRect.top + (rect.height - inkHeight) / 2 - outset,
        width: rect.width + outset * 2,
        height: inkHeight + outset * 2,
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
      activeGlyph.current?.classList.remove(HIDDEN_CLASS);
      activeGlyph.current = null;
      const canvas = canvasElRef.current;
      canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
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
      // Fade the hollow-letter canvas with the same spring as the box, so
      // the letter swap eases in/out instead of popping instantly whenever
      // the selection jumps to a different letter.
      if (canvasElRef.current) {
        canvasElRef.current.style.opacity = cur.opacity < 0.01 ? "0" : String(cur.opacity);
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
      activeGlyph.current?.classList.remove(HIDDEN_CLASS);
      activeGlyph.current = null;
    };
  }, [containerRef, active]);

  if (!active) return null;

  return (
    <>
      <canvas ref={canvasElRef} aria-hidden="true" className="tech-select-canvas" />
      <div ref={boxElRef} aria-hidden="true" className={`tech-select-box ${className}`.trim()}>
        <span ref={labelElRef} className="tech-select-box__label" />
        <span className="tech-select-box__corner tech-select-box__corner--tl" />
        <span className="tech-select-box__corner tech-select-box__corner--tr" />
        <span className="tech-select-box__corner tech-select-box__corner--bl" />
        <span className="tech-select-box__corner tech-select-box__corner--br" />
      </div>
    </>
  );
}
