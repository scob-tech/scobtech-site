"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { DropdownMenu } from "radix-ui";
import { ArrowUpRight, ChevronDown, CirclePlay, MessageCircle, PackageCheck, ShoppingBasket, Truck, Users } from "lucide-react";
import { AtendimentoDemo } from "@/components/demo-atendimento/atendimento-demo";
import { demoFontVars } from "@/components/demo-atendimento/fonts";
import { site } from "@/lib/site";
import {
  CAMINHAO_HD,
  LAPTOP_HD,
  MAPA_HD,
  OPERACAO_HD,
  PHONE_HD,
  PINO_HD,
  POSVENDA_HD,
  REF_H,
  REF_W,
  STATIONS,
  rel,
  type Box,
  type ImageHd,
  type Station,
} from "./data";
import { LaptopHdObject } from "./laptop-hd";
import { PhoneHdObject } from "./phone-hd";
import "./hero.css";

const ICONS: Record<Station["id"], typeof Truck> = {
  whatsapp: MessageCircle,
  vendas: ShoppingBasket,
  operacao: PackageCheck,
  entregas: Truck,
  posvenda: Users,
};

/** Posição de uma caixa da referência no palco do desktop (em % do canvas). */
const onCanvas = (b: { x: number; y: number; w: number; h: number }): CSSProperties =>
  ({
    "--l": `${(b.x / REF_W) * 100}%`,
    "--t": `${(b.y / REF_H) * 100}%`,
    "--w": `${(b.w / REF_W) * 100}%`,
    "--h": `${(b.h / REF_H) * 100}%`,
  }) as CSSProperties;

/**
 * Posição de um objeto na cena com um enquadramento alternativo abaixo de 1024 px.
 * Sem boxMobile, o resultado é idêntico ao rel() usado pelos demais objetos.
 */
