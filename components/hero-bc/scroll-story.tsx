"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { demoFontVars } from "@/components/demo-atendimento/fonts";
import { HeroBoneCobalt } from "./hero-bone-cobalt";
import "./scroll-story.css";

/**
 * Transição entre o hero aprovado e a primeira seção comercial, em continuidade visual.
 *
 * - O hero fica no fluxo normal da página e sobe com a rolagem, sem sticky, escala, fade ou
 *   deslocamento. Logo abaixo dele vem a seção das mensagens, no mesmo creme (#F2EFE8).
 * - Essa seção tem um palco de 100svh que fica preso (sticky no topo) por um trecho curto.
 *   As frases começam a surgir enquanto o palco ainda sobe (o hero saindo da tela) e os sete
 *   objetos de obra entram pelas bordas em seguida, completando a composição.
 * - Ao fim do trecho preso, a composição completa segue com a rolagem natural.
 *
 * Tudo é vinculado à posição do scroll (sem animação automática). O JS só lê o scroll e
 * escreve variáveis CSS (`--p` nas frases, `--q` nos objetos). Sem JS ou com
 * `prefers-reduced-motion`, a página é estática: hero e, abaixo dele, o quadro final.
 */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Progresso de `v` no intervalo [a, b], de 0 a 1. */
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ---------------------------------------------------------------------------
   Revelação por letras (ou palavras), vinculada ao scroll SEM listeners por letra:
   o JS escreve só `--p` (0 → 1) em cada frase; cada letra calcula em CSS a própria
   opacidade e descida a partir de `--p`, do seu índice `--i` e do escalonamento `--k`.
   As letras são spans INLINE com `position: relative` (não inline-block), para o
   navegador manter kerning e ligaduras da tipografia aprovada.
   Leitores de tela recebem o texto inteiro (span visualmente oculto); as letras
   ficam em `aria-hidden`.
   --------------------------------------------------------------------------- */

/** Fração do progresso de cada frase usada para escalonar o início das letras/palavras. */
const SPREAD = { line1: 0.74, line2: 0.8, line3: 0.6 } as const;

type Part = { text: string; className?: string };

const countUnits = (parts: Part[], by: "char" | "word") =>
  parts.reduce(
    (n, p) =>
      n +
      (by === "char"
        ? Array.from(p.text.replace(/\s/g, "")).length
        : p.text.split(/\s+/).filter(Boolean).length),
    0,
  );

function splitStyle(parts: Part[], by: "char" | "word", spread: number): CSSProperties {
  const n = countUnits(parts, by);
  return { "--k": (spread / Math.max(1, n - 1)).toFixed(5), "--w": (1 - spread).toFixed(3) } as CSSProperties;
}

/** Renderiza as partes divididas em letras ou palavras, com índice contínuo entre as partes. */
function SplitText({ parts, by }: { parts: Part[]; by: "char" | "word" }) {
  let i = 0;
  const unit = by === "char" ? "ss-ch" : "ss-wd";
  return (
    <>
      {parts.map((part, pi) => {
        const tokens = by === "char" ? Array.from(part.text) : part.text.split(/(\s+)/);
        const nodes: ReactNode[] = tokens.map((tk, k) =>
          tk === "" || /^\s+$/.test(tk) ? (
            tk
          ) : (
            <span key={k} className={unit} style={{ "--i": i++ } as CSSProperties}>
              {tk}
            </span>
          ),
        );
        return part.className ? (
          <em key={pi} className={part.className}>
            {nodes}
          </em>
        ) : (
          <span key={pi}>{nodes}</span>
        );
      })}
    </>
  );
}

const LINE1: Part[] = [{ text: "Você não perde vendas só por falta de clientes." }];
const LINE2: Part[] = [
  { text: "Enquanto você demora para responder, " },
  { text: "seu concorrente já está falando com o seu cliente.", className: "ss-impact" },
];
const LINE3: Part[] = [
  {
    text: "Tecnologia não é apenas modernização. É velocidade no atendimento, controle da operação e mais oportunidades de venda.",
  },
];
const plain = (parts: Part[]) => parts.map((p) => p.text).join("");

/* ---------------------------------------------------------------------------
   Elementos de obra ao redor das frases. Posição final, tamanho, origem fora da tela,
   giro, escala inicial e opacidade final (profundidade) ficam no CSS, por faixa de
   largura; o JS escreve só `--q` (0 → 1, já suavizado) em cada objeto, dentro da janela
   [a, b] do progresso da transição. Decorativos: `alt=""` e camada em aria-hidden.
   --------------------------------------------------------------------------- */
const PROPS = [
  { id: "capacete", w: 560, h: 445, a: 0.42, b: 0.71 },
  { id: "tijolos", w: 600, h: 424, a: 0.46, b: 0.77 },
  { id: "martelo", w: 560, h: 416, a: 0.48, b: 0.79 },
  { id: "trena", w: 520, h: 261, a: 0.54, b: 0.81 },
  { id: "chave", w: 560, h: 286, a: 0.6, b: 0.87 },
  { id: "cimento", w: 400, h: 528, a: 0.65, b: 0.94 },
  { id: "chave-fenda", w: 520, h: 344, a: 0.68, b: 0.96 },
] as const;

/** O progresso começa quando o topo do palco chega a esta fração da altura da tela. */
const LEAD = 0.6;

/** Janelas das frases no progresso (0 → 1). Os objetos começam depois da 1ª frase. */
const LINES = { l1: [0, 0.36], l2: [0.26, 0.6], l3: [0.5, 0.72] } as const;

