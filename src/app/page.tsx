import { ContactProvider } from "@/components/contact/ContactProvider";
import SectionToc from "@/components/layout/SectionToc";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteNav from "@/components/layout/SiteNav";
import AboutSection from "@/components/sections/AboutSection";
import ChallengeSection from "@/components/sections/ChallengeSection";
import LandingSection from "@/components/sections/LandingSection";
import OfferSection from "@/components/sections/OfferSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import { TOC_ITEMS } from "@/content/sections";

/**
 * The page is just the sections in order. Each section is its own file in
 * src/components/sections/ — edit the section's file to change its content
 * or look. To reorder, add or remove a section, change this list (and
 * src/content/sections.ts, which drives the side menu and sheet numbers).
 */
export default function Home() {
  return (
    <ContactProvider>
      <SiteNav />
      <SectionToc items={TOC_ITEMS} />

      <LandingSection />
      <SponsorsSection />
      <AboutSection />
      <OfferSection />
      <ChallengeSection />

      <SiteFooter />
    </ContactProvider>
  );
}
