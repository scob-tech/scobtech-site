import { ArrowRight, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import { homeNav, type NavItem } from "./nav-items";
import { Ponto } from "./ponto";

export function CtaFinal() {
  return (
    <section id="contato" className="hm-dark hm-cta" aria-labelledby="hm-cta-title">
      <div className="hm-wrap" data-reveal>
        <p className="hm-eyebrow">Diagnóstico gratuito</p>
        <h2 id="hm-cta-title" className="hm-cta-title">
          Vamos conversar sobre a sua operação<Ponto />
        </h2>
        <p className="hm-lead">
          Receba um diagnóstico operacional gratuito e um escopo sem compromisso, direto com quem vai
          construir o seu sistema.
        </p>
        <div className="hm-actions">
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-primary hm-btn-lg">
            Quero meu diagnóstico
            <ArrowRight aria-hidden className="hm-btn-icon" />
          </a>
          <a href={site.whatsappChat} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-onDark hm-btn-lg">
            <MessageCircle aria-hidden /> Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export function Rodape({ items = homeNav }: { items?: NavItem[] }) {
  return (
    <footer className="hm-dark hm-footer">
      <div className="hm-wrap">
        <div className="hm-footer-top">
          <div className="hm-footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-horizontal-light.svg" alt="scob." width={843} height={100} loading="lazy" decoding="async" />
            <p>Software sob medida, automações e integrações para empresas. São Paulo, SP.</p>
          </div>
          <nav aria-label="Rodapé">
            <h2>Navegar</h2>
            <ul>
              {items.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>Contato</h2>
            <ul>
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="hm-footer-bottom">
          <span>© 2026 scob. Todos os direitos reservados.</span>
          <a href="/privacy">Política de Privacidade</a>
          <span>{site.slogan}</span>
        </div>
      </div>
    </footer>
  );
}
