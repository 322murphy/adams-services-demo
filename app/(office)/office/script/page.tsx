import Link from "next/link";
import { OfficeHeader } from "@/components/office-shell";
import { invoiceHref } from "@/lib/hrefs";

const steps = [
  { href: "/", title: "Public site", text: "Check ZIP 78602, then 78704. The first is on the Friday route. The second becomes an inquiry." },
  { href: "/start", title: "Start service", text: "Use sample signup, leave the agreement checked, and submit. The request lands in the office." },
  { href: "/office/applications", title: "Approve", text: "Approve the new request or Dana Ruiz. That opens an account and a cart-delivery work order." },
  { href: "/office/customers", title: "CRM", text: "Search, filter, open Maria Gonzalez, add a note, and export the current list to CSV." },
  { href: "/office/plans", title: "Plans and territory", text: "Show rate version 2, then the ZIP list and the service map." },
  { href: invoiceHref("inv_1048"), title: "Invoice", text: "Open INV-1048. Balance is service plus fuel. No card data is on the page." },
  { href: "/portal", title: "Customer portal", text: "Maria can record a demo card payment. The same invoice updates in the office." },
  { href: "/office/dispatch", title: "Dispatch", text: "Friday Bastrop is in progress. Maria is still scheduled." },
  { href: "/driver", title: "Driver", text: "Leave 2 carts and 3 bags, attach sample evidence, and submit. The screen shows $25. The driver never types a price." },
  { href: invoiceHref("inv_1048"), title: "Approve the extra", text: "Approve the pending charge onto INV-1048. If Maria already paid, the balance comes back by $25." },
  { href: "/portal", title: "Customer sees the charge", text: "The portal lists the extra carts and bags, the rate, and the new balance." },
  { href: "/office/reports", title: "The rest of the operation", text: "Then open fleet, equipment, work orders, and reports. Reset sample data in the top bar to run it again." },
];

export default function ScriptPage() {
  return (
    <div>
      <OfficeHeader title="Meeting script" subtitle="Working prototype on sample data. Say that out loud. Payments, text messages, and GPS are not live." />
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border border-line bg-card p-4">
            <p className="text-sm font-semibold text-brand">Step {index + 1}</p>
            <h2 className="text-2xl tracking-wide">{step.title}</h2>
            <p className="mt-1 text-sm text-muted">{step.text}</p>
            <Link href={step.href} className="mt-2 inline-block text-sm font-semibold text-brand">Open this screen</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
