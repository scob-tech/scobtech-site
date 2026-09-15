// Google Ads (gtag.js). A tag global é carregada uma única vez em app/layout.tsx.
// O ID vem de NEXT_PUBLIC_GOOGLE_ADS_ID (inlined no build — necessário no export estático).

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

// Labels das ações de conversão (Google Ads → Metas → Conversões → "Configurar tag").
export const CONVERSIONS = {
  /** Diagnóstico Operacional */
  diagnostico: "vo7fCNHUjvkcEIG-vtxE",
  /** WhatsApp Scob */
  whatsapp: "BZUtCOTCkPkcEIG-vtxE",
} as const;

export type ConversionLabel = (typeof CONVERSIONS)[keyof typeof CONVERSIONS];

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

/**
 * Conversão do Google Ads. Não bloqueia navegação: o gtag.js envia o hit via beacon,
 * então pode ser chamada no onClick de um link que abre o WhatsApp.
 */
export function conversion(label: ConversionLabel, value?: number, currency = "BRL") {
  const params: GtagParams = { send_to: `${GOOGLE_ADS_ID}/${label}` };
  if (value !== undefined) {
    params.value = value;
    params.currency = currency;
  }
  event("conversion", params);
}

/** Conversão "Diagnóstico Operacional" (lead). */
export function trackLeadConversion() {
  conversion(CONVERSIONS.diagnostico, 1.0, "BRL");
}

/** Conversão "WhatsApp Scob". Chamada antes de abrir o WhatsApp. */
export function trackWhatsAppConversion() {
  conversion(CONVERSIONS.whatsapp);
}
