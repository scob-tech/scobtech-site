"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Code2, Rocket, Route, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { Eyebrow } from "./section-heading";

const steps = [
  {
    icon: Stethoscope,
    title: "Diagnóstico",
    text: "Uma conversa para entender a dor, o fluxo real e onde o trabalho trava hoje. Sem custo e sem compromisso.",
    tags: ["Conversa gratuita", "Levantamento de dores"],
  },
  {
    icon: Route,
    title: "Mapeamento do processo",
    text: "Desenhamos o processo como ele é e como deveria ser: o que automatizar, o que simplificar e o que medir. O sistema nasce desse mapa.",
    tags: ["Fluxo desenhado", "Escopo claro"],
  },
  {
    icon: Code2,
    title: "Desenvolvimento",
    text: "O sistema é construído do zero, com você acompanhando de perto e ajustando no caminho, em contato direto com quem desenvolve.",
    tags: ["Acompanhamento próximo", "Ajustes no caminho"],
  },
  {
    icon: Rocket,
    title: "Entrega + Evolução",
    text: "Você recebe um sistema que é seu, em uso no dia a dia, e que continua evoluindo junto com a empresa.",
    tags: ["Sistema em uso", "Evolução contínua"],
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="processo" className="relative overflow-x-clip py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-page grid gap-14 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>Como funciona</Eyebrow>
          <h2 className="text-gradient mt-5 text-[2rem] leading-[1.08] font-semibold sm:text-5xl">
            Do primeiro papo ao sistema rodando.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Um processo claro, com você participando de cada decisão. Nada de caixa-preta.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <a href="#contato">Começar pelo diagnóstico</a>
          </Button>
        </Reveal>

        <ol ref={ref} className="relative">
          {/* trilho */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-line sm:left-[23px]" />
          <motion.div
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute top-2 bottom-2 left-[19px] w-px origin-top bg-gradient-to-b from-brand via-brand to-brand/0 shadow-[0_0_12px_rgba(20,184,166,.8)] sm:left-[23px]"
          />

          {steps.map(({ icon: Icon, title, text, tags }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-5 pb-12 last:pb-0 sm:gap-8"
            >
              <div className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-brand/40 bg-background text-brand shadow-[0_0_0_6px_var(--background)] sm:size-12">
                <Icon className="size-[18px] sm:size-5" />
              </div>
              <div className="group flex-1 rounded-2xl border border-line bg-surface p-6 transition duration-500 hover:-translate-y-1 hover:border-line-strong sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm text-brand">0{i + 1}</span>
                  <span className="h-px w-6 bg-line-strong" />
                </div>
                <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="rounded-full border border-line bg-white/[0.02] px-3 py-1 text-xs text-foreground/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
