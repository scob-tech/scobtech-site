/**
 * Motor da demonstração de Atendimento & Vendas.
 *
 * Funções puras: recebem o estado e devolvem um estado novo (ou o mesmo, quando a ação
 * não é permitida). Nada aqui acessa rede, armazenamento, WhatsApp ou IA.
 * O React só despacha ações para `reduce`.
 */
import { at, DEMO_DAY } from "./data.ts";
import type {
  AnalysisRun,
  Conversation,
  DemoState,
  Finding,
  Message,
  Profile,
  Sale,
  Task,
  TaskOrigin,
  TaskPriority,
  TaskStatus,
} from "./types.ts";

const MIN = 60_000;
/** Quanto o relógio simulado anda a cada ação do visitante. */
const STEP = 2 * MIN;

/** Limiares da análise simulada (expostos na interface para deixar a regra explícita). */
export const RULES = {
  queueWaitMinutes: 15,
  quoteDelayMinutes: 120,
} as const;

/* =========================================================
   Consultas
   ========================================================= */

export const sellerName = (s: DemoState, id: string | null | undefined) =>
  s.sellers.find((x) => x.id === id)?.name ?? "Sem responsável";

export const customerOf = (s: DemoState, conv: Conversation) => s.customers.find((c) => c.id === conv.customerId);

export const messagesOf = (s: DemoState, convId: string) =>
  s.messages.filter((m) => m.convId === convId).sort((a, b) => a.at - b.at);

export const saleOf = (s: DemoState, convId: string): Sale | undefined => s.sales.find((x) => x.convId === convId);

/** Fila compartilhada: leads sem responsável, visíveis a todos os vendedores autorizados. */
export function sharedQueue(s: DemoState): Conversation[] {
  return s.conversations.filter((c) => c.ownerId === null && c.status === "aguardando");
}

/**
 * Conversas que o perfil pode ver.
 * - Gestor: todas.
 * - Vendedor: a fila compartilhada + as conversas pelas quais é responsável.
 *   Conversas assumidas por outro vendedor não aparecem.
 */
export function visibleConversations(s: DemoState, p: Profile): Conversation[] {
  if (p.role === "gestor") return s.conversations;
  return s.conversations.filter((c) => c.ownerId === null || c.ownerId === p.sellerId);
}

export function canView(s: DemoState, p: Profile, convId: string) {
  return visibleConversations(s, p).some((c) => c.id === convId);
}

/** Último horário de atividade da conversa (para ordenar a lista). */
export function lastActivity(s: DemoState, convId: string) {
  const ms = messagesOf(s, convId);
  return ms.length ? ms[ms.length - 1].at : 0;
}

/* =========================================================
   Indicadores
   ========================================================= */

export interface ConversationTimings {
  /** Intervalo entre a 1ª mensagem do lead e a 1ª resposta humana (null se ainda não houve). */
  firstResponse: number | null;
  /** Esperas encerradas durante o atendimento, já sem a primeira resposta. */
  during: { ms: number; sellerId: string }[];
}

/**
 * Regras de cálculo:
 * - Primeira resposta: da primeira mensagem do cliente até a primeira mensagem de um vendedor.
 * - Resposta durante o atendimento: depois da primeira resposta, cada mensagem do cliente que
 *   exige resposta abre uma espera, encerrada pela próxima mensagem de vendedor. Mensagens
 *   consecutivas do cliente não abrem esperas novas: a espera conta desde a primeira delas.
 *   Mensagens de sistema e de encerramento ("obrigado!") não abrem espera.
 * - Esperas ainda abertas não entram na média (não há como saber quanto vão durar).
 */
