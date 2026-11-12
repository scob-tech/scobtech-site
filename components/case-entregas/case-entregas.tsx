"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, Camera, FileUp, ScanBarcode, Search, Shuffle, UserCheck } from "lucide-react";
import { demoFontVars } from "@/components/demo-atendimento/fonts";
import "./case-entregas.css";

/**
 * Case real: conferência digital de entregas e fretes (Depósito Santo Antônio).
 * Em /preview-hero, logo após a vitrine de soluções; prévia isolada em /preview-case.
 *
 * Antes (papel) x depois (registro digital). Sem estatísticas: o destaque é a mudança do
 * processo. Única interação: passar o mouse ou focar uma etapa do "depois" acende a parte
 * correspondente do registro ilustrativo. Sem fotos nem logos do cliente.
 */

const ANTES = [
  "Toda sexta-feira, centenas de folhas para conferir antes do pagamento.",
  "Endereço, valor do frete e quem recebeu, verificados um a um.",
  "Comprovantes em papel arquivados por meses, à espera de uma consulta eventual.",
];

const DEPOIS = [
  { Icon: ScanBarcode, titulo: "O motorista escaneia o romaneio", texto: "O código de barras identifica a entrega." },
  { Icon: Camera, titulo: "Registra a foto e quem recebeu", texto: "Foto da entrega, nome e documento de quem recebeu." },
  { Icon: FileUp, titulo: "O financeiro importa o arquivo", texto: "O mesmo arquivo exportado do sistema que a loja já usa." },
  { Icon: Shuffle, titulo: "A plataforma cruza os dados", texto: "Entregas e valores de frete, lado a lado." },
  { Icon: AlertTriangle, titulo: "As divergências aparecem", texto: "O que não confere é destacado para conferência." },
  { Icon: Search, titulo: "Tudo fica registrado", texto: "Os comprovantes ficam disponíveis para consulta digital." },
] as const;

const MUDANCAS = [
  ["Pilha de folhas", "Um registro digital por entrega"],
  ["Conferência linha a linha", "Divergências destacadas"],
  ["Arquivo físico por meses", "Consulta quando precisar"],
] as const;

