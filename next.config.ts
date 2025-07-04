import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'www.paypalobjects.com'],
  },
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
