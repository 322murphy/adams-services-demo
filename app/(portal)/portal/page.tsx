"use client";

import Link from "next/link";
import { ChargeCard } from "@/components/charge-card";
import { Wordmark } from "@/components/wordmark";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { COMPANY, MARIA_ID, currentVersion, planById, territoryForZip } from "@/lib/catalog";
import { invoiceBalanceCents, invoiceTotalCents } from "@/lib/billing";
import { formatCents, formatDay, formatWhen } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function PortalPage() {
  const { state, payInvoice, toggleAutopay } = useDemo();
  const customer = state.customers.find((item) => item.id === MARIA_ID);
  if (!customer) return null;
  const property = state.properties.find((item) => item.customerId === customer.id);
  const plan = planById(customer.planId);
  const rate = currentVersion(plan);
  const invoices = state.invoices.filter((invoice) => invoice.customerId === customer.id);
  const payments = state.payments.filter((payment) => payment.customerId === customer.id);
  const charges = state.charges.filter((charge) => charge.customerId === customer.id);
  const day = property ? territoryForZip(property.zip)?.day ?? "Friday" : "Friday";
  const balance = invoices.reduce((sum, invoice) => sum + Math.max(0, invoiceBalanceCents(invoice, state.payments)), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Wordmark />
          <p className="text-sm text-muted">{customer.accountNumber}</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Customer portal · sample account</p>
        <h1 className="mt-1 text-4xl tracking-wide">Hello, {customer.name.split(" ")[0]}</h1>
        <div className="mt-6 rounded-2xl bg-ink p-6 text-cream">
          <p className="text-sm text-cream/70">Amount due</p>
          <p className="font-display text-5xl text-white">{formatCents(balance)}</p>
          <p className="mt-2 text-sm text-cream/70">{plan.name} · {customer.cartCount} × {customer.cartSize} gal · {day} pickup</p>
        </div>

        <section className="mt-6 space-y-4">
          {invoices.map((invoice) => {
            const due = invoiceBalanceCents(invoice, state.payments);
            return (
              <article key={invoice.id} className="rounded-xl border border-line bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-2xl tracking-wide">{invoice.number}</h2>
                  <StatusPill value={invoice.status} />
                </div>
                <p className="text-sm text-muted">Due {formatDay(invoice.dueOn)} · total {formatCents(invoiceTotalCents(invoice))}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {invoice.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span>{item.description}</span>
                      <span>{formatCents(item.amountCents)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-semibold">Balance {formatCents(due)}</p>
                {due > 0 ? (
                  <Button type="button" className="mt-3" onClick={() => payInvoice(invoice.id, "demo_card")}>
                    Pay {formatCents(due)} with demo card
                  </Button>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className="mt-6 rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">AutoPay</h2>
          <p className="mt-1 text-sm text-muted">Demo switch only. It does not store a card.</p>
          <Button type="button" className="mt-3" variant="outline" onClick={() => toggleAutopay(customer.id)}>
            {customer.autopay ? "Turn AutoPay off" : "Turn AutoPay on"}
          </Button>
        </section>

        <section className="mt-4 rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Collection</h2>
          <p className="mt-2 text-sm">{day} · cart at the curb by 7:00 a.m. · {property?.line1}</p>
          <p className="mt-2 text-sm text-muted">Thanksgiving Day had no pickup. Friday, November 27 runs on schedule. Christmas Day moves to the next business day.</p>
          <p className="mt-2 text-sm">Plan includes {rate.includedCarts} cart. Extra cart {formatCents(rate.extraCartCents)}. Extra bag {formatCents(rate.extraBagCents)}.</p>
        </section>

        {charges.length > 0 ? (
          <section className="mt-4 space-y-3">
            <h2 className="text-2xl tracking-wide">Additional trash</h2>
            {charges.map((charge) => (
              <ChargeCard key={charge.id} charge={charge} />
            ))}
          </section>
        ) : null}

        <section className="mt-4 rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Receipts</h2>
          {payments.length === 0 ? <p className="mt-2 text-sm text-muted">No payments yet.</p> : null}
          <ul className="mt-2 space-y-2 text-sm">
            {payments.map((payment) => (
              <li key={payment.id}>{payment.receiptNumber} · {formatCents(payment.amountCents)} · {payment.method === "demo_card" ? "Demo card" : "Demo ACH"} · {formatWhen(payment.createdAt)}</li>
            ))}
          </ul>
        </section>
        <p className="mt-6 text-sm text-muted">Questions: <a className="font-semibold text-brand" href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>. <Link href="/login" className="font-semibold text-brand">Sample log in</Link></p>
      </main>
    </div>
  );
}