const respBox = (box: Box, boxMobile: Box | undefined, outer: Box): CSSProperties => {
  const d = rel(box, outer);
  const m = rel(boxMobile ?? box, outer);
  return {
    "--o-l": d.left, "--o-t": d.top, "--o-w": d.width, "--o-h": d.height,
    "--om-l": m.left, "--om-t": m.top, "--om-w": m.width, "--om-h": m.height,
  } as CSSProperties;
};

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HeroBoneCobalt() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [active, setActive] = useState<Station["id"] | null>(null);
  const activeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const demoReturnFocus = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageScrolls, setStageScrolls] = useState(false);

  // O carrossel (tablet/celular) só recebe foco do teclado quando de fato rola na horizontal;
  // assim as setas o percorrem, e no desktop ele não vira uma parada extra no Tab.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageScrolls(el.scrollWidth > el.clientWidth + 1);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Abre a demo aprovada e lembra quem a abriu, para devolver o foco ao fechar. */
  const openDemo = useCallback(() => {
    demoReturnFocus.current = document.activeElement as HTMLElement | null;
    setDemoOpen(true);
  }, []);
  const onDemoOpenChange = useCallback((open: boolean) => {
    setDemoOpen(open);
    if (!open) requestAnimationFrame(() => demoReturnFocus.current?.focus());
  }, []);

  /** Toque e menu: realça a estação como se o cursor estivesse sobre ela. */
  const highlight = useCallback((id: Station["id"], ms = 1400) => {
    if (activeTimer.current) clearTimeout(activeTimer.current);
    setActive(id);
    activeTimer.current = setTimeout(() => setActive(null), ms);
  }, []);
  useEffect(() => () => void (activeTimer.current && clearTimeout(activeTimer.current)), []);

  function goToStation(id: Station["id"]) {
    const el = document.getElementById(`solucao-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "nearest", inline: "center" });
    highlight(id, 1800);
  }

  return (
    <div className={`hbc ${demoFontVars}`}>
      <div className="hbc-canvas">
        <div className="hbc-bg" aria-hidden>
          <svg viewBox={`0 0 ${REF_W} ${REF_H}`} preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="hbc-blue-r" x1="1440" y1="420" x2="1672" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#8d9cf6" stopOpacity="0.55" />
                <stop offset="0.4" stopColor="#2a46f0" />
                <stop offset="1" stopColor="#0a1cf5" />
              </linearGradient>
              <linearGradient id="hbc-blue-l" x1="0" y1="560" x2="220" y2="380" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#8d9cf6" stopOpacity="0.4" />
                <stop offset="0.55" stopColor="#2a46f0" />
                <stop offset="1" stopColor="#1f3ef0" />
              </linearGradient>
              <radialGradient id="hbc-stage-glow" cx="836" cy="700" r="820" gradientTransform="matrix(1 0 0 .32 0 476)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#c9ccfb" stopOpacity="0.75" />
                <stop offset="1" stopColor="#c9ccfb" stopOpacity="0" />
              </radialGradient>
              <filter id="hbc-soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            <rect x="0" y="380" width={REF_W} height="561" fill="url(#hbc-stage-glow)" />
            <path d="M1672 70C1590 95 1500 200 1462 320c-22 70-10 150 38 240 40 70 110 130 172 160Z" fill="url(#hbc-blue-r)" />
            <path d="M1672 70C1590 95 1500 200 1462 320" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="10" filter="url(#hbc-soft)" />
            <path d="M0 335c95 0 180 60 214 135 21 50-4 90-64 130L0 640Z" fill="url(#hbc-blue-l)" />
            <path d="M0 396c96 6 186 46 236 104" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="12" filter="url(#hbc-soft)" />
          </svg>
        </div>

        {/* Cabeçalho */}
        <header className="hbc-header">
          <a href="/" className="hbc-logo" aria-label="scob. — Você sonha. A gente tira do papel.">
            {/* WebP sem perda (640 e 1086 px) gerado do logo-scob.png original; mesmo desenho, ~10x mais leve */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-scob-639.webp"
              srcSet="/logo-scob-639.webp 639w, /logo-scob-1086.webp 1086w"
              sizes="(min-width: 1024px) 22vw, clamp(150px, 34vw, 230px)"
              alt=""
              width={2172}
              height={724}
            />
          </a>

          <nav aria-label="Principal" className="hbc-nav">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger className="hbc-nav-link">
                Soluções <ChevronDown aria-hidden className="hbc-chev" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className={`hbc-menu ${demoFontVars}`} sideOffset={10} align="start">
                  {STATIONS.map((s) => {
                    const Icon = ICONS[s.id];
                    return (
                      <DropdownMenu.Item key={s.id} className="hbc-menu-item" onSelect={() => goToStation(s.id)}>
                        <Icon aria-hidden className="size-4" />
                        {s.title}
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </nav>

          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hbc-btn hbc-btn-primary hbc-cta-top">
            <span className="hbc-cta-top-text">Falar com um especialista</span>
            <span className="sr-only"> (abre o WhatsApp em uma nova aba)</span>
            <ArrowUpRight aria-hidden className="hbc-btn-icon" />
          </a>
        </header>

        {/* Texto */}
        <section className="hbc-copy" aria-labelledby="hbc-title">
          <p className="hbc-kicker">
            <span aria-hidden className="hbc-kicker-line" />
            Tecnologia para lojas de materiais de construção
            <span aria-hidden className="hbc-kicker-line" />
          </p>
          <h1 id="hbc-title" className="hbc-title">
            <span className="hbc-title-main">Sua loja mais eficiente,</span>{" "}
            <span className="hbc-title-accent">do primeiro atendimento à última entrega.</span>
          </h1>
          <p className="hbc-sub">
            Sistemas modulares para organizar o atendimento, impulsionar as vendas <br className="hbc-br" />e dar mais controle à operação da sua
            loja.
          </p>
          <div className="hbc-ctas">
            <a href="#solucoes" className="hbc-btn hbc-btn-primary hbc-btn-lg">
              Conhecer as soluções
              <ArrowUpRight aria-hidden className="hbc-btn-icon" />
            </a>
            <button type="button" className="hbc-btn hbc-btn-outline hbc-btn-lg" aria-haspopup="dialog" onClick={openDemo}>
              <CirclePlay aria-hidden className="hbc-btn-icon hbc-btn-icon-lead" />
              Ver como funciona
            </button>
          </div>
        </section>

        {/* Palco */}
        <div
          id="solucoes"
          ref={stageRef}
          className="hbc-stage"
          role="list"
          aria-label="Soluções"
          tabIndex={stageScrolls ? 0 : undefined}
        >
          {STATIONS.map((s) => (
            <StationView
              key={s.id}
              station={s}
              active={active === s.id}
              onTouch={() => highlight(s.id)}
              onOpenDemo={openDemo}
            />
          ))}
        </div>
      </div>

      <AtendimentoDemo open={demoOpen} onOpenChange={onDemoOpenChange} />
    </div>
  );
}

function StationView({
  station: s,
  active,
  onTouch,
  onOpenDemo,
}: {
  station: Station;
  active: boolean;
  onTouch: () => void;
  onOpenDemo: () => void;
}) {
  const Icon = ICONS[s.id];
  const p = s.platform;
  const interactive = s.id === "whatsapp";
  const scene = (
    <div className="hbc-scene" style={{ aspectRatio: `${s.box.w} / ${s.box.h}` }}>
      {s.ring && (
        <span
          aria-hidden
          className="hbc-ring"
          style={rel({ x: s.ring.cx - s.ring.rx, y: s.ring.cy - s.ring.ry, w: s.ring.rx * 2, h: s.ring.ry * 2 }, s.box)}
        />
      )}
      <span
        aria-hidden
        className="hbc-platform"
        style={
          {
            ...rel({ x: p.cx - p.rx, y: p.cy - p.ry, w: p.rx * 2, h: p.ry * 2 + p.t }, s.box),
            "--top": `${((p.ry * 2) / (p.ry * 2 + p.t)) * 100}%`,
          } as CSSProperties
        }
      />
      <span
        aria-hidden
        className="hbc-shadow"
        style={rel({ x: p.cx - p.rx * 0.62, y: p.cy - p.ry * 0.55, w: p.rx * 1.24, h: p.ry * 1.1 }, s.box)}
      />
      {s.objects.map((o) => {
        // Celular e notebook: imagem HD + tela em HTML projetada.
        if (o.id === "celular") {
          return (
            <div key={o.id} className="hbc-obj hbc-obj-celular" style={rel(PHONE_HD.box, s.box)}>
              <div className="hbc-obj-inner">
                <PhoneHdObject hd={PHONE_HD} />
              </div>
            </div>
          );
        }
        if (o.id === "notebook") {
          return (
            <div key={o.id} className="hbc-obj hbc-obj-notebook hbc-obj-resp" style={respBox(LAPTOP_HD.box, LAPTOP_HD.boxMobile, s.box)}>
              <div className="hbc-obj-inner">
                <LaptopHdObject hd={LAPTOP_HD} />
              </div>
            </div>
          );
        }
        // Demais objetos: só a imagem HD.
        const hd: ImageHd = { materiais: OPERACAO_HD, rota: MAPA_HD, caminhao: CAMINHAO_HD, avaliacao: POSVENDA_HD }[o.id];
        const resp = o.id === "materiais";
        return (
          <div
            key={o.id}
            className={`hbc-obj hbc-obj-${o.id}${resp ? " hbc-obj-resp" : ""}`}
            style={resp ? respBox(hd.box, hd.boxMobile, s.box) : rel(hd.box, s.box)}
          >
            <div className="hbc-obj-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hd.src} alt={interactive ? "" : o.alt} width={hd.width} height={hd.height} loading="lazy" decoding="async" draggable={false} />
            </div>
          </div>
        );
      })}
      {/* Pino independente sobre o mapa (camada própria, estática) */}
      {s.id === "entregas" && (
        <div className="hbc-obj hbc-obj-pino" style={rel(PINO_HD.box, s.box)}>
          <div className="hbc-obj-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PINO_HD.src} alt="" width={PINO_HD.width} height={PINO_HD.height} loading="lazy" decoding="async" draggable={false} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      id={`solucao-${s.id}`}
      role="listitem"
      className="hbc-station"
      data-id={s.id}
      data-active={active || undefined}
      style={onCanvas(s.box)}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") onTouch();
      }}
    >
      {/* No carrossel, o slot tem a mesma altura em todas as estações (rótulos alinhados). */}
      <div className="hbc-slot">
        {s.id === "whatsapp" ? (
          <button type="button" className="hbc-hit" aria-haspopup="dialog" aria-label="WhatsApp: abrir a demonstração de Atendimento & Vendas" onClick={onOpenDemo}>
            {scene}
          </button>
        ) : (
          scene
        )}
      </div>

      <div
        className="hbc-label"
        style={
          {
            "--ll": `${((s.label.x - s.box.x) / s.box.w) * 100}%`,
            "--lt": `${((s.label.y - s.box.y) / s.box.h) * 100}%`,
          } as CSSProperties
        }
      >
        <h2 className="hbc-label-title">
          <span className="hbc-label-icon" aria-hidden>
            <Icon strokeWidth={2.4} />
          </span>
          {s.title}
        </h2>
        <p className="hbc-label-text">{s.description}</p>
      </div>
    </div>
  );
}
