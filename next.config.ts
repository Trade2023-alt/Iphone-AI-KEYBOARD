import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Disabled to allow API routes
  images: {
    // unoptimized: true, // Keep this if we eventually export, but fine to comment out for now or leave in.
  },
};

export default nextConfig;
