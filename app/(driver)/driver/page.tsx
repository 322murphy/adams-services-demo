"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { StatusPill } from "@/components/status-pill";
import { calculateExtra } from "@/lib/billing";
import { MARIA_INVOICE_ID, ROUTE, currentVersion, planById } from "@/lib/catalog";
import { formatCents } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import { SAMPLE_EVIDENCE_NAME, SAMPLE_EVIDENCE_URL } from "@/lib/sample-evidence";
import type { CollectionResult, RouteStop } from "@/lib/types";

export default function DriverPage() {
  const { state, submitCollection } = useDemo();
  const [last, setLast] = useState<CollectionResult | null>(null);
  const stops = [...state.stops].sort((a, b) => a.sequence - b.sequence);
  const current = stops.find((stop) => stop.status === "scheduled");
  const done = stops.filter((stop) => stop.status !== "scheduled").length;

  return (
    <div className="bg-sand px-3 py-6">
      <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border border-ink bg-card shadow-xl">
        <header className="bg-ink px-4 py-4 text-cream">
          <p className="text-xs tracking-[0.16em] text-red-200">DRIVER</p>
          <h1 className="text-3xl tracking-wide text-white">{ROUTE.name}</h1>
          <p className="text-sm text-cream/80">{ROUTE.driverName} · Truck {ROUTE.truckNumber}</p>
          <p className="text-sm text-cream/70">{done} of {stops.length} recorded · {ROUTE.dateLabel}</p>
        </header>
        <div className="space-y-4 p-4">
          {last?.status === "recorded" ? (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-950">
              <p className="font-semibold">Stop recorded.</p>
              {last.amountCents > 0 ? (
                <p>Pending office approval: {formatCents(last.amountCents)}. That price came from the plan. You did not enter it.</p>
              ) : (
                <p>No extra charge.</p>
              )}
              <Link href={`/office/billing/${MARIA_INVOICE_ID}`} className="mt-1 inline-block font-semibold text-brand">Review it in the office</Link>
            </div>
          ) : null}
          {last?.status === "duplicate" ? <p className="rounded-xl bg-sand p-3 text-sm">That stop was already recorded. It was not charged again.</p> : null}
          {current ? (
            <StopForm key={current.id} stop={current} onDone={setLast} submit={submitCollection} />
          ) : (
            <div className="rounded-xl bg-sand p-4">
              <h2 className="text-2xl tracking-wide">Route complete</h2>
              <p className="mt-1 text-sm text-muted">Every stop on {ROUTE.name} has a record.</p>
            </div>
          )}
          <div className="space-y-2">
            {stops.map((stop) => {
              const customer = state.customers.find((item) => item.id === stop.customerId);
              const charge = state.charges.find((item) => item.stopId === stop.id);
              return (
                <div key={stop.id} className="flex items-center justify-between gap-2 text-sm">
                  <span>{stop.sequence}. {customer?.name}</span>
                  <span className="flex items-center gap-2">
                    {charge ? formatCents(charge.amountCents) : null}
                    <StatusPill value={stop.status} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StopForm({
  stop,
  submit,
  onDone,
}: {
  stop: RouteStop;
  submit: ReturnType<typeof useDemo>["submitCollection"];
  onDone: (result: CollectionResult) => void;
}) {
  const { state } = useDemo();
  const customer = state.customers.find((item) => item.id === stop.customerId);
  const property = state.properties.find((item) => item.id === stop.propertyId);
  const plan = planById(customer?.planId ?? "plan_residential");
  const rate = currentVersion(plan);
  const eventId = useRef("");
  const [carts, setCarts] = useState(customer?.id === "cus_maria" ? "2" : String(rate.includedCarts));
  const [bags, setBags] = useState(customer?.id === "cus_maria" ? "3" : "0");
  const [notes, setNotes] = useState("");
  const [exception, setException] = useState<"none" | "cart_not_out" | "blocked" | "missed">("none");
  const [photoName, setPhotoName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  const calc = calculateExtra({
    carts: Number(carts),
    bags: Number(bags),
    includedCarts: rate.includedCarts,
    extraCartCents: rate.extraCartCents,
    extraBagCents: rate.extraBagCents,
  });

  function attachSample() {
    setPhotoName(SAMPLE_EVIDENCE_NAME);
    setPhotoUrl(SAMPLE_EVIDENCE_URL);
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setPhotoUrl(result.length > 0 && result.length < 200000 ? result : "");
    };
    reader.readAsDataURL(file);
  }

  function record() {
    const cartCount = Number(carts);
    const bagCount = Number(bags);
    if (exception === "none" && (!Number.isInteger(cartCount) || !Number.isInteger(bagCount) || cartCount < 0 || bagCount < 0)) {
      setError("Enter whole numbers for carts and bags.");
      return;
    }
    setError("");
    if (!eventId.current) eventId.current = crypto.randomUUID();
    const result = submit({
      stopId: stop.id,
      carts: cartCount,
      bags: bagCount,
      notes,
      photoName,
      photoDataUrl: photoUrl,
      clientEventId: eventId.current,
      exception,
    });
    onDone(result);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Stop {stop.sequence}</p>
        <h2 className="text-3xl tracking-wide">{customer?.name}</h2>
        <p className="text-sm">{property?.line1}</p>
        <p className="text-sm text-muted">{property?.city}, {property?.state} {property?.zip}</p>
      </div>
      <div className="rounded-xl bg-sand p-3 text-sm">
        <p className="font-semibold">{plan.name}</p>
        <p>Included: {rate.includedCarts} × {customer?.cartSize} gal cart</p>
        <p>Gate code: {property?.gateCode || "None on file"}</p>
        <p>{property?.instructions || "No special instructions."}</p>
        <p className="text-muted">Service location on file {property?.lat.toFixed(3)}, {property?.lng.toFixed(3)}. Not live GPS.</p>
      </div>
      <Field label="Carts at the curb">
        <Input inputMode="numeric" className="h-14 text-lg" value={carts} onChange={(event) => setCarts(event.target.value)} />
      </Field>
      <Field label="Extra bags">
        <Input inputMode="numeric" className="h-14 text-lg" value={bags} onChange={(event) => setBags(event.target.value)} />
      </Field>
      <div className="rounded-xl border border-line p-3 text-sm">
        {exception === "none" ? (
          <>
            <p className="font-semibold">Office rate · {formatCents(calc.amountCents)}</p>
            <p>{`${calc.extraCarts} extra cart${calc.extraCarts === 1 ? "" : "s"} × ${formatCents(rate.extraCartCents)} + ${calc.extraBags} extra bag${calc.extraBags === 1 ? "" : "s"} × ${formatCents(rate.extraBagCents)}`}</p>
            <p className="text-muted">There is no price field. The plan sets this number.</p>
          </>
        ) : (
          <p>This exception does not create an extra charge.</p>
        )}
      </div>
      <Field label="Exception">
        <Select value={exception} onChange={(event) => setException(event.target.value as typeof exception)}>
          <option value="none">Record collection</option>
          <option value="cart_not_out">Cart not out</option>
          <option value="blocked">Blocked</option>
          <option value="missed">Missed</option>
        </Select>
      </Field>
      <Field label="Notes">
        <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional note for the office" />
      </Field>
      <div className="space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onFile(event.target.files?.[0])}
          className="block w-full text-sm"
        />
        <Button type="button" variant="outline" className="w-full" onClick={attachSample}>Attach sample evidence</Button>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="Evidence preview" className="max-h-40 rounded-md border border-line" />
        ) : photoName ? <p className="text-sm text-muted">{photoName} attached. The full image stayed on this phone.</p> : null}
      </div>
      {error ? <p className="text-sm text-brand">{error}</p> : null}
      <Button type="button" size="xl" className="w-full" onClick={record}>
        {exception === "none" ? "Submit stop" : "Record exception"}
      </Button>
    </div>
  );
}
