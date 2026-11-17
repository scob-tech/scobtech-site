"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { site } from "@/lib/site";
import { homeNav, type NavItem } from "./nav-items";

type NavProps = {
  /** Itens do menu. Padrão: âncoras da home. */
  items?: NavItem[];
  /** Destino do logo: o topo da página na home, a home nas páginas internas. */
  logoHref?: string;
  /** href do item que corresponde à página atual (recebe aria-current). */
  atual?: string;
};

/** Elementos focáveis visíveis dentro do cabeçalho (o que está com display: none fica de fora). */
function focaveis(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
    (el) => el.getClientRects().length > 0,
  );
}

export function Nav({ items = homeNav, logoHref = "#top", atual }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const header = headerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // se o foco estava dentro do menu, ele sumiria junto: devolve ao botão que abriu
        const focoNoMenu = document.getElementById("hm-menu")?.contains(document.activeElement);
        setOpen(false);
        if (focoNoMenu) toggleRef.current?.focus();
        return;
      }
      // com o menu aberto (e a rolagem da página travada), o Tab circula só pelo cabeçalho
      if (e.key !== "Tab" || !header) return;
      const lista = focaveis(header);
      if (lista.length === 0) return;
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      const ativo = document.activeElement;
      if (!header.contains(ativo)) {
        e.preventDefault();
        (e.shiftKey ? ultimo : primeiro).focus();
      } else if (e.shiftKey && ativo === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && ativo === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    // o menu some a partir de 900 px (CSS); fecha junto para não deixar a rolagem travada
    const largo = window.matchMedia("(min-width: 900px)");
    const onLargo = () => {
      if (largo.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    largo.addEventListener("change", onLargo);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      largo.removeEventListener("change", onLargo);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header ref={headerRef} className="hm-nav" data-scrolled={scrolled || open ? "" : undefined}>
      <nav className="hm-nav-bar" aria-label="Principal">
        <a href={logoHref} className="hm-nav-logo" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-horizontal.svg" alt="scob. — início" width={843} height={100} decoding="async" />
        </a>

        <ul className="hm-nav-links">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} aria-current={item.href === atual ? "page" : undefined}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hm-nav-end">
          <a href="#contato" className="hm-btn hm-btn-primary hm-btn-sm hm-nav-cta">
            Agendar diagnóstico
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="hm-nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="hm-menu"
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </nav>

      <div id="hm-menu" className="hm-menu" hidden={!open}>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={close} aria-current={item.href === atual ? "page" : undefined}>
                {item.label}
                <ArrowRight aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <div className="hm-menu-actions">
          <a href="#contato" className="hm-btn hm-btn-primary" onClick={close}>
            Agendar diagnóstico
          </a>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-ghost">
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
