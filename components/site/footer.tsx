import { nav, site } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-line pt-14 pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)]">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Logo className="size-14" />
            <p className="mt-4 text-sm leading-relaxed text-subtle">
              Sistemas sob medida, construídos do zero a partir da sua operação real. São Paulo, SP.
            </p>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-10 text-sm sm:gap-16">
            <div>
              <h4 className="font-sans text-xs font-medium tracking-wider text-foreground/60 uppercase">Navegar</h4>
              <ul className="mt-4 space-y-3">
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="text-subtle transition-colors hover:text-foreground">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sans text-xs font-medium tracking-wider text-foreground/60 uppercase">Contato</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-subtle transition-colors hover:text-foreground"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="text-subtle transition-colors hover:text-foreground">
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-2 border-t border-line pt-6 text-xs text-subtle sm:flex-row">
          <span>© 2026 scob. Todos os direitos reservados.</span>
          <span>{site.slogan}</span>
        </div>
        <p className="mt-3 text-xs text-subtle/70">
          Construído no Brasil para empresas que querem crescer sem caos operacional.
        </p>
      </div>
    </footer>
  );
}
