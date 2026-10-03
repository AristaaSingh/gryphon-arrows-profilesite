import type { Metadata } from "next";
import "./globals.css";
import { headingFont, monoFont, bodyFont } from "@/config/fonts";

export const metadata: Metadata = {
  title: "Gryphon Arrows",
  description: "Gryphon Arrows — the university's entry to the IMechE UAS Challenge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${monoFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
