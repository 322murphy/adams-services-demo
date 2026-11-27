"use client";

import { useState } from "react";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { PLANS, currentVersion } from "@/lib/catalog";
import { formatCents, formatWhen } from "@/lib/format";
import type { ExtraCharge, PlanVersion } from "@/lib/types";

function rateFor(versionId: string): PlanVersion {
  for (const plan of PLANS) {
    const version = plan.versions.find((item) => item.id === versionId);
    if (version) return version;
  }
  return currentVersion(PLANS[0]);
}

export function ChargeCard({
  charge,
  onApprove,
  onReject,
}: {
  charge: ExtraCharge;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const rate = rateFor(charge.planVersionId);
  const [confirmReject, setConfirmReject] = useState(false);
  return (
    <article className="rounded-xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-ink">
            {`${charge.extraCarts} extra cart${charge.extraCarts === 1 ? "" : "s"}, ${charge.extraBags} extra bag${charge.extraBags === 1 ? "" : "s"}`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {charge.extraCarts} × {formatCents(rate.extraCartCents)} + {charge.extraBags} × {formatCents(rate.extraBagCents)} = {formatCents(charge.amountCents)}
          </p>
          <p className="text-sm text-muted">Recorded {formatWhen(charge.createdAt)} · plan allows {charge.includedCarts} cart · driver counted {charge.carts} carts and {charge.bags} bags</p>
          {charge.notes ? <p className="mt-1 text-sm">{charge.notes}</p> : null}
          {charge.photoName ? <p className="text-sm text-muted">Evidence file: {charge.photoName}</p> : null}
        </div>
        <StatusPill value={charge.status} />
      </div>
      {charge.photoDataUrl ? (
        // Data URLs from the driver phone are local to this browser.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={charge.photoDataUrl} alt="Collection evidence" className="mt-3 max-h-48 rounded-md border border-line" />
      ) : null}
      {charge.status === "pending" && (onApprove || onReject) ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {onApprove ? <Button type="button" onClick={onApprove}>Approve onto invoice</Button> : null}
          {onReject ? (
            confirmReject ? (
              <Button type="button" variant="outline" onClick={onReject}>Confirm reject</Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => setConfirmReject(true)}>Reject</Button>
            )
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
