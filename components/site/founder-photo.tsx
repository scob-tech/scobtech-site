"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/** Foto do fundador em /public/fundador-scob.webp, com monograma caso o arquivo não exista. */
export function FounderPhoto({ name }: { name: string }) {
  const img = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="relative size-40 sm:size-48">
      <div
        aria-hidden
        className="absolute -inset-3 rounded-full bg-[conic-gradient(from_180deg,transparent,rgba(20,184,166,.6),transparent_60%)] opacity-70 blur-md"
      />
      <div className="relative size-full overflow-hidden rounded-full border border-line-strong bg-gradient-to-br from-[#16302d] to-surface p-1">
        {failed ? (
          <div className="grid size-full place-items-center rounded-full bg-surface font-display text-6xl font-semibold text-white">
            <span aria-hidden>{name[0]}</span>
            <span className="sr-only">{name}</span>
          </div>
        ) : (
          <Image
            ref={img}
            src="/fundador-scob.webp"
            alt={`${name}, fundador da scob.`}
            width={200}
            height={200}
            sizes="192px"
            onError={() => setFailed(true)}
            className="aspect-square size-full rounded-full object-cover object-top"
          />
        )}
      </div>
    </div>
  );
}
