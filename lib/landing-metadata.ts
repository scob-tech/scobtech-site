import type { Metadata } from "next";

/**
 * Metadados definitivos da nova landing (Bone & Cobalt), preparados para a futura rota
 * pública `/`. Hoje aplicados em /preview-hero, que acrescenta `robots: noindex` por
 * cima. Ao substituir `/`, basta usar este objeto SEM o noindex.
 *
 * Textos derivados do hero aprovado (kicker, título e subtítulo); nada novo foi afirmado.
 * Caminhos relativos resolvem contra `metadataBase` (https://scobtech.com.br, no layout).
 */
const title = "scob. | Tecnologia para lojas de materiais de construção";
const description =
  "Sua loja mais eficiente, do primeiro atendimento à última entrega. Sistemas modulares para organizar o atendimento, impulsionar as vendas e controlar a operação.";

const ogTitle = "Sua loja mais eficiente, do primeiro atendimento à última entrega.";
const ogDescription =
  "Sistemas modulares para organizar o atendimento, impulsionar as vendas e dar mais controle à operação da sua loja.";
const ogImage = {
  url: "/og-landing.jpg",
  width: 1200,
  height: 630,
  alt: "scob.: tecnologia para lojas de materiais de construção, do primeiro atendimento à última entrega.",
};

export const landingMetadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "scob.",
    url: "/",
    title: ogTitle,
    description: ogDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: [{ url: ogImage.url, alt: ogImage.alt }],
  },
};
