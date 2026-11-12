/** Número comercial do WhatsApp (confirmado: +55 11 93913-0859). Única fonte do número no site. */
const WHATSAPP_NUMERO = "5511939130859";

/** Link wa.me para o número comercial com a mensagem pré-preenchida. */
export function whatsappUrl(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export const site = {
  name: "scob.",
  url: "https://scobtech.com.br",
  slogan: "Você sonha. A gente tira do papel.",
  founder: "Silvio",
  founderFullName: "Silvio Arruda",
  email: "silvio@scobtech.com.br",
  whatsapp: whatsappUrl("Olá, quero agendar um diagnóstico com a scob."),
  whatsappChat: whatsappUrl("Olá, quero falar com a scob."),
  /** CTA final da landing (seção de contato). */
  whatsappProjeto: whatsappUrl("Olá! Quero conversar sobre um projeto para a minha empresa."),
};

/**
 * Âncoras da página inicial (landing Bone & Cobalt), usadas na coluna "Navegar" do rodapé
 * de /privacy. Só destinos que existem na landing: os títulos da vitrine de soluções e do
 * contato. As âncoras da página anterior (#comparacao, #cases, #processo, #sobre) e a do
 * case (#ce-titulo, seção retirada da página) não existem mais.
 */
export const nav = [
  { label: "Soluções", href: "#sv-titulo" },
  { label: "Contato", href: "#ct-titulo" },
];
