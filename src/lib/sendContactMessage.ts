import { SITE_LINKS } from "@/content/site-links";
import { validateContact, type ContactInput } from "@/lib/contactValidation";

const ENDPOINT = "https://api.web3forms.com/submit";
const COOLDOWN_MS = 30_000; // minimum gap between messages from one visitor

export interface ContactMessage extends ContactInput {
  /** Web3Forms' own hidden spam-trap field: real visitors never tick it. */
  botcheck?: boolean;
}

/** Why a send failed, so the form can show the right message. */
export class ContactError extends Error {
  constructor(
    public reason: "not-configured" | "invalid" | "too-fast" | "failed",
    public detail?: string,
  ) {
    super(reason);
  }
}

let lastSentAt = 0;

/**
 * Sends a contact-form message through Web3Forms (key in content/site-links.ts).
 * Everything is re-checked and cleaned here, even though the form already did,
 * so no other caller can push raw input through.
 */
export async function sendContactMessage(msg: ContactMessage): Promise<void> {
  if (!SITE_LINKS.contactFormKey) throw new ContactError("not-configured");

  const check = validateContact(msg);
  if (!check.ok) throw new ContactError("invalid", check.error);
  if (Date.now() - lastSentAt < COOLDOWN_MS) throw new ContactError("too-fast");

  const { firstName, lastName, email, message } = check.values;
  const fullName = `${firstName} ${lastName}`;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: SITE_LINKS.contactFormKey,
        subject: `Website enquiry from ${fullName}`,
        from_name: "Gryphon Arrows website",
        name: fullName,
        email,
        message,
        botcheck: msg.botcheck ? "on" : "",
      }),
    });
    const result = await res.json();
    if (!res.ok || !result.success)
      throw new Error(result.message || "Request failed");
    lastSentAt = Date.now();
  } catch {
    throw new ContactError("failed");
  }
}
