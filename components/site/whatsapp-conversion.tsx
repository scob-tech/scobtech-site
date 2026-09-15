"use client";

import { useEffect } from "react";
import { trackWhatsAppConversion } from "@/lib/gtag";

/**
 * Registra a conversão "WhatsApp Scob" em QUALQUER link para o WhatsApp da página
 * (hero, CTA final, barra flutuante, rodapé, menu...), inclusive os que forem criados depois.
 *
 * Usa um único listener em captura no documento, então:
 * - não altera layout, animações nem o comportamento dos links;
 * - dispara exatamente uma vez por clique (sem duplicar eventos);
 * - não converte componentes de servidor em componentes de cliente.
 */
export function WhatsAppConversion() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!link) return;
      // O hit sai por beacon e o link abre em nova aba: a navegação segue normalmente.
      trackWhatsAppConversion();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
