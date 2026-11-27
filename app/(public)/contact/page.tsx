"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { COMPANY } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";

const schema = z.object({
  name: z.string().min(2, { error: "Enter your name" }),
  email: z.email({ error: "Enter a valid email" }),
  phone: z.string().min(7, { error: "Enter a phone number" }),
  topic: z.string().min(2),
  body: z.string().min(8, { error: "Tell the office what you need" }),
});

export default function ContactPage() {
  const { sendMessage } = useDemo();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      topic: form.get("topic"),
      body: form.get("body"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }
    sendMessage(parsed.data);
    setError("");
    setSent(true);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-5xl tracking-wide">Contact</h1>
        <p className="mt-3 text-muted">The office reads messages from this form. Nothing is emailed or texted in this prototype.</p>
        <a href={COMPANY.phoneHref} className="mt-6 block font-display text-4xl text-brand">{COMPANY.phoneDisplay}</a>
        <p className="mt-2 text-muted">{COMPANY.hours}</p>
        <p className="text-muted">{COMPANY.city}</p>
      </div>
      {sent ? (
        <div className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-3xl tracking-wide">Message saved</h2>
          <p className="mt-2 text-muted">It is on the office dashboard with the other sample requests.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-6">
          <Field label="Name"><Input name="name" /></Field>
          <Field label="Email"><Input name="email" type="email" /></Field>
          <Field label="Phone"><Input name="phone" /></Field>
          <Field label="Topic">
            <Select name="topic" defaultValue="New service">
              <option>New service</option>
              <option>Bulk pickup</option>
              <option>Missed pickup</option>
              <option>Billing</option>
              <option>Other</option>
            </Select>
          </Field>
          <Field label="Message"><Textarea name="body" /></Field>
          {error ? <p className="text-sm text-brand">{error}</p> : null}
          <Button type="submit">Send to the office</Button>
        </form>
      )}
    </div>
  );
}
