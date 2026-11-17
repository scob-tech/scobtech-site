import { ArrowRight } from "lucide-react";
import { DemoBotao } from "@/components/home/demo-botao";
import type { Demonstracao } from "@/lib/projetos";

/**
 * Cartão de uma demonstração funcional. Sem captura de tela: o painel lista as áreas que o
 * visitante pode explorar, e o botão abre a própria demonstração.
 */
export function CartaoDemo({ demo }: { demo: Demonstracao }) {
  return (
    <article className="pf-card pf-card-demo" aria-labelledby={`pf-demo-${demo.id}`}>
      <div className="hm-tela pf-card-media pf-demo-painel" aria-hidden>
        <div className="hm-tela-bar">
          <span />
          <span />
          <span />
        </div>
        <ol>
          {demo.areas.map((a, i) => (
            <li key={a.nome}>
              <span className="pf-demo-num">0{i + 1}</span>
              <span>
                <strong>{a.nome}</strong>
                {a.texto}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="pf-card-info">
        <p className="hm-proj-meta">
          <span className="pf-badge-demo">Demonstração funcional</span>
          Dados fictícios
        </p>
        <h3 id={`pf-demo-${demo.id}`} className="hm-h3">
          {demo.nome}
        </h3>
        <p className="pf-card-resumo">{demo.resumo}</p>
        <div className="hm-actions">
          <DemoBotao className="hm-btn hm-btn-primary">
            Abrir a demonstração <ArrowRight aria-hidden className="hm-btn-icon" />
          </DemoBotao>
        </div>
        <p className="pf-nota">{demo.aviso}</p>
      </div>
    </article>
  );
}
