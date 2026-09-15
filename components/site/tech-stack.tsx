"use client";

import { motion } from "framer-motion";
import { techLogos, type TechLogo } from "@/lib/tech-logos";
import { fadeBlur, Stagger } from "./reveal";
import { SectionHeading } from "./section-heading";
import { SpotlightCard } from "./spotlight-card";

const stack: { logo: TechLogo; name: string; role: string; color: string }[] = [
  { logo: "postgresql", name: "PostgreSQL", role: "Banco de dados robusto para os dados da operação", color: "#6f9fd8" },
  { logo: "supabase", name: "Supabase", role: "Autenticação, permissões e dados em tempo real", color: "#3ecf8e" },
  { logo: "nextjs", name: "Next.js", role: "Interfaces rápidas no computador e no celular", color: "#ffffff" },
  { logo: "vercel", name: "Vercel", role: "Hospedagem com alta disponibilidade", color: "#ffffff" },
  { logo: "whatsapp", name: "WhatsApp API", role: "Atendimento, avisos e automações no canal do cliente", color: "#25d366" },
  { logo: "openai", name: "OpenAI", role: "Automação inteligente onde ela realmente economiza tempo", color: "#ffffff" },
];

export function TechStack() {
  return (
    <section id="tecnologia" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Infraestrutura"
          title="A base técnica de empresas grandes. Desenhada para a sua."
          description="Cada sistema roda sobre tecnologias maduras, seguras e escaláveis. A tecnologia é o alicerce — o produto é o seu processo funcionando."
        />
        <Stagger gap={0.06} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {stack.map(({ logo, name, role, color }) => {
            const l = techLogos[logo];
            return (
              <motion.div key={name} variants={fadeBlur}>
                <SpotlightCard
                  color="rgba(255,255,255,0.06)"
                  className="h-full p-5 sm:p-7"
                  style={{ ["--logo" as string]: color }}
                >
                  <svg viewBox={l.viewBox} role="img" aria-label={name} className="size-7 sm:size-8">
                    <path
                      d={l.path}
                      className="fill-white/55 transition-[fill] duration-500 group-hover/spot:fill-[var(--logo)]"
                    />
                  </svg>
                  <h3 className="mt-6 font-sans text-[15px] font-medium text-foreground sm:text-base">{name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-subtle sm:text-sm">{role}</p>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
