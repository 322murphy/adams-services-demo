export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-5xl tracking-wide">Service agreement</h1>
      <p className="mt-2 text-sm font-semibold text-brand">Sample terms for this prototype. Have counsel review them before a customer signs.</p>
      <div className="mt-6 space-y-4 text-muted">
        <p>Service starts when the office approves the request, the cart is delivered, and the stop is on a route. A website request alone does not start billing.</p>
        <p>The plan includes the stated number of carts. Extra carts, extra bags, and approved bulk items are billed from the rate version in effect on the service date. Drivers record quantities. They do not set the price.</p>
        <p>The customer keeps the cart accessible by 7:00 a.m. on the collection day and keeps animals secured.</p>
        <p>Paint, chemicals, tires, batteries, and concrete are refused.</p>
        <p>Addresses outside the published ZIPs are inquiries only.</p>
        <p>In this prototype, invoices and payments are sample records. They are not a charge to a bank or card.</p>
      </div>
    </article>
  );
}
