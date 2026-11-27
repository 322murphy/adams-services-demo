export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-5xl tracking-wide">Privacy</h1>
      <p className="mt-2 text-sm font-semibold text-brand">Sample notice for this prototype. Have counsel review it before it is published.</p>
      <div className="mt-6 space-y-4 text-muted">
        <p>Adams Services keeps the account name, service address, phone, email, gate code, collection notes, invoices, and pickup photos so the route and the bill can be completed.</p>
        <p>Gate codes, photos, and addresses are for staff and the assigned driver. This prototype stores them in the browser on this computer. It does not send them to a payment company or a texting service.</p>
        <p>Demo payments do not ask for a real card or bank number. Do not type a real card into this prototype.</p>
        <p>Call 512-718-1555 to ask about an account.</p>
      </div>
    </article>
  );
}
