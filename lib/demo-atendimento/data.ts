/**
 * Dados 100% fictícios da demonstração. Nomes, telefones, loja, preços e conversas
 * foram inventados para ilustrar o fluxo — não correspondem a pessoas ou empresas reais.
 *
 * As conversas foram montadas para exercitar as regras da demo:
 * - Ana Paula pede porcelanato e ninguém oferece argamassa/rejunte (oportunidade).
 * - Thiago pede porcelanato e recebe a oferta completa (sem oportunidade).
 * - Carlos pede orçamento de cimento e não recebe retorno com valor (orçamento atrasado),
 *   depois de esperar 22 min na fila (gargalo).
 * - Diego está na fila há mais de 15 min sem responsável (gargalo).
 */
import type { Customer, DemoState, LeadTemplate, Message, Profile, Seller, Task } from "./types.ts";

/** Dia simulado da demo: 10/11/2026. Horários em UTC para não depender do fuso do visitante. */
export const DEMO_DAY = Date.UTC(2026, 10, 10);
export const at = (h: number, m: number, dayOffset = 0) => DEMO_DAY + dayOffset * 86_400_000 + (h * 60 + m) * 60_000;

export const STORE_NAME = "Casa & Obra Materiais";

export const SELLERS: Seller[] = [
  { id: "marcos", name: "Marcos Lima" },
  { id: "juliana", name: "Juliana Reis" },
  { id: "rafael", name: "Rafael Costa" },
];

export const PROFILES: Profile[] = [
  { id: "gestor", name: "Sandra Melo", role: "gestor" },
  { id: "p-marcos", name: "Marcos Lima", role: "vendedor", sellerId: "marcos" },
  { id: "p-juliana", name: "Juliana Reis", role: "vendedor", sellerId: "juliana" },
  { id: "p-rafael", name: "Rafael Costa", role: "vendedor", sellerId: "rafael" },
];

const CUSTOMERS: Customer[] = [
  { id: "ana", name: "Ana Paula Ribeiro", phone: "(11) 90000-0101" },
  { id: "carlos", name: "Carlos Mendes", phone: "(11) 90000-0102" },
  { id: "fernanda", name: "Fernanda Lima", phone: "(11) 90000-0103" },
  { id: "roberto", name: "Roberto Alves", phone: "(11) 90000-0104" },
  { id: "patricia", name: "Patrícia Souza", phone: "(11) 90000-0105" },
  { id: "thiago", name: "Thiago Nunes", phone: "(11) 90000-0106" },
  { id: "diego", name: "Diego Ramos", phone: "(11) 90000-0107" },
  { id: "luciana", name: "Luciana Prado", phone: "(11) 90000-0108" },
];

type Seed = Omit<Message, "id" | "convId">;
const cli = (h: number, m: number, text: string, expectsReply = true): Seed => ({
  author: "cliente",
  text,
  at: at(h, m),
  ...(expectsReply ? {} : { expectsReply: false }),
});
const ven = (sellerId: string, h: number, m: number, text: string): Seed => ({ author: "vendedor", sellerId, text, at: at(h, m) });
const claim = (sellerId: string, h: number, m: number): Seed => ({
  author: "sistema",
  kind: "claim",
  sellerId,
  text: "assumiu o atendimento",
  at: at(h, m),
});
const fin = (h: number, m: number): Seed => ({ author: "sistema", kind: "finalize", text: "Atendimento finalizado", at: at(h, m) });

