"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  Map,
  Package,
  Receipt,
  Route,
  Tags,
  Truck,
  Users,
  ListChecks,
} from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

const items = [
  { href: "/office", label: "Dashboard", icon: LayoutDashboard },
  { href: "/office/customers", label: "Customers", icon: Users },
  { href: "/office/applications", label: "Applications", icon: Inbox },
  { href: "/office/plans", label: "Plans", icon: Tags },
  { href: "/office/territory", label: "Territory", icon: Map },
  { href: "/office/billing", label: "Billing", icon: Receipt },
  { href: "/office/dispatch", label: "Dispatch", icon: Route },
  { href: "/office/fleet", label: "Fleet", icon: Truck },
  { href: "/office/equipment", label: "Equipment", icon: Package },
  { href: "/office/work-orders", label: "Work orders", icon: ClipboardList },
  { href: "/office/reports", label: "Reports", icon: BarChart3 },
  { href: "/office/script", label: "Meeting script", icon: ListChecks },
];

export function OfficeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useDemo();
  const pendingApps = state.applications.filter((item) => item.status === "pending").length;
  const pendingCharges = state.charges.filter((item) => item.status === "pending").length;

  return (
    <div className="min-h-[calc(100vh-2.75rem)] bg-background lg:flex">
      <aside className="no-print border-b border-line bg-ink text-cream lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="hidden flex-col items-center px-4 py-5 lg:flex">
          <Wordmark tone="light" size="md" />
          <p className="mt-1 text-xs text-cream/60">Office · sample books</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 py-2 lg:block lg:space-y-1 lg:px-3 lg:pb-6">
          {items.map((item) => {
            const active = item.href === "/office" ? pathname === "/office" : pathname.startsWith(item.href);
            const Icon = item.icon;
            const count = item.href === "/office/applications" ? pendingApps : item.href === "/office/billing" ? pendingCharges : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm",
                  active ? "bg-brand text-white" : "text-cream/80 hover:bg-white/10",
                )}
              >
                <Icon size={16} />
                {item.label}
                {count > 0 ? <span className="rounded-full bg-white/20 px-1.5 text-xs">{count}</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</div>
    </div>
  );
}

export function OfficeHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl tracking-wide text-ink">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
