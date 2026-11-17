import { srcPortfolio, type Tela } from "@/lib/projetos-base";

/** Agrupa as telas pela área do sistema, mantendo a ordem em que aparecem nos dados. */
function agrupar(telas: Tela[]) {
  const grupos = new Map<string, Tela[]>();
  for (const t of telas) {
    const g = t.grupo ?? "";
    if (!grupos.has(g)) grupos.set(g, []);
    grupos.get(g)!.push(t);
  }
  return [...grupos.entries()];
}

function Figura({ tela }: { tela: Tela }) {
  const retrato = tela.height > tela.width;
  return (
    <figure className="pf-fig">
      {/* a imagem abre em tamanho real: no celular, é a forma de ler os detalhes da tela */}
      <a href={tela.src} target="_blank" rel="noopener" className="pf-fig-link">
        <span className="hm-tela hm-proj-stage" data-portrait={retrato ? "" : undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={srcPortfolio(tela)} alt={tela.alt} width={tela.width} height={tela.height} loading="lazy" decoding="async" />
        </span>
        <span className="hm-sr"> (abre a imagem em tamanho real)</span>
      </a>
      <figcaption>{tela.label}</figcaption>
    </figure>
  );
}

/** Galeria da página do projeto. Com grupos, cada área ganha um subtítulo (h3). */
export function Galeria({ telas }: { telas: Tela[] }) {
  const grupos = agrupar(telas);
  const comGrupos = grupos.length > 1 || grupos[0]?.[0] !== "";

  if (!comGrupos) {
    return (
      <div className="pf-grid">
        {telas.map((t) => (
          <Figura key={t.src} tela={t} />
        ))}
      </div>
    );
  }

  return (
    <div className="pf-grupos">
      {grupos.map(([nome, lista]) => (
        <div key={nome} className="pf-grupo" data-reveal>
          {nome && <h3 className="pf-grupo-title">{nome}</h3>}
          <div className="pf-grid">
            {lista.map((t) => (
              <Figura key={t.src} tela={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
