"use client";

import Link from "next/link";
import { OfficeHeader } from "@/components/office-shell";
import { invoiceBalanceCents, invoiceTotalCents } from "@/lib/billing";
import { formatCents } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import type { CustomerStatus } from "@/lib/types";

const statuses: CustomerStatus[] = ["active", "pending", "suspended", "canceled", "lead"];

export default function ReportsPage() {
  const { state } = useDemo();
  const billed = state.invoices.reduce((sum, invoice) => sum + invoiceTotalCents(invoice), 0);
  const collected = state.payments.reduce((sum, payment) => sum + payment.amountCents, 0);
  const open = state.invoices.reduce((sum, invoice) => sum + Math.max(0, invoiceBalanceCents(invoice, state.payments)), 0);
  const approvedExtras = state.charges.filter((charge) => charge.status === "approved").reduce((sum, charge) => sum + charge.amountCents, 0);
  const pendingExtras = state.charges.filter((charge) => charge.status === "pending").reduce((sum, charge) => sum + charge.amountCents, 0);
  const done = state.stops.filter((stop) => stop.status !== "scheduled").length;

  const figures = [
    { label: "Billed", value: formatCents(billed) },
    { label: "Collected", value: formatCents(collected) },
    { label: "Open receivables", value: formatCents(open) },
    { label: "Approved extras", value: formatCents(approvedExtras) },
    { label: "Extras waiting", value: formatCents(pendingExtras) },
    { label: "Route recorded", value: `${done} / ${state.stops.length}` },
  ];

  return (
    <div>
      <OfficeHeader title="Reports" subtitle="Sample books. Disposal cost is not in this prototype, so this is service revenue only." />
      <div className="grid gap-3 md:grid-cols-3">
        {figures.map((figure) => (
          <div key={figure.label} className="rounded-xl border border-line bg-card p-4">
            <p className="text-sm text-muted">{figure.label}</p>
            <p className="mt-2 font-display text-4xl">{figure.value}</p>
          </div>
        ))}
      </div>
      <section className="mt-6 rounded-xl border border-line bg-card p-4">
        <h2 className="text-2xl tracking-wide">Customers</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          {statuses.map((status) => (
            <li key={status} className="capitalize">{status}: {state.customers.filter((customer) => customer.status === status).length}</li>
          ))}
        </ul>
      </section>
      <section className="mt-4 rounded-xl border border-line bg-card p-4">
        <h2 className="text-2xl tracking-wide">Open balances</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {state.invoices.filter((invoice) => invoiceBalanceCents(invoice, state.payments) > 0).map((invoice) => {
            const customer = state.customers.find((item) => item.id === invoice.customerId);
            return (
              <li key={invoice.id}>
                <Link href={`/office/billing/${invoice.id}`} className="font-semibold text-brand">{invoice.number}</Link>
                <span> · {customer?.name} · {formatCents(invoiceBalanceCents(invoice, state.payments))}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