const THREADS: Record<string, Seed[]> = {
  c1: [
    cli(14, 2, "Boa tarde! Vocês têm porcelanato 60x60 acetinado bege? Preciso para uma sala de 32 m²."),
    claim("juliana", 14, 9),
    ven("juliana", 14, 11, "Boa tarde, Ana Paula! Temos o Porcelanato Areia 60x60 acetinado. Para 32 m² recomendo 36 m², contando a margem de perda."),
    cli(14, 13, "Qual o valor do metro?"),
    cli(14, 14, "E vocês entregam no Jardim Europa?"),
    ven("juliana", 14, 20, "R$ 69,90 o m². Entregamos sim, o frete sai grátis acima de R$ 1.500 na região."),
    cli(14, 26, "Ótimo, me manda o orçamento fechado das 36 m² então."),
    ven("juliana", 14, 31, "Orçamento: 36 m² de Porcelanato Areia 60x60 = R$ 2.516,40, com entrega inclusa."),
    cli(14, 33, "Perfeito, obrigada!", false),
  ],
  c2: [
    cli(9, 5, "Bom dia. Preciso de orçamento de 40 sacos de cimento CP-II 50 kg, com entrega na obra."),
    claim("marcos", 9, 27),
    ven("marcos", 9, 30, "Bom dia, Carlos! Vou verificar o estoque e o frete e já te retorno com o orçamento."),
    cli(11, 42, "Oi, conseguiu ver o orçamento do cimento?"),
  ],
  c3: [
    cli(10, 15, "Oi! Tem tinta acrílica fosca branco neve, lata de 18 litros?"),
    claim("rafael", 10, 18),
    ven("rafael", 10, 19, "Oi, Fernanda! Temos a Acrílica Premium Fosca Branco Neve 18 L por R$ 459,90. Quer que eu inclua rolo e fita crepe?"),
    cli(10, 24, "Pode incluir um rolo de lã 23 cm e duas fitas."),
    ven("rafael", 10, 27, "Fechado: tinta + rolo + 2 fitas = R$ 534,60. Posso separar para retirada hoje?"),
    cli(10, 31, "Pode sim, passo às 16h."),
    ven("rafael", 10, 33, "Separado em seu nome. Até mais tarde!"),
    fin(16, 20),
  ],
  c4: [
    cli(13, 0, "Boa tarde, preciso de 6 tubos PVC soldável 50 mm, 10 joelhos 90° e um registro de gaveta 1 1/2."),
    claim("marcos", 13, 4),
    ven("marcos", 13, 6, "Boa tarde, Roberto! Tenho tudo. Total de R$ 412,50. Quer adesivo plástico também?"),
    cli(13, 15, "Já tenho adesivo. Pode fechar, pago no Pix na retirada."),
    ven("marcos", 13, 18, "Fechado! Pedido separado no balcão 2."),
    cli(13, 19, "Valeu!", false),
    fin(13, 21),
  ],
  c5: [
    cli(11, 0, "Qual argamassa vocês indicam para assentar pastilha em piscina?"),
    claim("juliana", 11, 2),
    ven("juliana", 11, 5, "Para piscina o indicado é argamassa AC-III com rejunte epóxi. A AC-III está R$ 38,90 o saco de 20 kg."),
    cli(11, 40, "Vou fazer as contas com o pedreiro e volto a falar."),
    ven("juliana", 11, 52, "Combinado, Patrícia. Fico à disposição!"),
    fin(12, 0),
  ],
  c6: [
    cli(16, 40, "Vocês têm porcelanato 80x80 polido cinza?"),
    claim("rafael", 16, 44),
    ven("rafael", 16, 46, "Temos o Cinza Urbano 80x80 polido, R$ 94,90 o m². Para esse formato indico argamassa AC-III e rejunte cinza platina. Quantos m²?"),
    cli(16, 52, "São 20 m²."),
    cli(16, 52, "Pode mandar o total com a argamassa e o rejunte."),
    ven("rafael", 17, 1, "Total para 20 m²: R$ 2.282,40, com 8 sacos de AC-III e 4 kg de rejunte."),
    cli(17, 5, "Vou fechar amanhã cedo."),
  ],
  c7: [
    cli(17, 12, "Boa tarde! Vocês têm rejunte cinza platina de 1 kg?"),
    cli(17, 13, "E argamassa AC-II?"),
  ],
  c8: [cli(17, 31, "Oi, preciso de orçamento de 2 m³ de areia média e 1 m³ de brita 1, entrega no Morumbi.")],
};

