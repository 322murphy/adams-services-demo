"use client";

import Link from "next/link";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { TERRITORY, projectPoint } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";

export default function TerritoryPage() {
  const { state } = useDemo();
  const inside = state.properties.filter((property) => property.inTerritory);
  const outside = state.properties.filter((property) => !property.inTerritory);

  return (
    <div>
      <OfficeHeader title="Territory" subtitle="Schematic service map for the meeting. It is not a live GPS feed." />
      <div className="grid gap-4 lg:grid-cols-2">
        <svg viewBox="0 0 400 260" className="h-auto w-full rounded-xl border border-line bg-[#e7f0e4]">
          <path d="M48 48 L310 36 L360 90 L332 210 L70 220 Z" fill="#d7e7d1" stroke="#5f7d55" />
          <text x="138" y="128" fontSize="13" fill="#3d5a40">Bastrop service area</text>
          {inside.map((property) => {
            const point = projectPoint(property.lat, property.lng);
            if (!point.inside) return null;
            const customer = state.customers.find((item) => item.id === property.customerId);
            return (
              <g key={property.id}>
                <circle cx={point.x} cy={point.y} r="6" fill="#1f3d2b" />
                <title>{customer?.name}</title>
              </g>
            );
          })}
        </svg>
        <div className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-2xl tracking-wide">ZIP coverage</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {TERRITORY.map((row) => (
              <li key={row.zip}>{row.zip} · {row.city} · {row.day}</li>
            ))}
          </ul>
        </div>
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
                  <Link href={`/office/customers/${customer.id}`} className="font-semibold text-brand">{customer.name}</Link>
                  <span className="text-muted"> · {property.zip} · {property.city}</span>
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
                  <Link href={`/office/customers/${customer.id}`} className="font-semibold text-brand">{customer.name}</Link>
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
