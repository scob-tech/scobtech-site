"use client";

import { motion } from "framer-motion";
import { Code2, KeyRound, MessageCircle, TrendingUp } from "lucide-react";
import { fadeBlur, Stagger } from "./reveal";
import { SpotlightCard } from "./spotlight-card";

const items = [
  { icon: KeyRound, title: "Sistema 100% proprietário", text: "O código e os dados são da sua empresa." },
  { icon: MessageCircle, title: "Integrações com WhatsApp e APIs", text: "Conectado aos canais e ferramentas que você já usa." },
  { icon: Code2, title: "Desenvolvido para o seu processo", text: "Cada tela nasce da sua operação real." },
  { icon: TrendingUp, title: "Evolução contínua após a entrega", text: "O sistema cresce junto com a empresa." },
];

export function Authority() {
  return (
    <section aria-label="Diferenciais" className="relative py-10 sm:py-14">
      <div className="container-page">
        <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {items.map(({ icon: Icon, title, text }) => (
            <motion.div key={title} variants={fadeBlur}>
              <SpotlightCard className="h-full p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand-soft text-brand">
                    <Icon className="size-[18px]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm leading-snug font-medium text-foreground sm:text-[15px]">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-subtle sm:text-[13px]">{text}</p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
