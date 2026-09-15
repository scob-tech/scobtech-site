"use client";

import { motion } from "framer-motion";
import { ChartColumnIncreasing, ClipboardList, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeBlur, Stagger } from "./reveal";
import { SectionHeading } from "./section-heading";
import { SpotlightCard } from "./spotlight-card";

const steps = [
  {
    icon: ClipboardList,
    label: "Antes",
    text: "Planilhas, WhatsApp e retrabalho.",
    tone: "before" as const,
  },
  {
    icon: Layers,
    label: "Sistema Scob",
    text: "Uma plataforma construída exatamente para a operação.",
    tone: "brand" as const,
  },
  {
    icon: ChartColumnIncreasing,
    label: "Resultado",
    text: "Mais controle, menos tarefas manuais e decisões mais rápidas.",
    tone: "brand" as const,
  },
];

export function BeforeScob() {
  return (
    <section id="antes-da-scob" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Antes da Scob"
          title={
            <>
              Empresas não precisam de mais software.
              <br />
              Precisam de processos organizados.
            </>
          }
        />

        <div className="relative">
          {/* linha de conexão entre os cards (desktop) */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[52px] right-[16%] left-[16%] hidden h-px origin-left bg-gradient-to-r from-red-300/40 via-brand to-brand lg:block"
          />

          <Stagger gap={0.15} className="relative grid gap-4 lg:grid-cols-3 lg:gap-8">
            {steps.map(({ icon: Icon, label, text, tone }) => (
              <motion.div key={label} variants={fadeBlur}>
                <SpotlightCard className="h-full p-6 text-center sm:p-7">
                  <div
                    className={cn(
                      "mx-auto grid size-12 place-items-center rounded-2xl border",
                      tone === "before"
                        ? "border-red-400/20 bg-red-500/[0.08] text-red-300/80"
                        : "border-brand/25 bg-brand-soft text-brand",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div
                    className={cn(
                      "mt-5 text-xs font-medium tracking-[0.16em] uppercase",
                      tone === "before" ? "text-red-300/70" : "text-brand",
                    )}
                  >
                    {label}
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">{text}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
