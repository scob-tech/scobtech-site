"use client";

import { useId, useState, type FormEvent } from "react";
import { Bot, Check, Circle, CirclePlay, Plus, RotateCcw, ShieldCheck, User } from "lucide-react";
import { at } from "@/lib/demo-atendimento/data";
import { customerOf, sellerName, tasksFor, visibleConversations, type TaskFilter } from "@/lib/demo-atendimento/engine";
import { formatDateTime } from "@/lib/demo-atendimento/format";
import type { Task, TaskOrigin, TaskPriority, TaskStatus } from "@/lib/demo-atendimento/types";
import { useDemo } from "./demo-store";

const FILTERS: { id: TaskFilter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "pendente", label: "Pendentes" },
  { id: "em_andamento", label: "Em andamento" },
  { id: "concluida", label: "Concluídas" },
];

const STATUS: Record<TaskStatus, { label: string; cls: string }> = {
  pendente: { label: "Pendente", cls: "sd-chip-warn" },
  em_andamento: { label: "Em andamento", cls: "sd-chip-cobalt" },
  concluida: { label: "Concluída", cls: "sd-chip-ok" },
};

const ORIGIN: Record<TaskOrigin, { label: string; Icon: typeof Bot }> = {
  gestor: { label: "Criada pelo gestor", Icon: ShieldCheck },
  vendedor: { label: "Criada pelo vendedor", Icon: User },
  ia: { label: "Sugerida pela análise", Icon: Bot },
};

const PRIORITY: Record<TaskPriority, string> = { alta: "Prioridade alta", media: "Prioridade média", baixa: "Prioridade baixa" };

