"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import ContactModal from "@/components/contact/ContactModal";

const ContactContext = createContext<{ open: () => void } | null>(null);

/** Wrap the page in this once. Anything inside can call `useContact().open()`
 *  (or render a <ContactLink />) to pop the contact form up over the page. */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContactContext.Provider value={{ open }}>
      {children}
      <ContactModal open={isOpen} onClose={close} />
    </ContactContext.Provider>
  );
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContact must be used inside <ContactProvider>");
  return ctx;
}
