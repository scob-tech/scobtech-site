import fs from "node:fs";
import path from "node:path";
import { preload } from "react-dom";

/**
 * Pré-carrega as fontes da primeira dobra da landing (Fraunces, DM Sans e Cormorant
 * Garamond, subconjunto latino).
 *
 * Por quê: neste projeto o next/font não emite os <link rel="preload"> (o manifesto de
 * fontes sai vazio no build). Sem eles, no celular o título do hero é pintado primeiro com
 * a fonte reserva, que quebra "Sua loja mais eficiente," em duas linhas; quando o Fraunces
 * chega, o título volta a uma linha e tudo abaixo sobe ~38 px (CLS ≈ 0,09).
 *
 * Como: componente de servidor executado só no build (export estático). Lê o CSS que o
 * próprio Next gerou em .next/static/css, encontra o arquivo do subconjunto latino de cada
 * família e chama preload() do React, que coloca o <link> no <head>. Nenhum caminho com
 * hash fica fixo no código: se a fonte mudar de versão, o build encontra o arquivo novo.
 * Se qualquer passo falhar, não pré-carrega nada (comportamento anterior, sem erro).
 */
const FAMILIES = new Set(["Fraunces", "DM Sans", "Cormorant Garamond"]);
// subconjunto latino: o next/font gera o unicode-range com "u+00??" (ou U+0000-00FF)
const LATIN = /u\+00\?\?|u\+0000-00ff/i;

function latinFontUrls(): string[] {
  if (process.env.NODE_ENV !== "production") return [];
  try {
    const dir = path.join(process.cwd(), ".next", "static", "css");
    const urls = new Set<string>();
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".css")) continue;
      const css = fs.readFileSync(path.join(dir, file), "utf8");
      for (const [, body] of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
        const family = /font-family:\s*["']?([^;"']+)/.exec(body)?.[1]?.trim();
        if (!family || !FAMILIES.has(family) || !LATIN.test(body)) continue;
        const url = /url\(\s*["']?([^)"']+)/.exec(body)?.[1];
        if (url?.startsWith("/_next/static/media/") && url.endsWith(".woff2")) urls.add(url);
      }
    }
    // uma por família no máximo: se aparecer mais de um arquivo, não arrisca baixar o errado
    return urls.size <= FAMILIES.size ? [...urls] : [];
  } catch {
    return [];
  }
}

export function LandingFontPreload() {
  for (const href of latinFontUrls()) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "" });
  }
  return null;
}
