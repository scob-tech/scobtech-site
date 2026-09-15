"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Card com brilho que acompanha o cursor (padrão "Spotlight Card").
 * O efeito usa variáveis CSS, sem re-render a cada movimento.
 */
export function SpotlightCard({
  children,
  className,
  color = "rgba(20,184,166,0.14)",
  ...props
}: React.ComponentProps<"div"> & { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        "group/spot relative overflow-hidden rounded-2xl border border-line bg-surface transition duration-500 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,.9)]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), ${color}, transparent 60%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
