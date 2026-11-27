"use client";

import Link from "next/link";
import { useState } from "react";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { Select } from "@/components/ui/input";
import { DataTable, Td, Th } from "@/components/ui/table";
import { EQUIPMENT } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";
import { customerHref } from "@/lib/hrefs";

export default function EquipmentPage() {
  const { state } = useDemo();
  const [status, setStatus] = useState("all");
  const rows = EQUIPMENT.filter((item) => status === "all" || item.status === status);

  return (
    <div>
      <OfficeHeader title="Equipment" subtitle="Carts and dumpsters in the sample yard." />
      <div className="mb-4 max-w-xs">
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
          <option value="pending delivery">Pending delivery</option>
          <option value="damaged">Damaged</option>
        </Select>
      </div>
      {rows.length === 0 ? <p className="text-sm text-muted">Nothing in that status.</p> : null}
      <DataTable>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Type</Th>
            <Th>Size</Th>
            <Th>Status</Th>
            <Th>Condition</Th>
            <Th>Account</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const customer = state.customers.find((customer) => customer.id === item.customerId);
            return (
              <tr key={item.id}>
                <Td className="font-semibold">{item.code}</Td>
                <Td>{item.type}</Td>
                <Td>{item.size}</Td>
                <Td><StatusPill value={item.status} /></Td>
                <Td>{item.condition}</Td>
                <Td>
                  {customer ? <Link className="font-semibold text-brand" href={customerHref(customer.id)}>{customer.name}</Link> : "Yard"}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </div>
  );
}
