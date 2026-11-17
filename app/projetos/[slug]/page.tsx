import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PlayerYouTube } from "@/components/home/midia";
import { Ponto } from "@/components/home/ponto";
import { Galeria } from "@/components/portfolio/galeria";
import { PaginaPortfolio } from "@/components/portfolio/pagina";
import { FRENTES, NATUREZA, projetoPorSlug, projetosPublicos, srcPortfolio } from "@/lib/projetos";

type Props = { params: Promise<{ slug: string }> };

// export estático: só os projetos públicos de lib/projetos.ts viram páginas
export const dynamicParams = false;

export function generateStaticParams() {
  return projetosPublicos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projeto = projetoPorSlug((await params).slug);
  if (!projeto) return {};
  const title = `${projeto.nome}: ${projeto.segmento} | scob.`;
  const capa = projeto.telas[0];
  const url = `/projetos/${projeto.slug}`;
  return {
    title,
    description: projeto.resumo,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: "scob.",
      url,
      title,
      description: projeto.resumo,
      images: [{ url: capa.src, width: capa.width, height: capa.height, alt: capa.alt }],
    },
    twitter: { card: "summary_large_image", title, description: projeto.resumo, images: [capa.src] },
  };
}

export const viewport: Viewport = {
  themeColor: "#F2EFE8",
  colorScheme: "light",
};

export default async function ProjetoPage({ params }: Props) {
  const { slug } = await params;
  const projeto = projetoPorSlug(slug);
  if (!projeto) notFound();

  // próximo projeto da mesma natureza; com um só, o link não aparece
  const mesmos = projetosPublicos.filter((p) => p.natureza === projeto.natureza);
  const indice = mesmos.indexOf(projeto);
  const proximo = mesmos.length > 1 ? mesmos[(indice + 1) % mesmos.length] : null;
  const capa = projeto.telas[0];
  const videos = projeto.videos ?? [];
  const resultados = projeto.resultados ?? [];

  return (
    <PaginaPortfolio>
      <article aria-labelledby="pf-case-title">
        <header className="pf-intro pf-case-head">
          <div className="hm-wrap">
            <nav aria-label="Trilha de navegação" className="pf-trilha">
              <ol>
                <li>
                  <a href="/">Início</a>
                </li>
                <li>
                  <a href="/projetos/">Projetos e demonstrações</a>
                </li>
                <li aria-current="page">{projeto.nome}</li>
              </ol>
            </nav>
            <p className="hm-proj-meta">
              <span className="hm-badge">{NATUREZA[projeto.natureza]}</span>
              {projeto.segmento}
            </p>
            <h1 id="pf-case-title" className="pf-title">
              {projeto.nome}
              <Ponto />
            </h1>
            <p className="hm-lead">{projeto.resumo}</p>
            <ul className="hm-chips" aria-label="Frentes do projeto">
              {projeto.frentes.map((f) => (
                <li key={f}>{FRENTES[f]}</li>
              ))}
            </ul>
          </div>
        </header>

        <div className="hm-wrap pf-capa">
          <figure className="hm-tela">
            <div className="hm-tela-bar" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={srcPortfolio(capa)}
              alt={capa.alt}
              width={capa.width}
              height={capa.height}
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        </div>

        <section className="hm-section pf-sec" aria-labelledby="pf-contexto">
          <div className="hm-wrap pf-dupla">
            <header data-reveal>
              <p className="hm-eyebrow">Contexto</p>
              <h2 id="pf-contexto" className="hm-h2">
                Antes e depois do sistema<Ponto />
              </h2>
            </header>
            <div data-reveal>
              {projeto.desafio && <p className="pf-desafio">{projeto.desafio}</p>}
              <dl className="hm-proj-ba pf-ba">
                <div>
                  <dt>Antes</dt>
                  <dd>{projeto.antes}</dd>
                </div>
                <div>
                  <dt>Depois</dt>
                  <dd>{projeto.depois}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="hm-section hm-section-surface pf-sec" aria-labelledby="pf-entrega">
          <div className="hm-wrap pf-dupla">
            <header data-reveal>
              <p className="hm-eyebrow">Entrega</p>
              <h2 id="pf-entrega" className="hm-h2">
                O que foi construído<Ponto />
              </h2>
            </header>
            <ol className="pf-mods" data-reveal>
              {projeto.modulos.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ol>
          </div>
        </section>

        {videos.length > 0 && (
          <section className="hm-section pf-sec" aria-labelledby="pf-videos">
            <div className="hm-wrap">
              <header className="hm-head" data-reveal>
                <p className="hm-eyebrow">Vídeos</p>
                <h2 id="pf-videos" className="hm-h2">
                  O sistema em uso<Ponto />
                </h2>
              </header>
              <div className="pf-videos">
                {videos.map((v) => (
                  <figure key={v.youtubeId} className="pf-video" data-reveal>
                    <PlayerYouTube video={v} />
                    <figcaption>
                      <span className="hm-badge">{v.tipo === "institucional" ? "Institucional" : "Demonstração"}</span>
                      {v.titulo}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="hm-section pf-sec" aria-labelledby="pf-telas">
          <div className="hm-wrap">
            <header className="hm-head" data-reveal>
              <p className="hm-eyebrow">Telas</p>
              <h2 id="pf-telas" className="hm-h2">
                Por dentro do sistema<Ponto />
              </h2>
              <p className="pf-nota">Capturas do sistema em uso, com nomes e dados pessoais ocultados.</p>
            </header>
            <Galeria telas={projeto.telas} />
          </div>
        </section>

        {resultados.length > 0 && (
          <section className="hm-section hm-section-surface pf-sec" aria-labelledby="pf-resultados">
            <div className="hm-wrap">
              <header className="hm-head" data-reveal>
                <p className="hm-eyebrow">Resultados</p>
                <h2 id="pf-resultados" className="hm-h2">
                  Resultados confirmados pelo cliente<Ponto />
                </h2>
              </header>
              <dl className="pf-resultados" data-reveal>
                {resultados.map((r) => (
                  <div key={r.rotulo}>
                    <dt>{r.rotulo}</dt>
                    <dd>{r.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        <nav className="hm-wrap pf-outros" aria-label="Outros projetos">
          <a href="/projetos/" className="hm-link">
            <ArrowLeft aria-hidden /> Projetos e demonstrações
          </a>
          {proximo && (
            <a href={`/projetos/${proximo.slug}`} className="pf-proximo">
              <span className="pf-proximo-rotulo">Próximo projeto</span>
              <span className="pf-proximo-nome">
                {proximo.nome} <ArrowRight aria-hidden />
              </span>
              <span className="pf-proximo-seg">{proximo.segmento}</span>
            </a>
          )}
        </nav>
      </article>
    </PaginaPortfolio>
  );
}
