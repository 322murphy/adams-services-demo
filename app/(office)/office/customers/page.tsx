"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { OfficeHeader } from "@/components/office-shell";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Td, Th } from "@/components/ui/table";
import { planById } from "@/lib/catalog";
import { customersToCsv, downloadText } from "@/lib/csv";
import { useDemo } from "@/lib/demo-store";
import { customerHref } from "@/lib/hrefs";
import type { CustomerStatus, CustomerType } from "@/lib/types";

const statuses: Array<CustomerStatus | "all"> = ["all", "lead", "pending", "active", "hold", "suspended", "canceled", "archived"];

export default function CustomersPage() {
  const { state } = useDemo();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [type, setType] = useState<CustomerType | "all">("all");

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return state.customers.filter((customer) => {
      const property = state.properties.find((item) => item.customerId === customer.id);
      const haystack = [customer.name, customer.accountNumber, customer.email, customer.phone, property?.line1, property?.city, property?.zip]
        .join(" ")
        .toLowerCase();
      return (
        (!query || haystack.includes(query)) &&
        (status === "all" || customer.status === status) &&
        (type === "all" || customer.type === type)
      );
    });
  }, [search, state.customers, state.properties, status, type]);

  function exportCsv() {
    const csv = customersToCsv(
      rows.map((customer) => ({
        customer,
        property: state.properties.find((item) => item.customerId === customer.id),
        planName: planById(customer.planId).name,
      })),
    );
    downloadText("adams-customers.csv", csv);
  }

  return (
    <div>
      <OfficeHeader
        title="Customers"
        subtitle={`Showing ${rows.length} of ${state.customers.length} sample accounts.`}
        action={<Button type="button" variant="outline" onClick={exportCsv}>Export CSV</Button>}
      />
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, account, phone, address, ZIP" />
        <Select value={status} onChange={(event) => setStatus(event.target.value as CustomerStatus | "all")}>
          {statuses.map((item) => (
            <option key={item} value={item}>{item === "all" ? "All statuses" : item}</option>
          ))}
        </Select>
        <Select value={type} onChange={(event) => setType(event.target.value as CustomerType | "all")}>
          <option value="all">All types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </Select>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-card p-8 text-center text-muted">No customers match that search.</p>
      ) : (
        <DataTable>
          <thead>
            <tr>
              <Th>Account</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>City</Th>
              <Th>Plan</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((customer) => {
              const property = state.properties.find((item) => item.customerId === customer.id);
              return (
                <tr key={customer.id} className="hover:bg-sand/50">
                  <Td><Link className="font-semibold text-brand" href={customerHref(customer.id)}>{customer.accountNumber}</Link></Td>
                  <Td>{customer.name}</Td>
                  <Td className="capitalize">{customer.type}</Td>
                  <Td><StatusPill value={customer.status} /></Td>
                  <Td>{property?.city} {property?.zip}</Td>
                  <Td>{planById(customer.planId).name}</Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      )}
    </div>
  );
}
