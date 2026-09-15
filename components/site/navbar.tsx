"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nav, site } from "@/lib/site";
import { Logo } from "./logo";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-[calc(env(safe-area-inset-top,0px)+12px)] sm:px-6"
    >
      <nav
        className={cn(
          "mx-auto flex h-14 max-w-[1100px] items-center justify-between rounded-full border pr-2 pl-5 transition-all duration-500",
          scrolled || open
            ? "border-line bg-[#0b0b0c]/70 shadow-[0_10px_40px_-12px_rgba(0,0,0,.8)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" aria-label="scob. — início" onClick={() => setOpen(false)}>
          <Logo className="lg:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-horizontal-light.svg"
            alt="scob. — Você sonha. A gente tira do papel."
            width={843}
            height={100}
            decoding="async"
            className="hidden h-8 w-auto lg:block"
          />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contato">
              Agendar diagnóstico
              <ArrowRight className="transition-transform group-hover/btn:translate-x-0.5" />
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full text-foreground transition hover:bg-white/5 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-2 max-w-[1100px] overflow-hidden rounded-3xl border border-line bg-[#0b0b0c]/90 p-3 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base text-foreground/90 transition hover:bg-white/5"
                  >
                    {item.label}
                    <ArrowRight className="size-4 text-subtle" />
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-2 grid gap-2 border-t border-line p-2 pt-4">
              <Button asChild size="lg" className="w-full">
                <a href="#contato" onClick={() => setOpen(false)}>
                  Agendar diagnóstico
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full">
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
