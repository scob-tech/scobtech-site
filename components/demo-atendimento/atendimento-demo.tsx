"use client";

import { useEffect, useId, useState } from "react";
import { Dialog, Tabs } from "radix-ui";
import { BarChart3, CalendarDays, MessagesSquare, RotateCcw, Sparkles, X } from "lucide-react";
import { PROFILES } from "@/lib/demo-atendimento/data";
import { formatDateTime } from "@/lib/demo-atendimento/format";
import { AgendaTab } from "./agenda-tab";
import { AnaliseTab } from "./analise-tab";
import { AtendimentoTab } from "./atendimento-tab";
import { DemoProvider, useDemo } from "./demo-store";
import { demoFontVars } from "./fonts";
import { IndicadoresTab } from "./indicadores-tab";
import "./demo.css";

type TabId = "atendimento" | "indicadores" | "agenda" | "analise";

const TABS: { id: TabId; label: string; short: string; Icon: typeof MessagesSquare }[] = [
  { id: "atendimento", label: "Atendimento", short: "Atendimento", Icon: MessagesSquare },
  { id: "indicadores", label: "Indicadores", short: "Indicadores", Icon: BarChart3 },
  { id: "agenda", label: "Minha Agenda", short: "Agenda", Icon: CalendarDays },
  { id: "analise", label: "Análise com IA", short: "Análise IA", Icon: Sparkles },
];

/**
 * Demonstração de Atendimento & Vendas em painel sobreposto.
 *
 * Componente independente e reutilizável: quem o usa controla `open`. Na landing
 * aprovada, o objeto WhatsApp do hero deve só chamar `onOpenChange(true)`.
 * O estado (conversas, vendas, tarefas) vive no provider e sobrevive a fechar e reabrir;
 * "Reiniciar" volta aos dados iniciais.
 */
export function AtendimentoDemo({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DemoProvider>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="sd-overlay" />
          <Dialog.Content className={`sd sd-dialog ${demoFontVars}`} aria-describedby={undefined}>
            <DemoShell />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </DemoProvider>
  );
}

function DemoShell() {
  const [tab, setTab] = useState<TabId>("atendimento");

  return (
    <Tabs.Root value={tab} onValueChange={(v) => setTab(v as TabId)} className="flex h-full min-h-0 flex-col">
      <Header />

      <Tabs.List
        aria-label="Áreas da demonstração"
        className="order-last grid shrink-0 grid-cols-4 border-t border-(--sd-line) bg-(--sd-paper) pb-[env(safe-area-inset-bottom)] md:order-none md:flex md:gap-7 md:border-t-0 md:border-b md:bg-(--sd-bone) md:px-6"
      >
        {TABS.map(({ id, label, short, Icon }) => (
          <Tabs.Trigger key={id} value={id} className="sd-tab">
            <Icon className="size-5 md:size-4" aria-hidden />
            <span className="md:hidden">{short}</span>
            <span className="max-md:hidden">{label}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <div className="min-h-0 flex-1">
        <Tabs.Content value="atendimento" className="h-full outline-none">
          <AtendimentoTab />
        </Tabs.Content>
        <Tabs.Content value="indicadores" className="h-full outline-none">
          <IndicadoresTab />
        </Tabs.Content>
        <Tabs.Content value="agenda" className="h-full outline-none">
          <AgendaTab />
        </Tabs.Content>
        <Tabs.Content value="analise" className="h-full outline-none">
          <AnaliseTab onOpenAgenda={() => setTab("agenda")} />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}

function Header() {
  const { state, profile, setProfileId, reset } = useDemo();
  const [confirmReset, setConfirmReset] = useState(false);
  const profileId = useId();

  // O pedido de confirmação expira sozinho, sem diálogo do navegador.
  useEffect(() => {
    if (!confirmReset) return;
    const t = setTimeout(() => setConfirmReset(false), 4000);
    return () => clearTimeout(t);
  }, [confirmReset]);

  return (
    <header className="shrink-0 border-b border-(--sd-line) bg-(--sd-bone) px-4 pt-3 pb-3 md:px-6 md:pt-4 md:pb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[13px] text-(--sd-muted)">
            <span className="text-[15px] font-bold tracking-tight text-(--sd-graphite)">
              scob<span className="ml-px inline-block size-[5px] bg-(--sd-cobalt) align-baseline" aria-hidden />
            </span>
            <span aria-hidden>·</span>
            <span className="truncate">{state.storeName}</span>
            <span className="sd-chip sd-chip-warn max-sm:hidden">Dados fictícios</span>
          </p>
          <Dialog.Title className="mt-1 text-[1.5rem] leading-tight md:text-[1.85rem]">
            Atendimento <span className="sd-accent text-(--sd-cobalt)">&amp;</span> Vendas
          </Dialog.Title>
        </div>
        <Dialog.Close className="sd-btn sd-btn-ghost size-11 shrink-0 p-0" aria-label="Fechar demonstração">
          <X className="size-5" aria-hidden />
        </Dialog.Close>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-2">
          <label htmlFor={profileId} className="shrink-0 text-[13px] font-semibold">
            Ver como
          </label>
          <select id={profileId} className="sd-field w-auto min-w-0 py-1.5" value={profile.id} onChange={(e) => setProfileId(e.target.value)}>
            {PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.role === "gestor" ? "Gestora" : "Vendedor(a)"}
              </option>
            ))}
          </select>
        </div>
        <p className="tabular text-[13px] text-(--sd-muted)">
          Relógio simulado: <span className="font-semibold text-(--sd-graphite)">{formatDateTime(state.clock)}</span>
        </p>
        <button
          type="button"
          className={`sd-btn sd-btn-sm ml-auto ${confirmReset ? "sd-btn-primary" : "sd-btn-ghost border border-(--sd-line)"}`}
          onClick={() => {
            if (confirmReset) {
              reset();
              setConfirmReset(false);
            } else setConfirmReset(true);
          }}
        >
          <RotateCcw className="size-4" aria-hidden />
          {confirmReset ? "Confirmar reinício" : "Reiniciar demo"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {confirmReset ? "Clique de novo para apagar as alterações e voltar aos dados iniciais." : ""}
      </p>
    </header>
  );
}
