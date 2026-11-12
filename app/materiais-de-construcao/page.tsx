import type { Metadata, Viewport } from "next";
import { ScrollStory } from "@/components/hero-bc/scroll-story";
import { SecaoCusto } from "@/components/secao-custo/secao-custo";
import { Solucoes } from "@/components/solucoes/solucoes";
import { Contato, Rodape } from "@/components/contato/contato";
import { LandingFontPreload } from "@/components/hero-bc/font-preload";
import { landingMetadata } from "@/lib/landing-metadata";
import "./landing.css";

/**
 * /materiais-de-construcao — landing Bone & Cobalt para lojas de materiais de construção.
 * Rota independente: a página institucional (/) continua sendo a página inicial do site.
 *
 * Hero com a transição para as mensagens, "O custo de uma operação desorganizada", a vitrine
 * de soluções, o contato comercial pelo WhatsApp e o rodapé. Metadados definitivos
 * (indexável), em lib/landing-metadata.ts.
 *
 * Decisão comercial: a página apresenta as soluções sem uma seção exclusiva de case.
 *
 * Isolamento: o CSS da landing é importado só por esta rota (e pelos componentes dela), com
 * classes próprias (.ss, .hbc, .sc, .sv, .ct, .sd). As regras globais (html:has, @property)
 * só valem quando esse CSS está carregado. Não há navegação client-side entre as rotas
 * (links comuns), então o CSS de uma página não permanece carregado na outra.
 */
export const metadata: Metadata = landingMetadata;

export const viewport: Viewport = {
  themeColor: "#F2EFE8",
  colorScheme: "light",
};

export default function MateriaisDeConstrucaoPage() {
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
