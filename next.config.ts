import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'www.paypalobjects.com', 'randomuser.me'],
  },
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
