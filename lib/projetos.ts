/**
 * Projetos exibidos na home e no portfólio (/projetos e /projetos/[slug]).
 *
 * Regras de conteúdo:
 * - Só projetos reais. Nada de casos ilustrativos.
 * - Sem métricas ou resultados que não tenham sido comprovados. O campo `resultados`
 *   só deve ser preenchido com números confirmados; vazio, a seção não aparece.
 * - Mídias ficam em /public. Vídeos longos são do YouTube (carregados só no clique);
 *   loops curtos podem ficar no próprio site.
 */

import type { Projeto, Tela, VideoArquivo } from "./projetos-base";

export * from "./projetos-base";

const dsa = "/cases/deposito-santo-antonio";

/**
 * Liga cada captura PNG à versão WebP gerada ao lado dela (qualidade 95, mesmas dimensões).
 * Os PNG originais continuam no repositório e seguem em uso na home homologada.
 */
const comWebp = (telas: Tela[]): Tela[] => telas.map((t) => ({ ...t, webp: t.src.replace(/\.png$/, ".webp") }));

export const projetos: Projeto[] = [
  {
    slug: "deposito-santo-antonio",
    nome: "Depósito Santo Antônio",
    segmento: "Materiais de construção",
    natureza: "real",
    publico: true,
    frentes: ["whatsapp", "automacao", "operacoes"],
    resumo:
      "Plataforma que reúne o atendimento via WhatsApp, a gestão de entregas, a frota e a operação comercial em um único sistema.",
    antes: "Atendimento, entregas e frota separados entre WhatsApp e planilhas.",
    depois: "Pedidos, motoristas e comprovantes organizados em um único sistema.",
    modulos: [
      "Atendimento integrado ao WhatsApp",
      "Gestão de entregas em tempo real",
      "Aplicativo para motoristas",
      "Leitura inteligente de comprovantes",
    ],
    telas: comWebp([
      { label: "Painel de vendas", src: `${dsa}/wa-vendas.png`, alt: "Painel de vendas do atendimento via WhatsApp", width: 1100, height: 617, grupo: "Atendimento via WhatsApp" },
      { label: "Agenda do atendimento", src: `${dsa}/wa-agenda.png`, alt: "Agenda de tarefas do atendimento via WhatsApp", width: 1100, height: 611, grupo: "Atendimento via WhatsApp" },
      { label: "Progresso de vendas", src: `${dsa}/wa-progresso.png`, alt: "Gráfico de pedidos por período, com filtro por vendedor", width: 1100, height: 617, grupo: "Atendimento via WhatsApp", somentePortfolio: true },
      { label: "App do motorista", src: `${dsa}/entrega-motorista.png`, alt: "Aplicativo do motorista para registrar entregas", width: 470, height: 766, grupo: "Entregas" },
      { label: "Últimas entregas", src: `${dsa}/entrega-ultimas.png`, alt: "Lista das últimas entregas do motorista, com número da carga e do pedido", width: 494, height: 766, grupo: "Entregas", somentePortfolio: true },
      { label: "Financeiro conciliado", src: `${dsa}/entrega-financeiro.png`, alt: "Painel financeiro com conciliação das entregas", width: 1100, height: 618, grupo: "Entregas" },
      { label: "Painel da frota", src: `${dsa}/frota-painel.png`, alt: "Painel do administrador do controle de frota", width: 1100, height: 618, grupo: "Frota" },
      { label: "Leitura por IA", src: `${dsa}/frota-abastecimentos.png`, alt: "Abastecimentos do dia com leitura por IA e reconciliação", width: 1100, height: 616, grupo: "Frota" },
    ]),
  },
];

/** Só o que pode aparecer no site. Use sempre esta lista nas páginas e no sitemap. */
export const projetosPublicos = projetos.filter((p) => p.publico);

export const projetoPorSlug = (slug: string) => projetosPublicos.find((p) => p.slug === slug);

/**
 * Demonstrações funcionais: sistemas navegáveis com dados fictícios, que mostram uma solução
 * por dentro. Não são clientes nem projetos implementados, e o site sempre diz isso.
 */
export type Demonstracao = {
  id: "atendimento-vendas";
  nome: string;
  resumo: string;
  /** Áreas que o visitante pode explorar (iguais às abas da demonstração). */
  areas: { nome: string; texto: string }[];
  aviso: string;
};

export const demonstracoes: Demonstracao[] = [
  {
    id: "atendimento-vendas",
    nome: "Atendimento & Vendas",
    resumo:
      "CRM com WhatsApp para equipes de atendimento: fila compartilhada, conversas com responsável, registro de vendas e indicadores. Um exemplo de solução que adaptamos a diferentes segmentos.",
    areas: [
      { nome: "Atendimento", texto: "Fila compartilhada e conversas assumidas por vendedor" },
      { nome: "Indicadores", texto: "Tempo de resposta, conversas e vendas da equipe" },
      { nome: "Agenda", texto: "Tarefas de acompanhamento por vendedor" },
      { nome: "Alertas automáticos", texto: "Atrasos e oportunidades apontados por regras fixas" },
    ],
    aviso: "Dados fictícios. Nesta versão, a demonstração simula uma loja de materiais de construção.",
  },
];

/**
 * Mídias institucionais. Ficam `null` até os arquivos serem fornecidos:
 * enquanto isso, as seções correspondentes não são renderizadas.
 */
export const videoInstitucional: VideoArquivo | null = {
  src: "/institucional/scob-institucional.mp4",
  capa: "/institucional/scob-institucional-capa.jpg",
  largura: 1920,
  altura: 1080,
  titulo: "Como a scob. nasceu",
  duracao: "52 segundos",
  capaComBotao: true,
  // conferida com a narração e com os textos do próprio vídeo
  transcricao: [
    "Toda empresa tem um jeito próprio de funcionar. E quase toda empresa toca esse jeito no WhatsApp, na planilha e no papel.",
    "A scob. nasceu assim: um depósito de material de construção precisava organizar a operação, e nenhum sistema pronto servia. A gente construiu um, do tamanho exato do problema.",
    "Funcionou. E um sistema virou outro. E mais outro. Hoje são quase vinte, rodando no dia a dia de depósitos, academias, óticas e escritórios.",
    "O que a gente entrega? Atendimento por WhatsApp num painel só, com cada setor vendo o que é seu. Entregas, caixa e comissões sem planilha. E inteligência artificial cuidando do trabalho repetitivo.",
    "Sem pacote fechado: a gente parte de uma base pronta e ajusta ao jeito que a sua empresa já trabalha. Você não muda a empresa pra caber no sistema.",
    "Você sonha. A gente tira do papel.",
  ],
};
export const avatarScob: { src: string; alt: string; width: number; height: number } | null = null;
