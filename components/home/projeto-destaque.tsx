"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { FRENTES, NATUREZA, telasDaHome, type Projeto } from "@/lib/projetos-base";
import { PlayerYouTube } from "./midia";

/**
 * Destaque de um projeto na home (galeria interativa). Recebe o projeto por props: o arquivo
 * de dados é lido no servidor, para que projetos não públicos não entrem no JavaScript do site.
 */
export function ProjetoDestaque({ projeto, inverter }: { projeto: Projeto; inverter: boolean }) {
  const [atual, setAtual] = useState(0);
  const telas = telasDaHome(projeto);
  const tela = telas[atual];
  const retrato = tela.height > tela.width;

  return (
    <article className="hm-proj" data-invert={inverter ? "" : undefined} aria-labelledby={`hm-proj-${projeto.slug}`}>
      <div className="hm-proj-media" data-reveal>
        <figure className="hm-tela hm-proj-stage" data-portrait={retrato ? "" : undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={tela.src}
            src={tela.src}
            alt={tela.alt}
            width={tela.width}
            height={tela.height}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{tela.label}</figcaption>
        </figure>

        {telas.length > 1 && (
          <ul className="hm-thumbs" aria-label={`Telas do projeto ${projeto.nome}`}>
            {telas.map((t, i) => (
              <li key={t.src}>
                <button
                  type="button"
                  aria-pressed={i === atual}
                  aria-label={`Mostrar tela: ${t.label}`}
                  onClick={() => setAtual(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.src} alt="" width={t.width} height={t.height} loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {projeto.videos?.map((v) => <PlayerYouTube key={v.youtubeId} video={v} className="hm-proj-video" />)}
      </div>

      <div className="hm-proj-info" data-reveal>
        <p className="hm-proj-meta">
          <span className="hm-badge">{NATUREZA[projeto.natureza]}</span>
          {projeto.segmento}
        </p>
        <h3 id={`hm-proj-${projeto.slug}`} className="hm-h3">
          {projeto.nome}
        </h3>
        <p className="hm-proj-resumo">{projeto.resumo}</p>

        <dl className="hm-proj-ba">
          <div>
            <dt>Antes</dt>
            <dd>{projeto.antes}</dd>
          </div>
          <div>
            <dt>Depois</dt>
            <dd>{projeto.depois}</dd>
          </div>
        </dl>

        <ul className="hm-proj-mods">
          {projeto.modulos.map((m) => (
            <li key={m}>
              <Check aria-hidden /> {m}
            </li>
          ))}
        </ul>

        <ul className="hm-chips" aria-label="Frentes do projeto">
          {projeto.frentes.map((f) => (
            <li key={f}>{FRENTES[f]}</li>
          ))}
        </ul>

        <p className="hm-proj-more">
          <a href={`/projetos/${projeto.slug}`} className="hm-link">
            Ver o projeto completo<span className="hm-sr">: {projeto.nome}</span> <ArrowRight aria-hidden />
          </a>
        </p>
      </div>
    </article>
  );
}
