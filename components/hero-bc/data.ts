/**
 * Hero Bone & Cobalt — dados de composição.
 *
 * Todas as medidas estão em pixels da referência aprovada
 * (public/references/scobtech-hero-approved.png, 1672×941) e são convertidas em
 * porcentagem na renderização: no desktop o palco reproduz a referência em escala.
 *
 * Os cinco objetos usam imagens HD aprovadas, servidas em WebP a partir de
 * public/preview-hero/. Os PNGs originais ficam em design/hero-fontes/ (fora do export).
 */

export const REF_W = 1672;
export const REF_H = 941;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Objeto de uma estação. A imagem e a posição vêm da configuração HD correspondente. */
export interface StationObject {
  id: "celular" | "notebook" | "materiais" | "rota" | "caminhao" | "avaliacao";
  alt: string;
}

export interface Platform {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** espessura lateral do disco */
  t: number;
}

export interface Station {
  id: "whatsapp" | "vendas" | "operacao" | "entregas" | "posvenda";
  title: string;
  description: string;
  /** Área da estação (objetos + plataforma). */
  box: Box;
  objects: StationObject[];
  platform: Platform;
  /** Anel de luz no piso, quando existe na referência. */
  ring?: { cx: number; cy: number; rx: number; ry: number };
  /** Posição do rótulo (ícone + título + texto) no desktop. */
  label: { x: number; y: number };
}

export const STATIONS: Station[] = [
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Atendimento que não perde nenhuma oportunidade.",
    box: { x: 70, y: 462, w: 320, h: 292 },
    objects: [{ id: "celular", alt: "Celular com a tela de atendimento do WhatsApp" }],
    platform: { cx: 248, cy: 703, rx: 122, ry: 22, t: 20 },
    ring: { cx: 226, cy: 678, rx: 148, ry: 54 },
    label: { x: 138, y: 773 },
  },
  {
    id: "vendas",
    title: "Vendas",
    description: "Mais conversas em pedidos, com acompanhamento real.",
    box: { x: 378, y: 506, w: 284, h: 262 },
    objects: [{ id: "notebook", alt: "Notebook com o painel de vendas" }],
    platform: { cx: 522, cy: 720, rx: 124, ry: 22, t: 20 },
    label: { x: 449, y: 775 },
  },
  {
    // Operação: acompanhamento de pedidos e status, avisos automáticos ao cliente,
    // preparo para retirada ou entrega. Não apresentar controle de estoque nem ERP.
    id: "operacao",
    title: "Operação",
    description: "Pedidos acompanhados, clientes avisados e menos trabalho manual.",
    // área termina 6 px abaixo da plataforma, como em Vendas (rótulos na mesma linha)
    box: { x: 630, y: 494, w: 386, h: 274 },
    objects: [{ id: "materiais", alt: "Prateleira com tijolos, sacos de cimento, areia e pedra" }],
    // plataforma 10% menor que a original (rx 184, ry 27, t 20) e na altura da de Vendas
    platform: { cx: 822, cy: 720, rx: 165.6, ry: 24.3, t: 18 },
    label: { x: 718, y: 775 },
  },
  {
    id: "entregas",
    title: "Entregas",
    description: "Acompanhe o status dos pedidos até o cliente.",
    box: { x: 1004, y: 488, w: 300, h: 266 },
    objects: [
      { id: "rota", alt: "Mapa com a rota da entrega" },
      { id: "caminhao", alt: "Caminhão de entregas da scob." },
    ],
    platform: { cx: 1146, cy: 710, rx: 134, ry: 22, t: 20 },
    label: { x: 1088, y: 775 },
  },
  {
    id: "posvenda",
    title: "Pós-venda",
    description: "Relacionamento contínuo que gera mais vendas.",
    box: { x: 1294, y: 488, w: 334, h: 266 },
    objects: [{ id: "avaliacao", alt: "Cartão de avaliação com cinco estrelas" }],
    platform: { cx: 1446, cy: 703, rx: 132, ry: 22, t: 20 },
    ring: { cx: 1462, cy: 684, rx: 158, ry: 46 },
    label: { x: 1393, y: 773 },
  },
];

