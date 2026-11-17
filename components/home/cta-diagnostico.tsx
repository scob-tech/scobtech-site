"use client";

import { trackLeadConversion } from "@/lib/gtag";

/** CTA principal do hero: mantém o rastreamento de lead que já existia na home. */
export function CtaDiagnostico({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <a href="#contato" className={className} onClick={() => trackLeadConversion()}>
      {children}
    </a>
  );
}
