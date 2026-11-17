"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { DemoBotao } from "./demo-botao";
import { Ponto } from "./ponto";

const dsa = "/cases/deposito-santo-antonio";

type Imagem = { src: string; alt: string; w: number; h: number };

type Frente = {
  nome: string;
  problema: string;
  texto: string;
  /** Recursos já implementados e em uso em projeto real (Depósito Santo Antônio). */
  emUso?: string[];
  /** Possibilidades de desenvolvimento sob medida, sem implementação comprovada. */
  sobMedida: string[];
  /** Captura real; frentes sem projeto implementado não têm tela. */
  img?: Imagem;
  /** Fluxo em texto, usado no lugar de uma tela quando não há projeto real. */
  fluxo?: string[];
  demo?: boolean;
};

/**
 * As três frentes da scob., na ordem de prioridade comercial.
 * Regra: "emUso" só recebe o que foi verificado no Depósito Santo Antônio (capturas e rótulos
 * aprovados em components/solucoes/data.ts). Todo o resto entra em "sobMedida".
 */
const frentes: Frente[] = [
  {
    nome: "Atendimento e vendas",
    problema: "As conversas ficam no celular de cada vendedor.",
    texto:
      "O WhatsApp da empresa vira um painel compartilhado: cada conversa com um responsável, uma etapa do funil e o histórico do cliente.",
    emUso: [
      "CRM integrado ao WhatsApp",
      "Atendimento por vários colaboradores",
      "Gestão de leads e funil de vendas",
      "Histórico de conversas e contatos",
    ],
    sobMedida: ["Qualificação de leads", "Automações e inteligência artificial no atendimento"],
    img: { src: `${dsa}/wa-agenda.png`, alt: "Agenda de tarefas do atendimento via WhatsApp", w: 1100, h: 611 },
    demo: true,
  },
  {
    nome: "Reservas e agendamentos",
    problema: "Horários marcados à mão e confirmações que dependem de alguém lembrar.",
    texto:
      "Sistemas de reservas e agendamento desenvolvidos sob medida, desenhados a partir de como a sua empresa atende hoje.",
    sobMedida: [
      "Reservas e agendamento de serviços",
      "Gestão de horários e disponibilidade",
      "Confirmações e lembretes automáticos",
      "Integração com WhatsApp e agendas",
      "Organização dos atendimentos",
    ],
    fluxo: ["Pedido de horário", "Disponibilidade", "Confirmação", "Lembrete", "Atendimento"],
  },
  {
    nome: "Gestão empresarial",
    problema: "Entregas, financeiro e indicadores espalhados em planilhas.",
    texto: "Entregas, financeiro e indicadores conectados, com automação onde hoje existe retrabalho.",
    emUso: [
      "Gestão de entregas com aplicativo do motorista",
      "Financeiro com conciliação automática",
      "Leitura de documentos com inteligência artificial",
      "Importação de dados do sistema que a empresa já usa",
      "Dashboards e indicadores",
    ],
    sobMedida: ["Integrações por API com outros sistemas", "Softwares personalizados para cada operação"],
    img: { src: `${dsa}/entrega-financeiro.png`, alt: "Financeiro das entregas com conciliação", w: 1100, h: 618 },
  },
];

function Fluxo({ passos }: { passos: string[] }) {
  return (
    <div className="hm-sol-fluxo">
      <p className="hm-sol-fluxo-title">Exemplo de fluxo</p>
      <ol>
        {passos.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>
      <p className="hm-sol-fluxo-nota">Cada sistema é desenhado a partir do diagnóstico da sua operação.</p>
    </div>
  );
}

export function Solucoes() {
  const [ativo, setAtivo] = useState(0);

  return (
    <section id="solucoes" className="hm-section" aria-labelledby="hm-sol-title">
      <div className="hm-wrap">
        <header className="hm-head" data-reveal>
          <p className="hm-eyebrow">O que resolvemos</p>
          <h2 id="hm-sol-title" className="hm-h2">
            Três frentes, começando sempre pelo problema<Ponto />
          </h2>
        </header>

        <div className="hm-sol">
          <ol className="hm-sol-list">
            {frentes.map((f, i) => {
              const aberto = i === ativo;
              return (
                <li key={f.nome} className="hm-sol-item" data-open={aberto ? "" : undefined} data-reveal>
                  <button
                    type="button"
                    className="hm-sol-trigger"
                    aria-expanded={aberto}
                    aria-controls={`hm-sol-${i}`}
                    onClick={() => setAtivo(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setAtivo(i)}
                  >
                    <span className="hm-sol-num">0{i + 1}</span>
                    <span className="hm-sol-problema">{f.nome}</span>
                    <span className="hm-sol-solucao">{f.problema}</span>
                  </button>
                  <div id={`hm-sol-${i}`} className="hm-sol-body" hidden={!aberto}>
                    <p>{f.texto}</p>

                    {f.emUso && (
                      <div className="hm-sol-grupo">
                        <p className="hm-sol-grupo-title">Em uso em projeto real</p>
                        <ul>
                          {f.emUso.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="hm-sol-grupo" data-sob-medida="">
                      <p className="hm-sol-grupo-title">{f.emUso ? "Também sob medida" : "Desenvolvido sob medida"}</p>
                      <ul>
                        {f.sobMedida.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    {f.demo && (
                      <DemoBotao className="hm-link hm-sol-demo">
                        Experimentar a demonstração <ArrowRight aria-hidden />
                      </DemoBotao>
                    )}

                    {/* no celular, a tela (ou o fluxo) aparece dentro do item aberto */}
                    <div className="hm-sol-inline">
                      {f.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="hm-sol-img-inline"
                          src={f.img.src}
                          alt={f.img.alt}
                          width={f.img.w}
                          height={f.img.h}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        f.fluxo && <Fluxo passos={f.fluxo} />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* no desktop, a tela da frente ativa fica fixa ao lado da lista */}
          <div className="hm-sol-preview" aria-hidden>
            <div className="hm-sol-stack">
              {frentes.map((f, i) =>
                f.img ? (
                  <div key={f.nome} className="hm-tela" data-active={i === ativo ? "" : undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.img.src} alt="" width={f.img.w} height={f.img.h} loading="lazy" decoding="async" />
                  </div>
                ) : (
                  f.fluxo && (
                    <div key={f.nome} data-active={i === ativo ? "" : undefined}>
                      <Fluxo passos={f.fluxo} />
                    </div>
                  )
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
