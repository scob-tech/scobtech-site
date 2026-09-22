import type { MetadataRoute } from "next";

// Necessário com output: "export" — o robots.txt é gerado como arquivo estático no build
export const dynamic = "force-static";

const BASE_URL = "https://scobtech.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
