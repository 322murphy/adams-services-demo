"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useDemo } from "@/lib/demo-store";
import type { Role } from "@/lib/types";

const users: Record<string, { role: Role; href: string; label: string }> = {
  office: { role: "office", href: "/office", label: "Office staff" },
  maria: { role: "customer", href: "/portal", label: "Maria Gonzalez, customer" },
  driver: { role: "driver", href: "/driver", label: "Carlos Reyes, driver" },
};

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useDemo();
  const [error, setError] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const user = users[username];
    if (!user || password !== "demo") {
      setError("Use one of the sample usernames and the password demo.");
      return;
    }
    setRole(user.role);
    router.push(user.href);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-5xl tracking-wide">Log in</h1>
      <p className="mt-3 text-sm text-muted">Sample sign-in for the meeting. Password for each username is demo.</p>
      <ul className="mt-4 space-y-1 text-sm">
        {Object.entries(users).map(([username, user]) => (
          <li key={username}><span className="font-semibold">{username}</span> — {user.label}</li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-line bg-card p-6">
        <Field label="Username"><Input name="username" autoComplete="username" /></Field>
        <Field label="Password"><Input name="password" type="password" autoComplete="current-password" /></Field>
        {error ? <p className="text-sm text-brand">{error}</p> : null}
        <Button type="submit" className="w-full">Continue</Button>
      </form>
    </div>
  );
}
