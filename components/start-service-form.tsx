"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { PLANS, currentVersion, territoryForZip } from "@/lib/catalog";
import { formatCents } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import type { Application } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, { error: "Enter the account name" }),
  email: z.email({ error: "Enter a valid email" }),
  phone: z.string().min(7, { error: "Enter a phone number" }),
  line1: z.string().min(4, { error: "Enter the service address" }),
  city: z.string().min(2, { error: "Enter the city" }),
  state: z.string().min(2, { error: "Enter the state" }),
  zip: z.string().regex(/^\d{5}$/, { error: "Enter a 5-digit ZIP" }),
  planId: z.string().min(1),
  frequency: z.enum(["weekly", "biweekly"]),
  cartSize: z.enum(["35", "65", "95"]),
  cartCount: z.number().int().min(1, { error: "Choose at least 1 cart" }).max(6),
  agreement: z.literal(true, { error: "Accept the service agreement to continue" }),
});

type StartValues = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  planId: string;
  frequency: "weekly" | "biweekly";
  cartSize: "35" | "65" | "95";
  cartCount: number;
  agreement: boolean;
};

export function StartServiceForm() {
  const params = useSearchParams();
  const { submitApplication } = useDemo();
  const [done, setDone] = useState<Application | null>(null);
  const [blocked, setBlocked] = useState("");
  const [zip, setZip] = useState(params.get("zip") ?? "");
  const [agreed, setAgreed] = useState(false);

  const form = useForm<StartValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      line1: "",
      city: "",
      state: "TX",
      zip: params.get("zip") ?? "",
      planId: params.get("plan") ?? "plan_residential",
      frequency: "weekly",
      cartSize: "95",
      cartCount: 1,
      agreement: false,
    },
  });

  const area = /^\d{5}$/.test(zip) ? territoryForZip(zip) : null;
  const zipReady = /^\d{5}$/.test(zip);

  function fillSample() {
    form.setValue("name", "Alex Pena");
    form.setValue("email", "alex.pena@example.com");
    form.setValue("phone", "512-555-0148");
    form.setValue("line1", "22 Elm Street");
    form.setValue("city", "Bastrop");
    form.setValue("state", "TX");
    form.setValue("zip", "78602");
    form.setValue("planId", "plan_residential");
    form.setValue("frequency", "weekly");
    form.setValue("cartSize", "95");
    form.setValue("cartCount", 1);
    form.setValue("agreement", true);
    setZip("78602");
    setAgreed(true);
  }

  const onSubmit = form.handleSubmit((values) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") form.setError(key as keyof StartValues, { message: issue.message });
      }
      return;
    }
    const result = submitApplication({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      line1: parsed.data.line1,
      city: parsed.data.city,
      state: parsed.data.state,
      zip: parsed.data.zip,
      planId: parsed.data.planId,
      frequency: parsed.data.frequency,
      cartSize: parsed.data.cartSize,
      cartCount: parsed.data.cartCount,
    });
    if (!result.ok) {
      setBlocked(result.reason);
      return;
    }
    setBlocked("");
    setDone(result.application);
  });

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Request received</p>
        <h1 className="mt-2 text-4xl tracking-wide">{done.number}</h1>
        <p className="mt-3 text-muted">
          {done.inTerritory
            ? `${done.name} is in the office queue as pending. Staff still approve the account before service starts. No payment was taken.`
            : `${done.zip} is outside the service area. ${done.number} was saved as an inquiry and will not become a subscription.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/office/applications" className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-semibold text-cream">
            Open the office queue
          </Link>
          <Button type="button" variant="outline" onClick={() => setDone(null)}>Submit another</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl tracking-wide">Start service</h1>
          <p className="mt-2 max-w-xl text-muted">Tell us the address, plan, and cart. The office approves the account. This step does not charge a card.</p>
        </div>
        <Button type="button" variant="outline" onClick={fillSample}>Use sample signup</Button>
      </div>

      {zipReady ? (
        <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${area ? "bg-emerald-50 text-emerald-950" : "bg-sand text-ink"}`}>
          {area
            ? `${zip} is on the ${area.day} collection day in ${area.city}.`
            : `${zip} is outside the service area. Submitting saves an inquiry, not a subscription.`}
        </p>
      ) : null}
      {blocked ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-900">{blocked}</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Name" error={form.formState.errors.name?.message}><Input {...form.register("name")} /></Field>
        <Field label="Email" error={form.formState.errors.email?.message}><Input type="email" {...form.register("email")} /></Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}><Input {...form.register("phone")} /></Field>
        <Field label="Street" error={form.formState.errors.line1?.message}><Input {...form.register("line1")} /></Field>
        <Field label="City" error={form.formState.errors.city?.message}><Input {...form.register("city")} /></Field>
        <Field label="State" error={form.formState.errors.state?.message}><Input {...form.register("state")} /></Field>
        <Field label="ZIP" error={form.formState.errors.zip?.message}>
          <Input
            {...form.register("zip")}
            onChange={(event) => {
              setZip(event.target.value);
              form.setValue("zip", event.target.value);
            }}
          />
        </Field>
        <Field label="Plan" error={form.formState.errors.planId?.message}>
          <Select {...form.register("planId")}>
            {PLANS.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} · {formatCents(currentVersion(plan).basePriceCents)} / month
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Frequency" error={form.formState.errors.frequency?.message}>
          <Select {...form.register("frequency")}>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every other week</option>
          </Select>
        </Field>
        <Field label="Cart size" error={form.formState.errors.cartSize?.message}>
          <Select {...form.register("cartSize")}>
            <option value="35">35 gallon</option>
            <option value="65">65 gallon</option>
            <option value="95">95 gallon</option>
          </Select>
        </Field>
        <Field label="Carts" error={form.formState.errors.cartCount?.message}>
          <Input type="number" min={1} max={6} {...form.register("cartCount", { valueAsNumber: true })} />
        </Field>
      </div>

      <label className="mt-4 flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          {...form.register("agreement")}
          checked={agreed}
          onChange={(event) => {
            setAgreed(event.target.checked);
            form.setValue("agreement", event.target.checked, { shouldValidate: true });
          }}
        />
        <span>
          I accept the <Link href="/terms" className="font-semibold text-brand">sample service agreement</Link>.
          {form.formState.errors.agreement ? <span className="mt-1 block text-brand">{form.formState.errors.agreement.message}</span> : null}
        </span>
      </label>
      <Button type="submit" className="mt-5" size="lg">Submit request</Button>
    </form>
  );
}
