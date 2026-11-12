import { CheckCheck, Clock3, FileSpreadsheet, MessageCircle, NotebookPen } from "lucide-react";
import { demoFontVars } from "@/components/demo-atendimento/fonts";
import "./secao-custo.css";

/**
 * Seção "O custo de uma operação desorganizada": em /preview-hero, logo após a transição;
 * prévia isolada em /preview-custo.
 *
 * Quatro dores das lojas de materiais de construção. Cada cartão traz uma pequena cena de
 * interface que mostra a dor acontecendo (não um ícone genérico). As cenas são decorativas
 * (aria-hidden): o título e o texto de cada cartão carregam a informação.
 *
 * Composição assimétrica em zigue-zague no desktop (largo/estreito, estreito/largo, com a
 * coluna da direita deslocada). Interação só no hover, com movimento curto e suave.
 */

const PRICE_NOTE = "Areia média — R$ 135/m³?";

export function SecaoCusto() {
  return (
    <section className={`sc ${demoFontVars}`} aria-labelledby="sc-titulo">
      <div className="sc-inner">
        <header className="sc-head">
          <h2 id="sc-titulo" className="sc-title">
            O custo de uma operação <em>desorganizada</em>.
          </h2>
          <p className="sc-lead">
            Raramente a venda se perde por falta de produto ou de preço. Ela se perde nos intervalos: na mensagem que
            demora, no orçamento que ninguém retoma, na informação que ninguém encontra.
          </p>
        </header>

        <div className="sc-grid">
          {/* 1 — Atendimento lento */}
          <article className="sc-card sc-card--lento">
            <div className="sc-scene" aria-hidden>
              <div className="sc-chat">
                <div className="sc-chat-top">
                  <span className="sc-avatar">RC</span>
                  <span className="sc-chat-name">Ricardo · Obra Jd. América</span>
                  <MessageCircle className="sc-chat-icon" />
                </div>
                <p className="sc-bubble">
                  Boa tarde! Tem cimento CP II para entregar hoje? Preciso de 40 sacos.
                  <time>14:02</time>
                </p>
                <p className="sc-bubble sc-bubble--late">
                  Alguém aí?
                  <time>14:31</time>
                </p>
                <div className="sc-wait">
                  <Clock3 className="sc-wait-icon" />
                  <span>Sem resposta há 47 min</span>
                </div>
              </div>
            </div>
            <div className="sc-copy">
              <h3 className="sc-card-title">Atendimento lento no WhatsApp</h3>
              <p className="sc-card-text">
                O cliente pergunta preço e prazo e fica esperando. Enquanto isso, pede o mesmo orçamento em outras lojas e
                fecha com quem responder primeiro.
              </p>
            </div>
          </article>

          {/* 2 — Conversas esquecidas */}
          <article className="sc-card sc-card--esquecidas">
            <div className="sc-scene" aria-hidden>
              <ul className="sc-inbox">
                <li>
                  <span className="sc-avatar">MA</span>
                  <span className="sc-inbox-text">
                    <b>Marcos Antunes</b>
                    <span>Fecha o orçamento do telhado?</span>
                  </span>
                  <span className="sc-inbox-meta">
                    <time>ontem</time>
                    <i>2</i>
                  </span>
                </li>
                <li>
                  <span className="sc-avatar">CS</span>
                  <span className="sc-inbox-text">
                    <b>Construtora Silva</b>
                    <span>Segue a lista do pedido</span>
                  </span>
                  <span className="sc-inbox-meta">
                    <time>seg.</time>
                    <i>5</i>
                  </span>
                </li>
                <li>
                  <span className="sc-avatar">JL</span>
                  <span className="sc-inbox-text">
                    <b>Juliana Lopes</b>
                    <span>Vocês ainda têm o porcelanato?</span>
                  </span>
                  <span className="sc-inbox-meta">
                    <time>12/11</time>
                    <i>1</i>
                  </span>
                </li>
              </ul>
              <p className="sc-inbox-more">+ 18 conversas sem retorno</p>
            </div>
            <div className="sc-copy">
              <h3 className="sc-card-title">Conversas e oportunidades esquecidas</h3>
              <p className="sc-card-text">
                Orçamentos ficam sem retorno e pedidos se perdem no meio do histórico. Ninguém sabe quem deveria responder,
                e o cliente desiste em silêncio.
              </p>
            </div>
          </article>

          {/* 3 — Informações dispersas */}
          <article className="sc-card sc-card--dispersas">
            <div className="sc-scene" aria-hidden>
              <div className="sc-scatter">
                <div className="sc-frag sc-frag--sheet">
                  <span className="sc-frag-label">
                    <FileSpreadsheet /> orcamentos_v3_final.xlsx
                  </span>
                  <span className="sc-cells">
                    <span>Marcos · telhado</span>
                    <span>?</span>
                    <span>Construtora Silva</span>
                    <span>R$ 4.870</span>
                  </span>
                </div>
                <div className="sc-frag sc-frag--note">
                  <NotebookPen />
                  <span>{PRICE_NOTE}</span>
                </div>
                <div className="sc-frag sc-frag--msg">
                  <span>Qual o preço que passei pro Ricardo?</span>
                  <CheckCheck />
                </div>
              </div>
            </div>
            <div className="sc-copy">
              <h3 className="sc-card-title">Informações comerciais dispersas</h3>
              <p className="sc-card-text">
                Preço combinado no WhatsApp, desconto anotado no caderno, orçamento numa planilha que só uma pessoa
                entende. Cada consulta vira uma busca, e cada resposta depende de quem está no balcão.
              </p>
            </div>
          </article>

          {/* 4 — Sem indicadores */}
          <article className="sc-card sc-card--indicadores">
            <div className="sc-scene" aria-hidden>
              <div className="sc-panel-top">
                <span>Atendimento · este mês</span>
                <span className="sc-panel-tag">sem dados</span>
              </div>
              <dl className="sc-metrics">
                <div>
                  <dt>Tempo da primeira resposta</dt>
                  <dd>—</dd>
                  <span className="sc-track" />
                </div>
                <div>
                  <dt>Orçamentos sem retorno</dt>
                  <dd>—</dd>
                  <span className="sc-track" />
                </div>
                <div>
                  <dt>Conversas que viraram venda</dt>
                  <dd>—</dd>
                  <span className="sc-track" />
                </div>
              </dl>
            </div>
            <div className="sc-copy">
              <h3 className="sc-card-title">Falta de indicadores sobre o atendimento</h3>
              <p className="sc-card-text">
                Sem saber quanto o cliente espera, quantos orçamentos ficam parados e quantas conversas viram venda, não há
                como corrigir o que está custando vendas.
              </p>
            </div>
          </article>
        </div>

        <p className="sc-close">
          Cada falha parece pequena no dia a dia. <em>Somadas, viram vendas que a loja nunca chega a ver.</em>
        </p>
      </div>
    </section>
  );
}
