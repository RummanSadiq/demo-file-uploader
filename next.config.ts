import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbnail-uploader-temp.s3.us-east-2.amazonaws.com'
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    }
  },
};

export default nextConfig;
