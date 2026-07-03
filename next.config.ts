import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d10xsoss226fg9.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
