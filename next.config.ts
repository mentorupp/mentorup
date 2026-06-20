import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd()),
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  async redirects() {
    return [
      { source: "/servicos", destination: "/consultoria", permanent: true },
      { source: "/precos", destination: "/planos", permanent: true },
    ];
  },
};

export default nextConfig;
