"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { conversion } from "@/lib/gtag";
import { site } from "@/lib/site";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section id="contato" className="relative px-3 py-16 sm:px-6 sm:py-24">
      <Reveal className="noise relative mx-auto max-w-[1200px] overflow-hidden rounded-[36px] border border-line bg-[#070909] px-6 py-20 text-center sm:px-12 sm:py-28">
        {/* gradiente + brilho */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,rgba(20,184,166,.35),transparent_60%),radial-gradient(ellipse_50%_40%_at_50%_-10%,rgba(255,255,255,.06),transparent_70%)]"
        />
        <div
          aria-hidden
          className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_bottom,#000,transparent_70%)]"
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
        <div
          aria-hidden
          className="absolute -bottom-40 left-1/2 h-80 w-[720px] max-w-full -translate-x-1/2 rounded-full bg-brand/25 blur-[100px]"
        />

        <div className="relative mx-auto max-w-3xl">
          <p className="font-display text-sm font-medium tracking-wide text-brand">{site.slogan}</p>
          <h2 className="text-gradient mt-5 text-[2.1rem] leading-[1.05] font-semibold sm:text-6xl">
            Vamos desenhar o sistema da sua empresa?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Receba um diagnóstico operacional gratuito e um escopo sem compromisso.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => conversion()}>
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
                <span className="relative">Quero meu diagnóstico operacional</span>
                <ArrowRight className="relative transition-transform group-hover/btn:translate-x-1" />
              </a>
            </Button>
            <Button asChild size="xl" variant="secondary" className="w-full sm:w-auto">
              <a href={site.whatsappChat} target="_blank" rel="noopener noreferrer" onClick={() => conversion()}>
                <MessageCircle /> Falar pelo WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-subtle">Resposta direta de quem vai construir o seu sistema.</p>
        </div>
      </Reveal>
    </section>
  );
}
