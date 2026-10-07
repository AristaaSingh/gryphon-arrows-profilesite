/**
 * Validation + cleaning for the contact form. Pure functions, no imports, so
 * they can run in the browser, in the sender, and in tests.
 *
 * What this protects against, and what it can't:
 *  - It keeps junk and markup out of what we send ("<script>", links, control
 *    characters, header-injection newlines in names/emails).
 *  - It runs in the visitor's browser, so a determined attacker can skip it and
 *    call the email service directly. The real defence for that is on the
 *    email service's side (allowed-domain lock, captcha, spam filter).
 */

export const LIMITS = {
  name: 60,
  email: 120,
  messageMin: 5,
  message: 300,
  maxLinks: 1,
} as const;

// Control characters, zero-width characters and bidi overrides: invisible
// characters used to disguise text or inject mail headers.
const INVISIBLE =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u2028\u2029\u202A-\u202E\u2060-\u2069\uFEFF]/g;

/** Single-line text: invisible characters removed, whitespace collapsed. */
export function cleanLine(text: string): string {
  return text
    .normalize("NFC")
    .replace(INVISIBLE, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Multi-line text: invisible characters removed, line breaks kept (max 1 blank line). */
export function cleanMessage(text: string): string {
  return text
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(INVISIBLE, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type FieldName = "firstName" | "lastName" | "email" | "message";
type Result = { ok: true; value: string } | { ok: false; error: string };

const NAME = /^\p{L}[\p{L}\p{M}'’.\u2010\u2011 -]*$/u; // letters, spaces, - ' . (no digits or symbols)
const EMAIL =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function validateName(raw: string, label: string): Result {
  const value = cleanLine(raw);
  if (!value) return { ok: false, error: `Please enter your ${label}.` };
  if (value.length > LIMITS.name)
    return { ok: false, error: `${label} is too long.` };
  if (!NAME.test(value))
    return {
      ok: false,
      error: `${label} can only contain letters, spaces, hyphens and apostrophes.`,
    };
  return { ok: true, value };
}

export function validateEmail(raw: string): Result {
  const value = cleanLine(raw);
  if (!value) return { ok: false, error: "Please enter your email address." };
  if (value.length > LIMITS.email || value.includes("..") || !EMAIL.test(value))
    return { ok: false, error: "Please enter a valid email address." };
  return { ok: true, value };
}

export function validateMessage(raw: string): Result {
  const value = cleanMessage(raw);
  if (value.length < LIMITS.messageMin)
    return { ok: false, error: "Please write a little more in your message." };
  if (value.length > LIMITS.message)
    return {
      ok: false,
      error: `Please keep your message to ${LIMITS.message} characters.`,
    };
  if (!/\p{L}/u.test(value))
    return { ok: false, error: "Please write your message in words." };
  // Markup, script-style URLs and inline event handlers have no place in a plain-text enquiry.
  if (
    /<\s*\/?\s*[a-z!?]/i.test(value) ||
    /(?:javascript|vbscript|data)\s*:/i.test(value) ||
    /\bon(?:error|load|click|mouse\w*|focus|blur|key\w*|submit|change)\s*=/i.test(
      value,
    )
  )
    return {
      ok: false,
      error: "Please remove any code or HTML from your message.",
    };
  if ((value.match(/https?:\/\/|www\./gi) ?? []).length > LIMITS.maxLinks)
    return { ok: false, error: "Please include at most one link." };
  if (/(.)\1{14,}/u.test(value))
    return {
      ok: false,
      error: "Please check your message for repeated characters.",
    };
  return { ok: true, value };
}

export type ContactInput = Record<FieldName, string>;
export type ContactCheck =
  | { ok: true; values: ContactInput }
  | { ok: false; field: FieldName; error: string };

/** Checks every field in form order; reports the first problem (and which field). */
export function validateContact(input: ContactInput): ContactCheck {
  const checks: [FieldName, Result][] = [
    ["firstName", validateName(input.firstName, "First name")],
    ["lastName", validateName(input.lastName, "Last name")],
    ["email", validateEmail(input.email)],
    ["message", validateMessage(input.message)],
  ];
  const values = {} as ContactInput;
  for (const [field, result] of checks) {
    if (!result.ok) return { ok: false, field, error: result.error };
    values[field] = result.value;
  }
  return { ok: true, values };
}
