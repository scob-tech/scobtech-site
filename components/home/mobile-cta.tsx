"use client";

import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

/** Barra fixa no celular: aparece depois do hero e some quando o contato está na tela. */
export function MobileCta() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const contato = document.getElementById("contato");
    let contatoNaTela = false;
    const update = () => setVisivel(window.scrollY > window.innerHeight * 0.8 && !contatoNaTela);
    const io = new IntersectionObserver(([e]) => {
      contatoNaTela = e.isIntersecting;
      update();
    });
    if (contato) io.observe(contato);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className="hm-mcta" data-visible={visivel ? "" : undefined} inert={!visivel}>
      <a href="#contato" className="hm-btn hm-btn-primary">
        Agendar diagnóstico <ArrowRight aria-hidden className="hm-btn-icon" />
      </a>
      <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hm-mcta-wa" aria-label="Falar no WhatsApp">
        <MessageCircle aria-hidden />
      </a>
    </div>
  );
}
