"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LINK_HOVER, WIPE_FILL } from "@/components/layout/navLinks";
import FocusLock from "@/components/ui/FocusLock";
import {
  LIMITS,
  validateContact,
  type FieldName,
} from "@/lib/contactValidation";
import { ContactError, sendContactMessage } from "@/lib/sendContactMessage";
import { EASE_OUT } from "@/lib/motion";

const MAX_QUERY = LIMITS.message;
const FIELD_IDS: Record<FieldName, string> = {
  firstName: "contact-first",
  lastName: "contact-last",
  email: "contact-email",
  message: "contact-query",
};
const SLICES = 8;

type Status = "idle" | "sending" | "success" | "error";

const FIELD =
  "contact-field no-focus-ring w-full rounded-sm bg-white px-3 py-2.5 font-body text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400";
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
  // Field with a validation problem (marked aria-invalid), and when the form
  // opened (a human can't fill four fields in under a couple of seconds).
  const [invalid, setInvalid] = useState<FieldName | null>(null);
  const openedAtRef = useRef(0);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // While open: Esc closes, the page behind doesn't scroll, focus moves into
  // the form and returns to whatever opened it afterwards.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    openedAtRef.current = Date.now();
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
    setInvalid(null);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "");

    // Spam traps that real visitors never trigger (hidden fields). Bots get a
    // fake "sent" screen so they don't learn what tripped them.
    if (text("contact_hp_check") || data.get("botcheck")) {
      setStatus("success");
      return;
    }
    if (Date.now() - openedAtRef.current < 2500) {
      setStatus("error");
      setError("That was quick! Please take a moment and try again.");
      return;
    }

    const check = validateContact({
      firstName: text("firstName"),
      lastName: text("lastName"),
      email: text("email"),
      message: text("query"),
    });
    if (!check.ok) {
      setStatus("error");
      setError(check.error);
      setInvalid(check.field);
      document.getElementById(FIELD_IDS[check.field])?.focus();
      return;
    }

    setStatus("sending");
    setError("");
    setInvalid(null);
    try {
      await sendContactMessage(check.values);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      const reason = err instanceof ContactError ? err.reason : "failed";
      setError(
        reason === "not-configured"
          ? "The contact form isn't set up yet. Please try again later."
          : reason === "too-fast"
            ? "You've just sent a message. Please wait a moment before sending another."
            : reason === "invalid"
              ? ((err as ContactError).detail ??
                "Please check your details and try again.")
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
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="relative my-auto w-full max-w-lg overflow-hidden rounded-md p-6 shadow-[0_0_80px_rgba(255,0,44,0.35)] sm:p-8"
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

            {/* Panel chrome: the close button sits against the panel's own edge,
                clear of the form content. */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0.5 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact form"
                className={`${WIPE_FILL} pointer-events-auto absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white`}
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
                className="font-display text-2xl text-white sm:text-3xl pr-12"
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
                    className={`${LINK_HOVER} mt-6 cursor-pointer bg-black/70 font-mono text-sm uppercase tracking-[0.2em] text-white`}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="relative mt-6 space-y-4"
                >
                  <FocusLock />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-first" className={LABEL}>
                        First name
                      </label>
                      <input
                        ref={firstFieldRef}
                        id="contact-first"
                        aria-invalid={invalid === "firstName"}
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
                        aria-invalid={invalid === "lastName"}
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
                      aria-invalid={invalid === "email"}
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
                      aria-invalid={invalid === "message"}
                      name="query"
                      required
                      rows={5}
                      maxLength={MAX_QUERY}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={`${FIELD} resize-none`}
                    />
                  </div>

                  {/* Spam traps, hidden from people (and skipped by keyboard and
                      screen readers). Bots tend to fill every field they find. */}
                  <input
                    type="text"
                    name="contact_hp_check"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
                  />
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
                      className={`${LINK_HOVER} shrink-0 cursor-pointer bg-black/70 font-mono text-sm uppercase tracking-[0.2em] text-white disabled:cursor-wait disabled:opacity-60`}
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
