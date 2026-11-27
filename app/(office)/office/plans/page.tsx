import { OfficeHeader } from "@/components/office-shell";
import { PLANS, currentVersion } from "@/lib/catalog";
import { formatCents, formatDay } from "@/lib/format";

export default function PlansPage() {
  return (
    <div>
      <OfficeHeader title="Plans" subtitle="The driver charge uses the current version. Older versions stay on file and are not edited." />
      <div className="space-y-6">
        {PLANS.map((plan) => {
          const current = currentVersion(plan);
          return (
            <section key={plan.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-3xl tracking-wide">{plan.name}</h2>
                  <p className="text-sm text-muted">{plan.description}</p>
                </div>
                <p className="text-sm font-semibold">Current: version {current.version}</p>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="py-2">Version</th>
                      <th>Effective</th>
                      <th>Base</th>
                      <th>Included</th>
                      <th>Extra cart</th>
                      <th>Extra bag</th>
                      <th>Fuel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.versions.map((version) => (
                      <tr key={version.id} className="border-t border-line">
                        <td className="py-2 font-semibold">{version.version}{version.id === current.id ? " · current" : ""}</td>
                        <td>{formatDay(version.effectiveDate)}</td>
                        <td>{formatCents(version.basePriceCents)}</td>
                        <td>{version.includedCarts}</td>
                        <td>{formatCents(version.extraCartCents)}</td>
                        <td>{formatCents(version.extraBagCents)}</td>
                        <td>{formatCents(version.fuelFeeCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
