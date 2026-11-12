/** Formatação da demo. Tudo em UTC: o relógio simulado não depende do fuso do visitante. */
import { DEMO_DAY } from "./data.ts";

const pad = (n: number) => String(n).padStart(2, "0");

export function formatTime(ms: number) {
  const d = new Date(ms);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** "Hoje", "Amanhã", "Ontem" ou dd/mm, relativo ao dia simulado. */
export function formatDay(ms: number) {
  const diff = Math.floor((ms - DEMO_DAY) / 86_400_000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff === -1) return "Ontem";
  const d = new Date(ms);
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}`;
}

export const formatDateTime = (ms: number) => `${formatDay(ms)}, ${formatTime(ms)}`;

export function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m >= 60) return `${Math.floor(m / 60)} h ${pad(m % 60)} min`;
  if (m === 0) return `${s} s`;
  return s ? `${m} min ${pad(s)} s` : `${m} min`;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (cents: number) => brl.format(cents / 100);

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
