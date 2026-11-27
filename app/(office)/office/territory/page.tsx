"use client";

import Link from "next/link";
import { OfficeHeader } from "@/components/office-shell";
import { ServiceMap } from "@/components/service-map";
import { StatusPill } from "@/components/status-pill";
import { TERRITORY, territoryForZip } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";
import { customerHref } from "@/lib/hrefs";

export default function TerritoryPage() {
  const { state } = useDemo();
  const inside = state.properties.filter((property) => property.inTerritory);
  const outside = state.properties.filter((property) => !property.inTerritory);

  return (
    <div>
      <OfficeHeader title="Territory" subtitle="Collection days, towns, and today's numbered truck route." />
      <ServiceMap variant="territory" customers={state.customers} properties={state.properties} stops={state.stops} />
      <div className="mt-4 rounded-xl border border-line bg-card p-4">
        <h2 className="text-2xl tracking-wide">ZIP coverage</h2>
        <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
          {TERRITORY.map((row) => (
            <li key={row.zip}>{row.zip} · {row.city} · {row.day}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section>
          <h2 className="mb-2 text-2xl tracking-wide">Inside</h2>
          <ul className="space-y-2 text-sm">
            {inside.map((property) => {
              const customer = state.customers.find((item) => item.id === property.customerId);
              if (!customer) return null;
              return (
                <li key={property.id} className="rounded-lg border border-line bg-card px-3 py-2">
                  <Link href={customerHref(customer.id)} className="font-semibold text-brand">{customer.name}</Link>
                  <span className="text-muted"> · {property.city} {property.zip} · {territoryForZip(property.zip)?.day}</span>
                  <span className="ml-2"><StatusPill value={customer.status} /></span>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-2xl tracking-wide">Outside</h2>
          {outside.length === 0 ? <p className="text-sm text-muted">No outside accounts.</p> : null}
          <ul className="space-y-2 text-sm">
            {outside.map((property) => {
              const customer = state.customers.find((item) => item.id === property.customerId);
              if (!customer) return null;
              return (
                <li key={property.id} className="rounded-lg border border-line bg-card px-3 py-2">
                  <Link href={customerHref(customer.id)} className="font-semibold text-brand">{customer.name}</Link>
                  <span className="text-muted"> · {property.city} {property.zip}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
