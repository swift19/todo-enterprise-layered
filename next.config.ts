import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        "**/System Volume Information/**",
        "E:\\System Volume Information",
        "**/node_modules/**",
        "**/.git/**",
      ],
    };
    return config;
  },
};

export default nextConfig;