/** Converte uma caixa absoluta (referência) em porcentagens relativas a outra caixa. */
export function rel(inner: Box, outer: Box) {
  return {
    left: `${((inner.x - outer.x) / outer.w) * 100}%`,
    top: `${((inner.y - outer.y) / outer.h) * 100}%`,
    width: `${(inner.w / outer.w) * 100}%`,
    height: `${(inner.h / outer.h) * 100}%`,
  };
}

/* =========================================================
   Contratos das imagens HD
   ========================================================= */

type Pt = readonly [number, number];

/** Objeto em alta resolução sem tela em HTML (só a imagem). */
export interface ImageHd {
  src: string;
  /** Tamanho natural da imagem servida, em pixels. */
  width: number;
  height: number;
  /** Posição no palco, em px da referência. */
  box: Box;
  /** Enquadramento opcional abaixo de 1024 px. */
  boxMobile?: Box;
}

/** Aparelho com tela em HTML projetada sobre os 4 cantos da tela vazada do PNG. */
export interface PhoneHd extends Omit<ImageHd, "boxMobile"> {
  /** Cantos da tela na imagem servida (sup. esq., sup. dir., inf. dir., inf. esq.), em px. */
  screen: readonly [Pt, Pt, Pt, Pt];
  /** "sob": tela vazada (a moldura cobre a interface). "sobre": tela vazia e opaca. */
  screenLayer: "sob" | "sobre";
  /**
   * Largura (em px da tela HTML de 300 px) coberta pelo selo no topo. O cabeçalho
   * da interface começa depois dela para o selo não esconder o nome do cliente.
   */
  badgeInset?: number;
}

/** Mesmo contrato do celular, sem o recuo do selo. Tela da interface: 640 × 400 (16:10). */
export type LaptopHd = Omit<PhoneHd, "badgeInset"> & {
  /**
   * Enquadramento só para tablet e celular (< 1024 px), em px da referência. No
   * carrossel cada estação fica isolada no seu card, sem os tijolos para cobrir a
   * ponta da base; aqui o notebook é reduzido e centralizado na plataforma.
   */
  boxMobile?: Box;
};

/* =========================================================
   WhatsApp — celular HD v3 (aprovado em 11/11/2026)
   ========================================================= */

/** Fonte: design/hero-fontes/celular-hd-v3.png (1078×1459, RGBA), servido em WebP 640 px. */
export const PHONE_HD: PhoneHd = {
  src: "/preview-hero/celular-hd-v3.webp",
  badgeInset: 112,
  width: 640,
  height: 866,
  box: { x: 172.0, y: 486.5, w: 176.4, h: 238.8 },
  // cantos medidos na tela vazada (erro ≤ 3,6 px no PNG), expandidos 3 px para dentro da moldura
  screen: [
    [90.2, 39.7],
    [439.8, 70.2],
    [601.1, 759.2],
    [283.3, 788.5],
  ],
  screenLayer: "sob",
};

/* =========================================================
   Vendas — notebook HD v2 (aprovado em 11/11/2026; desktop em 96%, aprovado em 12/11/2026)
   ========================================================= */

/**
 * Fonte: design/hero-fontes/notebook-hd-v2.png (1536 × 1024, RGBA), câmera baixa.
 * Servido em WebP 1100 px.
 * Desktop: 96% do enquadramento anterior (opção A da auditoria), com o mesmo centro e o
 * mesmo fundo da base. Mobile inalterado. Histórico em components/hero-bc/PENDENCIAS.md.
 */
