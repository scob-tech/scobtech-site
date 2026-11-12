"use client";

import { useId, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { demoFontVars } from "@/components/demo-atendimento/fonts";
import { AREAS, TAG_LABEL, type AreaId } from "./data";
import { DemoAtendimento, DemoCobrancas, DemoEntregas, DemoFinanceiro, DemoGestao, TagChip } from "./demos";
import "./solucoes.css";

/**
 * Vitrine de soluções (prévia em /preview-solucoes).
 *
 * Um menu de cinco áreas (padrão de abas acessível: setas, Home/End, foco circulante) e um
 * grande palco com a demonstração da área escolhida. Cada demonstração tem uma interação
 * real (escolher conversa, avançar etapas da entrega, importar arquivo, escolher pendência,
 * trocar período). A troca de área usa uma única transição curta; com movimento reduzido,
 * troca direta.
 */

const DEMOS: Record<AreaId, ComponentType> = {
  atendimento: DemoAtendimento,
  entregas: DemoEntregas,
  financeiro: DemoFinanceiro,
  cobrancas: DemoCobrancas,
  gestao: DemoGestao,
};

export function Solucoes() {
  const [ativa, setAtiva] = useState(0);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const area = AREAS[ativa];
  const Demo = DEMOS[area.id];
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  const escolher = (i: number, foco = false) => {
    setAtiva(i);
    const tab = tabRefs.current[i];
    if (foco) tab?.focus();
    // no menu horizontal (tablet/celular), traz a aba escolhida para a área visível sem
    // mexer na rolagem vertical da página
    const strip = tab?.parentElement;
    if (tab && strip && strip.scrollWidth > strip.clientWidth) {
      const left = tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2;
      strip.scrollTo({ left, behavior: "smooth" });
    }
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = AREAS.length;
    const map: Record<string, number> = {
      ArrowDown: (ativa + 1) % n,
      ArrowRight: (ativa + 1) % n,
      ArrowUp: (ativa - 1 + n) % n,
      ArrowLeft: (ativa - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    escolher(map[e.key], true);
  };

  return (
    <section className={`sv ${demoFontVars}`} aria-labelledby="sv-titulo">
      <div className="sv-inner">
        <header className="sv-head">
          <h2 id="sv-titulo" className="sv-title">
            Tecnologia que se adapta <em>à sua operação.</em>
          </h2>
          <p className="sv-sub">
            Da primeira conversa ao fechamento do caixa, desenvolvemos sistemas para eliminar tarefas manuais, conectar
            informações e dar mais controle à sua empresa.
          </p>
        </header>

        <div className="sv-body">
          <div className="sv-nav-col">
            <div className="sv-nav" role="tablist" aria-label="Áreas" aria-orientation="vertical" onKeyDown={onKey}>
              {AREAS.map((a, i) => (
                <button
                  key={a.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={tabId(i)}
                  type="button"
                  role="tab"
                  aria-selected={i === ativa}
                  aria-controls={panelId}
                  tabIndex={i === ativa ? 0 : -1}
                  className="sv-tab"
                  onClick={() => escolher(i)}
                >
                  <span className="sv-tab-name">{a.nome}</span>
                  <span className="sv-tab-sum">{a.resumo}</span>
                  <span className="sv-tab-tags" aria-hidden>
                    {a.tags.map((t) => (
                      <span key={t} className={`sv-dot sv-dot--${t}`} />
                    ))}
                  </span>
                  <span className="sv-sr">, {a.tags.map((t) => TAG_LABEL[t]).join(" e ")}</span>
                </button>
              ))}
            </div>

            <dl className="sv-legend">
              <div>
                <dt>
                  <span className="sv-dot sv-dot--real" aria-hidden /> Aplicação real
                </dt>
                <dd>Solução já desenvolvida pela Scobtech</dd>
              </div>
              <div>
                <dt>
                  <span className="sv-dot sv-dot--medida" aria-hidden /> Solução sob medida
                </dt>
                <dd>desenvolvida a partir do seu processo</dd>
              </div>
            </dl>
          </div>

          <div id={panelId} role="tabpanel" aria-labelledby={tabId(ativa)} className="sv-panel" tabIndex={-1}>
            <div className="sv-stage">
              <div className="sv-window">
                <div className="sv-window-bar">
                  <span className="sv-crumb">
                    <b>scob.</b> / {area.nome}
                  </span>
                  <span className="sv-window-note">Demonstração · dados ilustrativos</span>
                </div>
                <div className="sv-demo" key={area.id}>
                  <Demo />
                </div>
              </div>
            </div>

            <div className="sv-caption" key={`cap-${area.id}`}>
              <div className="sv-caption-text">
                <h3 className="sv-caption-title">{area.titulo}</h3>
                <p>{area.texto}</p>
              </div>
              <ul className="sv-features">
                {area.itens.map((it) => (
                  <li key={it.texto}>
                    <span>{it.texto}</span>
                    <TagChip tag={it.tag} small />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
