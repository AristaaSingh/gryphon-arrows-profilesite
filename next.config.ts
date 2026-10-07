import type { NextConfig } from "next";

// Security headers sent with every page.
//  - Stops other sites framing ours (clickjacking), blocks MIME sniffing,
//    trims what we reveal to other sites, switches off browser features we
//    never use, and locks down plugins, <base> and form targets.
//  - There is deliberately no script-src rule: Next.js needs inline scripts,
//    and doing that safely takes per-request nonces (a bigger change).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
