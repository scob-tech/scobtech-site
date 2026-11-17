"use client";

import { useEffect, useRef } from "react";

/**
 * Composição do hero com duas telas reais do Depósito Santo Antônio.
 * Com mouse (pointer: fine) e sem reduced-motion, as camadas seguem o cursor com
 * profundidades diferentes (no máximo ~8 px, só transform). No toque, fica estática.
 */
export function HeroTelas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <figure className="hm-hero-telas" ref={ref}>
      <div className="hm-tela hm-tela-desktop">
        <div className="hm-tela-bar" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cases/deposito-santo-antonio/wa-vendas.png"
          alt="Painel de vendas do atendimento via WhatsApp, desenvolvido para o Depósito Santo Antônio"
          width={1100}
          height={617}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="hm-tela hm-tela-phone">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cases/deposito-santo-antonio/entrega-motorista.png"
          alt="Aplicativo do motorista para registrar entregas"
          width={470}
          height={766}
          decoding="async"
        />
      </div>
      <figcaption className="hm-hero-caption">
        <span className="hm-badge">Projeto real</span> Depósito Santo Antônio · atendimento e entregas
      </figcaption>
    </figure>
  );
}
