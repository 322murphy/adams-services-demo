"use client";

import { useState } from "react";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { Select } from "@/components/ui/input";
import { VEHICLES } from "@/lib/catalog";
import { formatDay } from "@/lib/format";

export default function FleetPage() {
  const [status, setStatus] = useState("all");
  const rows = VEHICLES.filter((vehicle) => status === "all" || vehicle.status === status);

  return (
    <div>
      <OfficeHeader title="Fleet" subtitle="Truck records for the sample yard. No GPS hardware is connected." />
      <div className="mb-4 max-w-xs">
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="in service">In service</option>
          <option value="maintenance">Maintenance</option>
          <option value="out of service">Out of service</option>
        </Select>
      </div>
      {rows.length === 0 ? <p className="text-sm text-muted">No trucks in that status.</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((vehicle) => (
          <article key={vehicle.id} className="rounded-xl border border-line bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl tracking-wide">Truck {vehicle.number}</h2>
              <StatusPill value={vehicle.status} />
            </div>
            <p className="mt-2 text-sm">{vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.type} · {vehicle.capacity}</p>
            <p className="text-sm text-muted">Plate {vehicle.plate} · VIN {vehicle.vin}</p>
            <p className="text-sm">Mileage {vehicle.mileage.toLocaleString("en-US")} · Driver {vehicle.driver}</p>
            <p className="text-sm">Insurance through {formatDay(vehicle.insuranceExpires)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
