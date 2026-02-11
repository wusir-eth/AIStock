import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    SECONDME_API_ENDPOINT: process.env.SECONDME_API_ENDPOINT || 'https://api.second.me',
    SECONDME_CLIENT_ID: process.env.SECONDME_CLIENT_ID,
    SECONDME_CLIENT_SECRET: process.env.SECONDME_CLIENT_SECRET,
  },
};

export default nextConfig;
