import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GOOGLE_ADS_ID } from "@/lib/gtag";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const title = "scob. — Sistemas sob medida para empresas que cresceram";
const description =
  "Scob desenvolve sistemas sob medida para empresas que desejam eliminar processos manuais, integrar operações e crescer com software personalizado.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "scob.",
    url: site.url,
    title: "scob. — Sistemas sob medida",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "scob. — Sistemas sob medida" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
      {/* Google Ads (gtag.js): carregada uma vez para todas as páginas */}
      {GOOGLE_ADS_ID && <GoogleAnalytics gaId={GOOGLE_ADS_ID} />}
    </html>
  );
}
