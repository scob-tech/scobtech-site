import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { Ponto } from "./ponto";

const fatores = [
  { titulo: "Usuários", texto: "Quantas pessoas e perfis de acesso" },
  { titulo: "Integrações", texto: "WhatsApp, IA, ERPs e outras APIs" },
  { titulo: "Módulos", texto: "Áreas da operação no sistema" },
  { titulo: "Complexidade", texto: "Regras, fluxos e automações" },
];

export function Fundador() {
  return (
    <section id="sobre" className="hm-section" aria-labelledby="hm-sobre-title">
      <div className="hm-wrap hm-sobre">
        <div className="hm-sobre-foto" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fundador-scob.webp"
            alt={`${site.founderFullName}, fundador da scob.`}
            width={200}
            height={200}
            loading="lazy"
            decoding="async"
          />
          <p>
            <strong>{site.founderFullName}</strong>
            <span>Fundador e desenvolvedor · São Paulo, SP</span>
          </p>
        </div>

        <div data-reveal>
          <p className="hm-eyebrow">Sobre a scob.</p>
          <h2 id="hm-sobre-title" className="hm-h2">
            Você fala direto com quem desenvolve<Ponto />
          </h2>
          <p className="hm-lead">
            Sem vendedor no meio e sem equipe terceirizada. Quem faz o diagnóstico é quem desenha e escreve o
            código do seu sistema, do primeiro papo à evolução depois da entrega.
          </p>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-ghost">
            Conversar com o {site.founder}
            <ArrowRight aria-hidden className="hm-btn-icon" />
          </a>
          <p className="hm-tech">
            <span>Tecnologias com que trabalhamos</span>
            PostgreSQL, Supabase, Next.js, Vercel, API do WhatsApp e OpenAI. A combinação é definida em cada
            projeto.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Investimento() {
  return (
    <section id="investimento" className="hm-section hm-section-surface" aria-labelledby="hm-inv-title">
      <div className="hm-wrap hm-inv">
        <header data-reveal>
          <p className="hm-eyebrow">Investimento</p>
          <h2 id="hm-inv-title" className="hm-h2">
            Quanto custa um sistema sob medida?
          </h2>
          <p className="hm-lead">
            Cada sistema é desenvolvido para a realidade da empresa, então o investimento depende do projeto.
            Todo projeto começa com um diagnóstico gratuito, seguido de um escopo e orçamento sem compromisso.
          </p>
        </header>
        <ul className="hm-inv-fatores" data-reveal>
          {fatores.map((f, i) => (
            <li key={f.titulo}>
              <span aria-hidden>0{i + 1}</span>
              <strong>{f.titulo}</strong>
              {f.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
