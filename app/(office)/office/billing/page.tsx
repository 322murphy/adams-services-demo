"use client";

import Link from "next/link";
import { ChargeCard } from "@/components/charge-card";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { DataTable, Td, Th } from "@/components/ui/table";
import { invoiceBalanceCents, invoiceTotalCents } from "@/lib/billing";
import { formatCents, formatDay } from "@/lib/format";
import { invoiceHref } from "@/lib/hrefs";
import { useDemo } from "@/lib/demo-store";
import { isPastDue } from "@/lib/reduce";

export default function BillingPage() {
  const { state, approveCharge, rejectCharge } = useDemo();
  const pending = state.charges.filter((charge) => charge.status === "pending");

  return (
    <div>
      <OfficeHeader title="Billing" subtitle="Money is stored in cents. Demo payments do not call a processor." />
      {pending.length > 0 ? (
        <section className="mb-6 space-y-3">
          <h2 className="text-2xl tracking-wide">Pending extras</h2>
          {pending.map((charge) => {
            const customer = state.customers.find((item) => item.id === charge.customerId);
            return (
              <div key={charge.id}>
                <p className="mb-1 text-sm font-semibold">{customer?.name} · {customer?.accountNumber}</p>
                <ChargeCard charge={charge} onApprove={() => approveCharge(charge.id)} onReject={() => rejectCharge(charge.id)} />
              </div>
            );
          })}
        </section>
      ) : null}
      <DataTable>
        <thead>
          <tr>
            <Th>Invoice</Th>
            <Th>Customer</Th>
            <Th>Issued</Th>
            <Th>Due</Th>
            <Th>Total</Th>
            <Th>Balance</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {state.invoices.map((invoice) => {
            const customer = state.customers.find((item) => item.id === invoice.customerId);
            const balance = invoiceBalanceCents(invoice, state.payments);
            return (
              <tr key={invoice.id}>
                <Td><Link className="font-semibold text-brand" href={invoiceHref(invoice.id)}>{invoice.number}</Link></Td>
                <Td>{customer?.name}</Td>
                <Td>{formatDay(invoice.issuedOn)}</Td>
                <Td>{formatDay(invoice.dueOn)}{isPastDue(invoice, state.payments) ? " · past due" : ""}</Td>
                <Td>{formatCents(invoiceTotalCents(invoice))}</Td>
                <Td>{formatCents(balance)}</Td>
                <Td><StatusPill value={invoice.status} /></Td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </div>
  );
}