const TASKS: Task[] = [
  {
    id: "t1",
    title: "Conferir estoque de cimento CP-II para a semana",
    description: "Levantar quantos sacos temos e quanto chega na reposição de quinta.",
    origin: "gestor",
    sellerId: "marcos",
    dueAt: at(18, 0),
    priority: "media",
    status: "pendente",
    createdAt: at(8, 30),
  },
  {
    id: "t2",
    title: "Enviar fotos do Porcelanato Areia instalado",
    description: "A cliente quer ver o acabamento em ambiente antes de fechar.",
    origin: "vendedor",
    sellerId: "juliana",
    convId: "c1",
    customerId: "ana",
    dueAt: at(18, 30),
    priority: "baixa",
    status: "em_andamento",
    createdAt: at(14, 35),
  },
  {
    id: "t3",
    title: "Ligar para Thiago Nunes para fechar o pedido",
    description: "Cliente disse que fecha amanhã cedo. Confirmar quantidade e forma de entrega.",
    origin: "gestor",
    sellerId: "rafael",
    convId: "c6",
    customerId: "thiago",
    dueAt: at(9, 30, 1),
    priority: "alta",
    status: "pendente",
    createdAt: at(17, 10),
  },
  {
    id: "t4",
    title: "Separar pedido de Roberto Alves no balcão 2",
    description: "Retirada com pagamento via Pix.",
    origin: "vendedor",
    sellerId: "marcos",
    convId: "c4",
    customerId: "roberto",
    dueAt: at(13, 30),
    priority: "media",
    status: "concluida",
    createdAt: at(13, 19),
  },
];

const LEAD_POOL: LeadTemplate[] = [
  {
    customer: { name: "Eduardo Martins", phone: "(11) 90000-0109" },
    topic: "Massa corrida PVA",
    messages: ["Boa noite! Quanto está a massa corrida PVA de 25 kg?", "Preciso de umas 4 latas."],
  },
  {
    customer: { name: "Simone Araújo", phone: "(11) 90000-0110" },
    topic: "Caixa d'água 1.000 L",
    messages: ["Oi! Vocês têm caixa d'água de 1.000 litros? Preciso de entrega amanhã."],
  },
  {
    customer: { name: "Paulo Henrique", phone: "(11) 90000-0111" },
    topic: "Orçamento de cimento e cal",
    messages: ["Bom dia, quero orçamento de 15 sacos de cimento e 10 de cal hidratada."],
  },
];

/** Estado inicial da demo. Sempre gera um objeto novo (usado também pelo "Reiniciar"). */
export function createInitialState(): DemoState {
  const conversations = [
    { id: "c1", customerId: "ana", ownerId: "juliana", status: "em_atendimento", topic: "Porcelanato 60x60" },
    { id: "c2", customerId: "carlos", ownerId: "marcos", status: "em_atendimento", topic: "Orçamento de cimento CP-II" },
    { id: "c3", customerId: "fernanda", ownerId: "rafael", status: "finalizada", topic: "Tinta acrílica 18 L" },
    { id: "c4", customerId: "roberto", ownerId: "marcos", status: "finalizada", topic: "Tubos e conexões PVC" },
    { id: "c5", customerId: "patricia", ownerId: "juliana", status: "finalizada", topic: "Argamassa para piscina" },
    { id: "c6", customerId: "thiago", ownerId: "rafael", status: "em_atendimento", topic: "Porcelanato 80x80" },
    { id: "c7", customerId: "diego", ownerId: null, status: "aguardando", topic: "Rejunte e argamassa" },
    { id: "c8", customerId: "luciana", ownerId: null, status: "aguardando", topic: "Orçamento de areia e brita" },
  ] satisfies DemoState["conversations"];

  let n = 0;
  const messages: Message[] = [];
  for (const [convId, seeds] of Object.entries(THREADS)) {
    for (const s of seeds) messages.push({ ...s, id: `m${++n}`, convId });
  }

  return {
    clock: at(17, 40),
    seq: 1000,
    storeName: STORE_NAME,
    sellers: SELLERS.map((s) => ({ ...s })),
    customers: CUSTOMERS.map((c) => ({ ...c })),
    conversations: conversations.map((c) => ({ ...c })),
    messages,
    sales: [
      { id: "s1", convId: "c4", customerId: "roberto", sellerId: "marcos", amount: 41_250, at: at(13, 20) },
      { id: "s2", convId: "c3", customerId: "fernanda", sellerId: "rafael", amount: 53_460, at: at(16, 18) },
    ],
    tasks: TASKS.map((t) => ({ ...t })),
    leadPool: LEAD_POOL.map((l) => ({ ...l, customer: { ...l.customer }, messages: [...l.messages] })),
    analysis: null,
  };
}
