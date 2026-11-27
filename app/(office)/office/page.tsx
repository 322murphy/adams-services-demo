"use client";

import Link from "next/link";
import { ChargeCard } from "@/components/charge-card";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { ROUTE } from "@/lib/catalog";
import { invoiceBalanceCents } from "@/lib/billing";
import { formatCents, formatWhen } from "@/lib/format";
import { customerHref } from "@/lib/hrefs";
import { useDemo } from "@/lib/demo-store";

export default function DashboardPage() {
  const { state, approveApplication } = useDemo();
  const active = state.customers.filter((customer) => customer.status === "active").length;
  const suspended = state.customers.filter((customer) => customer.status === "suspended").length;
  const upcoming = state.customers.filter((customer) => customer.status === "pending");
  const applications = state.applications.filter((application) => application.status === "pending");
  const receivables = state.invoices.reduce((sum, invoice) => sum + Math.max(0, invoiceBalanceCents(invoice, state.payments)), 0);
  const remaining = state.stops.filter((stop) => stop.status === "scheduled").length;
  const pendingCharges = state.charges.filter((charge) => charge.status === "pending");

  const cards = [
    { label: "Active customers", value: String(active) },
    { label: "Applications to approve", value: String(applications.length) },
    { label: "Open receivables", value: formatCents(receivables) },
    { label: "Stops still out", value: `${remaining} of ${state.stops.length}` },
  ];

  return (
    <div>
      <OfficeHeader title="Dashboard" subtitle={`${suspended} suspended. Sample day is ${ROUTE.dateLabel}.`} />
      <div className="grid gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-line bg-card p-4">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-4xl text-ink">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Applications</h2>
          {applications.length === 0 ? <p className="mt-3 text-sm text-muted">No applications waiting. New website signups land here.</p> : null}
          <div className="mt-3 space-y-3">
            {applications.map((application) => (
              <div key={application.id} className="rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{application.name}</p>
                  <StatusPill value={application.status} />
                </div>
                <p className="text-sm text-muted">{application.number} · {application.line1}, {application.city} {application.zip}</p>
                <Button type="button" className="mt-2" size="sm" onClick={() => approveApplication(application.id)}>Approve and activate</Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Upcoming starts</h2>
          {upcoming.length === 0 ? <p className="mt-3 text-sm text-muted">No pending accounts.</p> : null}
          <ul className="mt-3 space-y-2 text-sm">
            {upcoming.map((customer) => (
              <li key={customer.id}>
                <Link href={customerHref(customer.id)} className="font-semibold text-brand">{customer.name}</Link>
                <span className="text-muted"> · {customer.accountNumber}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 text-2xl tracking-wide">Friday route</h2>
          <p className="mt-2 text-sm text-muted">{ROUTE.driverName} · Truck {ROUTE.truckNumber} · {remaining} stops remaining</p>
          <Link href="/office/dispatch" className="mt-2 inline-block text-sm font-semibold text-brand">Open dispatch</Link>
        </section>
      </div>

      {pendingCharges.length > 0 ? (
        <section className="mt-6 space-y-3">
          <h2 className="text-2xl tracking-wide">Extras waiting on the office</h2>
          {pendingCharges.map((charge) => {
            const customer = state.customers.find((item) => item.id === charge.customerId);
            return (
              <div key={charge.id}>
                <p className="mb-1 text-sm font-semibold">{customer?.name}</p>
                <ChargeCard charge={charge} />
              </div>
            );
          })}
          <Link href="/office/billing" className="text-sm font-semibold text-brand">Review on billing</Link>
        </section>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Website messages</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {state.messages.map((message) => (
              <li key={message.id}>
                <p className="font-semibold">{message.name} · {message.topic}</p>
                <p className="text-muted">{message.body}</p>
                <p className="text-xs text-muted">{formatWhen(message.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Activity</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {state.audit.slice(0, 6).map((event) => (
              <li key={event.id}>
                <p>{event.message}</p>
                <p className="text-xs text-muted">{formatWhen(event.at)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
