"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { PLANS, currentVersion, territoryForZip } from "@/lib/catalog";
import { formatCents } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

const inquirySchema = z.object({
  name: z.string().min(2, { error: "Enter a name" }),
  email: z.email({ error: "Enter a valid email" }),
  phone: z.string().min(7, { error: "Enter a phone number" }),
  line1: z.string().min(4, { error: "Enter the street address" }),
  city: z.string().min(2, { error: "Enter the city" }),
  zip: z.string().regex(/^\d{5}$/, { error: "Enter a 5-digit ZIP" }),
});

export function AvailabilityCheck() {
  const { submitApplication } = useDemo();
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [checked, setChecked] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [inquiryError, setInquiryError] = useState("");
  const [sent, setSent] = useState("");

  const area = checked ? territoryForZip(checked) : null;

  function check(event: React.FormEvent) {
    event.preventDefault();
    setSent("");
    setInquiryError("");
    if (!/^\d{5}$/.test(zip.trim())) {
      setError("Enter a 5-digit ZIP.");
      setChecked(null);
      return;
    }
    setError("");
    setChecked(zip.trim());
  }

  function sendInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = inquirySchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      line1: street || form.get("line1"),
      city: form.get("city"),
      zip: checked,
    });
    if (!parsed.success) {
      setInquiryError(parsed.error.issues[0]?.message ?? "Check the inquiry fields.");
      return;
    }
    const result = submitApplication({
      ...parsed.data,
      state: "TX",
      planId: "plan_residential",
      frequency: "weekly",
      cartSize: "95",
      cartCount: 1,
    });
    if (!result.ok) {
      setInquiryError(result.reason);
      return;
    }
    setSent(result.application.number);
  }

  return (
    <div className="rounded-sm border-t-4 border-brand bg-card p-6 shadow-xl">
      <h2 className="brand-heading text-2xl text-ink">Is your street on the route?</h2>
      <p className="mt-1 text-sm text-muted">We match the ZIP to the current service area. This demo does not call a maps service.</p>
      <form onSubmit={check} className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px_auto]">
        <Field label="Street">
          <Input value={street} onChange={(event) => setStreet(event.target.value)} placeholder="184 Pecan Street" />
        </Field>
        <Field label="ZIP" error={error}>
          <Input inputMode="numeric" value={zip} onChange={(event) => setZip(event.target.value)} placeholder="78602" />
        </Field>
        <div className="sm:pt-6">
          <Button type="submit" className="brand-heading w-full rounded-sm">Check</Button>
        </div>
      </form>

      {checked && area ? (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm">
          <p className="font-semibold text-emerald-950">{checked} is in service. Collection day: {area.day}. City: {area.city}.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {PLANS.map((plan) => {
              const rate = currentVersion(plan);
              return (
                <div key={plan.id} className="rounded-lg bg-white p-3">
                  <p className="font-semibold">{plan.name}</p>
                  <p className="text-lg">{formatCents(rate.basePriceCents)} / month</p>
                  <Link href={`/start?zip=${checked}&plan=${plan.id}`} className="mt-2 inline-block font-semibold text-brand">
                    Start this plan
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {checked && !area ? (
        <form onSubmit={sendInquiry} className="mt-4 rounded-xl bg-sand p-4">
          <p className="font-semibold text-ink">{checked} is outside the service area.</p>
          <p className="mt-1 text-sm text-muted">We will save this as an inquiry. It does not open a subscription.</p>
          {sent ? (
            <p className="mt-3 font-semibold">Inquiry {sent} is in the office queue.</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Name"><Input name="name" /></Field>
              <Field label="Email"><Input name="email" type="email" /></Field>
              <Field label="Phone"><Input name="phone" /></Field>
              <Field label="City"><Input name="city" defaultValue="Austin" /></Field>
              <div className="sm:col-span-2">
                {inquiryError ? <p className="mb-2 text-sm text-brand">{inquiryError}</p> : null}
                <Button type="submit">Send inquiry</Button>
              </div>
            </div>
          )}
        </form>
      ) : null}
    </div>
  );
}
