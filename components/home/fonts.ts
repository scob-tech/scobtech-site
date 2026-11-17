import { DM_Sans, Fraunces } from "next/font/google";

/**
 * Fontes da home (direção "o ponto da scob."): Fraunces nos títulos e DM Sans no restante.
 * A configuração é idêntica à de components/demo-atendimento/fonts.ts, de propósito: assim o
 * build gera os mesmos arquivos de fonte e o preload da landing continua encontrando um
 * arquivo por família. Não usar Cormorant na home.
 */
const fraunces = Fraunces({ subsets: ["latin"], variable: "--hm-font-title", axes: ["opsz"], display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--hm-font-ui", axes: ["opsz"], display: "swap" });

export const homeFontVars = `${fraunces.variable} ${dmSans.variable}`;
