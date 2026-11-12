"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Camera,
  Check,
  CheckCheck,
  Clock3,
  FileSpreadsheet,
  FileUp,
  Lock,
  MessageCircle,
  ScanBarcode,
  UserCheck,
} from "lucide-react";
import { TAG_LABEL, type Tag } from "./data";

/* Todos os valores, nomes e datas destas telas são ilustrativos. */

export function TagChip({ tag, small = false }: { tag: Tag; small?: boolean }) {
  return (
    <span className={`sv-tag sv-tag--${tag}${small ? " sv-tag--sm" : ""}`}>
      {tag === "medida" && <span className="sv-tag-dash" aria-hidden />}
      {TAG_LABEL[tag]}
    </span>
  );
}

/* =========================================================
   1. Atendimento e vendas
   ========================================================= */

const CONVERSAS = [
  {
    id: "rc",
    ini: "RC",
    nome: "Ricardo · Obra Jd. América",
    ultima: "Fechado, pode separar.",
    etapa: "Fechamento",
    vendedor: "Paula",
    msgs: [
      { de: "cliente", t: "Consegue 40 sacos de cimento CP II para amanhã?" },
      { de: "loja", t: "Consigo sim. Mando o orçamento com o frete em seguida." },
      { de: "cliente", t: "Fechado, pode separar." },
    ],
  },
  {
    id: "ms",
    ini: "MA",
    nome: "Marcos Antunes",
    ultima: "E o prazo de entrega?",
    etapa: "Orçamento",
    vendedor: "André",
    msgs: [
      { de: "cliente", t: "Preciso de telhas para 60 m². Qual a melhor opção?" },
      { de: "loja", t: "Separei duas opções. Segue o orçamento das duas." },
      { de: "cliente", t: "E o prazo de entrega?" },
    ],
  },
  {
    id: "cs",
    ini: "CS",
    nome: "Construtora Silva",
    ultima: "Segue a lista do pedido.",
    etapa: "Novo contato",
    vendedor: "—",
    msgs: [{ de: "cliente", t: "Boa tarde! Segue a lista do pedido da obra da Rua 7." }],
  },
] as const;

