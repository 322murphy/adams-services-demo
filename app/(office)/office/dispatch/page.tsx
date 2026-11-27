"use client";

import Link from "next/link";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { ServiceMap } from "@/components/service-map";
import { ROUTE } from "@/lib/catalog";
import { formatCents, formatWhen } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import { customerHref } from "@/lib/hrefs";

export default function DispatchPage() {
  const { state } = useDemo();
  const stops = [...state.stops].sort((a, b) => a.sequence - b.sequence);
  const done = stops.filter((stop) => stop.status !== "scheduled").length;
  const width = stops.length === 0 ? 0 : Math.round((done / stops.length) * 100);

  return (
    <div>
      <OfficeHeader title={ROUTE.name} subtitle={`${ROUTE.dateLabel} · ${ROUTE.driverName} · Truck ${ROUTE.truckNumber}. Follow the numbers on the map.`} />
      <div className="mb-4">
        <ServiceMap variant="route" customers={state.customers} properties={state.properties} stops={stops} />
      </div>
      <div className="mb-4 rounded-xl border border-line bg-card p-4">
        <p className="text-sm text-muted">{done} of {stops.length} stops recorded</p>
        <div className="mt-2 h-2 rounded-full bg-sand">
          <div className="h-2 rounded-full bg-brand" style={{ width: `${width}%` }} />
        </div>
      </div>
      <div className="space-y-3">
        {stops.map((stop) => {
          const customer = state.customers.find((item) => item.id === stop.customerId);
          const property = state.properties.find((item) => item.id === stop.propertyId);
          const charge = state.charges.find((item) => item.stopId === stop.id);
          return (
            <article key={stop.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-muted">Stop {stop.sequence}</p>
                  <Link href={customer ? customerHref(customer.id) : "/office/customers"} className="text-lg font-semibold text-brand">{customer?.name}</Link>
                  <p className="text-sm text-muted">{property?.line1}, {property?.city}</p>
                  {stop.completedAt ? <p className="text-xs text-muted">{formatWhen(stop.completedAt)}</p> : null}
                </div>
                <StatusPill value={stop.status} />
              </div>
              {charge ? <p className="mt-2 text-sm">Extra {formatCents(charge.amountCents)} · {charge.status}</p> : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
