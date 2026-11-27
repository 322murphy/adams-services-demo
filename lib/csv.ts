import type { Customer, Property } from "@/lib/types";

export function customersToCsv(
  rows: { customer: Customer; property?: Property; planName: string }[],
): string {
  const header = ["Account", "Name", "Type", "Status", "Email", "Phone", "Address", "City", "ZIP", "Plan"];
  const lines = rows.map(({ customer, property, planName }) => [
    customer.accountNumber,
    customer.name,
    customer.type,
    customer.status,
    customer.email,
    customer.phone,
    property?.line1 ?? "",
    property?.city ?? "",
    property?.zip ?? "",
    planName,
  ]);
  return [header, ...lines].map((columns) => columns.map(csvCell).join(",")).join("\n");
}

export function downloadText(filename: string, contents: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}
