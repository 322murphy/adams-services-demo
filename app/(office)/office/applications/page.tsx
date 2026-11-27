"use client";

import Link from "next/link";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { planById } from "@/lib/catalog";
import { formatWhen } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function ApplicationsPage() {
  const { state, approveApplication } = useDemo();
  const waiting = state.applications.filter((item) => item.status === "pending");

  return (
    <div>
      <OfficeHeader title="Applications" subtitle="In-territory requests can be approved. Outside ZIPs stay inquiries." />
      {waiting.length === 0 ? <p className="mb-4 text-sm text-muted">No applications waiting.</p> : null}
      <div className="space-y-3">
        {state.applications.map((application) => (
          <article key={application.id} className="rounded-xl border border-line bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{application.number} · {application.name}</p>
                <p className="text-sm text-muted">{application.line1}, {application.city}, {application.state} {application.zip}</p>
                <p className="text-sm text-muted">{application.email} · {application.phone}</p>
                <p className="text-sm">{planById(application.planId).name} · {application.frequency} · {application.cartCount} × {application.cartSize} gal</p>
                <p className="text-xs text-muted">{formatWhen(application.createdAt)}</p>
              </div>
              <StatusPill value={application.status} />
            </div>
            <div className="mt-3">
              {application.status === "pending" ? (
                <Button type="button" onClick={() => approveApplication(application.id)}>Approve and activate</Button>
              ) : null}
              {application.status === "inquiry" ? <p className="text-sm text-muted">Outside the service area. No subscription is created.</p> : null}
              {application.status === "approved" && application.customerId ? (
                <Link href={`/office/customers/${application.customerId}`} className="text-sm font-semibold text-brand">Open the account</Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
