"use client";

import { Bot, CalendarCheck2, Eye, Lightbulb, MoonStar } from "lucide-react";
import { RULES, sellerName } from "@/lib/demo-atendimento/engine";
import { formatDateTime } from "@/lib/demo-atendimento/format";
import type { Finding, FindingKind } from "@/lib/demo-atendimento/types";
import { useDemo } from "./demo-store";

const GROUPS: { kind: FindingKind; title: string; empty: string }[] = [
  { kind: "gargalo", title: "Gargalos no atendimento", empty: "Nenhum lead esperou além do limite na fila." },
  { kind: "orcamento_atrasado", title: "Orçamentos sem retorno", empty: "Todos os orçamentos pedidos receberam valor dentro do prazo." },
  { kind: "complementar", title: "Oportunidades de produtos complementares", empty: "Nenhuma oportunidade encontrada." },
];

export function AnaliseTab({ onOpenAgenda }: { onOpenAgenda: () => void }) {
  const { state, dispatch } = useDemo();
  const run = state.analysis;

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-(--sd-paper)">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[60ch]">
            <h2 className="text-2xl sm:text-[1.75rem]">Análise noturna</h2>
            <p className="mt-1 text-sm leading-relaxed text-(--sd-muted)">
              Ao fim do dia, as conversas são revisadas em busca de atrasos e oportunidades, e as tarefas vão direto para a agenda de cada
              vendedor.{" "}
              <strong className="text-(--sd-graphite)">Nesta demonstração não há modelo de IA conectado:</strong> a análise segue regras fixas
              sobre as conversas fictícias.
            </p>
          </div>
          <button type="button" className="sd-btn sd-btn-primary" onClick={() => dispatch({ type: "runAnalysis" })}>
            <MoonStar className="size-4" aria-hidden />
            Simular análise noturna
          </button>
        </div>

        <details className="mt-5 rounded-2xl border border-(--sd-line) bg-(--sd-bone) p-4 text-sm">
          <summary className="cursor-pointer font-bold">Regras usadas nesta simulação</summary>
          <ul className="mt-3 max-w-[70ch] list-disc space-y-1.5 pl-5 leading-relaxed text-(--sd-muted)">
            <li>Gargalo: lead que esperou mais de {RULES.queueWaitMinutes} min na fila compartilhada sem responsável.</li>
            <li>
              Orçamento sem retorno: cliente pediu orçamento e, após {RULES.quoteDelayMinutes / 60} h, nenhuma mensagem da equipe trouxe um
              valor em reais.
            </li>
            <li>Oportunidade: cliente pediu um produto (porcelanato, tinta, cimento, tubos) e a conversa não menciona os complementos usuais.</li>
            <li>Uma mesma situação nunca gera duas tarefas, mesmo se a análise rodar de novo.</li>
          </ul>
        </details>

        {!run ? (
          <div className="mt-8 rounded-2xl border border-dashed border-(--sd-line-strong) p-8 text-center">
            <Bot className="mx-auto size-8 text-(--sd-stone)" aria-hidden />
            <p className="mt-3 font-semibold">A análise ainda não rodou hoje</p>
            <p className="mt-1 text-sm text-(--sd-muted)">Clique em “Simular análise noturna” para revisar as conversas do dia.</p>
          </div>
        ) : (
          <div aria-live="polite">
            <div className="sd-enter mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-(--sd-graphite) px-5 py-4 text-white">
              <p className="text-sm">
                <span className="font-semibold">
                  {run.findings.length} {run.findings.length === 1 ? "achado" : "achados"}
                </span>
                <span className="text-white/75"> · análise de {formatDateTime(run.ranAt)} · </span>
                <span className="font-semibold">
                  {run.createdTasks > 0
                    ? `${run.createdTasks} ${run.createdTasks === 1 ? "tarefa nova" : "tarefas novas"} na agenda`
                    : "nenhuma tarefa nova: as equivalentes já estão na agenda"}
                </span>
              </p>
              <button type="button" className="sd-btn sd-btn-sm bg-white text-(--sd-graphite) hover:bg-(--sd-bone)" onClick={onOpenAgenda}>
                <CalendarCheck2 className="size-4" aria-hidden />
                Ver na agenda
              </button>
            </div>

            {GROUPS.map((g) => {
              const items = run.findings.filter((f) => f.kind === g.kind);
              return (
                <section key={g.kind} aria-label={g.title} className="mt-8">
                  <h3 className="text-xl">{g.title}</h3>
                  {items.length === 0 ? (
                    <p className="mt-2 text-sm text-(--sd-muted)">{g.empty}</p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {items.map((f) => (
                        <FindingCard key={f.key} f={f} />
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FindingCard({ f }: { f: Finding }) {
  const { state } = useDemo();
  const task = f.taskId ? state.tasks.find((t) => t.id === f.taskId) : undefined;

  return (
    <li className="sd-enter overflow-hidden rounded-2xl border border-(--sd-line) bg-white">
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold text-(--sd-graphite)">
            <Eye className="size-3.5" aria-hidden />
            Observado nas conversas
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">{f.observed}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold text-(--sd-cobalt-ink)">
            <Lightbulb className="size-3.5" aria-hidden />
            Sugestão (a confirmar pelo vendedor)
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-(--sd-muted)">{f.suggestion}</p>
        </div>
      </div>
      {task && (
        <p className="border-t border-(--sd-line) bg-(--sd-bone) px-4 py-2.5 text-[13px] sm:px-5">
          <span className="font-semibold">Tarefa na agenda de {sellerName(state, task.sellerId)}:</span> {task.title} · {formatDateTime(task.dueAt)}
        </p>
      )}
    </li>
  );
}
