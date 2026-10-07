"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LINK_HOVER } from "@/components/layout/navLinks";
import { Corner } from "@/components/ui/DrawingSheet";
import { ContactError, sendContactMessage } from "@/lib/sendContactMessage";
import { EASE_OUT } from "@/lib/motion";

const MAX_QUERY = 300;
const SLICES = 8;

type Status = "idle" | "sending" | "success" | "error";

const FIELD =
  "contact-field w-full rounded-sm border-2 border-transparent bg-white px-3 py-2.5 font-body text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-yellow";
const LABEL =
  "mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]";

/** Pop-up contact form. Opened via <ContactProvider> / <ContactLink>. */
export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // While open: Esc closes, the page behind doesn't scroll, focus moves into
  // the form and returns to whatever opened it afterwards.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(
      () => firstFieldRef.current?.focus(),
      80,
    );
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  const handleExited = () => {
    // Fresh form next time (after the closing animation has finished).
    setStatus("idle");
    setError("");
    setQuery("");
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    setStatus("sending");
    setError("");
    try {
      await sendContactMessage({
        firstName: field("firstName"),
        lastName: field("lastName"),
        email: field("email"),
        message: field("query"),
        botcheck: Boolean(data.get("botcheck")),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof ContactError && err.reason === "not-configured"
          ? "The contact form isn't set up yet. Please try again later."
          : "Sorry, something went wrong sending that. Please try again in a moment.",
      );
    }
  }

  return (
    <AnimatePresence onExitComplete={handleExited}>
      {open && (
        <motion.div
          key="contact-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="relative my-auto w-full max-w-lg overflow-hidden rounded-md border border-white/25 p-6 shadow-[0_0_80px_rgba(255,0,44,0.35)] sm:p-8"
            // Nothing to animate on the panel itself; this keeps it mounted
            // until the slices have slid back out.
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.45 } }}
          >
            {/* Red background in slices that slide in from alternating sides. */}
            <div aria-hidden="true" className="absolute inset-0 flex flex-col">
              {Array.from({ length: SLICES }, (_, i) => {
                const dir = i % 2 === 0 ? -1 : 1;
                return (
                  <motion.div
                    key={i}
                    className="flex-1 bg-team-red"
                    initial={{ x: `${dir * 105}%` }}
                    animate={{
                      x: 0,
                      transition: {
                        duration: 0.55,
                        delay: i * 0.05,
                        ease: EASE_OUT,
                      },
                    }}
                    exit={{
                      x: `${-dir * 105}%`,
                      transition: {
                        duration: 0.35,
                        delay: i * 0.025,
                        ease: [0.7, 0, 0.84, 0],
                      },
                    }}
                  />
                );
              })}
            </div>

            {/* Panel chrome: corner marks and the close button sit against the
                panel's own edges (not inside the padded form area), so they
                never overlap the content. */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0.5 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <Corner
                color="rgba(255,255,255,0.7)"
                className="left-1.5 top-1.5 border-l border-t"
              />
              <Corner
                color="rgba(255,255,255,0.7)"
                className="right-1.5 top-1.5 border-r border-t"
              />
              <Corner
                color="rgba(255,255,255,0.7)"
                className="bottom-1.5 left-1.5 border-b border-l"
              />
              <Corner
                color="rgba(255,255,255,0.7)"
                className="bottom-1.5 right-1.5 border-b border-r"
              />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact form"
                className="pointer-events-auto absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center text-white/80 transition-colors hover:text-brand-yellow"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0.5 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <h2
                id="contact-title"
                className="font-display text-2xl text-white sm:text-3xl pr-10"
              >
                Contact Us
              </h2>

              {status === "success" ? (
                <div className="mt-6" role="status">
                  <p className="font-body text-lg leading-relaxed text-white">
                    Thanks, your message has been sent. We&apos;ll reply to your
                    email as soon as we can.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className={`${LINK_HOVER} mt-6 cursor-pointer border border-white/40 bg-black/70 font-mono text-sm uppercase tracking-[0.2em] text-white`}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-first" className={LABEL}>
                        First name
                      </label>
                      <input
                        ref={firstFieldRef}
                        id="contact-first"
                        name="firstName"
                        type="text"
                        required
                        maxLength={60}
                        autoComplete="given-name"
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-last" className={LABEL}>
                        Last name
                      </label>
                      <input
                        id="contact-last"
                        name="lastName"
                        type="text"
                        required
                        maxLength={60}
                        autoComplete="family-name"
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={LABEL}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      maxLength={120}
                      autoComplete="email"
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <label
                        htmlFor="contact-query"
                        className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]"
                      >
                        Your query
                      </label>
                      <span
                        aria-live="polite"
                        className={`font-mono text-[11px] font-bold tracking-[0.15em] [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] ${query.length >= MAX_QUERY ? "text-brand-yellow" : "text-white"}`}
                      >
                        {query.length}/{MAX_QUERY}
                      </span>
                    </div>
                    <textarea
                      id="contact-query"
                      name="query"
                      required
                      rows={5}
                      maxLength={MAX_QUERY}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={`${FIELD} resize-none`}
                    />
                  </div>

                  {/* Spam trap, hidden from people. */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {status === "error" && (
                    <p
                      role="alert"
                      className="rounded-sm bg-black/45 px-3 py-2 font-body text-sm text-white"
                    >
                      {error}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="font-body text-sm text-white">
                      We&apos;ll only use your details to reply to you.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className={`${LINK_HOVER} shrink-0 cursor-pointer border border-white/40 bg-black/70 font-mono text-sm uppercase tracking-[0.2em] text-white disabled:cursor-wait disabled:opacity-60`}
                    >
                      {status === "sending" ? "Sending…" : "Send"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
