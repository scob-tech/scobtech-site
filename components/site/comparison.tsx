"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Logo } from "./logo";
import { fadeBlur, Stagger } from "./reveal";
import { SectionHeading } from "./section-heading";

const generic = [
  "Template fixo: sua equipe se adapta às telas dele",
  "Mensalidade por usuário, para sempre",
  "Funcionalidades que ninguém usa — e as que você precisa faltam",
  "Integrações limitadas ao que o fornecedor decidiu",
  "Suporte que não conhece o seu negócio",
];

const scob = [
  "Construído do zero a partir do seu processo real",
  "Sem licença: o sistema é propriedade da sua empresa",
  "Só o que faz sentido para a operação — nada sobrando",
  "Conectado ao WhatsApp e às ferramentas que você já usa",
  "Contato direto com quem desenvolve",
];

export function Comparison() {
  return (
    <section id="comparacao" className="relative py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="O diferencial"
          title="Seu processo não cabe em um software genérico."
          description="Todo software de prateleira quase resolve. No fim, é a equipe que muda o jeito de trabalhar para caber na ferramenta. A scob. inverte essa lógica."
        />

        <Stagger gap={0.15} className="relative grid gap-4 lg:grid-cols-2 lg:gap-6">
          {/* VS */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 z-10 hidden size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-background font-display text-sm font-semibold text-muted-foreground lg:grid"
          >
            VS
          </div>

          <motion.article
            variants={fadeBlur}
            className="relative overflow-hidden rounded-3xl border border-red-400/15 bg-gradient-to-b from-red-500/[0.06] to-surface p-7 sm:p-10"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent" />
            <span className="text-xs font-medium tracking-[0.18em] text-red-300/70 uppercase">Software genérico</span>
            <h3 className="mt-3 text-2xl font-semibold text-white/80 sm:text-3xl">Você se molda ao software</h3>
            <ul className="mt-8 space-y-4">
              {generic.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-400/80">
                    <X className="size-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            variants={fadeBlur}
            className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-b from-brand/[0.1] to-surface p-7 shadow-[0_30px_100px_-40px_rgba(20,184,166,.45)] sm:p-10"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
            <div
              aria-hidden
              className="absolute -top-24 -right-24 size-64 rounded-full bg-brand/20 blur-3xl"
            />
            <span className="relative flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-brand uppercase">
              <Logo className="size-6" /> Sistema Scob
            </span>
            <h3 className="relative mt-3 text-2xl font-semibold text-white sm:text-3xl">O software se molda a você</h3>
            <ul className="relative mt-8 space-y-4">
              {scob.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-foreground/90">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.article>
        </Stagger>
      </div>
    </section>
  );
}
