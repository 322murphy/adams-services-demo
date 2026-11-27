"use client";

import Link from "next/link";
import { useState } from "react";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { Select } from "@/components/ui/input";
import { formatWhen } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function WorkOrdersPage() {
  const { state } = useDemo();
  const [status, setStatus] = useState("all");
  const rows = state.workOrders.filter((order) => status === "all" || order.status === status);

  return (
    <div>
      <OfficeHeader title="Work orders" subtitle="Cart delivery from an approved signup shows up here." />
      <div className="mb-4 max-w-xs">
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </Select>
      </div>
      {rows.length === 0 ? <p className="text-sm text-muted">No work orders in that status.</p> : null}
      <div className="space-y-3">
        {rows.map((order) => {
          const customer = state.customers.find((item) => item.id === order.customerId);
          return (
            <article key={order.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{order.number} · {order.type}</p>
                  {customer ? <Link href={`/office/customers/${customer.id}`} className="text-sm font-semibold text-brand">{customer.name}</Link> : null}
                  <p className="text-sm text-muted">{order.instructions}</p>
                  <p className="text-xs text-muted">{formatWhen(order.createdAt)} · {order.priority} priority</p>
                </div>
                <StatusPill value={order.status} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
