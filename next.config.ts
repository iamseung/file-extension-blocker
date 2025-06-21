import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://43.200.94.63/api/:path*',
      },
    ];
  },
};

export default nextConfig;