export function ScrollStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const propsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const l3 = line3Ref.current;
    const propsLayer = propsRef.current;
    if (!root || !track || !l1 || !l2 || !l3 || !propsLayer) return;
    // objetos na mesma ordem de PROPS (cada um com sua janela de progresso)
    const props = Array.from(propsLayer.children) as HTMLElement[];

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let activeNow = false;
    // medidas em cache (atualizadas só em resize)
    let start = 0;
    let end = 1;

    // escreve a variável só quando muda: frases e objetos completos (ou ainda ocultos) não
    // são recalculados
    const lastP = new WeakMap<HTMLElement, string>();
    const write = (el: HTMLElement, name: string, t: number) => {
      const v = t.toFixed(4);
      if (lastP.get(el) === v) return;
      lastP.set(el, v);
      el.style.setProperty(name, v);
    };

    const reset = () => {
      for (const el of [l1, l2, l3]) el.style.removeProperty("--p");
      for (const el of props) el.style.removeProperty("--q");
      for (const el of [l1, l2, l3, ...props]) lastP.delete(el);
      root.removeAttribute("data-active");
      activeNow = false;
    };

    const measure = () => {
      // 100svh lido do CSS (mesma unidade do palco), para o início do progresso
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;height:100svh";
      document.body.appendChild(probe);
      const vh = probe.offsetHeight;
      probe.remove();
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const stageH = track.firstElementChild instanceof HTMLElement ? track.firstElementChild.offsetHeight : vh;
      // da chegada do palco a LEAD da tela até o fim do trecho preso
      start = trackTop - LEAD * vh;
      end = trackTop + Math.max(1, track.offsetHeight - stageH);
    };

    const frame = () => {
      raf = 0;
      const p = span(window.scrollY, start, end);
      // camadas próprias (will-change) só enquanto a composição se forma
      const active = p > 0 && p < 1;
      if (active !== activeNow) {
        activeNow = active;
        root.toggleAttribute("data-active", active);
      }

      // 1) as letras descem uma após a outra; as frases se sobrepõem no tempo
      write(l1, "--p", span(p, LINES.l1[0], LINES.l1[1]));
      write(l2, "--p", span(p, LINES.l2[0], LINES.l2[1]));
      write(l3, "--p", span(p, LINES.l3[0], LINES.l3[1]));

      // 2) os objetos de obra entram pelas bordas, escalonados, com desaceleração
      //    (ease-out); trajetória, giro e escala são calculados no CSS a partir de --q
      for (let i = 0; i < props.length; i++) {
        const cfg = PROPS[i];
        if (cfg) write(props[i], "--q", easeOut(span(p, cfg.a, cfg.b)));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => {
      if (!root.hasAttribute("data-motion")) return;
      measure();
      frame();
    });

    const enable = () => {
      root.setAttribute("data-motion", "");
      measure();
      frame();
      window.addEventListener("scroll", onScroll, { passive: true });
      ro.observe(document.documentElement);
    };
    const disable = () => {
      root.removeAttribute("data-motion");
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      reset();
    };
    const apply = () => (mq.matches ? disable() : enable());

    // altura do hero, para o topo do palco continuar o brilho da base dele (em qualquer modo)
    const hero = root.firstElementChild;
    const heroRo = new ResizeObserver(() => {
      if (hero instanceof HTMLElement) root.style.setProperty("--ss-hero-h", `${hero.offsetHeight}px`);
    });
    if (hero instanceof HTMLElement) heroRo.observe(hero);

    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      heroRo.disconnect();
      disable();
    };
  }, []);

  return (
    <div ref={rootRef} className={`ss ${demoFontVars}`}>
      {/* Hero aprovado, no fluxo normal da página */}
      <div className="ss-hero">
        <HeroBoneCobalt />
      </div>

      {/* Trilho: o palco das mensagens fica preso no topo por um trecho curto (modo animado) */}
      <div ref={trackRef} className="ss-track">
        <section className="ss-statement" aria-labelledby="ss-frase">
          <div className="ss-stage">
            <div ref={propsRef} className="ss-props" aria-hidden>
              {PROPS.map((o) => (
                <img
                  key={o.id}
                  className={`ss-prop ss-prop--${o.id}`}
                  src={`/preview-hero/transicao-${o.id}.webp`}
                  alt=""
                  width={o.w}
                  height={o.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ "--ar": (o.h / o.w).toFixed(4) } as CSSProperties}
                />
              ))}
            </div>
            <div className="ss-block">
              <h2
                ref={line1Ref}
                id="ss-frase"
                className="ss-line1 ss-split"
                style={splitStyle(LINE1, "char", SPREAD.line1)}
              >
                <span className="ss-sr">{plain(LINE1)}</span>
                <span aria-hidden>
                  <SplitText parts={LINE1} by="char" />
                </span>
              </h2>
              <p ref={line2Ref} className="ss-line2 ss-split" style={splitStyle(LINE2, "char", SPREAD.line2)}>
                <span className="ss-sr">{plain(LINE2)}</span>
                <span aria-hidden>
                  <SplitText parts={LINE2} by="char" />
                </span>
              </p>
              <p ref={line3Ref} className="ss-line3 ss-split" style={splitStyle(LINE3, "word", SPREAD.line3)}>
                <span className="ss-sr">{plain(LINE3)}</span>
                <span aria-hidden>
                  <SplitText parts={LINE3} by="word" />
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
