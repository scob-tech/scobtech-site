import fs from "node:fs";
import path from "node:path";
import { preload } from "react-dom";

/**
 * Pré-carrega o subconjunto latino de Fraunces e DM Sans na home.
 * Mesmo motivo e mesma técnica de components/hero-bc/font-preload.tsx (o next/font não emite
 * os preloads neste projeto): sem isso, o título do hero é pintado com a fonte reserva e
 * muda de tamanho quando a Fraunces chega. Só roda no build; se algo falhar, não faz nada.
 */
const FAMILIES = new Set(["Fraunces", "DM Sans"]);
const LATIN = /u\+00\?\?|u\+0000-00ff/i;

function latinFontUrls(): string[] {
  if (process.env.NODE_ENV !== "production") return [];
  try {
    const dir = path.join(process.cwd(), ".next", "static", "css");
    const byFamily = new Map<string, Set<string>>();
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".css")) continue;
      const css = fs.readFileSync(path.join(dir, file), "utf8");
      for (const [, body] of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
        const family = /font-family:\s*["']?([^;"']+)/.exec(body)?.[1]?.trim();
        if (!family || !FAMILIES.has(family) || !LATIN.test(body)) continue;
        const url = /url\(\s*["']?([^)"']+)/.exec(body)?.[1];
        if (!url?.startsWith("/_next/static/media/") || !url.endsWith(".woff2")) continue;
        if (!byFamily.has(family)) byFamily.set(family, new Set());
        byFamily.get(family)!.add(url);
      }
    }
    // um arquivo por família; se houver ambiguidade, não arrisca baixar o errado
    return [...byFamily.values()].filter((s) => s.size === 1).map((s) => [...s][0]);
  } catch {
    return [];
  }
}

export function HomeFontPreload() {
  for (const href of latinFontUrls()) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "" });
  }
  return null;
}
