import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { CtaDiagnostico } from "./cta-diagnostico";
import { HeroTelas } from "./hero-telas";
import { Ponto } from "./ponto";

export function Hero() {
  return (
    <section id="top" className="hm-hero" aria-labelledby="hm-hero-title">
      <div className="hm-wrap hm-hero-grid">
        <div className="hm-hero-copy">
          <p className="hm-eyebrow">Atendimento · Reservas · Gestão</p>
          <h1 id="hm-hero-title" className="hm-hero-title">
            Tecnologia para a sua empresa atender, vender e operar melhor<Ponto />
          </h1>
          <p className="hm-hero-lead">
            CRM com WhatsApp, sistemas de reservas e agendamento e softwares de gestão, desenhados a partir
            da rotina da sua equipe.
          </p>
          <div className="hm-actions">
            <CtaDiagnostico className="hm-btn hm-btn-primary hm-btn-lg">
              Agendar diagnóstico gratuito
              <ArrowRight aria-hidden className="hm-btn-icon" />
            </CtaDiagnostico>
            <a href="#projetos" className="hm-link">
              Ver projetos <ArrowRight aria-hidden />
            </a>
          </div>
          <div className="hm-hero-founder">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fundador-scob.webp" alt="" width={200} height={200} decoding="async" />
            <p>
              <strong>{site.founderFullName}</strong>
              <span>Você fala direto com quem projeta e desenvolve o seu sistema.</span>
            </p>
          </div>
        </div>
        <HeroTelas />
      </div>
    </section>
  );
}
