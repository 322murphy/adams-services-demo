"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDemo } from "@/lib/demo-store";

const titles: { prefix: string; title: string }[] = [
  { prefix: "/office/script", title: "Meeting script" },
  { prefix: "/office/customers", title: "Customers" },
  { prefix: "/office/applications", title: "Applications" },
  { prefix: "/office/plans", title: "Plans" },
  { prefix: "/office/territory", title: "Territory" },
  { prefix: "/office/billing", title: "Billing" },
  { prefix: "/office/dispatch", title: "Dispatch" },
  { prefix: "/office/fleet", title: "Fleet" },
  { prefix: "/office/equipment", title: "Equipment" },
  { prefix: "/office/work-orders", title: "Work orders" },
  { prefix: "/office/reports", title: "Reports" },
  { prefix: "/office", title: "Dashboard" },
  { prefix: "/portal", title: "Customer portal" },
  { prefix: "/driver", title: "Driver" },
  { prefix: "/start", title: "Start service" },
  { prefix: "/pricing", title: "Pricing" },
  { prefix: "/service-area", title: "Service area" },
  { prefix: "/residential", title: "Residential" },
  { prefix: "/commercial", title: "Commercial" },
  { prefix: "/recycling", title: "Recycling" },
  { prefix: "/bulk", title: "Bulk pickup" },
  { prefix: "/faq", title: "FAQ" },
  { prefix: "/contact", title: "Contact" },
  { prefix: "/about", title: "About" },
  { prefix: "/privacy", title: "Privacy" },
  { prefix: "/terms", title: "Terms" },
  { prefix: "/login", title: "Log in" },
  { prefix: "/", title: "Adams Services" },
];

const views = [
  { href: "/", label: "Public" },
  { href: "/office", label: "Office" },
  { href: "/portal", label: "Customer" },
  { href: "/driver", label: "Driver" },
  { href: "/office/script", label: "Script" },
];

export function DemoBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { reset } = useDemo();

  useEffect(() => {
    const match = titles
      .filter((item) => (item.prefix === "/" ? pathname === "/" : pathname.startsWith(item.prefix)))
      .sort((a, b) => b.prefix.length - a.prefix.length)[0];
    document.title = match && match.title !== "Adams Services" ? `${match.title} · Adams Services` : "Adams Services";
  }, [pathname]);

  return (
    <div className="no-print sticky top-0 z-50 flex h-11 items-center gap-3 overflow-x-auto bg-ink px-3 text-sm text-cream">
      <p className="shrink-0 font-semibold tracking-wide">
        DEMO<span className="hidden sm:inline"> · sample data · payments are not live</span>
      </p>
      <div className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap">
        {views.map((view) => {
          const on =
            view.href === "/office/script"
              ? pathname.startsWith("/office/script")
              : view.href === "/office"
                ? pathname.startsWith("/office") && !pathname.startsWith("/office/script")
                : view.href === "/"
                  ? !pathname.startsWith("/office") && !pathname.startsWith("/portal") && !pathname.startsWith("/driver")
                  : pathname.startsWith(view.href);
          return (
            <Link
              key={view.href}
              href={view.href}
              className={`rounded px-2 py-1 ${on ? "bg-brand text-white" : "hover:bg-white/10"}`}
            >
              {view.label}
            </Link>
          );
        })}
        <button
          type="button"
          className="rounded px-2 py-1 hover:bg-white/10"
          onClick={() => {
            reset();
            router.push("/");
          }}
        >
          Reset demo
        </button>
      </div>
    </div>
  );
}
