import type { MetadataRoute } from "next";

// Necessário com output: "export" — o sitemap é gerado como arquivo estático no build
export const dynamic = "force-static";

const BASE_URL = "https://scobtech.com.br";

// Rotas públicas do site. Seções da home (#cases, #contato) são âncoras, não páginas,
// por isso não entram aqui. Ao criar uma nova página em app/, adicione a rota nesta lista.
const routes: { path: string; priority: number }[] = [{ path: "/", priority: 1 }];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, priority }) => ({
    url: path === "/" ? BASE_URL : `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
