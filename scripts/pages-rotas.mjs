/**
 * Ajuste do export estático para o GitHub Pages (roda depois do `next build`).
 *
 * Problema: uma rota com páginas internas gera, ao mesmo tempo, `projetos.html` e a pasta
 * `projetos/` (com `deposito-santo-antonio.html`). No GitHub Pages, `/projetos` encontra a
 * pasta, redireciona para `/projetos/` e procura `projetos/index.html`, que não existe: 404.
 *
 * Solução localizada: para cada `rota.html` que tem uma pasta `rota/` ao lado, copia o HTML
 * para `rota/index.html`. Rotas sem pasta (/, /privacy, /materiais-de-construcao) não mudam,
 * e o trailingSlash global do Next continua desligado.
 *
 * Uso: node scripts/pages-rotas.mjs [pasta do export, padrão "out"]
 */
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const raiz = process.argv[2] ?? "out";
if (!existsSync(raiz)) {
  console.error(`pages-rotas: pasta "${raiz}" não encontrada. Rode o build antes.`);
  process.exit(1);
}

let copias = 0;

function percorrer(dir) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) {
      if (nome !== "_next") percorrer(caminho);
      continue;
    }
    if (!nome.endsWith(".html")) continue;
    const pasta = caminho.slice(0, -".html".length);
    const indice = join(pasta, "index.html");
    if (existsSync(pasta) && statSync(pasta).isDirectory() && !existsSync(indice)) {
      copyFileSync(caminho, indice);
      copias++;
      console.log(`pages-rotas: ${relative(raiz, caminho)} -> ${relative(raiz, indice)}`);
    }
  }
}

percorrer(raiz);
console.log(`pages-rotas: ${copias} rota(s) ajustada(s).`);
