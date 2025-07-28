import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'www.paypalobjects.com', 'randomuser.me'],
  },
  // Ensure environment variables are available on the client side
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
  // Enable React Strict Mode
  reactStrictMode: true,
};

export default nextConfig;