export function AgendaTab() {
  const { state, profile } = useDemo();
  const [filter, setFilter] = useState<TaskFilter>("todas");
  const [seller, setSeller] = useState<string>("");
  const [formOpen, setFormOpen] = useState(false);
  const isGestor = profile.role === "gestor";
  const tasks = tasksFor(state, profile, filter, isGestor ? seller || undefined : undefined);
  const sellerSelectId = useId();

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-(--sd-paper)">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-[1.75rem]">{isGestor ? "Agenda da equipe" : "Minha agenda"}</h2>
            <p className="mt-1 text-sm text-(--sd-muted)">
              {isGestor ? "Tarefas de todos os vendedores. Você pode criar e atribuir responsáveis." : `Tarefas de ${profile.name}.`}
            </p>
          </div>
          <button type="button" className="sd-btn sd-btn-primary" aria-expanded={formOpen} onClick={() => setFormOpen((v) => !v)}>
            <Plus className="size-4" aria-hidden />
            Nova tarefa
          </button>
        </div>

        {formOpen && <TaskForm onDone={() => setFormOpen(false)} />}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Filtrar por status" className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`sd-btn sd-btn-sm ${filter === f.id ? "sd-btn-primary" : "sd-btn-ghost border border-(--sd-line)"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {isGestor && (
            <div className="flex items-center gap-2">
              <label htmlFor={sellerSelectId} className="text-sm text-(--sd-muted)">
                Vendedor
              </label>
              <select id={sellerSelectId} className="sd-field w-auto py-1.5" value={seller} onChange={(e) => setSeller(e.target.value)}>
                <option value="">Toda a equipe</option>
                {state.sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {tasks.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-(--sd-line-strong) p-6 text-center text-sm text-(--sd-muted)">
            Nenhuma tarefa com esse filtro.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-(--sd-line) overflow-hidden rounded-2xl border border-(--sd-line) bg-white">
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const { state, profile, dispatch } = useDemo();
  const isGestor = profile.role === "gestor";
  const done = task.status === "concluida";
  const conv = task.convId ? state.conversations.find((c) => c.id === task.convId) : undefined;
  const customer = conv ? customerOf(state, conv) : undefined;
  const origin = ORIGIN[task.origin];
  const status = STATUS[task.status];
  const assignId = useId();
  const setStatus = (s: TaskStatus) => dispatch({ type: "setTaskStatus", profile, taskId: task.id, status: s });

  return (
    <li className="sd-enter flex gap-3 p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setStatus(done ? "pendente" : "concluida")}
        aria-label={done ? `Reabrir tarefa: ${task.title}` : `Concluir tarefa: ${task.title}`}
        className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          done ? "border-(--sd-ok) bg-(--sd-ok) text-white" : "border-(--sd-line-strong) text-transparent hover:border-(--sd-cobalt) hover:text-(--sd-cobalt)"
        }`}
      >
        <Check className="size-4" aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <p className={`font-semibold ${done ? "text-(--sd-muted) line-through decoration-(--sd-stone)" : ""}`}>{task.title}</p>
        {task.description && <p className="mt-1 max-w-[70ch] text-sm leading-relaxed text-(--sd-muted)">{task.description}</p>}

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className={`sd-chip ${status.cls}`}>{status.label}</span>
          <span className={`sd-chip ${task.origin === "ia" ? "sd-chip-cobalt" : "sd-chip-neutral"}`}>
            <origin.Icon className="size-3.5" aria-hidden />
            {origin.label}
          </span>
          <span className={`sd-chip ${task.priority === "alta" ? "sd-chip-warn" : "sd-chip-neutral"}`}>{PRIORITY[task.priority]}</span>
          <span className="tabular text-xs text-(--sd-muted)">{formatDateTime(task.dueAt)}</span>
          {customer && <span className="text-xs text-(--sd-muted)">· Cliente: {customer.name}</span>}
          {isGestor && <span className="text-xs text-(--sd-muted)">· {sellerName(state, task.sellerId)}</span>}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {task.status === "pendente" && (
            <button type="button" className="sd-btn sd-btn-outline sd-btn-sm" onClick={() => setStatus("em_andamento")}>
              <CirclePlay className="size-4" aria-hidden />
              Iniciar
            </button>
          )}
          {task.status === "em_andamento" && (
            <button type="button" className="sd-btn sd-btn-ghost sd-btn-sm border border-(--sd-line)" onClick={() => setStatus("pendente")}>
              <Circle className="size-4" aria-hidden />
              Voltar para pendente
            </button>
          )}
          {done && (
            <button type="button" className="sd-btn sd-btn-ghost sd-btn-sm" onClick={() => setStatus("pendente")}>
              <RotateCcw className="size-4" aria-hidden />
              Reabrir
            </button>
          )}
          {isGestor && (
            <span className="flex items-center gap-2">
              <label htmlFor={assignId} className="text-xs text-(--sd-muted)">
                Responsável
              </label>
              <select
                id={assignId}
                className="sd-field w-auto py-1 text-sm"
                value={task.sellerId}
                onChange={(e) => dispatch({ type: "assignTask", profile, taskId: task.id, sellerId: e.target.value })}
              >
                {state.sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function TaskForm({ onDone }: { onDone: () => void }) {
  const { state, profile, dispatch } = useDemo();
  const isGestor = profile.role === "gestor";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sellerId, setSellerId] = useState(state.sellers[0].id);
  const [convId, setConvId] = useState("");
  const [day, setDay] = useState<"0" | "1">("1");
  const [time, setTime] = useState("09:00");
  const [priority, setPriority] = useState<TaskPriority>("media");
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const convs = visibleConversations(state, profile).filter((c) => c.ownerId !== null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Dê um título para a tarefa.");
      return;
    }
    const [h, m] = time.split(":").map(Number);
    dispatch({
      type: "createTask",
      profile,
      input: {
        title,
        description,
        sellerId: isGestor ? sellerId : undefined,
        convId: convId || undefined,
        dueAt: at(h || 9, m || 0, Number(day)),
        priority,
      },
    });
    onDone();
  }

  return (
    <form onSubmit={submit} noValidate className="sd-enter mt-5 rounded-2xl border border-(--sd-line) bg-white p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="sd-label" htmlFor={`${id}-t`}>
            Título
          </label>
          <input
            id={`${id}-t`}
            className="sd-field"
            value={title}
            maxLength={140}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            placeholder="Ex.: Retornar orçamento de porcelanato"
            autoFocus
          />
          {error && (
            <p id={`${id}-err`} className="mt-1.5 text-xs font-semibold text-(--sd-warn)">
              {error}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="sd-label" htmlFor={`${id}-d`}>
            Descrição
          </label>
          <textarea id={`${id}-d`} className="sd-field" rows={2} maxLength={600} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {isGestor ? (
          <div>
            <label className="sd-label" htmlFor={`${id}-s`}>
              Responsável
            </label>
            <select id={`${id}-s`} className="sd-field" value={sellerId} onChange={(e) => setSellerId(e.target.value)}>
              {state.sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <span className="sd-label">Responsável</span>
            <p className="flex min-h-10 items-center text-sm">{profile.name} (você)</p>
          </div>
        )}
        <div>
          <label className="sd-label" htmlFor={`${id}-c`}>
            Conversa vinculada
          </label>
          <select id={`${id}-c`} className="sd-field" value={convId} onChange={(e) => setConvId(e.target.value)}>
            <option value="">Nenhuma</option>
            {convs.map((c) => (
              <option key={c.id} value={c.id}>
                {customerOf(state, c)?.name} · {c.topic}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="sd-label" htmlFor={`${id}-day`}>
              Dia
            </label>
            <select id={`${id}-day`} className="sd-field" value={day} onChange={(e) => setDay(e.target.value as "0" | "1")}>
              <option value="0">Hoje</option>
              <option value="1">Amanhã</option>
            </select>
          </div>
          <div>
            <label className="sd-label" htmlFor={`${id}-h`}>
              Horário
            </label>
            <input id={`${id}-h`} type="time" className="sd-field tabular" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="sd-label" htmlFor={`${id}-p`}>
            Prioridade
          </label>
          <select id={`${id}-p`} className="sd-field" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="submit" className="sd-btn sd-btn-primary">
          Criar tarefa
        </button>
        <button type="button" className="sd-btn sd-btn-ghost" onClick={onDone}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
