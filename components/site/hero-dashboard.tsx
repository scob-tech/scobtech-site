"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  CalendarDays,
  Home,
  LayoutGrid,
  MessageCircle,
  Search,
  Settings,
  Users,
} from "lucide-react";

// Eficiência operacional (%) nos últimos 7 dias
const points = [71, 74, 72, 78, 81, 83, 88];
const MAX = 100;
const MIN = 60;

function smoothPath(values: number[], w: number, h: number) {
  const norm = (v: number) => ((v - MIN) / (MAX - MIN)) * h;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, h - norm(v)] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

const W = 400;
const H = 84;
const line = smoothPath(points, W, H);

const areas = [
  { stage: "Expedição", count: 18, items: [["Pedido #4821", "Separado"], ["Pedido #4822", "Em separação"]] },
  { stage: "Logística", count: 24, items: [["Rota Norte", "8 entregas"], ["Rota Centro", "6 entregas"]] },
  { stage: "Atendimento", count: 9, items: [["Reserva #0381", "Confirmada"]] },
];

/** Dashboard glassmorphism do hero. Tamanho base: 640 × 480. */
export function HeroDashboard() {
  return (
    <div className="glass relative flex h-[480px] w-[640px] bg-[#0b0c0d]/70 overflow-hidden rounded-[22px] text-[11px] text-white/80 shadow-[0_40px_120px_-30px_rgba(20,184,166,.35)]">
      {/* sidebar */}
      <aside className="flex w-[52px] flex-col items-center gap-3 border-r border-white/[0.07] bg-black/20 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="" className="mb-2 size-7 rounded-full" />
        {[Home, LayoutGrid, Users, MessageCircle, CalendarDays, BarChart3].map((Icon, i) => (
          <div
            key={i}
            className={
              i === 1
                ? "grid size-8 place-items-center rounded-lg bg-white/10 text-white"
                : "grid size-8 place-items-center rounded-lg text-white/40"
            }
          >
            <Icon className="size-[15px]" />
          </div>
        ))}
        <div className="mt-auto grid size-8 place-items-center text-white/40">
          <Settings className="size-[15px]" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar */}
        <div className="flex h-12 items-center gap-3 border-b border-white/[0.07] px-4">
          <span className="text-white/40">Operações</span>
          <span className="text-white/25">/</span>
          <span className="font-medium whitespace-nowrap text-white">Central de processos em tempo real</span>
          <div className="ml-auto flex h-7 w-40 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 text-white/35">
            <Search className="size-3" /> Buscar pedido…
          </div>
          <Bell className="size-3.5 text-white/40" />
          <div className="size-6 rounded-full bg-gradient-to-br from-teal-300 to-teal-700" />
        </div>

        <div className="grid flex-1 grid-cols-[1fr_170px] gap-3 p-4">
          <div className="flex min-w-0 flex-col gap-3">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                ["Pedidos do dia", "128", "+12%"],
                ["Entregas em andamento", "24", "6 rotas"],
                ["Tarefas concluídas", "86%", "+4 p.p."],
                ["Tempo médio de resposta", "12 min", "-3 min"],
              ].map(([label, value, delta]) => (
                <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
                  <div className="text-[10px] text-white/45">{label}</div>
                  <div className="mt-1 font-display text-[16px] font-semibold text-white">{value}</div>
                  <div className="mt-0.5 text-[10px] text-teal-300">{delta}</div>
                </div>
              ))}
            </div>

            {/* chart */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-white">Eficiência operacional</span>
                <div className="flex gap-1 text-[10px]">
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-white">Últimos 7 dias</span>
                </div>
              </div>
              <svg viewBox={`0 0 ${W} ${H + 4}`} className="h-[84px] w-full overflow-visible">
                <defs>
                  <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((t) => (
                  <line key={t} x1="0" x2={W} y1={H * t} y2={H * t} stroke="rgba(255,255,255,.05)" />
                ))}
                <motion.path
                  d={`${line} L ${W} ${H} L 0 ${H} Z`}
                  fill="url(#hero-area)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                />
                <motion.path
                  d={line}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.6, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.circle
                  cx={W}
                  cy={H - ((points[points.length - 1] - MIN) / (MAX - MIN)) * H}
                  r="3.5"
                  fill="#5eead4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.3 }}
                />
              </svg>
            </div>

            {/* áreas da operação */}
            <div className="grid grid-cols-3 gap-2.5">
              {areas.map((col) => (
                <div key={col.stage} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2">
                  <div className="mb-1.5 flex items-center justify-between text-[10px]">
                    <span className="text-white/60">{col.stage}</span>
                    <span className="rounded bg-white/10 px-1 text-white/70">{col.count}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {col.items.map(([name, value]) => (
                      <div key={name} className="rounded-lg border border-white/[0.06] bg-black/25 px-2 py-1.5">
                        <div className="truncate text-[10px] text-white/85">{name}</div>
                        <div className="text-[10px] text-teal-300/90">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* activity */}
          <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-white">Atividade</span>
              <span className="size-1.5 animate-pulse rounded-full bg-teal-400" />
            </div>
            {[
              ["Expedição", "Pedido #4821 separado para expedição", "agora"],
              ["Logística", "Motorista iniciou rota Norte", "3 min"],
              ["Atendimento", "Reserva corporativa confirmada", "9 min"],
              ["Financeiro", "Comprovante processado por IA", "14 min"],
              ["Estoque", "Estoque atualizado automaticamente", "22 min"],
            ].map(([who, what, when], i) => (
              <div key={who} className="flex gap-2 border-t border-white/[0.05] py-2 first:border-t-0">
                <div
                  className="size-5 shrink-0 rounded-full"
                  style={{ background: `hsl(${170 + i * 12} 45% ${38 - i * 3}%)` }}
                />
                <div className="min-w-0">
                  <div className="flex justify-between gap-1">
                    <span className="truncate text-[10px] font-medium text-white/90">{who}</span>
                    <span className="shrink-0 text-[9px] text-white/35">{when}</span>
                  </div>
                  <div className="text-[10px] leading-snug text-white/45">{what}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