export function CaseEntregas() {
  const [ativo, setAtivo] = useState(0);
  const hl = (n: number) => (ativo === n ? "ce-hl ce-hl--on" : "ce-hl");

  return (
    <section className={`ce ${demoFontVars}`} aria-labelledby="ce-titulo">
      <div className="ce-inner">
        <header className="ce-head">
          <h2 id="ce-titulo" className="ce-title">
            De centenas de folhas à <em>conferência digital</em> de entregas.
          </h2>
          <dl className="ce-ficha">
            <div>
              <dt>Cliente</dt>
              <dd>Depósito Santo Antônio</dd>
            </div>
            <div>
              <dt>Segmento</dt>
              <dd>Materiais de construção</dd>
            </div>
            <div>
              <dt>O que construímos</dt>
              <dd>Sistema sob medida de comprovação de entregas e conferência de fretes</dd>
            </div>
            <div>
              <dt>Situação</dt>
              <dd>
                <span className="ce-real">Aplicação real</span>
              </dd>
            </div>
          </dl>
        </header>

        <div className="ce-compare">
          {/* ---------- Antes: papel ---------- */}
          <article className="ce-panel ce-panel--antes" aria-labelledby="ce-antes">
            <h3 id="ce-antes" className="ce-panel-title">Antes</h3>
            <p className="ce-panel-lead">A conferência dependia de papel e de memória.</p>

            <div className="ce-paper" aria-hidden>
              <span className="ce-sheet ce-sheet--5" />
              <span className="ce-sheet ce-sheet--4" />
              <span className="ce-sheet ce-sheet--3" />
              <span className="ce-sheet ce-sheet--2" />
              <span className="ce-sheet ce-sheet--1">
                <span className="ce-sheet-head">
                  <b>ROMANEIO</b> Nº 004815
                </span>
                <span className="ce-sheet-lines" />
                <span className="ce-sheet-row">
                  <i>Frete</i> R$ ______
                </span>
                <svg className="ce-sign" viewBox="0 0 120 36" fill="none">
                  <path d="M4 26c10-14 18-18 22-10s-6 14 2 10 12-20 18-14-4 16 4 12 10-14 16-10 4 10 12 6 14-8 30-10" />
                </svg>
                <span className="ce-sheet-q">?</span>
              </span>
              <span className="ce-tag-friday">sexta-feira</span>
              <span className="ce-box">
                <span>Arquivo</span>
                <span>out · nov · dez</span>
              </span>
            </div>

            <ul className="ce-antes-list">
              {ANTES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>

          <div className="ce-bridge" aria-hidden>
            <ArrowRight />
          </div>

          {/* ---------- Depois: registro digital ---------- */}
          <article className="ce-panel ce-panel--depois" aria-labelledby="ce-depois">
            <h3 id="ce-depois" className="ce-panel-title">Depois</h3>
            <p className="ce-panel-lead">Cada entrega vira um registro conferido pela própria plataforma.</p>

            <div className="ce-depois-body">
              <ol className="ce-steps">
                {DEPOIS.map(({ Icon, titulo, texto }, i) => (
                  <li key={titulo}>
                    <button
                      type="button"
                      className="ce-step"
                      aria-pressed={ativo === i}
                      onMouseEnter={() => setAtivo(i)}
                      onFocus={() => setAtivo(i)}
                      onClick={() => setAtivo(i)}
                    >
                      <span className="ce-step-icon" aria-hidden>
                        <Icon />
                      </span>
                      <span className="ce-step-text">
                        <b>{titulo}</b>
                        <span>{texto}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              {/* registro ilustrativo: cada parte corresponde a uma etapa */}
              <div className="ce-record" aria-hidden>
                <div className="ce-record-top">
                  <span className="ce-record-label">Registro ilustrativo</span>
                </div>
                <div className={hl(0)}>
                  <span className="ce-mini-barcode" />
                  <span className="ce-rec-strong">Romaneio 004816</span>
                  <span className="ce-chip ce-chip--ok">lido</span>
                </div>
                <div className={`${hl(1)} ce-rec-proof`}>
                  <span className="ce-photo">
                    <span className="ce-photo-box" />
                    <span className="ce-photo-box ce-photo-box--b" />
                  </span>
                  <span className="ce-rec-fields">
                    <span>
                      <i>Recebido por</i> Carlos Mendes
                    </span>
                    <span>
                      <i>Documento</i> •••.482.•••-10
                    </span>
                  </span>
                </div>
                <div className={hl(2)}>
                  <FileUp className="ce-rec-icon" />
                  <span>fretes_novembro.csv</span>
                  <span className="ce-chip">importado</span>
                </div>
                <div className={`${hl(3)} ce-rec-values`}>
                  <span>
                    <i>Frete cobrado</i> R$ 240,00
                  </span>
                  <span>
                    <i>Frete previsto</i> R$ 210,00
                  </span>
                </div>
                <div className={`${hl(4)} ce-rec-alert`}>
                  <AlertTriangle className="ce-rec-icon" />
                  <span>Divergência para conferência</span>
                </div>
                <div className={`${hl(5)} ce-rec-search`}>
                  <Search className="ce-rec-icon" />
                  <span>Disponível para consulta</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <ul className="ce-shifts" aria-label="O que mudou">
          {MUDANCAS.map(([de, para]) => (
            <li key={de}>
              <span className="ce-shift-from">{de}</span>
              <ArrowRight className="ce-shift-arrow" aria-hidden />
              <span className="ce-shift-to">{para}</span>
            </li>
          ))}
        </ul>

        <p className="ce-note">
          <UserCheck aria-hidden /> Desenhado a partir do processo que a equipe já seguia: a plataforma recebe o arquivo do
          sistema atual, sem trocar o que funciona.
        </p>
      </div>
    </section>
  );
}
