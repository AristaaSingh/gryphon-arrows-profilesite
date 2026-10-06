import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

// Single-page site, so one entry. Add new pages here if the site grows
// (e.g. a /gallery page).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE.url}/`, changeFrequency: "monthly", priority: 1 }];
}
