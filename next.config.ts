import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    // Product images are served from the inventory system's object storage
    // (Cloudflare R2 or S3). Set STOREFRONT_IMAGE_HOST to that hostname.
    remotePatterns: process.env.STOREFRONT_IMAGE_HOST
      ? [{ protocol: 'https', hostname: process.env.STOREFRONT_IMAGE_HOST }]
      : [],
  },
};

export default config;
