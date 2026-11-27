import type { Invoice, InvoiceItem, Payment } from "@/lib/types";

/** Integer cents only. This is the only extra-charge math in the demo. */

export function calculateExtra(input: {
  carts: number;
  bags: number;
  includedCarts: number;
  extraCartCents: number;
  extraBagCents: number;
}) {
  const carts = Math.max(0, Math.floor(Number.isFinite(input.carts) ? input.carts : 0));
  const bags = Math.max(0, Math.floor(Number.isFinite(input.bags) ? input.bags : 0));
  const extraCarts = Math.max(0, carts - input.includedCarts);
  const extraBags = bags;
  const amountCents = extraCarts * input.extraCartCents + extraBags * input.extraBagCents;
  return { carts, bags, extraCarts, extraBags, amountCents };
}

export function invoiceTotalCents(invoice: { items: Pick<InvoiceItem, "amountCents">[] }): number {
  return invoice.items.reduce((sum, item) => sum + item.amountCents, 0);
}

export function paidTowardCents(
  payments: Pick<Payment, "invoiceId" | "amountCents">[],
  invoiceId: string,
): number {
  return payments
    .filter((payment) => payment.invoiceId === invoiceId)
    .reduce((sum, payment) => sum + payment.amountCents, 0);
}

export function invoiceBalanceCents(
  invoice: Pick<Invoice, "id" | "items">,
  payments: Pick<Payment, "invoiceId" | "amountCents">[],
): number {
  return invoiceTotalCents(invoice) - paidTowardCents(payments, invoice.id);
}

export function statusForTotals(totalCents: number, paidCents: number): Invoice["status"] {
  if (paidCents <= 0) return "open";
  if (paidCents >= totalCents) return "paid";
  return "partial";
}
