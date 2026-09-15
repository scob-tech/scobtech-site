import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const SCREEN_W = 960;
export const SCREEN_H = 600;

export type Brand = { name: string; color: string; mark: string; url: string };

/** Moldura de "screenshot": janela do navegador + sidebar do produto. */
export function Shell({
  brand,
  nav,
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  brand: Brand;
  nav: { icon: LucideIcon; label: string; badge?: string }[];
  active: number;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden bg-[#0c0c0e] font-sans text-[12px] text-white/80"
      style={{ width: SCREEN_W, height: SCREEN_H, ["--c" as string]: brand.color }}
    >
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] bg-[#111114] px-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        <div className="mx-auto flex h-6 w-72 items-center justify-center rounded-md bg-white/[0.04] text-[11px] text-white/35">
          {brand.url}
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[188px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0f0f12] p-3">
          <div className="mb-5 flex items-center gap-2 px-1.5 pt-1">
            <div
              className={cn(
                "grid h-7 min-w-7 shrink-0 place-items-center rounded-lg px-1 font-bold text-black",
                brand.mark.length > 2 ? "text-[10.5px] tracking-tight" : "text-[13px]",
              )}
              style={{ background: brand.color }}
            >
              {brand.mark}
            </div>
            <span className="font-display text-[14px] leading-tight font-semibold text-white">{brand.name}</span>
          </div>
          <nav className="flex flex-col gap-0.5">
            {nav.map(({ icon: Icon, label, badge }, i) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                  i === active ? "bg-white/[0.07] text-white" : "text-white/50",
                )}
              >
                <Icon className="size-3.5" style={i === active ? { color: brand.color } : undefined} />
                {label}
                {badge && (
                  <span
                    className="ml-auto rounded px-1.5 text-[10px] font-medium text-black"
                    style={{ background: brand.color }}
                  >
                    {badge}
                  </span>
                )}
              </div>
            ))}
          </nav>
          <div className="mt-auto flex items-center gap-2 rounded-lg border border-white/[0.06] p-2">
            <div className="size-7 rounded-full bg-gradient-to-br from-white/30 to-white/5" />
            <div className="leading-tight">
              <div className="text-[11px] text-white/85">Administrador</div>
              <div className="text-[10px] text-white/35">Conta da empresa</div>
            </div>
          </div>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col p-5">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              {subtitle && <div className="text-[11px] text-white/40">{subtitle}</div>}
              <div className="font-display text-[20px] font-semibold text-white">{title}</div>
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
          <div className="min-h-0 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function Panel({ className, title, right, children }: {
  className?: string;
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5", className)}>
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[12px] font-medium text-white">{title}</span>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function Kpi({ label, value, delta, tone = "up" }: {
  label: string;
  value: string;
  delta?: string;
  tone?: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
      <div className="text-[11px] text-white/45">{label}</div>
      <div className="mt-1.5 font-display text-[22px] leading-none font-semibold text-white">{value}</div>
      {delta && (
        <div
          className={cn(
            "mt-2 text-[10.5px]",
            tone === "up" && "text-emerald-400",
            tone === "down" && "text-rose-400",
            tone === "neutral" && "text-white/40",
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

export function Pill({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium"
      style={{
        background: color ? `color-mix(in srgb, ${color} 16%, transparent)` : "rgba(255,255,255,.06)",
        color: color ?? "rgba(255,255,255,.6)",
      }}
    >
      {children}
    </span>
  );
}

export function ActionButton({ children, primary }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11px] font-medium",
        primary ? "text-black" : "border border-white/[0.08] text-white/70",
      )}
      style={primary ? { background: "var(--c)" } : undefined}
    >
      {children}
    </span>
  );
}

export function Avatar({ name, hue }: { name: string; hue: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className="grid size-6 shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white"
      style={{ background: `hsl(${hue} 35% 32%)` }}
    >
      {initials}
    </span>
  );
}

/** Linha suave em SVG para gráficos. */
export function areaPath(values: number[], w: number, h: number, max: number) {
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, h - (v / max) * h] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}
