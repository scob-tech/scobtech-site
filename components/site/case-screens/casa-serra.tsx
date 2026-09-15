import {
  BarChart3,
  CalendarRange,
  CheckCircle2,
  Clock3,
  CreditCard,
  Megaphone,
  PartyPopper,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { ActionButton, Avatar, Kpi, Panel, Pill, Shell, type Brand } from "./shell";

const ACCENT = "#e2725b";

const brand: Brand = { name: "Casa Serra", color: ACCENT, mark: "CS", url: "app.casaserra.com.br" };

const nav = [
  { icon: CalendarRange, label: "Mapa de reservas" },
  { icon: PartyPopper, label: "Eventos" },
  { icon: Users, label: "Clientes" },
  { icon: Megaphone, label: "Campanhas", badge: "2" },
  { icon: CreditCard, label: "Financeiro" },
  { icon: BarChart3, label: "Relatórios" },
  { icon: Settings, label: "Configurações" },
];

const hours = ["18h", "19h", "20h", "21h", "22h", "23h", "00h"];

const status = {
  confirmada: ACCENT,
  checkin: "#34d399",
  pendente: "#a78bfa",
} as const;

const rows: { unit: string; type: string; bookings: [number, number, string, keyof typeof status][] }[] = [
  { unit: "Salão · Mesa 01", type: "4 lugares", bookings: [[0, 2, "Fernanda · 4p", "checkin"], [2.5, 5, "Paulo · 3p", "confirmada"]] },
  { unit: "Salão · Mesa 02", type: "2 lugares", bookings: [[1, 3, "Luiza · 2p", "confirmada"], [4, 6, "Camila · 2p", "confirmada"]] },
  { unit: "Varanda · Mesa 07", type: "6 lugares", bookings: [[0, 2.5, "Família Rocha · 6p", "checkin"], [3, 5.5, "Beatriz · 5p", "pendente"]] },
  { unit: "Varanda · Mesa 08", type: "4 lugares", bookings: [[1.5, 4, "Thiago · 4p", "confirmada"]] },
  { unit: "Adega", type: "Até 10 pessoas", bookings: [[0, 1.5, "Marcos · 8p", "checkin"], [2, 4.5, "Degustação · 10p", "confirmada"]] },
  { unit: "Salão privativo", type: "Até 40 pessoas", bookings: [[1, 7, "Aniversário Martins · 32p", "confirmada"]] },
  { unit: "Deck externo", type: "Eventos · até 80", bookings: [[0, 4, "Happy hour Nexo · 60p", "checkin"], [4.5, 7, "Grupo Vale · 20p", "pendente"]] },
];

export function CasaSerraMapa() {
  return (
    <Shell
      brand={brand}
      nav={nav}
      active={0}
      subtitle="Sábado, 26 de setembro · jantar"
      title="Mapa de reservas"
      actions={
        <>
          <ActionButton>Hoje</ActionButton>
          <ActionButton primary>
            <Plus className="size-3" /> Nova reserva
          </ActionButton>
        </>
      }
    >
      <div className="mb-3 flex gap-4 text-[11px] text-white/50">
        {(
          [
            ["Cliente chegou", status.checkin],
            ["Confirmada", status.confirmada],
            ["Aguardando sinal", status.pendente],
          ] as const
        ).map(([l, c]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: c }} /> {l}
          </span>
        ))}
        <span className="ml-auto">
          Ocupação do jantar <b className="text-white">84%</b>
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/[0.07]">
        <div className="grid grid-cols-[150px_repeat(7,1fr)] border-b border-white/[0.07] bg-white/[0.02] text-[11px]">
          <div className="px-3 py-2 text-white/40">Mesa / ambiente</div>
          {hours.map((d, i) => (
            <div
              key={d}
              className={`border-l border-white/[0.05] py-2 text-center ${i === 2 ? "text-[var(--c)]" : "text-white/55"}`}
            >
              {d}
            </div>
          ))}
        </div>
        {rows.map((r) => (
          <div
            key={r.unit}
            className="relative grid h-[52px] grid-cols-[150px_repeat(7,1fr)] border-b border-white/[0.05] last:border-b-0"
          >
            <div className="flex flex-col justify-center px-3">
              <span className="text-white/90">{r.unit}</span>
              <span className="text-[10px] text-white/35">{r.type}</span>
            </div>
            {hours.map((d) => (
              <div key={d} className="border-l border-white/[0.04]" />
            ))}
            <div className="pointer-events-none absolute inset-y-0 right-0 left-[150px]">
              {r.bookings.map(([start, end, guest, s]) => (
                <div
                  key={guest}
                  className="absolute top-2 bottom-2 flex items-center gap-1.5 overflow-hidden rounded-md border-l-2 px-2 text-[10.5px] whitespace-nowrap text-white"
                  style={{
                    left: `calc(${(start / 7) * 100}% + 3px)`,
                    width: `calc(${((end - start) / 7) * 100}% - 6px)`,
                    background: `color-mix(in srgb, ${status[s]} 18%, #121215)`,
                    borderColor: status[s],
                  }}
                >
                  {guest}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function CasaSerraEvento() {
  return (
    <Shell brand={brand} nav={nav} active={1} subtitle="Evento #0381" title="Aniversário · Ricardo Martins"
      actions={<><ActionButton>Editar</ActionButton><ActionButton primary><CheckCircle2 className="size-3" /> Confirmar evento</ActionButton></>}
    >
      <div className="grid h-full grid-cols-[1fr_330px] gap-3">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <Kpi label="Data" value="26/09" delta="Sábado · 20h" tone="neutral" />
            <Kpi label="Convidados" value="32" delta="Salão privativo" tone="neutral" />
            <Kpi label="Valor total" value="R$ 6,4k" delta="Sinal pago" />
          </div>
          <Panel title="Detalhes do evento">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11.5px]">
              {[
                ["Espaço", "Salão privativo"],
                ["Cardápio", "Menu degustação"],
                ["Origem", "Campanha WhatsApp"],
                ["Pagamento", "Pix · sinal R$ 1.920"],
                ["Pedido especial", "Bolo e decoração"],
                ["Restante", "R$ 4.480 no dia"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10.5px] text-white/40">{k}</div>
                  <div className="mt-0.5 text-white/90">{v}</div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Linha do tempo">
            {[
              ["Veio da campanha de eventos", "10/09 · 18:12", "#a78bfa"],
              ["Sinal recebido via Pix e conciliado", "10/09 · 19:05", "#34d399"],
              ["Confirmação enviada automaticamente", "10/09 · 19:05", ACCENT],
            ].map(([t, d, c]) => (
              <div key={t} className="flex items-center gap-3 py-1.5">
                <span className="size-2 rounded-full" style={{ background: c }} />
                <span className="text-white/85">{t}</span>
                <span className="ml-auto text-[10.5px] text-white/35">{d}</span>
              </div>
            ))}
          </Panel>
        </div>
        <Panel title="WhatsApp" right={<Pill color="#34d399">Conectado</Pill>} className="h-full">
          <div className="flex flex-1 flex-col gap-2 text-[11.5px]">
            <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-white/[0.06] px-3 py-2">
              Vi a mensagem sobre eventos! Quero fazer o aniversário da minha esposa dia 26, umas 30 pessoas 🎉
            </div>
            <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm px-3 py-2 text-black" style={{ background: ACCENT }}>
              Que ótimo, Ricardo! Salão privativo com menu degustação para 32 pessoas: R$ 6.400. Segue o Pix do sinal.
            </div>
            <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-white/[0.06] px-3 py-2">Pago! ✅</div>
            <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm px-3 py-2 text-black" style={{ background: ACCENT }}>
              Evento confirmado 🙌 Deixamos tudo preparado para a comemoração.
            </div>
            <div className="mt-auto flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-white/35">
              <Clock3 className="size-3" /> Mensagens automáticas ativas
            </div>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

const weeks = [62, 71, 68, 80, 77, 88, 84, 92];

export function CasaSerraOcupacao() {
  return (
    <Shell brand={brand} nav={nav} active={4} subtitle="Setembro" title="Ocupação e receita"
      actions={<><ActionButton>Últimos 60 dias</ActionButton><ActionButton>Exportar</ActionButton></>}
    >
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-4 gap-3">
          <Kpi label="Ocupação média" value="84%" delta="+9 p.p. vs. agosto" />
          <Kpi label="Ticket médio" value="R$ 142" delta="+R$ 11" />
          <Kpi label="Receita do mês" value="R$ 186,4 mil" delta="+14,8%" />
          <Kpi label="No-show" value="2,1%" delta="-1,4 p.p." />
        </div>
        <div className="grid flex-1 grid-cols-[1fr_280px] gap-3">
          <Panel title="Ocupação por semana" right={<Pill color={ACCENT}>Meta 80%</Pill>}>
            <div className="relative flex flex-1 items-end gap-4 px-2 pt-4">
              <div
                className="absolute inset-x-2 border-t border-dashed"
                style={{ bottom: "80%", borderColor: `color-mix(in srgb, ${ACCENT} 40%, transparent)` }}
              />
              {weeks.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] text-white/50">{v}%</span>
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${v * 2.3}px`,
                      background: i === weeks.length - 1 ? ACCENT : `color-mix(in srgb, ${ACCENT} 30%, #1a1a1d)`,
                    }}
                  />
                  <span className="text-[10px] text-white/35">S{i + 29}</span>
                </div>
              ))}
            </div>
          </Panel>
          <div className="flex flex-col gap-3">
            <Panel title="Origem das reservas">
              {[
                ["Campanhas WhatsApp", 52, "#34d399"],
                ["Site próprio", 28, ACCENT],
                ["Apps de reserva", 20, "#a78bfa"],
              ].map(([l, v, c]) => (
                <div key={l as string} className="mb-2.5 last:mb-0">
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-white/75">{l}</span>
                    <span className="text-white/50">{v}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full" style={{ width: `${v}%`, background: c as string }} />
                  </div>
                </div>
              ))}
            </Panel>
            <Panel title="Próximos eventos" className="flex-1">
              {[["Ricardo Martins", "Sáb · Salão privativo · 32p", 30], ["Empresa Nexo", "Qui · Deck externo · 60p", 200], ["Renata Dias", "Dom · Adega · 10p", 320]].map(([n, d, h]) => (
                <div key={n as string} className="flex items-center gap-2 py-1.5">
                  <Avatar name={n as string} hue={h as number} />
                  <div className="leading-tight">
                    <div className="text-[11px] text-white/85">{n}</div>
                    <div className="text-[10px] text-white/35">{d}</div>
                  </div>
                </div>
              ))}
            </Panel>
          </div>
        </div>
      </div>
    </Shell>
  );
}
