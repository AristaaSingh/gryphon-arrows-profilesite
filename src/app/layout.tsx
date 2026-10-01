import type { Metadata } from "next";
import { Gajraj_One, Space_Mono, Exo_2 } from "next/font/google";
import "./globals.css";

const gajrajOne = Gajraj_One({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gryphon Arrows",
  description: "Gryphon Arrows — the university's entry to the IMechE UAS Challenge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${gajrajOne.variable} ${spaceMono.variable} ${exo2.variable} h-full snap-y snap-mandatory antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
