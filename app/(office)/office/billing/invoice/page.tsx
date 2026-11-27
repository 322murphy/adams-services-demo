"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ChargeCard } from "@/components/charge-card";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { invoiceBalanceCents, invoiceTotalCents } from "@/lib/billing";
import { formatCents, formatDay, formatWhen } from "@/lib/format";
import { customerHref } from "@/lib/hrefs";
import { useDemo } from "@/lib/demo-store";

function InvoiceDetail() {
  const id = useSearchParams().get("id") ?? "";
  const { state, approveCharge, rejectCharge, payInvoice } = useDemo();
  const invoice = state.invoices.find((item) => item.id === id);

  if (!invoice) {
    return (
      <div>
        <OfficeHeader title="Invoice not found" />
        <Link href="/office/billing" className="font-semibold text-brand">Back to billing</Link>
      </div>
    );
  }

  const customer = state.customers.find((item) => item.id === invoice.customerId);
  const balance = invoiceBalanceCents(invoice, state.payments);
  const payments = state.payments.filter((payment) => payment.invoiceId === invoice.id);
  const charges = state.charges.filter((charge) => charge.customerId === invoice.customerId && (charge.status === "pending" || charge.invoiceId === invoice.id));
  const audit = state.audit.filter((event) => event.message.includes(invoice.number)).slice(0, 8);

  return (
    <div>
      <OfficeHeader
        title={invoice.number}
        subtitle={customer ? `${customer.name} · ${customer.accountNumber}` : "Customer"}
        action={<Button type="button" variant="outline" className="no-print" onClick={() => window.print()}>Print</Button>}
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatusPill value={invoice.status} />
        <span className="text-sm text-muted">Issued {formatDay(invoice.issuedOn)} · Due {formatDay(invoice.dueOn)}</span>
      </div>
      {customer ? <Link href={customerHref(customer.id)} className="text-sm font-semibold text-brand">Open account</Link> : null}

      <div className="mt-4 space-y-3">
        {charges.filter((charge) => charge.status === "pending").map((charge) => (
          <ChargeCard key={charge.id} charge={charge} onApprove={() => approveCharge(charge.id)} onReject={() => rejectCharge(charge.id)} />
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-sand text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-3 py-3">{item.description}</td>
                <td className="px-3 py-3">{item.quantity}</td>
                <td className="px-3 py-3">{formatCents(item.amountCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between border-t border-line px-3 py-3 text-sm">
          <span>Total {formatCents(invoiceTotalCents(invoice))}</span>
          <span className="font-semibold">Balance {formatCents(balance)}</span>
        </div>
      </div>

      <section className="mt-4 rounded-xl border border-line bg-card p-4">
        <h2 className="text-2xl tracking-wide">Payments</h2>
        {payments.length === 0 ? <p className="mt-2 text-sm text-muted">No payments on this invoice.</p> : null}
        <ul className="mt-2 space-y-2 text-sm">
          {payments.map((payment) => (
            <li key={payment.id}>
              {payment.receiptNumber} · {formatCents(payment.amountCents)} · {payment.method === "demo_card" ? "Demo card" : "Demo ACH"} · {formatWhen(payment.createdAt)}
            </li>
          ))}
        </ul>
        {balance > 0 ? (
          <div className="no-print mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={() => payInvoice(invoice.id, "demo_card")}>Record demo card payment</Button>
            <Button type="button" variant="outline" onClick={() => payInvoice(invoice.id, "demo_ach")}>Record demo ACH payment</Button>
          </div>
        ) : (
          <p className="mt-3 text-sm font-semibold">Paid in full.</p>
        )}
        <p className="mt-2 text-xs text-muted">Demo payment. No card or bank number is collected or stored.</p>
      </section>

      {audit.length > 0 ? (
        <section className="mt-4 rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Audit</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {audit.map((event) => (
              <li key={event.id}>{formatWhen(event.at)} · {event.message}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={null}>
      <InvoiceDetail />
    </Suspense>
  );
}
