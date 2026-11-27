"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { currentVersion, planById, territoryForZip } from "@/lib/catalog";
import { invoiceBalanceCents } from "@/lib/billing";
import { formatCents, formatDay, formatWhen } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function CustomerDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { state, addNote, activateCustomer } = useDemo();
  const [note, setNote] = useState("");
  const customer = state.customers.find((item) => item.id === id);

  if (!customer) {
    return (
      <div>
        <OfficeHeader title="Account not found" />
        <Link href="/office/customers" className="font-semibold text-brand">Back to customers</Link>
      </div>
    );
  }

  const property = state.properties.find((item) => item.customerId === customer.id);
  const contacts = state.contacts.filter((item) => item.customerId === customer.id);
  const plan = planById(customer.planId);
  const rate = currentVersion(plan);
  const notes = state.notes.filter((item) => item.customerId === customer.id);
  const history = state.statusHistory.filter((item) => item.customerId === customer.id);
  const invoices = state.invoices.filter((item) => item.customerId === customer.id);
  const orders = state.workOrders.filter((item) => item.customerId === customer.id);
  const day = property ? territoryForZip(property.zip)?.day ?? "Not on a route" : "Not on a route";

  return (
    <div>
      <OfficeHeader
        title={customer.name}
        subtitle={`${customer.accountNumber} · ${customer.type}`}
        action={customer.status === "pending" ? <Button type="button" onClick={() => activateCustomer(customer.id)}>Activate account</Button> : undefined}
      />
      <div className="mb-4"><StatusPill value={customer.status} /></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Contacts</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <p className="font-semibold">{contact.name} · {contact.role}</p>
                <p>{contact.phone}</p>
                <p className="text-muted">{contact.email}</p>
              </li>
            ))}
          </ul>
          {customer.emergencyContact ? <p className="mt-3 text-sm">Emergency: {customer.emergencyContact}</p> : null}
        </section>
        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Service address</h2>
          {property ? (
            <div className="mt-3 text-sm">
              <p>{property.line1}</p>
              <p>{property.city}, {property.state} {property.zip}</p>
              <p className="mt-2">Collection day: {day}</p>
              <p>Gate code: {property.gateCode || "None on file"}</p>
              <p>Instructions: {property.instructions || "None"}</p>
              <p className="text-muted">On file: {property.lat.toFixed(3)}, {property.lng.toFixed(3)}. Not a live GPS reading.</p>
              <p>{property.inTerritory ? "Inside the service area." : "Outside the service area."}</p>
            </div>
          ) : <p className="mt-3 text-sm text-muted">No property on file.</p>}
        </section>
        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Plan</h2>
          <p className="mt-3 font-semibold">{plan.name}</p>
          <p className="text-sm text-muted">Version {rate.version} since {formatDay(rate.effectiveDate)} · {customer.frequency} · {customer.cartCount} × {customer.cartSize} gal</p>
          <p className="mt-2 text-sm">{formatCents(rate.basePriceCents)} / month · extra cart {formatCents(rate.extraCartCents)} · extra bag {formatCents(rate.extraBagCents)}</p>
          <p className="text-sm">AutoPay: {customer.autopay ? "On" : "Off"}</p>
        </section>
        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">Invoices</h2>
          {invoices.length === 0 ? <p className="mt-3 text-sm text-muted">No invoices yet.</p> : null}
          <ul className="mt-3 space-y-2 text-sm">
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                <Link href={`/office/billing/${invoice.id}`} className="font-semibold text-brand">{invoice.number}</Link>
                <span className="text-muted"> · balance {formatCents(invoiceBalanceCents(invoice, state.payments))}</span>
              </li>
            ))}
          </ul>
          {orders.length > 0 ? (
            <div className="mt-4">
              <h3 className="font-semibold">Work orders</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {orders.map((order) => (
                  <li key={order.id}>{order.number} · {order.type} · {order.status}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-line bg-card p-4">
        <h2 className="text-2xl tracking-wide">Notes</h2>
        {notes.length === 0 ? <p className="mt-3 text-sm text-muted">No notes yet.</p> : null}
        <ul className="mt-3 space-y-2 text-sm">
          {notes.map((item) => (
            <li key={item.id}>
              <p>{item.body}</p>
              <p className="text-xs text-muted">{item.author} · {formatWhen(item.createdAt)}</p>
            </li>
          ))}
        </ul>
        <form
          className="mt-4 space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            addNote(customer.id, note);
            setNote("");
          }}
        >
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a note the office and driver can use" />
          <Button type="submit" variant="outline" disabled={!note.trim()}>Add note</Button>
        </form>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-card p-4">
        <h2 className="text-2xl tracking-wide">Status history</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {history.map((item) => (
            <li key={item.id}>{formatWhen(item.at)} · {item.from} to {item.to}. {item.note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