export const LAPTOP_HD: LaptopHd = {
  src: "/preview-hero/notebook-hd-v2.webp",
  width: 1100,
  height: 733,
  // desktop (≥1024 px): ≈83,9% do tamanho original do v2 (96% de 87,4%), base centralizada
  // na plataforma de Vendas (x≈521,7) e apoiada em y≈731,5
  box: { x: 376.3, y: 549.4, w: 286.8, h: 191.2 },
  // < 1024 px: ≈84,6% do original, mesmo centro e fundo da base
  boxMobile: { x: 396.2, y: 575.3, w: 246.0, h: 163.9 },
  // cantos medidos na tela vazada (erro ≈ 1 px no PNG), expandidos 3 px
  screen: [
    [71.6, 77.5],
    [751.9, 145.9],
    [795.4, 589.7],
    [124.0, 604.2],
  ],
  screenLayer: "sob",
};

/* =========================================================
   Operação — composição HD em 75% (aprovada em 11/11/2026)
   ========================================================= */

/** Fonte: design/hero-fontes/estoque-hd.png (1495 × 1052, RGBA), servida em WebP 1000 px (q82). */
export const OPERACAO_HD: ImageHd = {
  src: "/preview-hero/estoque-hd.webp",
  width: 1000,
  height: 704,
  // 75% da área original, centralizada no eixo da plataforma (x 822) e com a base apoiada
  // 9 px abaixo do centro do disco (y≈729). Vale para todas as larguras.
  box: { x: 690.5, y: 546.1, w: 262.5, h: 184.5 },
};

/* =========================================================
   Entregas — caminhão, mapa e pino HD estáticos (aprovados em 11/11/2026)
   ========================================================= */

/**
 * Fonte: design/hero-fontes/entregas-caminhao-hd.png (1582 × 994, RGBA), servida em WebP 1000 px.
 * Escala com a MESMA ALTURA do caminhão da referência (141 px), ancorada na frente da cabine
 * (x≈1262) e no contato das rodas (y≈717). O PNG traz uma sombra de contato suave (alfa ≤ 119).
 */
export const CAMINHAO_HD: ImageHd = {
  src: "/preview-hero/entregas-caminhao-hd.webp",
  width: 1000,
  height: 628,
  box: { x: 991.4, y: 555.0, w: 277.4, h: 174.3 },
};

/**
 * Fonte: design/hero-fontes/entregas-mapa-hd.png (1327 × 1185, RGBA), servida em WebP 700 px.
 * Cartão completo, sem rota nem pino; ocupa x≈1138–1300, y≈505–627, com o canto inferior
 * esquerdo atrás da cabine do caminhão.
 */
export const MAPA_HD: ImageHd = {
  src: "/preview-hero/entregas-mapa-hd.webp",
  width: 700,
  height: 625,
  box: { x: 1134.1, y: 491.7, w: 173.5, h: 154.9 },
};

/**
 * Fonte: design/hero-fontes/entregas-pino-hd.png (1086 × 1448, RGBA), servida em WebP 400 px.
 * Camada própria e estática sobre o mapa: altura de 41 px da referência, ponta em (1240, 556).
 */
export const PINO_HD: ImageHd = {
  src: "/preview-hero/entregas-pino-hd.webp",
  width: 400,
  height: 533,
  box: { x: 1220.4, y: 507.8, w: 39.9, h: 53.1 },
};

/* =========================================================
   Pós-venda — cartão + selo HD (aprovado em 11/11/2026)
   ========================================================= */

/**
 * Fonte: design/hero-fontes/posvenda-hd.png (1351 × 1164, RGBA), servida em WebP 900 px.
 * Mesma altura do cartão da referência (≈196 px) e mesmo eixo (x≈1462): fica 14 px à direita
 * do centro da plataforma, intencionalmente.
 */
export const POSVENDA_HD: ImageHd = {
  src: "/preview-hero/posvenda-hd.webp",
  width: 900,
  height: 775,
  box: { x: 1329.9, y: 490.4, w: 271.0, h: 233.5 },
};
