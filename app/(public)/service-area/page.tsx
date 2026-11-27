import { AvailabilityCheck } from "@/components/availability-check";
import { TERRITORY } from "@/lib/catalog";

export default function ServiceAreaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-5xl tracking-wide">Service area</h1>
      <p className="mt-3 max-w-2xl text-muted">
        These ZIPs are in the sample territory. A ZIP that is not on the list can still send an inquiry. It does not start service.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-sand text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2">ZIP</th>
              <th className="px-3 py-2">City</th>
              <th className="px-3 py-2">Collection day</th>
            </tr>
          </thead>
          <tbody>
            {TERRITORY.map((row) => (
              <tr key={row.zip} className="border-t border-line">
                <td className="px-3 py-3 font-semibold">{row.zip}</td>
                <td className="px-3 py-3">{row.city}</td>
                <td className="px-3 py-3">{row.day}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">
        Thanksgiving Day, November 26, 2026, had no pickup. Friday, November 27 runs on schedule. Christmas Day has no pickup, and that route moves to the next business day.
      </p>
      <div className="mt-8">
        <AvailabilityCheck />
      </div>
    </div>
  );
}
