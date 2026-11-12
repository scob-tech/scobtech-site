"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { PhoneHd } from "./data";

/**
 * Celular em alta resolução: PNG transparente + tela em HTML.
 *
 * A interface da tela é renderizada num retângulo plano de SCREEN_W × SCREEN_H px e
 * projetada sobre os 4 cantos da tela do aparelho (medidos na imagem) com uma
 * transformação projetiva (matrix3d). Assim o texto acompanha a perspectiva do
 * celular e continua nítido em qualquer densidade de tela.
 */
const SCREEN_W = 300;
const SCREEN_H = 640;

type Pt = readonly [number, number];

/** Matriz CSS que leva o retângulo w×h (origem no canto superior esquerdo) ao quadrilátero dst. */
export function quadMatrix3d(w: number, h: number, dst: readonly [Pt, Pt, Pt, Pt]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = dst; // sup. esq., sup. dir., inf. dir., inf. esq.
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  let a: number, b: number, d: number, e: number, g: number, hh: number;
  if (Math.abs(dx3) < 1e-9 && Math.abs(dy3) < 1e-9) {
    a = x1 - x0; b = x3 - x0; d = y1 - y0; e = y3 - y0; g = 0; hh = 0;
  } else {
    const det = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / det;
    hh = (dx1 * dy3 - dx3 * dy1) / det;
    a = x1 - x0 + g * x1; b = x3 - x0 + hh * x3;
    d = y1 - y0 + g * y1; e = y3 - y0 + hh * y3;
  }
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(",")})`;
}

export function PhoneHdObject({ hd }: { hd: PhoneHd }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string | null>(null);

  // Os cantos estão em pixels da imagem; convertemos para o tamanho em que ela aparece.
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
      className="hbc-phone-screen"
      aria-hidden
      style={{ width: SCREEN_W, height: SCREEN_H, transform: transform ?? undefined, opacity: transform ? 1 : 0 }}
    >
      <PhoneScreen inset={hd.badgeInset} />
    </div>
  );

  return (
    <div ref={boxRef} className="hbc-phone" style={{ aspectRatio: `${hd.width} / ${hd.height}` }}>
      {/* "sob": o PNG tem a tela vazada e a moldura cobre as bordas da interface */}
      {hd.screenLayer === "sob" && screen}
      {/* elemento de LCP no celular: prioridade alta de rede */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={hd.src} alt="" width={hd.width} height={hd.height} fetchPriority="high" decoding="async" draggable={false} className="hbc-phone-img" />
      {/* "sobre": o PNG tem a tela vazia e opaca */}
      {hd.screenLayer === "sobre" && screen}
    </div>
  );
}

/** Interface ilustrativa da tela (dados fictícios, coerentes com a demonstração). */
function PhoneScreen({ inset }: { inset?: number }) {
  return (
    <div className="hbc-ps" data-inset={inset ? "" : undefined} style={inset ? ({ "--ps-inset": `${inset}px` } as CSSProperties) : undefined}>
      <div className="hbc-ps-status">
        <span>9:41</span>
        <span className="hbc-ps-status-icons" />
      </div>
      <div className="hbc-ps-head">
        <span className="hbc-ps-avatar">AP</span>
        <span>
          <strong>Ana Paula Ribeiro</strong>
          <small>Atendimento · Juliana</small>
        </span>
      </div>
      <div className="hbc-ps-chat">
        <p className="hbc-ps-in">Vocês têm porcelanato 60x60 acetinado bege?</p>
        <p className="hbc-ps-out">Temos sim! O Porcelanato Areia sai R$ 69,90 o m².</p>
        <p className="hbc-ps-in">Me manda o orçamento das 36 m², com entrega.</p>
        <p className="hbc-ps-out">Orçamento enviado: R$ 2.516,40 com entrega inclusa.</p>
      </div>
      <div className="hbc-ps-input">
        <span>Mensagem</span>
        <span className="hbc-ps-send" />
      </div>
    </div>
  );
}
