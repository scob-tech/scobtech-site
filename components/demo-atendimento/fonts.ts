import { Cormorant_Garamond, DM_Sans, Fraunces } from "next/font/google";

/**
 * Fontes da identidade Bone & Cobalt (referência aprovada do hero).
 * Ficam aqui, e não no layout raiz, para não alterar a home nem /experiencia.
 * O painel abre num portal fora da página, por isso as variáveis são aplicadas
 * tanto no wrapper da página quanto no próprio conteúdo do diálogo.
 */
const fraunces = Fraunces({ subsets: ["latin"], variable: "--sd-font-title", axes: ["opsz"], display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--sd-font-accent",
  weight: ["500", "600"],
  style: ["italic"],
  display: "swap",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--sd-font-ui", axes: ["opsz"], display: "swap" });

export const demoFontVars = `${fraunces.variable} ${cormorant.variable} ${dmSans.variable}`;
