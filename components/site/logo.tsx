import { cn } from "@/lib/utils";

/** Logo oficial da scob. (arquivo original do site). */
export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icon-512.png"
      alt="scob."
      width={512}
      height={512}
      decoding="async"
      className={cn("block size-9 shrink-0 rounded-full", className)}
    />
  );
}
