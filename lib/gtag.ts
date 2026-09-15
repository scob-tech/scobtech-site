// Google Ads (gtag.js). A tag global é carregada uma única vez em app/layout.tsx.
// O ID vem de NEXT_PUBLIC_GOOGLE_ADS_ID (inlined no build — necessário no export estático).

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

// Label da ação de conversão (Google Ads → Metas → Conversões → "Configurar tag").
// Quando existir, basta definir NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL; send_to vira "AW-XXX/LABEL".
export const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ?? "";

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(..._args: unknown[]) {
  if (typeof window === "undefined" || !GOOGLE_ADS_ID) return;
  if (typeof window.gtag === "function") {
    window.gtag(..._args);
    return;
  }
  // Clique antes do init da tag: enfileira no dataLayer (gtag.js exige o objeto `arguments`).
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** Page view manual. A tag já envia o page view inicial no `config`; use só em navegação client-side. */
export function pageview(url: string) {
  gtag("config", GOOGLE_ADS_ID, { page_path: url });
}

/** Evento genérico do gtag. */
export function event(action: string, params: GtagParams = {}) {
  gtag("event", action, params);
}

/** Conversão do Google Ads. Não bloqueia navegação (gtag.js envia via beacon). */
export function conversion(params: GtagParams = {}) {
  const sendTo = GOOGLE_ADS_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`
    : GOOGLE_ADS_ID;
  event("conversion", { send_to: sendTo, ...params });
}