export function conversationTimings(s: DemoState, convId: string): ConversationTimings {
  const ms = messagesOf(s, convId);
  const firstClient = ms.find((m) => m.author === "cliente");
  if (!firstClient) return { firstResponse: null, during: [] };

  const firstReplyIdx = ms.findIndex((m) => m.author === "vendedor" && m.at >= firstClient.at);
  if (firstReplyIdx === -1) return { firstResponse: null, during: [] };

  const firstResponse = ms[firstReplyIdx].at - firstClient.at;
  const during: ConversationTimings["during"] = [];
  let waitStart: number | null = null;

  for (const m of ms.slice(firstReplyIdx + 1)) {
    if (m.author === "cliente" && m.expectsReply !== false) {
      if (waitStart === null) waitStart = m.at;
    } else if (m.author === "vendedor" && waitStart !== null) {
      during.push({ ms: m.at - waitStart, sellerId: m.sellerId ?? "" });
      waitStart = null;
    }
  }
  return { firstResponse, during };
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export interface SellerMetrics {
  sellerId: string;
  name: string;
  duringAvgMs: number | null;
  duringSamples: number;
  finalized: number;
  salesCount: number;
  salesTotal: number;
}

export interface Metrics {
  firstResponseAvgMs: number | null;
  firstResponseSamples: number;
  duringAvgMs: number | null;
  duringSamples: number;
  finalized: number;
  salesCount: number;
  salesTotal: number;
  bySeller: SellerMetrics[];
}

/** Todos os indicadores são derivados do estado atual: mudar uma conversa muda os números. */
export function computeMetrics(s: DemoState): Metrics {
  const firsts: number[] = [];
  const during: { ms: number; sellerId: string }[] = [];
  for (const c of s.conversations) {
    const t = conversationTimings(s, c.id);
    if (t.firstResponse !== null) firsts.push(t.firstResponse);
    during.push(...t.during);
  }
  const finalizedConvs = s.conversations.filter((c) => c.status === "finalizada");

  return {
    firstResponseAvgMs: avg(firsts),
    firstResponseSamples: firsts.length,
    duringAvgMs: avg(during.map((d) => d.ms)),
    duringSamples: during.length,
    finalized: finalizedConvs.length,
    salesCount: s.sales.length,
    salesTotal: s.sales.reduce((a, x) => a + x.amount, 0),
    bySeller: s.sellers.map((seller) => {
      const mine = during.filter((d) => d.sellerId === seller.id).map((d) => d.ms);
      const sales = s.sales.filter((x) => x.sellerId === seller.id);
      return {
        sellerId: seller.id,
        name: seller.name,
        duringAvgMs: avg(mine),
        duringSamples: mine.length,
        finalized: finalizedConvs.filter((c) => c.ownerId === seller.id).length,
        salesCount: sales.length,
        salesTotal: sales.reduce((a, x) => a + x.amount, 0),
      };
    }),
  };
}

/* =========================================================
   Agenda
   ========================================================= */

export type TaskFilter = "todas" | TaskStatus;

/** Vendedor vê só a própria agenda; gestor vê a equipe (opcionalmente filtrada por vendedor). */
export function tasksFor(s: DemoState, p: Profile, status: TaskFilter = "todas", sellerId?: string): Task[] {
  return s.tasks
    .filter((t) => (p.role === "gestor" ? !sellerId || t.sellerId === sellerId : t.sellerId === p.sellerId))
    .filter((t) => status === "todas" || t.status === status)
    .sort((a, b) => a.dueAt - b.dueAt);
}

/* =========================================================
   Valores
   ========================================================= */

/** "1.250,90" | "1250.9" | "R$ 300" → centavos. Retorna null quando inválido ou fora do limite. */
export function parseBRL(input: string): number | null {
  let raw = input.replace(/R\$\s?/i, "").replace(/\s/g, "");
  if (!raw) return null;
  if (raw.includes(",")) raw = raw.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(raw)) raw = raw.replace(/\./g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return null;
  const cents = Math.round(Number(raw) * 100);
  return cents > 0 && cents <= 100_000_000 ? cents : null;
}

/* =========================================================
   Ações
   ========================================================= */

export type DemoAction =
  | { type: "claim"; convId: string; profile: Profile }
  | { type: "reply"; convId: string; profile: Profile; text: string }
  | { type: "customerMessage"; convId: string; text: string }
  | { type: "newLead" }
  | { type: "finalize"; convId: string; profile: Profile }
  | { type: "registerSale"; convId: string; profile: Profile; amount: number }
  | { type: "createTask"; profile: Profile; input: NewTaskInput }
  | { type: "setTaskStatus"; profile: Profile; taskId: string; status: TaskStatus }
  | { type: "assignTask"; profile: Profile; taskId: string; sellerId: string }
  | { type: "runAnalysis" }
  | { type: "reset"; state: DemoState };

export interface NewTaskInput {
  title: string;
  description: string;
  /** Ignorado para vendedor (a tarefa é sempre dele). */
  sellerId?: string;
  convId?: string;
  dueAt: number;
  priority: TaskPriority;
}

const nextId = (s: DemoState, prefix: string) => [`${prefix}${s.seq + 1}`, s.seq + 1] as const;

const isOwner = (c: Conversation, p: Profile) => p.role === "vendedor" && c.ownerId === p.sellerId;

export function reduce(s: DemoState, a: DemoAction): DemoState {
  switch (a.type) {
    case "claim": {
      const c = s.conversations.find((x) => x.id === a.convId);
      // Só um vendedor pode assumir, e só enquanto o lead está na fila.
      if (!c || a.profile.role !== "vendedor" || !a.profile.sellerId || c.ownerId !== null || c.status !== "aguardando") return s;
      const clock = s.clock + STEP;
      const [id, seq] = nextId(s, "m");
      return {
        ...s,
        clock,
        seq,
        conversations: s.conversations.map((x) =>
          x.id === c.id ? { ...x, ownerId: a.profile.sellerId!, status: "em_atendimento" } : x,
        ),
        messages: [
          ...s.messages,
          { id, convId: c.id, author: "sistema", kind: "claim", sellerId: a.profile.sellerId, text: "assumiu o atendimento", at: clock },
        ],
      };
    }

    case "reply": {
      const c = s.conversations.find((x) => x.id === a.convId);
      const text = a.text.trim();
      if (!c || !text || c.status !== "em_atendimento" || !isOwner(c, a.profile)) return s;
      const clock = s.clock + STEP;
      const [id, seq] = nextId(s, "m");
      return {
        ...s,
        clock,
        seq,
        messages: [...s.messages, { id, convId: c.id, author: "vendedor", sellerId: a.profile.sellerId, text: text.slice(0, 1000), at: clock }],
      };
    }

    case "customerMessage": {
      const c = s.conversations.find((x) => x.id === a.convId);
      if (!c || c.status === "finalizada" || !a.text.trim()) return s;
      const clock = s.clock + STEP;
      const [id, seq] = nextId(s, "m");
      return { ...s, clock, seq, messages: [...s.messages, { id, convId: c.id, author: "cliente", text: a.text.trim(), at: clock }] };
    }

    case "newLead": {
      const [lead, ...rest] = s.leadPool;
      if (!lead) return s;
      const seq0 = s.seq + 1;
      const customerId = `cl${seq0}`;
      const convId = `c${seq0}`;
      const clock = s.clock + STEP;
      const msgs: Message[] = lead.messages.map((text, i) => ({
        id: `m${seq0}-${i}`,
        convId,
        author: "cliente",
        text,
        at: clock + i * 20_000,
      }));
      return {
        ...s,
        clock: clock + (lead.messages.length - 1) * 20_000,
        seq: seq0,
        leadPool: rest,
        customers: [...s.customers, { id: customerId, ...lead.customer }],
        conversations: [...s.conversations, { id: convId, customerId, ownerId: null, status: "aguardando", topic: lead.topic }],
        messages: [...s.messages, ...msgs],
      };
    }

    case "finalize": {
      const c = s.conversations.find((x) => x.id === a.convId);
      if (!c || c.status !== "em_atendimento") return s;
      if (!isOwner(c, a.profile) && a.profile.role !== "gestor") return s;
      const clock = s.clock + STEP;
      const [id, seq] = nextId(s, "m");
      return {
        ...s,
        clock,
        seq,
        conversations: s.conversations.map((x) => (x.id === c.id ? { ...x, status: "finalizada" } : x)),
        messages: [...s.messages, { id, convId: c.id, author: "sistema", kind: "finalize", text: "Atendimento finalizado", at: clock }],
      };
    }

    case "registerSale": {
      const c = s.conversations.find((x) => x.id === a.convId);
      // Uma venda por atendimento: cliques repetidos não duplicam o registro.
      if (!c || !c.ownerId || c.status === "aguardando" || saleOf(s, c.id)) return s;
      if (!isOwner(c, a.profile) && a.profile.role !== "gestor") return s;
      if (!Number.isInteger(a.amount) || a.amount <= 0 || a.amount > 100_000_000) return s;
      const clock = s.clock + STEP;
      const [id, seq] = nextId(s, "s");
      // O vendedor é sempre o responsável pela conversa, nunca quem clicou.
      return {
        ...s,
        clock,
        seq,
        sales: [...s.sales, { id, convId: c.id, customerId: c.customerId, sellerId: c.ownerId, amount: a.amount, at: clock }],
      };
    }

    case "createTask": {
      const p = a.profile;
      const title = a.input.title.trim();
      if (!title) return s;
      const sellerId = p.role === "vendedor" ? p.sellerId : a.input.sellerId;
      if (!sellerId || !s.sellers.some((x) => x.id === sellerId)) return s;
      const conv = a.input.convId ? s.conversations.find((c) => c.id === a.input.convId) : undefined;
      const [id, seq] = nextId(s, "t");
      const origin: TaskOrigin = p.role === "gestor" ? "gestor" : "vendedor";
      return {
        ...s,
        seq,
        tasks: [
          ...s.tasks,
          {
            id,
            title: title.slice(0, 140),
            description: a.input.description.trim().slice(0, 600),
            origin,
            sellerId,
            convId: conv?.id,
            customerId: conv?.customerId,
            dueAt: a.input.dueAt,
            priority: a.input.priority,
            status: "pendente",
            createdAt: s.clock,
          },
        ],
      };
    }

    case "setTaskStatus": {
      const t = s.tasks.find((x) => x.id === a.taskId);
      if (!t) return s;
      if (a.profile.role === "vendedor" && t.sellerId !== a.profile.sellerId) return s;
      return { ...s, tasks: s.tasks.map((x) => (x.id === t.id ? { ...x, status: a.status } : x)) };
    }

    case "assignTask": {
      if (a.profile.role !== "gestor" || !s.sellers.some((x) => x.id === a.sellerId)) return s;
      return { ...s, tasks: s.tasks.map((x) => (x.id === a.taskId ? { ...x, sellerId: a.sellerId } : x)) };
    }

    case "runAnalysis":
      return runNightlyAnalysis(s);

    case "reset":
      return a.state;
  }
}

/* =========================================================
   Análise noturna (simulação determinística, sem IA)
   ========================================================= */

const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Produto pedido → complementos que costumam acompanhar. */
export const COMPLEMENT_RULES: { product: string; match: RegExp; complements: string[] }[] = [
  { product: "porcelanato", match: /porcelanato|pastilha|revestimento/, complements: ["argamassa", "rejunte"] },
  { product: "tinta", match: /\btinta\b/, complements: ["rolo", "fita", "massa corrida", "lixa"] },
  { product: "cimento", match: /cimento/, complements: ["areia", "brita", "cal"] },
  { product: "tubos de PVC", match: /\btubos?\b|pvc|registro/, complements: ["adesivo", "veda rosca"] },
];

const joinPt = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}`);
const fmtMin = (ms: number) => {
  const m = Math.round(ms / MIN);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min`;
};
const hhmm = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};

