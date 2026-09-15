"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, CheckCircle2, Layers, MessageCircle, Plug, Sparkles, TableProperties } from "lucide-react";
import { Button } from "@/components/ui/button";
import { conversion } from "@/lib/gtag";
import { site } from "@/lib/site";
import { HeroDashboard } from "./hero-dashboard";
import { fadeBlur, stagger } from "./reveal";
import { ScaledFrame } from "./scaled-frame";

const ease = [0.22, 1, 0.36, 1] as const;

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span key={i} variants={fadeBlur} className="inline-block whitespace-pre">
          {word}
          {" "}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mockY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  // Inclinação sutil do mockup acompanhando o cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, -6]), { stiffness: 80, damping: 20 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [9, 3]), { stiffness: 80, damping: 20 });

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-24"
    >
      {/* fundo */}
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 opacity-70" />
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="absolute top-[-10%] right-[-10%] -z-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,.22),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute bottom-[-20%] left-[-15%] -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,.08),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-background"
      />

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* copy */}
        <motion.div
          style={{ y: copyY, opacity: fade }}
          initial="hidden"
          animate="show"
          variants={stagger(0.1, 0.06)}
          className="relative z-10"
        >
          <motion.a
            variants={fadeBlur}
            href="#cases"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1 pr-3 pl-1 text-xs text-muted-foreground backdrop-blur transition hover:border-line-strong hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand">
              <Sparkles className="size-3" /> scob.
            </span>
            {site.slogan}
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <h1 className="mt-7 text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-[3.4rem] xl:text-[3.9rem]">
            <Words text="Sistemas sob medida" className="text-gradient block" />
            <Words
              text="para empresas que cresceram."
              className="mt-1 block text-white/45"
            />
          </h1>

          <motion.p
            variants={fadeBlur}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Eliminamos planilhas, retrabalho e processos manuais com software desenvolvido{" "}
            <span className="text-foreground">exatamente para a sua operação.</span>
          </motion.p>

          <motion.div variants={fadeBlur} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <a href="#contato" onClick={() => conversion()}>
                Agendar diagnóstico gratuito
                <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
              </a>
            </Button>
            <Button asChild size="xl" variant="secondary" className="w-full sm:w-auto">
              <a href="#cases" onClick={() => conversion()}>
                Ver sistemas reais
              </a>
            </Button>
          </motion.div>

          <motion.ul
            variants={fadeBlur}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-subtle"
          >
            {["Diagnóstico gratuito", "Sem compromisso", "Direto com quem desenvolve"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-brand" /> {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* faixa de valor + fundador: no celular ficam entre os CTAs e o mockup; no desktop ocupam a linha inteira abaixo */}
        <div className="relative z-10 flex flex-col gap-3 lg:order-last lg:col-span-2">
        <motion.ul
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.9, ease }}
          className="glass relative grid gap-4 rounded-2xl p-4 sm:grid-cols-3 sm:gap-6 sm:p-5"
        >
          {[
            { icon: Layers, text: "Atendimento, logística e financeiro em uma única plataforma" },
            { icon: TableProperties, text: "Menos planilhas. Mais controle da operação." },
            { icon: Plug, text: "Integrações com WhatsApp, IA e APIs empresariais" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-[13px] leading-snug text-foreground/85 sm:text-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-brand/20 bg-brand-soft text-brand">
                <Icon className="size-4" />
              </span>
              <span className="pt-1.5">{text}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 1.05, ease }}
          className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5 sm:py-3.5"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/fundador-scob.webp"
              alt={`${site.founderFullName}, fundador da scob.`}
              width={200}
              height={200}
              sizes="48px"
              className="size-10 shrink-0 rounded-full border border-brand/40 object-cover object-top sm:size-12"
            />
            <div className="leading-tight">
              <div className="text-sm font-medium text-foreground">{site.founderFullName}</div>
              <div className="mt-0.5 text-[13px] text-subtle">Fundador da scob.</div>
            </div>
          </div>
          <span aria-hidden className="hidden h-8 w-px bg-line-strong sm:block" />
          <p className="text-[13px] leading-snug text-muted-foreground">
            Atendimento direto com quem projeta e desenvolve o seu sistema.
          </p>
        </motion.div>
        </div>

        {/* mockup */}
        <motion.div
          style={{ y: mockY }}
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.35, ease }}
          className="relative mx-auto w-full max-w-[640px] [perspective:1800px]"
        >
          <motion.div
            style={{ rotateY: reduce ? -8 : rotY, rotateX: reduce ? 5 : rotX, transformStyle: "preserve-3d" }}
            className="relative max-lg:![transform:rotateX(8deg)_rotateY(0deg)]"
          >
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[36px] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,.25),transparent_70%)] blur-2xl"
            />
            <ScaledFrame width={640} height={480} className="rounded-[22px]">
              <HeroDashboard />
            </ScaledFrame>
            <span className="sr-only">
              Exemplo de sistema sob medida com indicadores, etapas da operação e atividade em tempo real.
            </span>
          </motion.div>

          {/* cartões flutuantes */}
          <motion.div
            initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.4, duration: 0.8, ease }}
            className="absolute -top-5 left-2 sm:-top-6 sm:-left-10"
            aria-hidden
          >
            <div className="flex animate-float items-center gap-2.5 rounded-2xl border border-white/10 bg-[#111214]/90 py-2 pr-4 pl-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,.8)] backdrop-blur-xl">
              <div className="grid size-8 place-items-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                <MessageCircle className="size-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-medium text-white sm:text-xs">Pedido recebido via WhatsApp</div>
                <div className="text-[10px] text-white/50 sm:text-[11px]">Enviado direto para a expedição</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.7, duration: 0.8, ease }}
            className="absolute -right-1 -bottom-6 sm:-right-8 sm:bottom-[4%]"
            aria-hidden
          >
            <div
              className="animate-float rounded-2xl border border-white/10 bg-[#111214]/90 px-4 py-2.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,.8)] backdrop-blur-xl"
              style={{ animationDelay: "-3s" }}
            >
              <div className="text-[10px] text-white/50 sm:text-[11px]">Entregas concluídas</div>
              <div className="font-display text-sm font-semibold text-white sm:text-base">
                118 <span className="text-xs font-normal text-teal-300">hoje</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
