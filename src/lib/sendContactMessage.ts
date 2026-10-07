import { SITE_LINKS } from "@/content/site-links";

const ENDPOINT = "https://api.web3forms.com/submit";

export interface ContactMessage {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  /** Hidden spam-trap field: real visitors never tick it. */
  botcheck?: boolean;
}

/** Why a send failed, so the form can show the right message. */
export class ContactError extends Error {
  constructor(public reason: "not-configured" | "failed") {
    super(reason);
  }
}

/** Sends a contact-form message through Web3Forms (key in content/site-links.ts). */
export async function sendContactMessage(msg: ContactMessage): Promise<void> {
  if (!SITE_LINKS.contactFormKey) throw new ContactError("not-configured");

  const fullName = `${msg.firstName} ${msg.lastName}`;
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
        email: msg.email,
        message: msg.message,
        botcheck: msg.botcheck ? "on" : "",
      }),
    });
    const result = await res.json();
    if (!res.ok || !result.success)
      throw new Error(result.message || "Request failed");
  } catch {
    throw new ContactError("failed");
  }
}
