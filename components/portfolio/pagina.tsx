import { CtaFinal, Rodape } from "@/components/home/contato";
import { HomeFontPreload } from "@/components/home/font-preload";
import { homeFontVars } from "@/components/home/fonts";
import { MobileCta } from "@/components/home/mobile-cta";
import { Nav } from "@/components/home/nav";
import { paginasNav } from "@/components/home/nav-items";
import { Reveal } from "@/components/home/reveal";
import "@/components/home/home.css";
import "./portfolio.css";

/**
 * Casca das páginas do portfólio: mesma identidade, navegação, CTA final e rodapé da home.
 * O CTA final (#contato) e os links de WhatsApp continuam com o rastreamento global do layout.
 */
export function PaginaPortfolio({ children, atual }: { children: React.ReactNode; atual?: string }) {
  return (
    <div className={`hm ${homeFontVars}`}>
      <HomeFontPreload />
      <Nav items={paginasNav} logoHref="/" atual={atual} />
      <main>
        {children}
        <CtaFinal />
      </main>
      <Rodape items={paginasNav} />
      <MobileCta />
      <Reveal />
    </div>
  );
}
