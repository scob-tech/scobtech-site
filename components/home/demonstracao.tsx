import { ArrowRight } from "lucide-react";
import { demonstracoes } from "@/lib/projetos";
import { DemoBotao } from "./demo-botao";
import { Ponto } from "./ponto";

/**
 * Faixa da demonstração funcional de Atendimento & Vendas.
 * Sempre identificada como demonstração com dados fictícios, nunca como cliente ou projeto.
 */
export function Demonstracao({ id = "demonstracao" }: { id?: string }) {
  const demo = demonstracoes[0];
  return (
    <section id={id} className="hm-section hm-dark" aria-labelledby={`${id}-title`}>
      <div className="hm-wrap hm-demo">
        <div data-reveal>
          <p className="hm-eyebrow">Demonstração funcional</p>
          <h2 id={`${id}-title`} className="hm-h2">
            Experimente um CRM com WhatsApp por dentro<Ponto />
          </h2>
          <p className="hm-lead">
            Atenda como vendedor, acompanhe a equipe como gestor e veja os indicadores mudarem a cada
            conversa. Um exemplo de solução que adaptamos a diferentes segmentos.
          </p>
          <div className="hm-actions">
            <DemoBotao className="hm-btn hm-btn-primary hm-btn-lg">
              Abrir a demonstração <ArrowRight aria-hidden className="hm-btn-icon" />
            </DemoBotao>
          </div>
          <p className="hm-demo-aviso">{demo.aviso}</p>
        </div>

        <ul className="hm-demo-areas" data-reveal aria-label="O que dá para explorar na demonstração">
          {demo.areas.map((a, i) => (
            <li key={a.nome}>
              <span className="hm-demo-num">0{i + 1}</span>
              <span>
                <strong>{a.nome}</strong>
                {a.texto}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
