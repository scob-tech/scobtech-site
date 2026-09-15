"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, CircleCheck, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CasaSerraEvento, CasaSerraMapa, CasaSerraOcupacao } from "./case-screens/casa-serra";
import { SCREEN_H, SCREEN_W } from "./case-screens/shell";
import { fadeBlur, Stagger } from "./reveal";
import { ScaledFrame } from "./scaled-frame";
import { SectionHeading } from "./section-heading";

type Case = {
  id: string;
  name: string;
  category: string;
  color: string;
  summary: string;
  challenge: string;
  outcomes: string[];
  screens: Screen[];
  /** Case com telas ilustrativas: exibe a nota de dados fictícios no modal. */
  illustrative?: boolean;
  before: string;
  after: string;
  result: { badge: string; metrics: { value: string; label: string }[] };
};

/** Tela ilustrativa (componente) ou captura real do sistema (imagem). */
type Screen = { label: string } & ({ Component: React.ComponentType } | { src: string; alt: string });

const SCREEN_RATIO = `${SCREEN_W} / ${SCREEN_H}`;

function ScreenView({ screen, thumb = false }: { screen: Screen; thumb?: boolean }) {
  if ("Component" in screen) {
    const C = screen.Component;
    return (
      <ScaledFrame width={SCREEN_W} height={SCREEN_H}>
        <C />
      </ScaledFrame>
    );
  }
  return (
    <div className="relative w-full overflow-hidden bg-[#eef1f6]" style={{ aspectRatio: SCREEN_RATIO }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={screen.src}
        alt={screen.alt}
        loading={thumb ? "lazy" : "eager"}
        decoding="async"
        className={cn("absolute inset-0 size-full", thumb ? "object-cover object-top-left" : "object-contain")}
      />
    </div>
  );
}

const cases: Case[] = [
  {
    id: "casa-serra",
    name: "Casa Serra",
    category: "Restaurante • Eventos • Reservas",
    color: "#e2725b",
    summary:
      "Sistema operacional desenvolvido para centralizar reservas, campanhas de WhatsApp, agenda de eventos e controle financeiro em uma única plataforma.",
    challenge:
      "Sistema operacional desenvolvido para centralizar reservas, campanhas de WhatsApp, agenda de eventos e controle financeiro em uma única plataforma.",
    outcomes: [
      "Mapa de mesas e ambientes por horário",
      "Campanhas de WhatsApp que viram reservas",
      "Agenda de eventos com sinal via Pix conciliado",
      "Financeiro com ocupação, ticket médio e origem",
    ],
    screens: [
      { label: "Mapa de reservas", Component: CasaSerraMapa },
      { label: "Evento + WhatsApp", Component: CasaSerraEvento },
      { label: "Ocupação e receita", Component: CasaSerraOcupacao },
    ],
    illustrative: true,
    before: "Reservas, eventos e financeiro controlados em ferramentas diferentes.",
    after: "Uma única plataforma para mesas, campanhas, eventos e pagamentos.",
    result: {
      badge: "Caso ilustrativo",
      metrics: [
        { value: "420", label: "reservas/mês" },
        { value: "-34%", label: "no-show reduzido" },
        { value: "R$ 186", label: "de ticket médio" },
      ],
    },
  },
  {
    id: "vertix",
    name: "Vertix",
    category: "Assessoria esportiva",
    color: "#3b82f6",
    summary: "Planilhas de treino, radar de atletas que precisam de atenção e financeiro da assessoria num só lugar.",
    challenge:
      "Treinos montados em planilhas soltas, cobranças no WhatsApp pessoal e nenhuma forma rápida de saber quais atletas estavam sumindo ou exagerando na carga.",
    outcomes: [
      "Calendário de treinos com biblioteca reutilizável",
      "Radar que aponta faltas, excesso de carga e dores",
      "Evolução de pace, volume e zonas por atleta",
      "Mensalidades e cobranças organizadas",
    ],
    screens: [
      { label: "Painel do personal", src: "/cases/vertix/vertix-dashboard.png", alt: "Painel do personal no Vertix" },
      { label: "Relatórios", src: "/cases/vertix/vertix-relatorios.png", alt: "Relatórios do negócio no Vertix" },
      { label: "Calendário de treino", src: "/cases/vertix/vertix-calendario.png", alt: "Calendário de treino no Vertix" },
    ],
    before: "Treinos, calendário e acompanhamento distribuídos entre vários aplicativos.",
    after: "Gestão completa dos atletas em um painel único.",
    result: {
      badge: "Projeto real",
      metrics: [
        { value: "65", label: "atletas gerenciados" },
        { value: "96%", label: "de adesão aos treinos" },
        { value: "Semanal", label: "relatórios automáticos" },
      ],
    },
  },
  {
    id: "deposito-santo-antonio",
    name: "Depósito Santo Antônio",
    category: "Materiais de Construção • Operações • WhatsApp",
    color: "#1a8ba0",
    summary:
      "Plataforma desenvolvida para centralizar atendimento via WhatsApp, gestão de entregas, frota e operação comercial em um único sistema.",
    challenge:
      "Plataforma desenvolvida para centralizar atendimento via WhatsApp, gestão de entregas, frota e operação comercial em um único sistema.",
    outcomes: [
      "Atendimento integrado ao WhatsApp",
      "Gestão de entregas em tempo real",
      "Aplicativo para motoristas",
      "Leitura inteligente de comprovantes",
      "Centralização da operação logística",
    ],
    screens: [
      { label: "WhatsApp · Painel de vendas", src: "/cases/deposito-santo-antonio/wa-vendas.png", alt: "Painel de vendas do atendimento via WhatsApp" },
      { label: "WhatsApp · Agenda inteligente", src: "/cases/deposito-santo-antonio/wa-agenda.png", alt: "Agenda de tarefas do atendimento" },
      { label: "WhatsApp · Progresso", src: "/cases/deposito-santo-antonio/wa-progresso.png", alt: "Progresso de vendas" },
      { label: "Entrega · App do motorista", src: "/cases/deposito-santo-antonio/entrega-motorista.png", alt: "App do motorista de entrega" },
      { label: "Entrega · Últimas entregas", src: "/cases/deposito-santo-antonio/entrega-ultimas.png", alt: "Últimas entregas registradas" },
      { label: "Entrega · Financeiro conciliado", src: "/cases/deposito-santo-antonio/entrega-financeiro.png", alt: "Painel do financeiro com conciliação" },
      { label: "Frota · Painel do tanque", src: "/cases/deposito-santo-antonio/frota-painel.png", alt: "Painel do administrador do controle de frota" },
      { label: "Frota · Leitura por IA", src: "/cases/deposito-santo-antonio/frota-abastecimentos.png", alt: "Abastecimentos do dia com leitura por IA e reconciliação" },
    ],
    before: "Atendimento, entregas e frota separados entre WhatsApp e planilhas.",
    after: "Operação centralizada com pedidos, motoristas e comprovantes em um único sistema.",
    result: {
      badge: "Projeto real",
      metrics: [
        { value: "1.240", label: "pedidos processados/mês" },
        { value: "98%", label: "das entregas acompanhadas em tempo real" },
        { value: "12 h", label: "economizadas por semana" },
      ],
    },
  },
];

function BeforeAfter({ item }: { item: Case }) {
  return (
    <div className="mt-5 rounded-2xl border border-line bg-white/[0.02] p-4">
      <div className="flex gap-3">
        <CircleDashed className="mt-0.5 size-4 shrink-0 text-red-300/70" />
        <div>
          <div className="text-[11px] font-medium tracking-[0.14em] text-red-300/70 uppercase">Antes</div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{item.before}</p>
        </div>
      </div>
      <div aria-hidden className="my-3 ml-7 h-px bg-line" />
      <div className="flex gap-3">
        <CircleCheck className="mt-0.5 size-4 shrink-0" style={{ color: item.color }} />
        <div>
          <div className="text-[11px] font-medium tracking-[0.14em] uppercase" style={{ color: item.color }}>
            Depois
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{item.after}</p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ item }: { item: Case }) {
  const real = !item.illustrative;
  return (
    <div
      className="relative mt-5 overflow-hidden rounded-2xl border bg-white/[0.03] p-4 backdrop-blur sm:p-5"
      style={{ borderColor: `color-mix(in srgb, ${item.color} 35%, transparent)` }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-white">Resultado ilustrativo</span>
        <span
          className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
          style={{
            color: item.color,
            borderColor: `color-mix(in srgb, ${item.color} 40%, transparent)`,
            background: `color-mix(in srgb, ${item.color} 12%, transparent)`,
          }}
        >
          {item.result.badge}
        </span>
      </div>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {item.result.metrics.map((m) => (
          <li key={m.label} className="flex items-baseline gap-2 sm:block">
            <span className="font-display text-2xl font-semibold text-white sm:text-3xl">{m.value}</span>
            <span className="block text-[13px] leading-snug text-muted-foreground sm:mt-1">{m.label}</span>
          </li>
        ))}
      </ul>
      {real && <p className="mt-3 text-[11px] text-subtle">Números ilustrativos.</p>}
    </div>
  );
}

function CaseModal({ item, onContact }: { item: Case; onContact: () => void }) {
  const [active, setActive] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // pré-carrega as capturas reais para a troca de abas não piscar
  useEffect(() => {
    item.screens.forEach((s) => {
      if ("src" in s) new Image().src = s.src;
    });
  }, [item]);

  return (
    <DialogContent
      ref={contentRef}
      tabIndex={-1}
      onOpenAutoFocus={(e) => {
        // foca o próprio modal (sem anel de foco na primeira aba)
        e.preventDefault();
        contentRef.current?.focus({ preventScroll: true });
      }}
      onCloseAutoFocus={(e) => {
        if (window.location.hash === "#contato") e.preventDefault();
      }}
      className="max-h-[92svh] w-[calc(100%-1.5rem)] grid-cols-[minmax(0,1fr)] focus:outline-none max-w-none gap-0 overflow-y-auto rounded-3xl border-line bg-surface p-0 sm:max-w-5xl">
      <div className="relative overflow-hidden border-b border-line px-5 pt-7 pb-6 sm:px-8">
        <div
          aria-hidden
          className="absolute -top-32 left-1/3 h-56 w-96 rounded-full blur-3xl"
          style={{ background: `${item.color}22` }}
        />
        <span className="relative text-xs font-medium tracking-[0.16em] uppercase" style={{ color: item.color }}>
          {item.category}
        </span>
        <DialogTitle className="relative mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
          {item.name}
        </DialogTitle>
        <ResultCard item={item} />
        <DialogDescription className="relative mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {item.challenge}
        </DialogDescription>
      </div>

      <div className="px-3 pt-5 sm:px-8">
        <div
          role="tablist"
          aria-label={`Telas do ${item.name}`}
          className="mb-4 flex gap-1 overflow-x-auto rounded-full border border-line bg-black/30 p-1 [scrollbar-width:none]"
        >
          {item.screens.map((s, i) => (
            <button
              key={s.label}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
                i === active ? "text-white" : "text-subtle hover:text-foreground",
              )}
            >
              {i === active && (
                <motion.span
                  layoutId={`tab-${item.id}`}
                  className="absolute inset-0 rounded-full border border-line-strong bg-white/[0.08]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>

        {/* no celular a tela ganha largura mínima e rola na horizontal para continuar legível */}
        <div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-line shadow-[0_30px_80px_-30px_rgba(0,0,0,.9)] [scrollbar-width:none]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, filter: "blur(8px)", scale: 0.99 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(8px)", scale: 0.99 }}
              transition={{ duration: 0.35 }}
              className="min-w-[680px] sm:min-w-0"
            >
              <ScreenView screen={item.screens[active]} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className={cn("mt-2 text-center text-[11px] text-subtle", !item.illustrative && "sm:hidden")}>
          <span className="sm:hidden">
            Deslize para ver a tela inteira
            {item.illustrative && " · "}
          </span>
          {item.illustrative && "Telas ilustrativas com dados fictícios."}
        </p>
      </div>

      <div className="grid gap-6 px-5 py-7 sm:grid-cols-[1fr_auto] sm:items-end sm:px-8">
        <ul className="grid gap-3 sm:grid-cols-2">
          {item.outcomes.map((o) => (
            <li key={o} className="flex gap-2.5 text-sm text-foreground/85">
              <Check className="mt-0.5 size-4 shrink-0" style={{ color: item.color }} />
              {o}
            </li>
          ))}
        </ul>
        <Button size="lg" className="w-full sm:w-auto" onClick={onContact}>
          Quero um sistema assim <ArrowRight />
        </Button>
      </div>
    </DialogContent>
  );
}

function CaseCard({ item }: { item: Case }) {
  const [open, setOpen] = useState(false);

  function goToContact() {
    history.replaceState(null, "", "#contato");
    setOpen(false);
    setTimeout(() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" }), 220);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          variants={fadeBlur}
          className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,1)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
          />
          <div className="relative overflow-hidden px-5 pt-5">
            <div
              aria-hidden
              className="absolute inset-x-8 top-10 h-40 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: item.color }}
            />
            <div className="relative translate-y-2 overflow-hidden rounded-t-xl border border-b-0 border-white/10 shadow-2xl transition-transform duration-700 ease-out group-hover:translate-y-0 group-hover:scale-[1.02]">
              <ScreenView screen={item.screens[0]} thumb />
            </div>
          </div>
          <div className="relative flex flex-1 flex-col border-t border-line p-6">
            <span className="text-xs font-medium tracking-[0.14em] uppercase" style={{ color: item.color }}>
              {item.category}
            </span>
            <h3 className="mt-2 text-2xl font-semibold text-white">{item.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
            <BeforeAfter item={item} />
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              Ver telas
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </motion.button>
      </DialogTrigger>
      <CaseModal item={item} onContact={goToContact} />
    </Dialog>
  );
}

export function Cases() {
  return (
    <section id="cases" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Cases"
          title="Sistemas desenhados para operações reais"
          description="Cada projeto nasce de uma dor concreta e é construído do zero. Clique em um case para ver as telas por dentro."
        />
        <Stagger gap={0.12} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
