import Link from "next/link";
import { COMPANY, PLANS, currentVersion } from "@/lib/catalog";
import { formatCents } from "@/lib/format";

const copy = {
  residential: {
    title: "Residential pickup",
    lede: "Set the cart at the curb by 7:00 a.m. on your collection day. One cart is included on the residential plan.",
    points: [
      "Cart sizes are 35, 65, and 95 gallon.",
      "Extra carts are $10 and extra bags are $5 on the current rate. The driver records the count. The office rate sets the price.",
      "Household trash belongs in bags inside the cart. Paint, chemicals, tires, batteries, and concrete do not.",
      "Thanksgiving Day, November 26, 2026, had no pickup. The Friday, November 27 route runs on schedule. Christmas Day has no pickup. That route runs the next business day.",
    ],
  },
  commercial: {
    title: "Commercial pickup",
    lede: "Shops and offices inside the service area can use carts or a small dumpster. The account stores the alley, enclosure, and access notes.",
    points: [
      "The current commercial plan is billed monthly and includes two containers.",
      "Extra containers use the commercial rate version on the account.",
      "Tell the office about locked gates and delivery trucks that block the alley.",
      "Service still has to pass the ZIP check. Addresses outside the area stay inquiries.",
    ],
  },
  recycling: {
    title: "Recycling cart",
    lede: "Recycling rides in its own cart. It is not a second trash cart.",
    points: [
      "Accepted: cardboard, paper, rinsed plastic bottles, and aluminum cans.",
      "Not accepted in the recycling cart: bagged trash, food, plastic bags, and glass.",
      "Leave the lid closed so the route can see it is recycling.",
      "A contaminated cart is tagged and can be billed as trash on review.",
    ],
  },
  bulk: {
    title: "Bulk pickup",
    lede: "Furniture, appliances, and similar items are a request, not part of the weekly cart allowance.",
    points: [
      "Call the office or send a request before the item goes to the curb.",
      "The charge uses the approved extra category. Drivers do not name a price.",
      "Paint, chemicals, tires, batteries, and concrete are not accepted.",
      "The office can turn the request into a work order on the driver list.",
    ],
  },
} as const;

export function ServiceArticle({ slug }: { slug: keyof typeof copy }) {
  const page = copy[slug];
  const residential = currentVersion(PLANS[0]);
  const commercial = currentVersion(PLANS[1]);
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">{COMPANY.city}</p>
      <h1 className="mt-2 text-5xl tracking-wide">{page.title}</h1>
      <p className="mt-4 text-lg text-muted">{page.lede}</p>
      <ul className="mt-6 space-y-3">
        {page.points.map((point) => (
          <li key={point} className="rounded-xl border border-line bg-card px-4 py-3">{point}</li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Residential {formatCents(residential.basePriceCents)} / month. Commercial {formatCents(commercial.basePriceCents)} / month.{" "}
        <Link href="/pricing" className="font-semibold text-brand">See pricing</Link>
      </p>
      <Link href="/start" className="mt-6 inline-flex h-11 items-center rounded-md bg-brand px-4 font-semibold text-white">
        Start service
      </Link>
    </article>
  );
}
