import { ArrowRight } from "lucide-react";
import { projetosPublicos } from "@/lib/projetos";
import { Ponto } from "./ponto";
import { ProjetoDestaque } from "./projeto-destaque";

export function Projetos() {
  return (
    <section id="projetos" className="hm-section hm-section-surface" aria-labelledby="hm-proj-title">
      <div className="hm-wrap">
        <header className="hm-head" data-reveal>
          <p className="hm-eyebrow">Projeto real</p>
          <h2 id="hm-proj-title" className="hm-h2">
            Um sistema em uso no dia a dia da operação<Ponto />
          </h2>
          <p className="hm-proj-todos">
            <a href="/projetos/" className="hm-link">
              Ver projetos e demonstrações <ArrowRight aria-hidden />
            </a>
          </p>
        </header>
        <div className="hm-proj-list">
          {projetosPublicos.filter((p) => p.natureza === "real").map((p, i) => (
            <ProjetoDestaque key={p.slug} projeto={p} inverter={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
