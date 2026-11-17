"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Abre a demonstração funcional de Atendimento & Vendas (components/demo-atendimento),
 * usada como está, sem alterações. O código da demonstração só é baixado no primeiro
 * clique; antes disso a página carrega apenas este botão.
 */
const AtendimentoDemo = dynamic(
  () => import("@/components/demo-atendimento/atendimento-demo").then((m) => m.AtendimentoDemo),
  { ssr: false },
);

export function DemoBotao({ className, children }: { className?: string; children: React.ReactNode }) {
  const [montada, setMontada] = useState(false);
  const [aberta, setAberta] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);

  const onOpenChange = (v: boolean) => {
    setAberta(v);
    // sem Dialog.Trigger, o foco não volta sozinho: devolve ao botão que abriu
    if (!v) requestAnimationFrame(() => botaoRef.current?.focus());
  };

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        className={className}
        aria-haspopup="dialog"
        onClick={() => {
          setMontada(true);
          setAberta(true);
        }}
      >
        {children}
      </button>
      {montada && <AtendimentoDemo open={aberta} onOpenChange={onOpenChange} />}
    </>
  );
}
