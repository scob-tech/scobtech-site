/** Itens do menu (fora do componente de cliente para poder ser usado no rodapé). */
export type NavItem = { label: string; href: string };

/** Na home, os itens são âncoras da própria página. */
export const homeNav: NavItem[] = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Projetos", href: "#projetos" },
  { label: "Como trabalhamos", href: "#processo" },
  { label: "Sobre", href: "#sobre" },
];

/** Nas páginas internas (portfólio), as âncoras apontam para a home e Projetos para /projetos. */
export const paginasNav: NavItem[] = [
  { label: "Soluções", href: "/#solucoes" },
  { label: "Projetos", href: "/projetos/" },
  { label: "Como trabalhamos", href: "/#processo" },
  { label: "Sobre", href: "/#sobre" },
];
