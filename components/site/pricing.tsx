"use client";

import { motion } from "framer-motion";
import { Blocks, Gauge, Plug, Users } from "lucide-react";
import { fadeBlur, Reveal, Stagger } from "./reveal";
import { Eyebrow } from "./section-heading";

const factors = [
  { icon: Users, label: "Usuários", hint: "Quantas pessoas e perfis de acesso" },
  { icon: Plug, label: "Integrações", hint: "WhatsApp, IA, ERPs e outras APIs" },
  { icon: Blocks, label: "Módulos", hint: "Áreas da operação no sistema" },
  { icon: Gauge, label: "Complexidade", hint: "Regras, fluxos e automações" },
];

export function Pricing() {
  return (
    <section id="investimento" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-page">
        <div className="glass relative overflow-hidden rounded-[32px] p-7 sm:p-12 lg:p-16">
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <Reveal>
              <Eyebrow>Diagnóstico gratuito</Eyebrow>
              <h2 className="text-gradient mt-5 text-[2rem] leading-[1.08] font-semibold sm:text-5xl">
                Quanto custa um sistema sob medida?
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>Cada sistema é desenvolvido do zero para a realidade da empresa.</p>
                <p>
                  O investimento depende da complexidade do projeto, número de usuários, integrações e módulos
                  necessários.
                </p>
                <p className="text-foreground/90">
                  Todo projeto começa com um diagnóstico gratuito, seguido de um escopo e orçamento sem compromisso.
                </p>
              </div>
            </Reveal>

            <Stagger gap={0.08} className="grid grid-cols-2 gap-3 sm:gap-4">
              {factors.map(({ icon: Icon, label, hint }) => (
                <motion.div
                  key={label}
                  variants={fadeBlur}
                  className="rounded-2xl border border-line bg-surface/80 p-4 transition duration-500 hover:-translate-y-1 hover:border-line-strong sm:p-5"
                >
                  <div className="grid size-10 place-items-center rounded-xl border border-brand/20 bg-brand-soft text-brand">
                    <Icon className="size-[18px]" />
                  </div>
                  <div className="mt-4 text-sm font-medium text-foreground sm:text-[15px]">{label}</div>
                  <div className="mt-1 text-xs leading-relaxed text-subtle sm:text-[13px]">{hint}</div>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
