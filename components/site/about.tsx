import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { FounderPhoto } from "./founder-photo";
import { Reveal } from "./reveal";
import { Eyebrow } from "./section-heading";

export function About() {
  return (
    <section id="sobre" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface p-7 sm:p-12 lg:p-16">
          <div
            aria-hidden
            className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_left,#000,transparent_70%)]"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
            <Reveal className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
              <FounderPhoto name={site.founder} />
              <div className="mt-2">
                <div className="font-display text-xl font-semibold text-white">{site.founder}</div>
                <div className="text-sm text-subtle">Fundador · desenvolvedor</div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Eyebrow>Sobre a scob.</Eyebrow>
              <h2 className="text-gradient mt-5 text-[2rem] leading-[1.08] font-semibold sm:text-5xl">
                Você fala direto com quem desenvolve.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Sem vendedor no meio, sem equipe terceirizada, sem suporte que não conhece o seu negócio. Quem faz o
                diagnóstico é quem desenha e escreve o código do seu sistema — do primeiro papo à evolução depois da
                entrega.
              </p>

              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-8">
                {[
                  ["1:1", "contato direto"],
                  ["100%", "sob medida"],
                  ["SP", "São Paulo, Brasil"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-display text-2xl font-semibold text-white sm:text-3xl">{v}</dt>
                    <dd className="mt-1 text-xs text-subtle sm:text-sm">{l}</dd>
                  </div>
                ))}
              </dl>

              <Button asChild variant="secondary" size="lg" className="mt-10">
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  Conversar com o {site.founder}
                  <ArrowRight className="transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
