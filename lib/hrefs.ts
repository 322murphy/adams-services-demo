export function customerHref(id: string) {
  return `/office/customers/account?id=${encodeURIComponent(id)}`;
}

export function invoiceHref(id: string) {
  return `/office/billing/invoice?id=${encodeURIComponent(id)}`;
}
