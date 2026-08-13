import type { NextConfig } from "next";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

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
  async rewrites() {
    // Same-origin proxy so HTTPS localhost can call the HTTP API without mixed content.
    if (process.env.NODE_ENV === "production") return [];
    return [
      {
        source: "/__api/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/guest/login", destination: "/login", permanent: true },
      { source: "/guest/signup", destination: "/signup", permanent: true },
      { source: "/guest/auth", destination: "/login", permanent: true },
      { source: "/auth", destination: "/login", permanent: true },
      {
        source: "/membership/dashboard",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/membership/pay",
        destination: "/dashboard/pay",
        permanent: false,
      },
      {
        source: "/membership/benefits",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
