/**
 * Conteúdo da vitrine de soluções.
 *
 * Rótulos (decisão de comunicação, não de layout):
 * - "real": funcionalidade comprovadamente desenvolvida pela scob. (rótulos revisados e
 *   aprovados em 12/11/2026: atendimento e vendas; entregas e fretes; importação e
 *   conferência no financeiro; na gestão, indicadores de atendimento e vendas,
 *   consolidação financeira e atualização automática só onde já foi implementada).
 *   Painel único integrando as três áreas: sob medida até confirmação.
 * - "medida": possibilidade de desenvolvimento sob medida — não é produto pronto.
 * Sem números de economia, produtividade ou resultado: os valores das telas são ilustrativos.
 */

export type Tag = "real" | "medida";

export type AreaId = "atendimento" | "entregas" | "financeiro" | "cobrancas" | "gestao";

export type Area = {
  id: AreaId;
  nome: string;
  /** linha curta no menu */
  resumo: string;
  /** rótulos presentes na área (o menu mostra os dois quando a área é mista) */
  tags: Tag[];
  titulo: string;
  texto: string;
  itens: { texto: string; tag: Tag }[];
};

export const TAG_LABEL: Record<Tag, string> = {
  real: "Aplicação real",
  medida: "Solução sob medida",
};

export const AREAS: Area[] = [
  {
    id: "atendimento",
    nome: "Atendimento e vendas",
    resumo: "Conversas centralizadas e funil comercial",
    tags: ["real"],
    titulo: "Todas as conversas num só lugar, com o funil à vista.",
    texto:
      "O WhatsApp da empresa vira uma caixa compartilhada: cada conversa ligada a um vendedor e a uma etapa do funil, com os indicadores de atendimento calculados sem planilha.",
    itens: [
      { texto: "Caixa de conversas compartilhada pela equipe", tag: "real" },
      { texto: "Etapa comercial e responsável em cada conversa", tag: "real" },
      { texto: "Tempo de resposta e conversas paradas, sempre à vista", tag: "real" },
    ],
  },
  {
    id: "entregas",
    nome: "Entregas e fretes",
    resumo: "Comprovante no celular, frete conferido",
    tags: ["real"],
    titulo: "Do romaneio escaneado à conferência do frete.",
    texto:
      "O motorista registra a entrega no celular: código do romaneio, foto e quem recebeu. O financeiro importa o arquivo do sistema que a empresa já usa, e a plataforma cruza entregas e valores de frete, destacando as divergências para conferência.",
    itens: [
      { texto: "Leitura do código de barras do romaneio", tag: "real" },
      { texto: "Foto da entrega com nome e documento de quem recebeu", tag: "real" },
      { texto: "Cruzamento automático de entregas e fretes, com divergências destacadas", tag: "real" },
    ],
  },
  {
    id: "financeiro",
    nome: "Financeiro",
    resumo: "Informações reunidas, menos digitação",
    tags: ["real", "medida"],
    titulo: "Arquivos que chegam, conferidos sem redigitar.",
    texto:
      "Os arquivos exportados dos sistemas que a empresa já usa entram na plataforma e são cruzados automaticamente. A partir dessa base, cada rotina financeira pode ganhar a sua própria tela.",
    itens: [
      { texto: "Importação do arquivo exportado pelo sistema atual", tag: "real" },
      { texto: "Conferência automática entre as fontes de dados", tag: "real" },
      { texto: "Fechamento de caixa no mesmo painel", tag: "medida" },
    ],
  },
  {
    id: "cobrancas",
    nome: "Cobranças",
    resumo: "Pendências, histórico e lembretes",
    tags: ["medida"],
    titulo: "Cada pendência acompanhada até o pagamento.",
    texto:
      "Um painel de valores em aberto, com o histórico de cada contato e lembretes automáticos pelo canal que o cliente já usa, desenhado a partir da forma como a sua empresa cobra hoje.",
    itens: [
      { texto: "Pendências organizadas por vencimento e situação", tag: "medida" },
      { texto: "Histórico de cada cobrança, contato a contato", tag: "medida" },
      { texto: "Lembretes automáticos antes e depois do vencimento", tag: "medida" },
    ],
  },
  {
    id: "gestao",
    nome: "Gestão e indicadores",
    resumo: "Indicadores de atendimento, vendas e financeiro",
    tags: ["real", "medida"],
    titulo: "Os indicadores da sua operação, organizados para decidir.",
    texto:
      "Indicadores de atendimento e vendas e informações financeiras consolidadas, organizados para as decisões do dia a dia. A partir daí, painéis podem ser desenhados sob medida para a sua operação.",
    itens: [
      { texto: "Indicadores de atendimento e vendas", tag: "real" },
      { texto: "Consolidação das informações financeiras", tag: "real" },
      { texto: "Atualização automática nos processos já integrados", tag: "real" },
      { texto: "Painel único com atendimento, vendas e financeiro", tag: "medida" },
      { texto: "Painéis específicos para cada gestor e área", tag: "medida" },
    ],
  },
];
