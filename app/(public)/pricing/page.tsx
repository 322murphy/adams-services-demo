import Link from "next/link";
import { PLANS, currentVersion } from "@/lib/catalog";
import { formatCents, formatDay } from "@/lib/format";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-5xl tracking-wide">Plans and pricing</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Prices below are the current rate version. Older versions stay on file so a past invoice does not change when the rate changes. Fuel is a separate line on the invoice.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {PLANS.map((plan) => {
          const rate = currentVersion(plan);
          return (
            <article key={plan.id} className="rounded-2xl border border-line bg-card p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">Version {rate.version} · since {formatDay(rate.effectiveDate)}</p>
              <h2 className="mt-2 text-4xl tracking-wide">{plan.name}</h2>
              <p className="mt-3 text-4xl">{formatCents(rate.basePriceCents)}<span className="text-base text-muted"> / month</span></p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>{rate.includedCarts} included</li>
                <li>Extra cart {formatCents(rate.extraCartCents)}</li>
                <li>Extra bag {formatCents(rate.extraBagCents)}</li>
                <li>Fuel and environmental {formatCents(rate.fuelFeeCents)}</li>
                <li>Cart delivery {formatCents(rate.deliveryFeeCents)}</li>
              </ul>
              <Link href={`/start?plan=${plan.id}`} className="mt-5 inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-semibold text-white">
                Start this plan
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
