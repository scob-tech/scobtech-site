"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

/** Barra de conversão fixa no celular: aparece após o hero e some na seção de contato. */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contato");
    let contactInView = false;

    const update = () => setVisible(window.scrollY > window.innerHeight * 0.8 && !contactInView);

    const io = new IntersectionObserver(([entry]) => {
      contactInView = entry.isIntersecting;
      update();
    });
    if (contact) io.observe(contact);

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:hidden"
        >
          <div className="flex items-center gap-2 rounded-full border border-line bg-[#0b0b0c]/85 p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,.9)] backdrop-blur-xl">
            <a
              href="#contato"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.35)] active:scale-[0.98]"
            >
              Agendar diagnóstico <ArrowRight className="size-4" />
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="grid size-12 place-items-center rounded-full border border-line-strong bg-white/[0.04] text-[#25D366] active:scale-95"
            >
              <MessageCircle className="size-5" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
