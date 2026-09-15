import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático: o site continua hospedado no GitHub Pages (scobtech.com.br)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
