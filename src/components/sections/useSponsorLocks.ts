"use client";

import { useEffect, useRef, useState } from "react";
import { TOUCH_QUERY, useMediaQuery } from "@/lib/useMediaQuery";

// Timing (ms). The cards start fading in about 900ms after the strip appears;
// each is roughly halfway into place ~100ms later, which is when its lock fires.
const INTRO_START_MS = 1000;
const INTRO_STEP_MS = 180; // matches the cards' fade-in stagger, so each locks as it arrives
const INTRO_HOLD_MS = 700; // how long all of them stay locked before the loop starts
const IDLE_MS = 1600; // gap between locks once the intro is done (touch screens)

/**
 * Which sponsor cards are "target locked" (data-locked on each card):
 *  1. Intro (every device): each card locks as it is about halfway into place
 *     and the locks pile up, so all of them show as the cards appear, then
 *     release together.
 *  2. Idle (touch screens only, which have no cursor): the cards take turns
 *     locking on a loop. Tapping a card locks it and carries on from the next.
 *  3. Mouse: the target cursor (TargetLockLayer) locks the nearest card via
 *     `lockOnly`, and the timed intro stays out of its way.
 *
 * @param active whether the strip is on screen (restarts the sequence each time)
 * @param count  how many cards there are
 */
export function useSponsorLocks(active: boolean, count: number) {
  const isTouch = useMediaQuery(TOUCH_QUERY);
  const [locked, setLocked] = useState<number[]>([]);
  // True while a mouse is driving the locks.
  const engagedRef = useRef(false);
  const nextRef = useRef(0); // next card for the idle loop
  const tappedRef = useRef(false);
  const [cycleKey, setCycleKey] = useState(0); // bump to restart after a tap

  useEffect(() => {
    if (!active) return;
    const fromTap = tappedRef.current;
    tappedRef.current = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };
    // Timed changes never override a mouse that is driving the locks.
    const unlessMouse = (fn: () => void) => () => {
      if (!engagedRef.current) fn();
    };

    const step = () => {
      const i = nextRef.current % count;
      setLocked([i]);
      nextRef.current = i + 1;
    };

    let idleStart = IDLE_MS; // after a tap: let the tapped card sit a beat
    if (!fromTap) {
      nextRef.current = 0;
      // Start clean: drop whatever was locked the last time the strip was on screen.
      later(
        unlessMouse(() => setLocked([])),
        0,
      );
      for (let i = 0; i < count; i++) {
        later(
          unlessMouse(() => setLocked((prev) => [...prev, i])),
          INTRO_START_MS + i * INTRO_STEP_MS,
        );
      }
      const lastLock = INTRO_START_MS + (count - 1) * INTRO_STEP_MS;
      later(
        unlessMouse(() => setLocked([])),
        lastLock + INTRO_HOLD_MS,
      );
      idleStart = lastLock + INTRO_HOLD_MS + 500;
    }
    if (isTouch) {
      later(() => {
        step();
        timers.push(window.setInterval(step, IDLE_MS));
      }, idleStart);
    }

    return () => {
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
  }, [active, count, isTouch, cycleKey]);

  return {
    /** Indices of the cards currently locked. */
    locked: active ? locked : [],
    /** For the mouse cursor: lock just this card (null = none). */
    lockOnly: (i: number | null) => {
      engagedRef.current = i !== null;
      setLocked(i === null ? [] : [i]);
    },
    /** For taps on touch screens: lock this card and carry on from the next. */
    tap: (i: number) => {
      if (!isTouch) return;
      nextRef.current = i + 1;
      tappedRef.current = true;
      setLocked([i]);
      setCycleKey((k) => k + 1);
    },
  };
}
