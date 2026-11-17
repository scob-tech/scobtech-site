/**
 * Tipos e rótulos do portfólio, sem dados. Pode ser importado por componentes de cliente:
 * os dados ficam em lib/projetos.ts, lido só no servidor, para que projetos não públicos
 * não entrem no JavaScript enviado ao navegador.
 */

export type Frente = "whatsapp" | "automacao" | "integracoes" | "personalizado" | "operacoes";

export const FRENTES: Record<Frente, string> = {
  whatsapp: "CRM e WhatsApp",
  automacao: "Automação e IA",
  integracoes: "Integrações",
  personalizado: "Software personalizado",
  operacoes: "Operações",
};

export type Tela = {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Área do sistema a que a tela pertence; agrupa a galeria da página do projeto. */
  grupo?: string;
  /** Só aparece na página do projeto (fica fora da galeria da home). */
  somentePortfolio?: true;
  /** Versão WebP (mesmas dimensões), usada nas páginas do portfólio. A home usa `src`. */
  webp?: string;
};

/** Imagem otimizada para o portfólio: WebP quando existe, senão o arquivo original. */
export const srcPortfolio = (t: Tela) => t.webp ?? t.src;

export type VideoYouTube = {
  youtubeId: string;
  titulo: string;
  /** Demonstração do sistema ou vídeo institucional. Padrão: demonstração. */
  tipo?: "demonstracao" | "institucional";
  /** Duração exibida no player, ex.: "1:20". */
  duracao?: string;
  /** Capa própria; sem ela, usa a miniatura do YouTube. */
  capa?: string;
};

/**
 * Vídeo hospedado no próprio site (MP4 em /public). Só é baixado depois do clique na capa:
 * antes disso, a página carrega apenas a imagem.
 */
export type VideoArquivo = {
  src: string;
  /** Capa exibida antes da reprodução (mesma proporção do vídeo). */
  capa: string;
  largura: number;
  altura: number;
  titulo: string;
  /** Duração para leitores de tela, ex.: "52 segundos". */
  duracao?: string;
  /** A capa já desenha o botão de reprodução: o player não sobrepõe outro. */
  capaComBotao?: boolean;
  /** Transcrição fiel da narração, um parágrafo por item. Exibida em "Ler o conteúdo do vídeo". */
  transcricao?: string[];
};

/**
 * Natureza de cada item do portfólio. Projeto real = sistema implementado e em uso por um
 * cliente. As outras naturezas só devem ser usadas quando houver material que as comprove.
 */
export type Natureza = "real" | "desenvolvimento" | "conceito";

export const NATUREZA: Record<Natureza, string> = {
  real: "Projeto real",
  desenvolvimento: "Em desenvolvimento",
  conceito: "Conceito",
};

export type Projeto = {
  slug: string;
  nome: string;
  segmento: string;
  natureza: Natureza;
  /** false = fica no repositório, mas fora de todas as áreas públicas (home, portfólio, sitemap). */
  publico: boolean;
  frentes: Frente[];
  resumo: string;
  /** Situação do cliente antes do projeto, em mais detalhe que `antes`. Opcional. */
  desafio?: string;
  antes: string;
  depois: string;
  modulos: string[];
  /** A primeira tela é a capa do projeto (cartão do portfólio e topo da página). */
  telas: Tela[];
  /** Vídeos do YouTube; só aparecem quando preenchidos. */
  videos?: VideoYouTube[];
  /** Apenas resultados confirmados pelo cliente. */
  resultados?: { valor: string; rotulo: string }[];
};

/** Telas exibidas na galeria da home (sem as exclusivas do portfólio). */
export const telasDaHome = (p: Projeto) => p.telas.filter((t) => !t.somentePortfolio);
