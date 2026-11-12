import type { Metadata } from "next";

/**
 * Metadados da landing Bone & Cobalt publicada em /materiais-de-construcao (indexável).
 * A página institucional (/) mantém os próprios metadados, definidos no layout raiz.
 *
 * Textos derivados do hero aprovado (kicker, título e subtítulo); nada novo foi afirmado.
 * Caminhos relativos resolvem contra `metadataBase` (https://scobtech.com.br, no layout).
 */
const ROTA = "/materiais-de-construcao";

const title = "scob. | Tecnologia para lojas de materiais de construção";
const description =
  "Sistemas modulares para lojas de materiais de construção: atendimento organizado, mais vendas e controle da operação, do primeiro atendimento à última entrega.";

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
  alternates: { canonical: ROTA },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "scob.",
    url: ROTA,
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