export function DemoAtendimento() {
  const [sel, setSel] = useState(0);
  const c = CONVERSAS[sel];
  return (
    <div className="dm-atd">
      <div className="dm-kpis">
        <div>
          <span>Primeira resposta</span>
          <b>4 min</b>
        </div>
        <div>
          <span>Conversas abertas</span>
          <b>12</b>
        </div>
        <div>
          <span>Sem resposta há +1 h</span>
          <b className="dm-warn">2</b>
        </div>
      </div>
      <div className="dm-atd-body">
        <ul className="dm-inbox" aria-label="Conversas">
          {CONVERSAS.map((cv, i) => (
            <li key={cv.id}>
              <button
                type="button"
                className="dm-inbox-item"
                aria-pressed={i === sel}
                onClick={() => setSel(i)}
              >
                <span className="dm-avatar" aria-hidden>
                  {cv.ini}
                </span>
                <span className="dm-inbox-text">
                  <b>{cv.nome}</b>
                  <span>{cv.ultima}</span>
                </span>
                <span className={`dm-stage dm-stage--${i}`}>{cv.etapa}</span>
              </button>
            </li>
          ))}
          <li className="dm-funnel" aria-label="Funil comercial: 3 novos contatos, 5 em orçamento, 4 em fechamento">
            <span className="dm-col-label">Funil desta semana</span>
            <span className="dm-funnel-bar" aria-hidden>
              <span style={{ flexGrow: 3 }}>Novo · 3</span>
              <span style={{ flexGrow: 5 }}>Orçamento · 5</span>
              <span style={{ flexGrow: 4 }}>Fechamento · 4</span>
            </span>
          </li>
        </ul>
        <div className="dm-chat" key={c.id}>
          <div className="dm-chat-head">
            <MessageCircle aria-hidden />
            <span>{c.nome}</span>
            <span className="dm-chat-owner">Responsável: {c.vendedor}</span>
          </div>
          <div className="dm-chat-msgs">
            {c.msgs.map((m, i) => (
              <p key={i} className={`dm-msg dm-msg--${m.de}`} style={{ animationDelay: `${i * 70}ms` }}>
                {m.t}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   2. Entregas e fretes (aplicação real)
   ========================================================= */

const PASSOS = [
  { rotulo: "Romaneio", Icon: ScanBarcode },
  { rotulo: "Foto", Icon: Camera },
  { rotulo: "Recebedor", Icon: UserCheck },
  { rotulo: "Conferência", Icon: FileSpreadsheet },
] as const;

export function DemoEntregas() {
  const [passo, setPasso] = useState(0);
  const enviado = passo >= 3;
  return (
    <div className="dm-ent">
      <div className="dm-ent-phone-col">
        <div className="dm-phone">
          <div className="dm-phone-notch" aria-hidden />
          <div className="dm-phone-screen" key={passo}>
            {passo === 0 && (
              <>
                <p className="dm-phone-title">Ler romaneio</p>
                <div className="dm-viewfinder" aria-hidden>
                  <span className="dm-barcode" />
                  <span className="dm-scanline" />
                </div>
                <p className="dm-phone-ok">
                  <Check aria-hidden /> Romaneio 004817 lido
                </p>
              </>
            )}
            {passo === 1 && (
              <>
                <p className="dm-phone-title">Foto da entrega</p>
                <div className="dm-photo" aria-hidden>
                  <span className="dm-photo-box" />
                  <span className="dm-photo-box dm-photo-box--b" />
                  <span className="dm-photo-ground" />
                </div>
                <p className="dm-phone-ok">
                  <Check aria-hidden /> Foto registrada às 14:32
                </p>
              </>
            )}
            {passo === 2 && (
              <>
                <p className="dm-phone-title">Quem recebeu</p>
                <div className="dm-field">
                  <span>Nome</span>
                  <b>Carlos Mendes</b>
                </div>
                <div className="dm-field">
                  <span>Documento</span>
                  <b>•••.482.•••-10</b>
                </div>
                <span className="dm-phone-btn">Confirmar entrega</span>
              </>
            )}
            {passo === 3 && (
              <div className="dm-phone-done">
                <span className="dm-done-ring" aria-hidden>
                  <CheckCheck />
                </span>
                <b>Entrega confirmada</b>
                <span>Romaneio 004817 enviado ao financeiro</span>
              </div>
            )}
          </div>
        </div>
        <div className="dm-steps" role="group" aria-label="Etapas da entrega">
          {PASSOS.map(({ rotulo, Icon }, i) => (
            <button
              key={rotulo}
              type="button"
              className="dm-step"
              aria-pressed={i === passo}
              data-done={i < passo || undefined}
              onClick={() => setPasso(i)}
            >
              <Icon aria-hidden />
              <span>{rotulo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ligação celular → painel do financeiro */}
      <div className="dm-link" data-on={enviado || undefined} aria-hidden>
        <span className="dm-link-line" />
        <span className="dm-link-dot" />
      </div>

      <div className="dm-panel">
        <div className="dm-panel-head">
          <b>Conferência de fretes</b>
          <span className="dm-file">
            <FileUp aria-hidden /> fretes_novembro.csv importado
          </span>
        </div>
        <table className="dm-table">
          <thead>
            <tr>
              <th scope="col">Romaneio</th>
              <th scope="col">Comprovante</th>
              <th scope="col">Frete cobrado</th>
              <th scope="col">Frete previsto</th>
              <th scope="col">Situação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>004815</td>
              <td>
                <Check className="dm-ok" aria-label="sim" />
              </td>
              <td>R$ 180,00</td>
              <td>R$ 180,00</td>
              <td>
                <span className="dm-st dm-st--ok">Conferido</span>
              </td>
            </tr>
            <tr className="dm-row-alert">
              <td>004816</td>
              <td>
                <Check className="dm-ok" aria-label="sim" />
              </td>
              <td>R$ 240,00</td>
              <td>R$ 210,00</td>
              <td>
                <span className="dm-st dm-st--alert">
                  <AlertTriangle aria-hidden /> Divergência
                </span>
              </td>
            </tr>
            <tr className={enviado ? "dm-row-new" : undefined}>
              <td>004817</td>
              <td>{enviado ? <Check className="dm-ok" aria-label="sim" /> : <span className="dm-dash">—</span>}</td>
              <td>R$ 150,00</td>
              <td>R$ 150,00</td>
              <td>
                {enviado ? (
                  <span className="dm-st dm-st--ok">Conferido</span>
                ) : (
                  <span className="dm-st">Aguardando</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="dm-panel-foot">
          <AlertTriangle aria-hidden /> 1 divergência destacada para conferência
          <span>{enviado ? "3 de 3 entregas com comprovante" : "2 de 3 entregas com comprovante"}</span>
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   3. Financeiro (importação e conferência reais; fechamento sob medida)
   ========================================================= */

export function DemoFinanceiro() {
  const [estado, setEstado] = useState<"inicio" | "importando" | "pronto">("inicio");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const importar = () => {
    if (estado !== "inicio") {
      setEstado("inicio");
      return;
    }
    setEstado("importando");
    timer.current = setTimeout(() => setEstado("pronto"), 900);
  };
  return (
    <div className="dm-fin">
      <div className="dm-fin-sources">
        <p className="dm-col-label">Fontes</p>
        <div className="dm-source" data-on={estado === "pronto" || undefined}>
          <FileSpreadsheet aria-hidden />
          <span>
            <b>Sistema atual</b>
            <span>vendas_novembro.csv</span>
          </span>
        </div>
        <div className="dm-source" data-on={estado === "pronto" || undefined}>
          <CheckCheck aria-hidden />
          <span>
            <b>Entregas registradas</b>
            <span>pelo app do motorista</span>
          </span>
        </div>
        <button type="button" className="dm-btn" onClick={importar} aria-live="polite">
          {estado === "inicio" && (
            <>
              <FileUp aria-hidden /> Importar arquivo
            </>
          )}
          {estado === "importando" && "Importando…"}
          {estado === "pronto" && "Recomeçar demonstração"}
        </button>
      </div>

      <div className="dm-fin-main">
        <div className="dm-fin-table" data-state={estado}>
          <div className="dm-panel-head">
            <b>Base consolidada</b>
            <span className="dm-file">{estado === "pronto" ? "3 conferências automáticas" : "aguardando arquivo"}</span>
          </div>
          <div className="dm-progress" aria-hidden>
            <span />
          </div>
          <ul className="dm-fin-rows">
            <li>
              <span>Pedido 18.204</span>
              <span>R$ 3.480,00</span>
              <span className="dm-st dm-st--ok">Confere</span>
            </li>
            <li>
              <span>Pedido 18.205</span>
              <span>R$ 1.920,00</span>
              <span className="dm-st dm-st--ok">Confere</span>
            </li>
            <li className="dm-row-alert">
              <span>Pedido 18.209</span>
              <span>R$ 760,00</span>
              <span className="dm-st dm-st--alert">
                <AlertTriangle aria-hidden /> Revisar
              </span>
            </li>
          </ul>
        </div>

        <div className="dm-future">
          <div>
            <b>Fechamento de caixa</b>
            <span>Entradas, saídas e conferência do dia na mesma base</span>
          </div>
          <TagChip tag="medida" small />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   4. Cobranças (sob medida)
   ========================================================= */

const PENDENCIAS = [
  {
    id: "a",
    cliente: "Construtora Silva",
    valor: "R$ 4.870,00",
    venc: "vence em 3 dias",
    st: "Lembrete agendado",
    tom: "info",
    hist: [
      { t: "Boleto emitido", d: "01/11" },
      { t: "Lembrete automático agendado", d: "para 10/11" },
    ],
  },
  {
    id: "b",
    cliente: "Marcos Antunes",
    valor: "R$ 1.260,00",
    venc: "venceu há 5 dias",
    st: "Em atraso",
    tom: "alert",
    hist: [
      { t: "Lembrete enviado pelo WhatsApp", d: "07/11" },
      { t: "Cliente respondeu: “pago na sexta”", d: "08/11" },
      { t: "Novo lembrete na sexta", d: "agendado" },
    ],
  },
  {
    id: "c",
    cliente: "Obra Jd. América",
    valor: "R$ 2.150,00",
    venc: "pago em 06/11",
    st: "Pago",
    tom: "ok",
    hist: [
      { t: "Lembrete enviado pelo WhatsApp", d: "04/11" },
      { t: "Pagamento identificado", d: "06/11" },
    ],
  },
] as const;

export function DemoCobrancas() {
  const [sel, setSel] = useState(1);
  const p = PENDENCIAS[sel];
  return (
    <div className="dm-cob">
      <ul className="dm-cob-list" aria-label="Pendências">
        {PENDENCIAS.map((x, i) => (
          <li key={x.id}>
            <button type="button" className="dm-cob-item" aria-pressed={i === sel} onClick={() => setSel(i)}>
              <span className="dm-cob-main">
                <b>{x.cliente}</b>
                <span>{x.venc}</span>
              </span>
              <span className="dm-cob-side">
                <b>{x.valor}</b>
                <span className={`dm-st dm-st--${x.tom}`}>{x.st}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="dm-cob-detail" key={p.id}>
        <p className="dm-col-label">Histórico · {p.cliente}</p>
        <ol className="dm-timeline">
          {p.hist.map((h, i) => (
            <li key={i} style={{ animationDelay: `${i * 70}ms` }}>
              <span className="dm-tl-dot" aria-hidden />
              <span>{h.t}</span>
              <time>{h.d}</time>
            </li>
          ))}
        </ol>
        <div className="dm-reminder">
          <span className="dm-reminder-head">
            <Bell aria-hidden /> Prévia do lembrete
          </span>
          <p>
            Olá! Passando para lembrar do pagamento de {p.valor} referente ao seu pedido. Qualquer dúvida, é só responder
            por aqui.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   5. Gestão e indicadores (indicadores reais; painel único e visão por gestor sob medida)
   ========================================================= */

const PERIODOS = {
  semana: {
    rotulo: "Semana",
    eixo: ["seg", "ter", "qua", "qui", "sex", "sáb"],
    barras: [52, 68, 61, 80, 74, 40],
    kpis: ["6 min", "38", "R$ 92 mil"],
  },
  mes: {
    rotulo: "Mês",
    eixo: ["sem 1", "sem 2", "sem 3", "sem 4"],
    barras: [64, 72, 58, 86],
    kpis: ["5 min", "164", "R$ 410 mil"],
  },
} as const;

export function DemoGestao() {
  const [per, setPer] = useState<keyof typeof PERIODOS>("semana");
  const d = PERIODOS[per];
  const max = Math.max(...d.barras);
  return (
    <div className="dm-ges">
      <div className="dm-ges-top">
        <b>Painel da diretoria</b>
        <div className="dm-seg" role="group" aria-label="Período">
          {(Object.keys(PERIODOS) as (keyof typeof PERIODOS)[]).map((k) => (
            <button key={k} type="button" aria-pressed={k === per} onClick={() => setPer(k)}>
              {PERIODOS[k].rotulo}
            </button>
          ))}
        </div>
      </div>
      <div className="dm-ges-kpis">
        <div>
          <span>
            <MessageCircle aria-hidden /> Atendimento · 1ª resposta
          </span>
          <b>{d.kpis[0]}</b>
        </div>
        <div>
          <span>
            <Check aria-hidden /> Vendas · pedidos fechados
          </span>
          <b>{d.kpis[1]}</b>
        </div>
        <div>
          <span>
            <Clock3 aria-hidden /> Financeiro · a receber
          </span>
          <b>{d.kpis[2]}</b>
        </div>
      </div>
      <div className="dm-chart">
        <p className="dm-col-label">Pedidos fechados por {per === "semana" ? "dia" : "semana"}</p>
        <div className="dm-bars" style={{ gridTemplateColumns: `repeat(${d.barras.length}, minmax(0, 1fr))` }}>
          {d.barras.map((v, i) => (
            <div key={`${per}-${i}`} className="dm-bar-col">
              <span className="dm-bar" style={{ height: `${(v / max) * 100}%`, animationDelay: `${i * 40}ms` }} />
              <span className="dm-bar-label">{d.eixo[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="dm-ges-note">
        <Lock aria-hidden /> Painel único e visão por gestor
        <TagChip tag="medida" small />
      </p>
    </div>
  );
}
