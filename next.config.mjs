import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "outgoing-panda-806.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
