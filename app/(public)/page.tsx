import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { AvailabilityCheck } from "@/components/availability-check";
import { COMPANY, PLANS, currentVersion } from "@/lib/catalog";
import { formatCents } from "@/lib/format";

const services = [
  { href: "/residential", title: "Residential", text: "Weekly curbside carts for houses in the service area." },
  { href: "/commercial", title: "Commercial", text: "Carts and small dumpsters for shops and offices." },
  { href: "/recycling", title: "Recycling", text: "A separate cart for paper, cardboard, bottles, and cans." },
  { href: "/bulk", title: "Bulk pickup", text: "Furniture and appliances by request, priced from the plan." },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    telephone: "+1-512-718-1555",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bastrop",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: "Bastrop County, Texas",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative h-[clamp(520px,82vh,800px)] overflow-hidden bg-ink">
        <Image
          src="/brand-hero.jpg"
          alt="Adams Services. A cowboy kneels by his horse below a cross on the hill. Call 512-718-1555."
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 38%" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 pb-10 text-center">
            <p className="brand-heading text-lg text-cream drop-shadow md:text-2xl">Trash pickup for Bastrop County</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/start"
                className="brand-heading inline-flex h-12 items-center rounded-sm bg-brand px-6 text-base text-white shadow-lg hover:bg-brand-dark"
              >
                Start service
              </Link>
              <a
                href={COMPANY.phoneHref}
                className="brand-heading inline-flex h-12 items-center gap-2 rounded-sm border-2 border-cream/80 bg-ink/40 px-6 text-base text-cream backdrop-blur-sm hover:bg-ink/70"
              >
                <Phone size={18} /> {COMPANY.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink pb-14">
        <div className="mx-auto max-w-4xl px-4">
          <AvailabilityCheck />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="brush-rule" />
        <h1 className="brand-heading mt-4 max-w-3xl text-4xl leading-tight text-ink md:text-5xl">
          Set the cart out. <span className="text-brand">We handle the rest.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Check the ZIP, pick a plan, and send the request. The office approves the account, delivers the cart, and puts the stop on the route.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group rounded-sm border-t-4 border-brand bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="brand-heading text-xl text-ink group-hover:text-brand">{service.title}</h2>
              <p className="mt-2 text-sm text-muted">{service.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-cream">
        <Image src="/brand-hero.jpg" alt="" fill sizes="100vw" className="object-cover opacity-15" style={{ objectPosition: "50% 85%" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="brush-rule" />
          <h2 className="brand-heading mt-4 text-3xl text-cream md:text-4xl">Plans</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => {
              const rate = currentVersion(plan);
              return (
                <div key={plan.id} className="rounded-sm border border-cream/15 bg-ink/60 p-6 backdrop-blur-sm">
                  <h3 className="brand-heading text-xl text-cream">{plan.name}</h3>
                  <p className="brand-heading mt-3 text-5xl text-white">
                    {formatCents(rate.basePriceCents)}
                    <span className="font-sans text-lg normal-case text-cream/70"> / month</span>
                  </p>
                  <p className="mt-3 text-sm text-cream/75">
                    {rate.includedCarts} included. Extra cart {formatCents(rate.extraCartCents)}. Extra bag {formatCents(rate.extraBagCents)}.
                  </p>
                  <Link href={`/start?plan=${plan.id}`} className="mt-4 inline-block font-semibold text-sepia hover:text-white">
                    Start this plan →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10">
          <div>
            <h2 className="brand-heading text-3xl">Call the office</h2>
            <p className="text-white/80">{COMPANY.hours}</p>
          </div>
          <a href={COMPANY.phoneHref} className="brand-heading -skew-x-6 text-4xl md:text-5xl">
            ★ {COMPANY.phoneDisplay} ★
          </a>
        </div>
      </section>
    </div>
  );
}
