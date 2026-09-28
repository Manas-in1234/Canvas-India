import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page in this app is a client component fetching from the external
  // NestJS API at runtime — nothing here needs a Node server, so a static
  // export is enough (and is what Cloudflare Pages serves most simply).
  output: "export",
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
