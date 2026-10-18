import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "www.yolearn.ai", pathname: "/og_image.png" }] },
};

export default nextConfig;
