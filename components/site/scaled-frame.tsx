"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renderiza um mockup em largura fixa e escala para caber no container.
 * Assim as telas mantêm densidade realista no desktop e no celular.
 */
export function ScaledFrame({
  width,
  height,
  children,
  className,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale || 1})`, opacity: scale ? 1 : 0 }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}
