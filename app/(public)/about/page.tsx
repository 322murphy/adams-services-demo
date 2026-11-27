import { COMPANY } from "@/lib/catalog";

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">{COMPANY.city}</p>
      <h1 className="mt-2 text-5xl tracking-wide">About Adams Services</h1>
      <div className="mt-6 space-y-4 text-lg text-muted">
        <p>Adams Services collects trash for houses and businesses in Bastrop and the nearby ZIPs on the route.</p>
        <p>The public site, the office records, billing, the customer portal, and the driver stop list are one system. A signup on the website shows up in the office. A count from the truck becomes a charge on the next invoice.</p>
        <p>Office hours are {COMPANY.hours}. Call {COMPANY.phoneDisplay}.</p>
        <p>This website is a working prototype on sample customers. It is not a published claim about years in business, fleet size, or reviews.</p>
      </div>
    </article>
  );
}
