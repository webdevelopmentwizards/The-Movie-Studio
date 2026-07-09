import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Assets are already on CDN — skip Next.js proxy (/_next/image) so CloudFront gets direct browser hits
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.themoviestudio.com",
      },
    ],
  },
};

export default nextConfig;
