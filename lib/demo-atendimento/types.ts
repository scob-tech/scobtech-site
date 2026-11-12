/**
 * Demonstração de Atendimento & Vendas — tipos do domínio.
 *
 * Tudo aqui é simulação local com dados fictícios: não há autenticação, WhatsApp,
 * pagamentos, ERP ou IA reais. Horários são milissegundos UTC de um relógio simulado.
 */

export type Role = "gestor" | "vendedor";

export interface Seller {
  id: string;
  name: string;
}

export interface Profile {
  id: string;
  name: string;
  role: Role;
  /** Presente quando role === "vendedor". */
  sellerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  /** Telefone fictício, só para exibição. */
  phone: string;
}

export type MessageAuthor = "cliente" | "vendedor" | "sistema";

export interface Message {
  id: string;
  convId: string;
  author: MessageAuthor;
  /** Vendedor que escreveu (author === "vendedor") ou que assumiu (mensagem de sistema). */
  sellerId?: string;
  text: string;
  at: number;
  /**
   * Mensagens do cliente exigem resposta por padrão. `false` marca mensagens de
   * encerramento ("obrigado!") que não abrem espera nos indicadores.
   */
  expectsReply?: boolean;
  /** Mensagem de sistema que marca o momento em que o lead foi assumido. */
  kind?: "claim" | "finalize";
}

export type ConversationStatus = "aguardando" | "em_atendimento" | "finalizada";

export interface Conversation {
  id: string;
  customerId: string;
  /** null enquanto o lead está na fila compartilhada. */
  ownerId: string | null;
  status: ConversationStatus;
  /** Assunto curto exibido na lista. */
  topic: string;
}

export interface Sale {
  id: string;
  convId: string;
  customerId: string;
  sellerId: string;
  /** Valor em centavos. */
  amount: number;
  at: number;
}

export type TaskOrigin = "gestor" | "vendedor" | "ia";
export type TaskStatus = "pendente" | "em_andamento" | "concluida";
export type TaskPriority = "alta" | "media" | "baixa";

export interface Task {
  id: string;
  title: string;
  description: string;
  origin: TaskOrigin;
  sellerId: string;
  convId?: string;
  customerId?: string;
  dueAt: number;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: number;
  /** Chave da análise que gerou a tarefa; impede duplicar tarefas equivalentes. */
  analysisKey?: string;
}

export type FindingKind = "gargalo" | "orcamento_atrasado" | "complementar";

export interface Finding {
  key: string;
  kind: FindingKind;
  convId?: string;
  customerId?: string;
  sellerId?: string;
  /** Fato verificável nas conversas. */
  observed: string;
  /** Sugestão comercial — hipótese a avaliar, não certeza. */
  suggestion: string;
  /** Tarefa gerada (ou já existente) para este achado. */
  taskId?: string;
}

export interface AnalysisRun {
  ranAt: number;
  findings: Finding[];
  /** Quantas tarefas novas esta execução criou (0 em reexecuções). */
  createdTasks: number;
}

export interface LeadTemplate {
  customer: Omit<Customer, "id">;
  topic: string;
  messages: string[];
}

export interface DemoState {
  /** Relógio simulado (ms UTC). Avança a cada ação. */
  clock: number;
  /** Contador para ids determinísticos. */
  seq: number;
  storeName: string;
  sellers: Seller[];
  customers: Customer[];
  conversations: Conversation[];
  messages: Message[];
  sales: Sale[];
  tasks: Task[];
  /** Leads que ainda podem chegar pelo botão "Simular novo lead". */
  leadPool: LeadTemplate[];
  analysis: AnalysisRun | null;
}
