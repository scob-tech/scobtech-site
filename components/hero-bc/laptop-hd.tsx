"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createInitialState } from "@/lib/demo-atendimento/data";
import { computeMetrics } from "@/lib/demo-atendimento/engine";
import { formatBRL, formatDuration } from "@/lib/demo-atendimento/format";
import type { LaptopHd } from "./data";
import { quadMatrix3d } from "./phone-hd";

/**
 * Notebook em alta resolução: PNG transparente + tela de Vendas em HTML.
 *
 * Mesmo princípio do celular HD: a interface é renderizada num retângulo plano
 * 16:10 (SCREEN_W × SCREEN_H) e projetada sobre os 4 cantos da tela medidos no PNG.
 * Os indicadores vêm do motor da demonstração de Atendimento & Vendas (estado
 * inicial, dados fictícios), para que a tela e a demo contem a mesma história.
 */
const SCREEN_W = 640;
const SCREEN_H = 400;

type Pt = readonly [number, number];

export function LaptopHdObject({ hd }: { hd: LaptopHd }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      const s = el.clientWidth / hd.width;
      if (!s) return;
      const q = hd.screen.map(([x, y]) => [x * s, y * s] as const) as unknown as [Pt, Pt, Pt, Pt];
      setTransform(quadMatrix3d(SCREEN_W, SCREEN_H, q));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hd]);

  const screen = (
    <div
      className="hbc-laptop-screen"
      aria-hidden
      style={{ width: SCREEN_W, height: SCREEN_H, transform: transform ?? undefined, opacity: transform ? 1 : 0 }}
    >
      <SalesScreen />
    </div>
  );

  return (
    <div ref={boxRef} className="hbc-laptop" style={{ aspectRatio: `${hd.width} / ${hd.height}` }}>
      {hd.screenLayer === "sob" && screen}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={hd.src} alt="" width={hd.width} height={hd.height} loading="lazy" decoding="async" draggable={false} className="hbc-laptop-img" />
      {hd.screenLayer === "sobre" && screen}
    </div>
  );
}

/** Painel de Vendas ilustrativo, derivado do estado inicial da demonstração. */
function SalesScreen() {
  const data = useMemo(() => {
    const s = createInitialState();
    const m = computeMetrics(s);
    // mensagens de clientes por hora, das 9h às 17h
    const hours = Array.from({ length: 9 }, (_, i) => 9 + i);
    const counts = new Map<number, number>();
    for (const msg of s.messages) {
      if (msg.author !== "cliente") continue;
      const h = new Date(msg.at).getUTCHours();
      counts.set(h, (counts.get(h) ?? 0) + 1);
    }
    const bars = hours.map((h) => ({ h, n: counts.get(h) ?? 0 }));
    const max = Math.max(...bars.map((b) => b.n), 1);
    return { m, bars, max, store: s.storeName };
  }, []);

  const { m, bars, max } = data;

  return (
    <div className="hbc-ls">
      {/* div (e não aside/main): ilustração decorativa, sem marcos de navegação próprios */}
      <div className="hbc-ls-side">
        <span className="hbc-ls-logo">
          s<i />
        </span>
        <span className="hbc-ls-nav">Atendimento</span>
        <span className="hbc-ls-nav hbc-ls-nav-on">Vendas</span>
        <span className="hbc-ls-nav">Agenda</span>
        <span className="hbc-ls-nav">Análise</span>
      </div>

      <div className="hbc-ls-main">
        <div className="hbc-ls-top">
          <span>{data.store} · Hoje</span>
          <span className="hbc-ls-tag">Dados fictícios</span>
        </div>

        <div className="hbc-ls-hero">
          <div>
            <p className="hbc-ls-title">Vendas</p>
            <p className="hbc-ls-value">{formatBRL(m.salesTotal)}</p>
          </div>
          <span className="hbc-ls-chip">
            {m.salesCount} {m.salesCount === 1 ? "venda" : "vendas"}
          </span>
        </div>

        <div className="hbc-ls-kpis">
          <span>
            <b>{m.finalized}</b> conversas finalizadas
          </span>
          <span>
            <b>{formatDuration(m.firstResponseAvgMs)}</b> 1ª resposta
          </span>
        </div>

        <div className="hbc-ls-chart">
          <p className="hbc-ls-chart-title">Mensagens de clientes por hora</p>
          <div className="hbc-ls-bars">
            {bars.map((b) => (
              <span key={b.h} className="hbc-ls-bar-col">
                <span className="hbc-ls-bar" style={{ height: `${(b.n / max) * 100}%` }} data-empty={b.n === 0 || undefined} />
                <span className="hbc-ls-bar-label">{b.h}h</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
