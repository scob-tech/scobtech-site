"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Inbox, MessageSquarePlus, ReceiptText, Send, UserPlus } from "lucide-react";
import {
  customerOf,
  lastActivity,
  messagesOf,
  parseBRL,
  saleOf,
  sellerName,
  sharedQueue,
  visibleConversations,
} from "@/lib/demo-atendimento/engine";
import { formatBRL, formatDateTime, formatTime, initials } from "@/lib/demo-atendimento/format";
import type { Conversation, ConversationStatus, DemoState } from "@/lib/demo-atendimento/types";
import { useDemo } from "./demo-store";

const STATUS: Record<ConversationStatus, { label: string; cls: string }> = {
  aguardando: { label: "Na fila", cls: "sd-chip-warn" },
  em_atendimento: { label: "Em atendimento", cls: "sd-chip-cobalt" },
  finalizada: { label: "Finalizada", cls: "sd-chip-neutral" },
};

/** Falas genéricas para simular o cliente respondendo (não dependem da conversa). */
const CUSTOMER_LINES = [
  "Consegue me mandar uma foto do produto?",
  "Qual o prazo de entrega?",
  "Aceita cartão em 3x?",
  "Tem em estoque para retirar hoje?",
];

export function AtendimentoTab() {
  const { state, profile } = useDemo();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = visibleConversations(state, profile);
  const selected = visible.find((c) => c.id === selectedId) ?? null;

  // Trocar de perfil pode esconder a conversa aberta (ex.: lead assumido por outro vendedor).
  useEffect(() => {
    if (selectedId && !visible.some((c) => c.id === selectedId)) setSelectedId(null);
  }, [selectedId, visible]);

  return (
    <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
      <div className={`min-h-0 border-r border-(--sd-line) ${selected ? "max-md:hidden" : ""}`}>
        <ConversationList state={state} visible={visible} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <div className={`min-h-0 ${selected ? "" : "max-md:hidden"}`}>
        {selected ? (
          <ConversationView key={selected.id} conv={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}

/* ---------- Lista ---------- */

function ConversationList({
  state,
  visible,
  selectedId,
  onSelect,
}: {
  state: DemoState;
  visible: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { profile, dispatch } = useDemo();
  const queue = sharedQueue(state);
  const own = visible
    .filter((c) => c.ownerId !== null)
    .sort((a, b) => Number(a.status === "finalizada") - Number(b.status === "finalizada") || lastActivity(state, b.id) - lastActivity(state, a.id));

  return (
    <div className="flex h-full min-h-0 flex-col bg-(--sd-bone)">
      <div className="flex items-center justify-between gap-3 border-b border-(--sd-line) px-4 py-3">
        <p className="text-[13px] text-(--sd-muted)">
          WhatsApp da loja · <span className="font-semibold text-(--sd-graphite)">um único número</span>
        </p>
        <button
          type="button"
          className="sd-btn sd-btn-outline sd-btn-sm"
          disabled={state.leadPool.length === 0}
          onClick={() => dispatch({ type: "newLead" })}
          title={state.leadPool.length === 0 ? "Todos os leads de exemplo já chegaram" : undefined}
        >
          <MessageSquarePlus className="size-4" aria-hidden />
          Simular lead
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
        <ListSection
          title="Fila compartilhada"
          hint={profile.role === "gestor" ? "Visível para toda a equipe" : "Sem responsável. Qualquer vendedor pode assumir."}
          count={queue.length}
        >
          {queue.length === 0 ? (
            <p className="px-4 py-3 text-sm text-(--sd-muted)">Nenhum lead aguardando.</p>
          ) : (
            queue.map((c) => <ConversationRow key={c.id} state={state} conv={c} active={c.id === selectedId} onSelect={onSelect} />)
          )}
        </ListSection>

        <ListSection
          title={profile.role === "gestor" ? "Conversas da equipe" : "Minhas conversas"}
          hint={profile.role === "gestor" ? "O gestor vê todas as conversas." : "Só você vê as conversas que assumiu."}
          count={own.length}
        >
          {own.length === 0 ? (
            <p className="px-4 py-3 text-sm text-(--sd-muted)">Assuma um lead da fila para começar.</p>
          ) : (
            own.map((c) => <ConversationRow key={c.id} state={state} conv={c} active={c.id === selectedId} onSelect={onSelect} />)
          )}
        </ListSection>
      </div>
    </div>
  );
}

function ListSection({ title, hint, count, children }: { title: string; hint: string; count: number; children: React.ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="pt-4">
      <div className="px-4 pb-2">
        <h3 id={id} className="sd-ui-heading flex items-center gap-2 text-sm font-bold">
          {title}
          <span className="sd-chip sd-chip-neutral tabular">{count}</span>
        </h3>
        <p className="mt-0.5 text-xs text-(--sd-muted)">{hint}</p>
      </div>
      <ul className="px-2">{children}</ul>
    </section>
  );
}

function ConversationRow({
  state,
  conv,
  active,
  onSelect,
}: {
  state: DemoState;
  conv: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const { profile } = useDemo();
  const customer = customerOf(state, conv);
  const msgs = messagesOf(state, conv.id).filter((m) => m.author !== "sistema");
  const last = msgs[msgs.length - 1];
  const sale = saleOf(state, conv.id);
  const status = STATUS[conv.status];

  return (
    <li className="sd-enter">
      <button
        type="button"
        onClick={() => onSelect(conv.id)}
        aria-current={active ? "true" : undefined}
        className="sd-row-btn flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left"
      >
        <span
          aria-hidden
          className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
            conv.status === "aguardando" ? "bg-(--sd-warn-wash) text-(--sd-warn)" : "bg-(--sd-graphite) text-white"
          }`}
        >
          {initials(customer?.name ?? "?")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate text-[0.9375rem] font-semibold">{customer?.name}</span>
            <span className="tabular shrink-0 text-xs text-(--sd-muted)">{last ? formatTime(last.at) : ""}</span>
          </span>
          <span className="block truncate text-[13px] text-(--sd-muted)">
            {last?.author === "vendedor"
              ? last.sellerId === profile.sellerId
                ? "Você: "
                : `${sellerName(state, last.sellerId).split(" ")[0]}: `
              : ""}
            {last?.text}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className={`sd-chip ${status.cls}`}>{status.label}</span>
            {profile.role === "gestor" && conv.ownerId && <span className="sd-chip sd-chip-neutral">{sellerName(state, conv.ownerId)}</span>}
            {sale && <span className="sd-chip sd-chip-ok">Venda {formatBRL(sale.amount)}</span>}
          </span>
        </span>
      </button>
    </li>
  );
}

function EmptyChat() {
  return (
    <div className="grid h-full place-items-center bg-(--sd-paper) p-8 text-center">
      <div className="max-w-sm">
        <Inbox className="mx-auto size-8 text-(--sd-stone)" aria-hidden />
        <p className="mt-3 font-semibold">Selecione uma conversa</p>
        <p className="mt-1 text-sm text-(--sd-muted)">
          Troque o perfil no topo para ver a mesma loja pelos olhos do gestor ou de cada vendedor.
        </p>
      </div>
    </div>
  );
}

/* ---------- Conversa ---------- */

function ConversationView({ conv, onBack }: { conv: Conversation; onBack: () => void }) {
  const { state, profile, dispatch } = useDemo();
  const customer = customerOf(state, conv);
  const messages = messagesOf(state, conv.id);
  const sale = saleOf(state, conv.id);
  const isOwner = profile.role === "vendedor" && conv.ownerId === profile.sellerId;
  const canAct = conv.ownerId !== null && (isOwner || profile.role === "gestor");
  const status = STATUS[conv.status];
  const [saleOpen, setSaleOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const customerTurns = messages.filter((m) => m.author === "cliente").length;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-(--sd-paper)">
      {/* cabeçalho */}
      <div className="border-b border-(--sd-line) px-3 py-3 sm:px-5">
        <div className="flex items-start gap-2">
          <button type="button" onClick={onBack} className="sd-btn sd-btn-ghost sd-btn-sm -ml-1 px-2 md:hidden" aria-label="Voltar para a lista">
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <h3 className="sd-ui-heading truncate text-base font-bold">{customer?.name}</h3>
            <p className="truncate text-[13px] text-(--sd-muted)">
              {customer?.phone} · {conv.topic}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className={`sd-chip ${status.cls}`}>{status.label}</span>
              <span className="sd-chip sd-chip-neutral">Responsável: {sellerName(state, conv.ownerId)}</span>
              {sale && (
                <span className="sd-chip sd-chip-ok">
                  <CheckCircle2 className="size-3.5" aria-hidden />
                  Venda registrada · {formatBRL(sale.amount)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {conv.status === "aguardando" && profile.role === "vendedor" && (
            <button type="button" className="sd-btn sd-btn-primary sd-btn-sm" onClick={() => dispatch({ type: "claim", convId: conv.id, profile })}>
              <UserPlus className="size-4" aria-hidden />
              Assumir atendimento
            </button>
          )}
          {canAct && !sale && (
            <button
              type="button"
              className="sd-btn sd-btn-primary sd-btn-sm"
              aria-expanded={saleOpen}
              onClick={() => setSaleOpen((v) => !v)}
            >
              <ReceiptText className="size-4" aria-hidden />
              Registrar venda
            </button>
          )}
          {canAct && conv.status === "em_atendimento" && (
            <button type="button" className="sd-btn sd-btn-outline sd-btn-sm" onClick={() => dispatch({ type: "finalize", convId: conv.id, profile })}>
              Finalizar conversa
            </button>
          )}
          {conv.status !== "finalizada" && (
            <button
              type="button"
              className="sd-btn sd-btn-ghost sd-btn-sm"
              onClick={() => dispatch({ type: "customerMessage", convId: conv.id, text: CUSTOMER_LINES[customerTurns % CUSTOMER_LINES.length] })}
            >
              Simular mensagem do cliente
            </button>
          )}
        </div>

        {saleOpen && !sale && canAct && <SaleForm conv={conv} onDone={() => setSaleOpen(false)} />}
        {sale && (
          <p className="mt-2 text-xs text-(--sd-muted)">
            Registrada em {formatDateTime(sale.at)} para {sellerName(state, sale.sellerId)}, vinculada a {customer?.name}.
          </p>
        )}
      </div>

      {/* mensagens */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5" aria-live="polite" aria-label="Mensagens">
        <ol className="flex flex-col gap-2.5">
          {messages.map((m) =>
            m.author === "sistema" ? (
              <li key={m.id} className="my-1 text-center text-xs text-(--sd-muted)">
                {m.kind === "claim" ? `${sellerName(state, m.sellerId)} ${m.text}` : m.text} · {formatTime(m.at)}
              </li>
            ) : (
              <li key={m.id} className={`flex ${m.author === "vendedor" ? "justify-end" : "justify-start"}`}>
                <div className={`sd-bubble ${m.author === "vendedor" ? "sd-bubble-out" : "sd-bubble-in"}`}>
                  {m.author === "vendedor" && (
                    <span className="mb-0.5 block text-xs font-semibold text-(--sd-cobalt-ink)">{sellerName(state, m.sellerId)}</span>
                  )}
                  <p>{m.text}</p>
                  <span className="tabular mt-1 block text-right text-[11px] text-(--sd-muted)">{formatTime(m.at)}</span>
                </div>
              </li>
            ),
          )}
        </ol>
      </div>

      <Composer conv={conv} isOwner={isOwner} />
    </div>
  );
}

function SaleForm({ conv, onDone }: { conv: Conversation; onDone: () => void }) {
  const { state, profile, dispatch } = useDemo();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const submitted = useRef(false);
  const inputId = useId();
  const errId = useId();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (submitted.current) return; // trava contra duplo envio (o motor também impede duplicidade)
    const cents = parseBRL(value);
    if (cents === null) {
      setError("Informe um valor válido, por exemplo 1.250,90.");
      return;
    }
    submitted.current = true;
    dispatch({ type: "registerSale", convId: conv.id, profile, amount: cents });
    onDone();
  }

  return (
    <form onSubmit={submit} className="sd-enter mt-3 rounded-xl border border-(--sd-line) bg-white p-3" noValidate>
      <label htmlFor={inputId} className="sd-label">
        Valor da venda
      </label>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-0 flex-1 basis-40">
          <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-(--sd-muted)">
            R$
          </span>
          <input
            id={inputId}
            className="sd-field tabular pl-9"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            autoFocus
          />
        </div>
        <button type="submit" className="sd-btn sd-btn-primary">
          Confirmar venda
        </button>
        <button type="button" className="sd-btn sd-btn-ghost" onClick={onDone}>
          Cancelar
        </button>
      </div>
      {error ? (
        <p id={errId} className="mt-2 text-xs font-semibold text-(--sd-warn)">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-(--sd-muted)">
          Vendedor: <strong className="text-(--sd-graphite)">{sellerName(state, conv.ownerId)}</strong> (responsável pela conversa). Data e
          horário são registrados automaticamente.
        </p>
      )}
    </form>
  );
}

function Composer({ conv, isOwner }: { conv: Conversation; isOwner: boolean }) {
  const { profile, dispatch } = useDemo();
  const [text, setText] = useState("");
  const inputId = useId();

  const notice = useMemo(() => {
    if (conv.status === "finalizada") return "Conversa finalizada.";
    if (conv.status === "aguardando")
      return profile.role === "vendedor" ? "Assuma o atendimento para responder." : "Aguardando um vendedor assumir o lead.";
    if (!isOwner) return profile.role === "gestor" ? "Modo supervisão: o gestor acompanha, quem responde é o vendedor responsável." : null;
    return null;
  }, [conv.status, isOwner, profile.role]);

  if (notice) {
    return <p className="border-t border-(--sd-line) bg-(--sd-bone) px-5 py-3 text-center text-[13px] text-(--sd-muted)">{notice}</p>;
  }

  function send(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: "reply", convId: conv.id, profile, text });
    setText("");
  }

  return (
    <form onSubmit={send} className="flex items-end gap-2 border-t border-(--sd-line) bg-(--sd-bone) px-3 py-3 sm:px-5">
      <label htmlFor={inputId} className="sr-only">
        Responder ao cliente
      </label>
      <textarea
        id={inputId}
        rows={1}
        className="sd-field max-h-32 min-h-11 flex-1 resize-none"
        placeholder="Escreva uma resposta (simulada)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />
      <button type="submit" className="sd-btn sd-btn-primary h-11 w-11 shrink-0 p-0" aria-label="Enviar resposta" disabled={!text.trim()}>
        <Send className="size-4" aria-hidden />
      </button>
    </form>
  );
}
