import { resolve } from "path";
import type { NextConfig } from "next";

// Match production setup that triggers the bug: turbopack bundler with explicit root.
const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname),
  },
};

export default nextConfig;
