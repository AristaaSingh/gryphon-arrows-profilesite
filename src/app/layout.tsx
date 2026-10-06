import type { Metadata, Viewport } from "next";
import "./globals.css";
import { headingFont, monoFont, bodyFont } from "@/config/fonts";
import { SITE_LINKS } from "@/content/site-links";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
};

export const viewport: Viewport = { themeColor: "#000000" };

// Tells search engines who we are (shown in knowledge panels and helps them
// link our social profiles to the site).
const organisationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/team/griff-logo.png`,
  description: SITE.description,
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "University of Leeds",
  },
  sameAs: [SITE_LINKS.instagram, SITE_LINKS.linkedin].filter(Boolean),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${headingFont.variable} ${monoFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationData) }}
        />
        {children}
      </body>
    </html>
  );
}
