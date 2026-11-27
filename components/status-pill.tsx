import { cn } from "@/lib/utils";
import { titleCase } from "@/lib/format";

const tones: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-950",
  pending: "bg-amber-100 text-amber-950",
  suspended: "bg-red-100 text-red-950",
  canceled: "bg-stone-200 text-stone-700",
  archived: "bg-stone-200 text-stone-600",
  hold: "bg-orange-100 text-orange-950",
  lead: "bg-sky-100 text-sky-950",
  inquiry: "bg-sky-100 text-sky-950",
  approved: "bg-emerald-100 text-emerald-950",
  rejected: "bg-stone-200 text-stone-700",
  paid: "bg-emerald-100 text-emerald-950",
  open: "bg-amber-100 text-amber-950",
  partial: "bg-orange-100 text-orange-950",
  scheduled: "bg-sky-100 text-sky-950",
  completed: "bg-emerald-100 text-emerald-950",
  completed_with_extras: "bg-emerald-100 text-emerald-950",
  cart_not_out: "bg-orange-100 text-orange-950",
  blocked: "bg-red-100 text-red-950",
  missed: "bg-red-100 text-red-950",
  available: "bg-emerald-100 text-emerald-950",
  assigned: "bg-sky-100 text-sky-950",
  "pending delivery": "bg-amber-100 text-amber-950",
  damaged: "bg-red-100 text-red-950",
  "in service": "bg-emerald-100 text-emerald-950",
  maintenance: "bg-amber-100 text-amber-950",
  "out of service": "bg-red-100 text-red-950",
  high: "bg-red-100 text-red-950",
  normal: "bg-sand text-ink",
};

export function StatusPill({ value }: { value: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize", tones[value] ?? "bg-sand text-ink")}>
      {titleCase(value)}
    </span>
  );
}
