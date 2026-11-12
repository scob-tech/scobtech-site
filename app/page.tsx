import type { Metadata, Viewport } from "next";
import { ScrollStory } from "@/components/hero-bc/scroll-story";
import { SecaoCusto } from "@/components/secao-custo/secao-custo";
import { Solucoes } from "@/components/solucoes/solucoes";
import { Contato, Rodape } from "@/components/contato/contato";
import { LandingFontPreload } from "@/components/hero-bc/font-preload";
import { landingMetadata } from "@/lib/landing-metadata";
import "./landing.css";

/**
 * Página inicial pública: landing Bone & Cobalt aprovada em /preview-hero.
 * Hero com a transição para as mensagens, "O custo de uma operação desorganizada", a vitrine
 * de soluções, o contato comercial pelo WhatsApp e o rodapé. Metadados definitivos
 * (indexável), em lib/landing-metadata.ts.
 *
 * Decisão comercial: a página apresenta as soluções sem uma seção exclusiva de case. O
 * componente CaseEntregas continua no repositório, mas não é renderizado. Como o espaçamento
 * inferior do case é o mesmo da vitrine, a distância vitrine → contato fica igual à que
 * existia entre case e contato (sem ajuste de espaçamento).
 *
 * A página anterior (components/site/*) continua no repositório para rollback.
 */
export const metadata: Metadata = landingMetadata;

export const viewport: Viewport = {
  themeColor: "#F2EFE8",
  colorScheme: "light",
};

export default function Home() {
  return (
    <>
      <LandingFontPreload />
      <main>
        <ScrollStory />
        <SecaoCusto />
        <Solucoes />
        <Contato />
      </main>
      <Rodape />
    </>
  );
}
