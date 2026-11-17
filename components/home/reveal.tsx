"use client";

import { useEffect } from "react";

/**
 * Entrada única dos elementos marcados com [data-reveal] (opacidade + 12 px).
 * Sem JavaScript ou com prefers-reduced-motion, tudo já aparece no lugar.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hm");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.shown = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    // só esconde o que ainda está abaixo da dobra (evita piscar o que já está na tela)
    const fold = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < fold) el.dataset.shown = "";
      else io.observe(el);
    });
    root.dataset.revealOn = "";
    return () => io.disconnect();
  }, []);
  return null;
}
