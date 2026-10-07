/** Shared animation easing: fast start, long soft landing (an "ease-out expo"). */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** The same curve as a CSS string, for plain CSS transitions. */
export const EASE_OUT_CSS = `cubic-bezier(${EASE_OUT.join(", ")})`;
