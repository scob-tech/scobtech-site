import type { Metadata, Viewport } from "next";
import { Ponto } from "@/components/home/ponto";
import { CartaoDemo } from "@/components/portfolio/cartao-demo";
import { CartaoProjeto } from "@/components/portfolio/cartao-projeto";
import { PaginaPortfolio } from "@/components/portfolio/pagina";
import { demonstracoes, projetosPublicos, type Natureza } from "@/lib/projetos";

const title = "Projetos e demonstrações | scob.";
const description =
  "Um sistema em uso por uma empresa real e uma demonstração funcional de CRM com WhatsApp, separados com clareza.";

export const metadata: Metadata = {
  title,
  description,
  // com barra final: no GitHub Pages o índice é servido como /projetos/ (projetos/index.html)
  alternates: { canonical: "/projetos/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "scob.",
    url: "/projetos/",
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

/** Seções do índice por natureza. Seções sem itens não aparecem. */
const SECOES: { natureza: Natureza; titulo: string; texto: string }[] = [
  {
    natureza: "real",
    titulo: "Projetos reais",
    texto: "Sistemas implementados e em uso na operação de um cliente.",
  },
  {
    natureza: "desenvolvimento",
    titulo: "Em desenvolvimento",
    texto: "Produtos em construção, ainda sem uso por clientes.",
  },
  {
    natureza: "conceito",
    titulo: "Conceitos",
    texto: "Propostas de solução que ainda não foram implementadas.",
  },
];

export default function ProjetosPage() {
  const secoes = SECOES.map((s) => ({ ...s, itens: projetosPublicos.filter((p) => p.natureza === s.natureza) })).filter(
    (s) => s.itens.length > 0,
  );
  // só a primeira capa da página carrega com prioridade (é o maior elemento na dobra)
  const primeiraCapa = secoes[0]?.itens[0]?.slug;

  return (
    <PaginaPortfolio atual="/projetos/">
      <header className="pf-intro">
        <div className="hm-wrap">
          <p className="hm-eyebrow">Portfólio</p>
          <h1 className="pf-title">
            Projetos e demonstrações<Ponto />
          </h1>
          <p className="hm-lead">
            O que já está em uso por uma empresa real, separado do que você pode experimentar em uma
            demonstração com dados fictícios.
          </p>
        </div>
      </header>

      {secoes.map((s) => (
        <section key={s.natureza} className="pf-indice" aria-labelledby={`pf-sec-${s.natureza}`}>
          <div className="hm-wrap">
            <header className="pf-sec-head" data-reveal>
              <h2 id={`pf-sec-${s.natureza}`} className="pf-sec-title">
                {s.titulo}
              </h2>
              <p>{s.texto}</p>
            </header>
            <ul className="pf-lista">
              {s.itens.map((p) => (
                <li key={p.slug} data-reveal>
                  <CartaoProjeto projeto={p} prioridade={p.slug === primeiraCapa} />
                </li>
              ))}
            </ul>
            {s.natureza === "real" && (
              <p className="pf-nota pf-nota-secao">Nas capturas, nomes e dados pessoais foram ocultados.</p>
            )}
          </div>
        </section>
      ))}

      {demonstracoes.length > 0 && (
        <section className="pf-indice" aria-labelledby="pf-sec-demonstracao">
          <div className="hm-wrap">
            <header className="pf-sec-head" data-reveal>
              <h2 id="pf-sec-demonstracao" className="pf-sec-title">
                Demonstrações funcionais
              </h2>
              <p>Sistemas navegáveis com dados fictícios. Não representam clientes nem resultados.</p>
            </header>
            <ul className="pf-lista">
              {demonstracoes.map((d) => (
                <li key={d.id} data-reveal>
                  <CartaoDemo demo={d} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PaginaPortfolio>
  );
}
