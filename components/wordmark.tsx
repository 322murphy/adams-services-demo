import { cn } from "@/lib/utils";

function Cross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 28" className={className} aria-hidden="true">
      <path d="M2 17 C 20 13, 36 12, 50 13 L 50 16 C 36 16, 20 17, 2 19 Z" fill="currentColor" />
      <path d="M118 17 C 100 13, 84 12, 70 13 L 70 16 C 84 16, 100 17, 118 19 Z" fill="currentColor" />
      <rect x="57.5" y="0" width="5" height="28" rx="0.6" fill="currentColor" />
      <rect x="51" y="7" width="18" height="4.5" rx="0.6" fill="currentColor" />
    </svg>
  );
}

/** Stacked lockup from branding.pdf: cross with brush rules, ADAMS over SERVICES. */
export function Wordmark({
  tone = "ink",
  size = "sm",
  className = "",
}: {
  tone?: "ink" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: { cross: "w-16", adams: "text-[1.35rem]", services: "text-[1.05rem]" },
    md: { cross: "w-24", adams: "text-3xl", services: "text-2xl" },
    lg: { cross: "w-40", adams: "text-6xl", services: "text-5xl" },
  }[size];
  return (
    <span className={cn("inline-flex flex-col items-center leading-[0.9]", className)}>
      <Cross className={cn(sizes.cross, "mb-0.5", tone === "light" ? "text-cream" : "text-ink")} />
      <span className={cn("font-brand -skew-x-6 uppercase tracking-wide", sizes.adams, tone === "light" ? "text-cream" : "text-ink")}>
        Adams
      </span>
      <span className={cn("font-brand -skew-x-6 uppercase tracking-wide text-brand", sizes.services)}>Services</span>
    </span>
  );
}
