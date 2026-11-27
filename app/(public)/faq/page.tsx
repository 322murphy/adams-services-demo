const faqs = [
  {
    q: "What belongs in the trash cart?",
    a: "Bagged household trash. Paint, chemicals, tires, batteries, and concrete are not accepted.",
  },
  {
    q: "What if I set out an extra cart or extra bags?",
    a: "The driver records the count and a photo when one is required. The price comes from the current plan. One included cart, a second cart, and three extra bags is $25 at the sample residential rate: $10 for the extra cart and $5 for each extra bag.",
  },
  {
    q: "Do you take furniture?",
    a: "Bulk items are a separate request. Send it from the contact form or call the office before the item goes to the curb.",
  },
  {
    q: "What if my ZIP is not listed?",
    a: "The request is saved as an inquiry. It does not open an account or a route stop.",
  },
  {
    q: "Which holidays move the route?",
    a: "Thanksgiving Day and Christmas Day have no pickup. The affected route runs the next business day. The Friday, November 27, 2026 route runs on schedule.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-5xl tracking-wide">Questions</h1>
      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card px-4">
        {faqs.map((item) => (
          <details key={item.q} className="py-4">
            <summary className="cursor-pointer text-lg font-semibold">{item.q}</summary>
            <p className="mt-2 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
