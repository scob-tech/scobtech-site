import type { Metadata, Viewport } from "next";
import { CtaFinal, Rodape } from "@/components/home/contato";
import { Demonstracao } from "@/components/home/demonstracao";
import { Diferencial } from "@/components/home/diferencial";
import { HomeFontPreload } from "@/components/home/font-preload";
import { homeFontVars } from "@/components/home/fonts";
import { Fundador, Investimento } from "@/components/home/fundador";
import { Hero } from "@/components/home/hero";
import { MobileCta } from "@/components/home/mobile-cta";
import { Nav } from "@/components/home/nav";
import { Processo } from "@/components/home/processo";
import { Projetos } from "@/components/home/projetos";
import { Reveal } from "@/components/home/reveal";
import { Solucoes } from "@/components/home/solucoes";
import { VideoInstitucional } from "@/components/home/video-institucional";
import "@/components/home/home.css";

/**
 * Home — direção "o ponto da scob.".
 * Componentes em components/home, CSS escopado em .hm. Título e descrição próprios abaixo;
 * o restante dos metadados (ícones, metadataBase) vem do layout raiz.
 * Os componentes antigos da home (components/site) continuam no repositório: /privacy
 * ainda usa Footer, Logo e Eyebrow.
 */
const title = "scob. — Tecnologia para atender, vender e operar melhor";
const description =
  "CRM com WhatsApp, sistemas de reservas e agendamento e softwares de gestão, desenvolvidos sob medida a partir da rotina da sua equipe.";

// metadados próprios da home; o layout raiz continua servindo /privacy
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "scob.",
    url: "/",
    title,
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "scob. — Sistemas sob medida" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#F2EFE8",
  colorScheme: "light",
};

export default function Home() {
  return (
    <div className={`hm ${homeFontVars}`}>
      <HomeFontPreload />
      <Nav />
      <main>
        <Hero />
        <Solucoes />
        <Demonstracao />
        <Projetos />
        <VideoInstitucional />
        <Diferencial />
        <Processo />
        <Fundador />
        <Investimento />
        <CtaFinal />
      </main>
      <Rodape />
      <MobileCta />
      <Reveal />
    </div>
  );
}
