"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { COMPANY } from "@/lib/catalog";
import { Wordmark } from "@/components/wordmark";

const links = [
  { href: "/residential", label: "Residential" },
  { href: "/commercial", label: "Commercial" },
  { href: "/recycling", label: "Recycling" },
  { href: "/bulk", label: "Bulk" },
  { href: "/pricing", label: "Pricing" },
  { href: "/service-area", label: "Service area" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="public-site min-h-screen bg-background">
      <header className="no-print sticky top-11 z-40 border-b-2 border-brand bg-ink text-cream">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2">
          <Link href="/" className="shrink-0">
            <Wordmark tone="light" />
          </Link>
          <nav className="hidden flex-1 items-center justify-end gap-4 text-sm lg:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
            <a href={COMPANY.phoneHref} className="brand-heading text-base text-white">
              {COMPANY.phoneDisplay}
            </a>
            <Link href="/start" className="brand-heading rounded-sm bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">
              Start service
            </Link>
          </nav>
          <button
            type="button"
            className="ml-auto rounded-md border border-white/20 p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open ? (
          <div className="space-y-2 border-t border-white/10 px-4 py-3 lg:hidden">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block py-1" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="block py-1" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link href="/start" className="inline-block rounded-md bg-brand px-3 py-2 font-semibold text-white" onClick={() => setOpen(false)}>
              Start service
            </Link>
          </div>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="no-print bg-ink text-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <Wordmark tone="light" size="md" />
            <p className="mt-3 text-sm text-cream/80">{COMPANY.city}</p>
            <p className="text-sm text-cream/80">{COMPANY.hours}</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">Service</p>
            <div className="mt-2 space-y-1 text-cream/80">
              <Link className="block" href="/residential">Residential</Link>
              <Link className="block" href="/commercial">Commercial</Link>
              <Link className="block" href="/recycling">Recycling</Link>
              <Link className="block" href="/bulk">Bulk pickup</Link>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">Office</p>
            <a className="brand-heading mt-2 block text-xl text-white" href={COMPANY.phoneHref}>
              {COMPANY.phoneDisplay}
            </a>
            <Link className="mt-2 block text-cream/80" href="/privacy">Privacy</Link>
            <Link className="block text-cream/80" href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
