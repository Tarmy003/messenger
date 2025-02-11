import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {hostname:"fiery-zebra-12.convex.cloud"}
    ]
  }
};

export default nextConfig;