export function runNightlyAnalysis(s: DemoState): DemoState {
  const findings: Finding[] = [];
  const name = (customerId: string) => s.customers.find((c) => c.id === customerId)?.name ?? "cliente";

  // 1) Gargalo: leads que esperaram (ou ainda esperam) na fila acima do limite.
  const waits: string[] = [];
  for (const c of s.conversations) {
    const ms = messagesOf(s, c.id);
    const first = ms.find((m) => m.author === "cliente");
    if (!first) continue;
    const claimMsg = ms.find((m) => m.kind === "claim");
    const waited = (claimMsg ? claimMsg.at : s.clock) - first.at;
    if (waited > RULES.queueWaitMinutes * MIN) {
      waits.push(`${name(c.customerId)}: ${fmtMin(waited)}${claimMsg ? "" : ", ainda sem responsável"}`);
    }
  }
  if (waits.length) {
    findings.push({
      key: "gargalo:fila",
      kind: "gargalo",
      observed: `${waits.length} ${waits.length === 1 ? "lead esperou" : "leads esperaram"} mais de ${RULES.queueWaitMinutes} min na fila compartilhada (${waits.join("; ")}).`,
      suggestion: "Pode valer definir quem cobre a fila nos horários de pico. Decisão do gestor; nenhuma tarefa foi criada automaticamente.",
    });
  }

  const newTasks: Task[] = [];
  let seq = s.seq;
  const existingKeys = new Set(s.tasks.map((t) => t.analysisKey).filter(Boolean));

  const pushTask = (f: Finding, t: Omit<Task, "id" | "origin" | "status" | "createdAt" | "analysisKey">) => {
    const existing = s.tasks.find((x) => x.analysisKey === f.key) ?? newTasks.find((x) => x.analysisKey === f.key);
    if (existing || existingKeys.has(f.key)) {
      f.taskId = existing?.id;
      return;
    }
    seq += 1;
    const task: Task = { ...t, id: `t${seq}`, origin: "ia", status: "pendente", createdAt: s.clock, analysisKey: f.key };
    newTasks.push(task);
    f.taskId = task.id;
  };

  for (const c of s.conversations) {
    if (!c.ownerId) continue; // sem responsável: não há para quem gerar tarefa comercial
    const ms = messagesOf(s, c.id);
    const clientText = norm(ms.filter((m) => m.author === "cliente").map((m) => m.text).join(" "));
    const allText = norm(ms.map((m) => m.text).join(" "));
    const customer = name(c.customerId);

    // 2) Orçamento solicitado sem retorno conclusivo (uma resposta com valor) dentro do prazo.
    const ask = ms.find((m) => m.author === "cliente" && /orcamento/.test(norm(m.text)));
    if (ask && !saleOf(s, c.id) && c.status !== "finalizada") {
      const conclusive = ms.some((m) => m.author === "vendedor" && m.at > ask.at && /R\$\s?\d/.test(m.text));
      const elapsed = s.clock - ask.at;
      if (!conclusive && elapsed > RULES.quoteDelayMinutes * MIN) {
        const f: Finding = {
          key: `orcamento_atrasado:${c.id}`,
          kind: "orcamento_atrasado",
          convId: c.id,
          customerId: c.customerId,
          sellerId: c.ownerId,
          observed: `${customer} pediu orçamento às ${hhmm(ask.at)}. Até ${hhmm(s.clock)} (${fmtMin(elapsed)}) nenhuma mensagem da equipe trouxe valor.`,
          suggestion: "Retornar com o orçamento e confirmar se o cliente ainda tem interesse.",
        };
        pushTask(f, {
          title: `Retornar orçamento para ${customer}`,
          description: `${f.observed} Prioridade alta porque o cliente já cobrou o retorno.`.slice(0, 600),
          sellerId: c.ownerId,
          convId: c.id,
          customerId: c.customerId,
          dueAt: at(9, 0, 1),
          priority: "alta",
        });
        findings.push(f);
      }
    }

    // 3) Produto pedido sem oferta de nenhum complemento na conversa.
    for (const rule of COMPLEMENT_RULES) {
      if (!rule.match.test(clientText)) continue;
      // Palavra inteira: "cal" não pode casar com "local", "fita" com "fitas" sim.
      if (rule.complements.some((x) => new RegExp(`\\b${norm(x)}`).test(allText))) continue;
      const f: Finding = {
        key: `complementar:${c.id}:${rule.product}`,
        kind: "complementar",
        convId: c.id,
        customerId: c.customerId,
        sellerId: c.ownerId,
        observed: `${customer} pediu ${rule.product}. A conversa não menciona ${joinPt(rule.complements)}.`,
        suggestion: `Possível oportunidade: avaliar se o cliente precisa de ${joinPt(rule.complements)}. Ele pode já ter esses itens.`,
      };
      pushTask(f, {
        title: `Avaliar oferta de ${joinPt(rule.complements)} para ${customer}`,
        description: `${f.observed} ${f.suggestion}`,
        sellerId: c.ownerId,
        convId: c.id,
        customerId: c.customerId,
        dueAt: at(10, 0, 1),
        priority: "media",
      });
      findings.push(f);
    }
  }

  const run: AnalysisRun = { ranAt: s.clock, findings, createdTasks: newTasks.length };
  return { ...s, seq, tasks: [...s.tasks, ...newTasks], analysis: run };
}

export { DEMO_DAY };
