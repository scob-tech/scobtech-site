import { ArrowUpRight } from "lucide-react";
import { demoFontVars } from "@/components/demo-atendimento/fonts";
import { site } from "@/lib/site";
import "./contato.css";

/**
 * Seção final: contato comercial + rodapé. Em /preview-hero, logo após o case de entregas;
 * prévia isolada em /preview-contato.
 *
 * O CTA abre o WhatsApp comercial (número único em lib/site.ts) com a mensagem
 * pré-preenchida. A conversão é registrada pelo listener global (WhatsAppConversion).
 */

/** Destinos institucionais que existem de fato no site. */
const LINKS = [{ label: "Política de Privacidade", href: "/privacy" }];

export function Contato() {
  return (
    <section
      className={`ct ct-contact ${demoFontVars}`}
      aria-labelledby="ct-titulo"
    >
      <span className="ct-glow" aria-hidden />
      <div className="ct-inner">
        <p className="ct-kicker">
          <span className="ct-kicker-mark" aria-hidden />
          Seu próximo projeto começa aqui
        </p>

        <h2 id="ct-titulo" className="ct-title">
          Qual processo da sua empresa ainda depende de{" "}
          <em>trabalho manual?</em>
        </h2>

        <div className="ct-row">
          <p className="ct-text">
            Conte o que está tomando tempo da sua equipe. Vamos entender o
            problema e avaliar uma solução desenvolvida para a sua operação.
          </p>

          <div className="ct-action">
            <a
              className="ct-cta"
              href={site.whatsappProjeto}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ct-cta-label">Conversar sobre meu projeto</span>
              <span className="ct-sr"> (abre o WhatsApp em uma nova aba)</span>
              <span className="ct-cta-icon" aria-hidden>
                <ArrowUpRight />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Rodapé discreto. Fica fora do <main> para manter o landmark contentinfo. */
export function Rodape() {
  const ano = new Date().getFullYear();
  return (
    <footer className={`ct ct-footer ${demoFontVars}`}>
      <div className="ct-inner ct-footer-inner">
        <div className="ct-brand">
          <a href="/" className="ct-logo" aria-label="Scobtech, página inicial">
            {/* recorte só da marca "scob." do arquivo oficial (sem o slogan) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-scob-639.webp"
              srcSet="/logo-scob-639.webp 639w, /logo-scob-1086.webp 1086w"
              sizes="204px"
              alt=""
              width={2172}
              height={724}
              loading="lazy"
              decoding="async"
            />
          </a>
          <p className="ct-motto">Tecnologia feita para a sua operação.</p>
        </div>

        <div className="ct-meta">
          <nav aria-label="Institucional">
            <ul className="ct-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="ct-legal">
            <span>scobtech.com.br</span>
            <span aria-hidden className="ct-sep" />
            <span>© {ano} Scobtech</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
