import { ArrowRight } from "lucide-react";
import { FRENTES, NATUREZA, srcPortfolio, type Projeto } from "@/lib/projetos";

/**
 * Cartão do índice do portfólio. O link fica no título e cobre o cartão inteiro (um único
 * ponto de foco por projeto); a imagem é decorativa porque o título já identifica o link.
 */
export function CartaoProjeto({ projeto, prioridade = false }: { projeto: Projeto; prioridade?: boolean }) {
  const capa = projeto.telas[0];
  const href = `/projetos/${projeto.slug}`;

  return (
    <article className="pf-card" aria-labelledby={`pf-card-${projeto.slug}`}>
      <figure className="hm-tela pf-card-media">
        <div className="hm-tela-bar" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={srcPortfolio(capa)}
          alt=""
          width={capa.width}
          height={capa.height}
          loading={prioridade ? "eager" : "lazy"}
          fetchPriority={prioridade ? "high" : undefined}
          decoding="async"
        />
      </figure>

      <div className="pf-card-info">
        <p className="hm-proj-meta">
          <span className="hm-badge">{NATUREZA[projeto.natureza]}</span>
          {projeto.segmento}
        </p>
        <h3 id={`pf-card-${projeto.slug}`} className="hm-h3">
          <a href={href} className="pf-card-link">
            {projeto.nome}
          </a>
        </h3>
        <p className="pf-card-resumo">{projeto.resumo}</p>
        <ul className="hm-chips" aria-label="Frentes do projeto">
          {projeto.frentes.map((f) => (
            <li key={f}>{FRENTES[f]}</li>
          ))}
        </ul>
        <p className="pf-card-cta" aria-hidden>
          Ver projeto <ArrowRight />
        </p>
      </div>
    </article>
  );
}
