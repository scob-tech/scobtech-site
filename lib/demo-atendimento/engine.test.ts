/**
 * Testes da demo de Atendimento & Vendas (runner nativo do Node: `npm test`).
 * Cobrem os 10 cenários exigidos na Fase 1.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { at, createInitialState, PROFILES } from "./data.ts";
import {
  computeMetrics,
  conversationTimings,
  parseBRL,
  reduce,
  sharedQueue,
  tasksFor,
  visibleConversations,
  type DemoAction,
} from "./engine.ts";
import type { DemoState, Profile } from "./types.ts";

const profile = (id: string): Profile => PROFILES.find((p) => p.id === id)!;
const gestor = profile("gestor");
const marcos = profile("p-marcos");
const juliana = profile("p-juliana");
const rafael = profile("p-rafael");
const run = (s: DemoState, ...actions: DemoAction[]) => actions.reduce(reduce, s);
const ids = (cs: { id: string }[]) => cs.map((c) => c.id);

describe("1. Lead novo na fila compartilhada", () => {
  it("aparece na fila e é visível para todos os vendedores", () => {
    const s = run(createInitialState(), { type: "newLead" });
    const lead = s.conversations[s.conversations.length - 1];
    assert.equal(lead.ownerId, null);
    assert.equal(lead.status, "aguardando");
    assert.ok(ids(sharedQueue(s)).includes(lead.id));
    for (const p of [marcos, juliana, rafael, gestor]) assert.ok(ids(visibleConversations(s, p)).includes(lead.id), p.name);
  });

  it("o pool de leads se esgota sem quebrar", () => {
    let s = createInitialState();
    for (let i = 0; i < 10; i++) s = reduce(s, { type: "newLead" });
    assert.equal(s.leadPool.length, 0);
    assert.equal(s.conversations.length, 8 + 3);
  });
});

describe("2. Lead assumido some para os demais vendedores", () => {
  it("sai da fila e fica visível só para o responsável", () => {
    const s = run(createInitialState(), { type: "claim", convId: "c7", profile: juliana });
    const c = s.conversations.find((x) => x.id === "c7")!;
    assert.equal(c.ownerId, "juliana");
    assert.equal(c.status, "em_atendimento");
    assert.ok(!ids(sharedQueue(s)).includes("c7"));
    assert.ok(ids(visibleConversations(s, juliana)).includes("c7"));
    assert.ok(!ids(visibleConversations(s, marcos)).includes("c7"));
    assert.ok(!ids(visibleConversations(s, rafael)).includes("c7"));
  });

  it("um segundo vendedor não consegue assumir o mesmo lead", () => {
    const s = run(createInitialState(), { type: "claim", convId: "c7", profile: juliana }, { type: "claim", convId: "c7", profile: marcos });
    assert.equal(s.conversations.find((x) => x.id === "c7")!.ownerId, "juliana");
  });

  it("vendedor não vê conversas de outros vendedores", () => {
    const s = createInitialState();
    assert.deepEqual(ids(visibleConversations(s, marcos)).sort(), ["c2", "c4", "c7", "c8"]);
  });
});

describe("3. Gestor mantém visibilidade", () => {
  it("vê todas as conversas, inclusive as já assumidas", () => {
    const s = run(createInitialState(), { type: "claim", convId: "c7", profile: juliana });
    assert.equal(visibleConversations(s, gestor).length, s.conversations.length);
    assert.ok(ids(visibleConversations(s, gestor)).includes("c7"));
  });

  it("gestor não assume leads (é perfil de supervisão)", () => {
    const s0 = createInitialState();
    assert.equal(reduce(s0, { type: "claim", convId: "c7", profile: gestor }), s0);
  });
});

describe("4. Registro de venda vinculado ao vendedor correto", () => {
  it("usa o responsável pela conversa, a conversa e o cliente", () => {
    const s = run(createInitialState(), { type: "registerSale", convId: "c1", profile: juliana, amount: 251_640 });
    const sale = s.sales.find((x) => x.convId === "c1")!;
    assert.equal(sale.sellerId, "juliana");
    assert.equal(sale.customerId, "ana");
    assert.equal(sale.amount, 251_640);
    assert.ok(sale.at > at(17, 40));
  });

  it("quando o gestor registra, a venda continua sendo do vendedor responsável", () => {
    const s = run(createInitialState(), { type: "registerSale", convId: "c6", profile: gestor, amount: 228_240 });
    assert.equal(s.sales.find((x) => x.convId === "c6")!.sellerId, "rafael");
  });

  it("cliques repetidos não duplicam a venda", () => {
    const sale: DemoAction = { type: "registerSale", convId: "c1", profile: juliana, amount: 10_000 };
    const s = run(createInitialState(), sale, sale, sale);
    assert.equal(s.sales.filter((x) => x.convId === "c1").length, 1);
  });

  it("outro vendedor e valores inválidos não registram", () => {
    const s0 = createInitialState();
    assert.equal(reduce(s0, { type: "registerSale", convId: "c1", profile: marcos, amount: 10_000 }), s0);
    assert.equal(reduce(s0, { type: "registerSale", convId: "c1", profile: juliana, amount: 0 }), s0);
    assert.equal(reduce(s0, { type: "registerSale", convId: "c7", profile: juliana, amount: 10_000 }), s0, "lead na fila");
  });

  it("interpreta valores em reais", () => {
    assert.equal(parseBRL("1.250,90"), 125_090);
    assert.equal(parseBRL("R$ 300"), 30_000);
    assert.equal(parseBRL("1250.9"), 125_090);
    assert.equal(parseBRL("1.250"), 125_000);
    assert.equal(parseBRL("abc"), null);
    assert.equal(parseBRL("-5"), null);
    assert.equal(parseBRL("0"), null);
  });
});

describe("5. Indicadores atualizam após registrar venda", () => {
  it("soma vendas no total geral e no vendedor", () => {
    const s0 = createInitialState();
    const before = computeMetrics(s0);
    const s1 = reduce(s0, { type: "registerSale", convId: "c1", profile: juliana, amount: 251_640 });
    const after = computeMetrics(s1);
    assert.equal(before.salesCount, 2);
    assert.equal(before.salesTotal, 41_250 + 53_460);
    assert.equal(after.salesCount, 3);
    assert.equal(after.salesTotal, before.salesTotal + 251_640);
    const j0 = before.bySeller.find((x) => x.sellerId === "juliana")!;
    const j1 = after.bySeller.find((x) => x.sellerId === "juliana")!;
    assert.equal(j1.salesCount, j0.salesCount + 1);
    assert.equal(j1.salesTotal, j0.salesTotal + 251_640);
  });

  it("finalizar uma conversa conta para o responsável", () => {
    const s = run(createInitialState(), { type: "finalize", convId: "c1", profile: juliana });
    const m = computeMetrics(s);
    assert.equal(m.finalized, 4);
    assert.equal(m.bySeller.find((x) => x.sellerId === "juliana")!.finalized, 2);
  });
});

describe("6. Cálculo dos dois tempos médios", () => {
  const MIN = 60_000;

  it("primeira resposta: 1ª mensagem do lead até a 1ª resposta humana", () => {
    const s = createInitialState();
    assert.equal(conversationTimings(s, "c1").firstResponse, 9 * MIN); // 14:02 → 14:11
    assert.equal(conversationTimings(s, "c2").firstResponse, 25 * MIN); // 09:05 → 09:30
    assert.equal(conversationTimings(s, "c7").firstResponse, null); // ainda na fila
  });

  it("mensagens consecutivas do cliente contam como uma única espera", () => {
    const s = createInitialState();
    // c1: 14:13 e 14:14 (consecutivas) → 14:20 = 7 min; 14:26 → 14:31 = 5 min; "obrigada" não abre espera.
    assert.deepEqual(conversationTimings(s, "c1").during.map((d) => d.ms), [7 * MIN, 5 * MIN]);
    // c6: 16:52 + 16:52 → 17:01 = 9 min; 17:05 ainda aberta e não entra.
    assert.deepEqual(conversationTimings(s, "c6").during.map((d) => d.ms), [9 * MIN]);
  });

  it("a média geral exclui a primeira resposta e esperas abertas", () => {
    const m = computeMetrics(createInitialState());
    // primeiras respostas: c1 9, c2 25, c3 4, c4 6, c5 5, c6 6 → 55/6
    assert.equal(m.firstResponseSamples, 6);
    assert.equal(m.firstResponseAvgMs, (55 * MIN) / 6);
    // durante: c1 7,5 · c3 3,2 · c4 3 · c5 12 · c6 9 → 41/7
    assert.equal(m.duringSamples, 7);
    assert.equal(m.duringAvgMs, (41 * MIN) / 7);
    const rafaelM = m.bySeller.find((x) => x.sellerId === "rafael")!;
    assert.equal(rafaelM.duringAvgMs, ((3 + 2 + 9) * MIN) / 3);
  });

  it("uma resposta nova do vendedor entra na média", () => {
    const s = run(createInitialState(), { type: "reply", convId: "c6", profile: rafael, text: "Combinado, até amanhã!" });
    const t = conversationTimings(s, "c6");
    assert.equal(t.during.length, 2);
    assert.equal(t.during[1].ms, s.clock - at(17, 5));
  });

  it("só o responsável responde", () => {
    const s0 = createInitialState();
    assert.equal(reduce(s0, { type: "reply", convId: "c6", profile: marcos, text: "oi" }), s0);
    assert.equal(reduce(s0, { type: "reply", convId: "c6", profile: gestor, text: "oi" }), s0);
  });
});

describe("7. Criação e conclusão de tarefas", () => {
  it("vendedor cria tarefa na própria agenda e conclui", () => {
    let s = reduce(createInitialState(), {
      type: "createTask",
      profile: marcos,
      input: { title: "Ligar para Carlos", description: "", sellerId: "juliana", dueAt: at(9, 0, 1), priority: "alta", convId: "c2" },
    });
    const t = s.tasks[s.tasks.length - 1];
    assert.equal(t.sellerId, "marcos", "vendedor não cria tarefa para outro");
    assert.equal(t.origin, "vendedor");
    assert.equal(t.customerId, "carlos");
    assert.equal(t.status, "pendente");
    s = reduce(s, { type: "setTaskStatus", profile: marcos, taskId: t.id, status: "concluida" });
    assert.equal(s.tasks.find((x) => x.id === t.id)!.status, "concluida");
  });

  it("gestor atribui responsável e vê a equipe; vendedor vê só a própria agenda", () => {
    let s = reduce(createInitialState(), {
      type: "createTask",
      profile: gestor,
      input: { title: "Revisar vitrine", description: "", sellerId: "rafael", dueAt: at(9, 0, 1), priority: "baixa" },
    });
    const t = s.tasks[s.tasks.length - 1];
    assert.equal(t.origin, "gestor");
    assert.equal(t.sellerId, "rafael");
    s = reduce(s, { type: "assignTask", profile: gestor, taskId: t.id, sellerId: "juliana" });
    assert.equal(s.tasks.find((x) => x.id === t.id)!.sellerId, "juliana");
    assert.equal(tasksFor(s, gestor).length, s.tasks.length);
    assert.ok(tasksFor(s, marcos).every((x) => x.sellerId === "marcos"));
    assert.deepEqual(tasksFor(s, gestor, "concluida").map((x) => x.id), ["t4"]);
  });

  it("vendedor não altera nem reatribui tarefa de outro", () => {
    const s0 = createInitialState();
    assert.equal(reduce(s0, { type: "setTaskStatus", profile: marcos, taskId: "t2", status: "concluida" }), s0);
    assert.equal(reduce(s0, { type: "assignTask", profile: marcos, taskId: "t2", sellerId: "marcos" }), s0);
  });
});

describe("8. Tarefas geradas pela análise simulada", () => {
  it("identifica gargalo, orçamento atrasado e oportunidade, separando fato de sugestão", () => {
    const s = reduce(createInitialState(), { type: "runAnalysis" });
    const kinds = s.analysis!.findings.map((f) => `${f.kind}:${f.convId ?? ""}`).sort();
    assert.deepEqual(kinds, ["complementar:c1", "complementar:c2", "gargalo:", "orcamento_atrasado:c2"]);
    for (const f of s.analysis!.findings) {
      assert.ok(f.observed.length > 0 && f.suggestion.length > 0);
    }
    const gargalo = s.analysis!.findings.find((f) => f.kind === "gargalo")!;
    assert.match(gargalo.observed, /Carlos Mendes: 22 min/);
    assert.match(gargalo.observed, /Diego Ramos: 28 min, ainda sem responsável/);
  });

  it("as tarefas aparecem na agenda do vendedor responsável, com origem IA", () => {
    const s = reduce(createInitialState(), { type: "runAnalysis" });
    const ia = s.tasks.filter((t) => t.origin === "ia");
    assert.equal(ia.length, 3);
    assert.equal(s.analysis!.createdTasks, 3);
    assert.deepEqual(ia.map((t) => t.sellerId).sort(), ["juliana", "marcos", "marcos"]);
    assert.ok(tasksFor(s, juliana).some((t) => t.origin === "ia" && t.convId === "c1"));
    assert.ok(ia.every((t) => t.status === "pendente"));
  });

  it("não gera oportunidade quando o complemento já foi oferecido", () => {
    const s = reduce(createInitialState(), { type: "runAnalysis" });
    const convs = s.analysis!.findings.map((f) => f.convId);
    for (const c of ["c3", "c4", "c5", "c6"]) assert.ok(!convs.includes(c), c);
  });

  it("orçamento respondido com valor deixa de ser atrasado", () => {
    const s = run(
      createInitialState(),
      { type: "reply", convId: "c2", profile: marcos, text: "Carlos, 40 sacos de CP-II ficam R$ 1.396,00 com entrega." },
      { type: "runAnalysis" },
    );
    assert.ok(!s.analysis!.findings.some((f) => f.kind === "orcamento_atrasado"));
  });
});

describe("9. Prevenção de tarefas duplicadas", () => {
  it("reexecutar a análise não recria tarefas equivalentes", () => {
    const s1 = reduce(createInitialState(), { type: "runAnalysis" });
    const s2 = reduce(s1, { type: "runAnalysis" });
    assert.equal(s2.tasks.length, s1.tasks.length);
    assert.equal(s2.analysis!.createdTasks, 0);
    assert.ok(s2.analysis!.findings.filter((f) => f.kind !== "gargalo").every((f) => f.taskId));
  });

  it("nem mesmo depois de a tarefa ser concluída", () => {
    let s = reduce(createInitialState(), { type: "runAnalysis" });
    const t = s.tasks.find((x) => x.origin === "ia")!;
    s = reduce(s, { type: "setTaskStatus", profile: gestor, taskId: t.id, status: "concluida" });
    s = reduce(s, { type: "runAnalysis" });
    assert.equal(s.tasks.filter((x) => x.analysisKey === t.analysisKey).length, 1);
  });
});

describe("10. Reinicialização da demonstração", () => {
  it("volta ao estado inicial depois de várias ações", () => {
    const initial = createInitialState();
    const dirty = run(
      initial,
      { type: "newLead" },
      { type: "claim", convId: "c7", profile: juliana },
      { type: "registerSale", convId: "c1", profile: juliana, amount: 5_000 },
      { type: "runAnalysis" },
    );
    assert.notDeepEqual(dirty, initial);
    const reset = reduce(dirty, { type: "reset", state: createInitialState() });
    assert.deepEqual(reset, createInitialState());
  });

  it("o estado inicial é sempre uma cópia nova (ações não vazam entre reinícios)", () => {
    const a = createInitialState();
    a.sellers[0].name = "alterado";
    a.tasks[0].title = "alterado";
    assert.equal(createInitialState().sellers[0].name, "Marcos Lima");
    assert.equal(createInitialState().tasks[0].title, "Conferir estoque de cimento CP-II para a semana");
  });
});
