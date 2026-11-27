import {
  invoiceBalanceCents,
  invoiceTotalCents,
  paidTowardCents,
  statusForTotals,
  calculateExtra,
} from "@/lib/billing";
import { currentVersion, planById, territoryForZip } from "@/lib/catalog";
import { formatCents } from "@/lib/format";
import { nid } from "@/lib/utils";
import type {
  Application,
  ApplicationDraft,
  ApplicationResult,
  AuditEvent,
  CollectionInput,
  CollectionResult,
  Customer,
  DemoState,
  ExtraCharge,
  Invoice,
  InvoiceItem,
  Payment,
  WorkOrder,
} from "@/lib/types";

export function applyApplication(state: DemoState, draft: ApplicationDraft): { state: DemoState; result: ApplicationResult } {
  const email = draft.email.trim().toLowerCase();
  const inTerritory = territoryForZip(draft.zip) !== null;
  const existingAccount = state.customers.find(
    (customer) =>
      customer.email.toLowerCase() === email &&
      (customer.status === "active" || customer.status === "pending"),
  );
  if (existingAccount && inTerritory) {
    return {
      state,
      result: {
        ok: false,
        reason: `${existingAccount.name} already has account ${existingAccount.accountNumber}. The office can change service on that record.`,
      },
    };
  }
  const pending = state.applications.find(
    (application) => application.email.toLowerCase() === email && application.status === "pending",
  );
  if (pending) {
    return { state, result: { ok: true, application: pending, alreadyReceived: true } };
  }

  const application: Application = {
    ...draft,
    email,
    name: draft.name.trim(),
    id: nid("app"),
    number: nextNumber(state.applications.map((item) => item.number), "APP", 200),
    createdAt: new Date().toISOString(),
    status: inTerritory ? "pending" : "inquiry",
    inTerritory,
  };
  return {
    state: {
      ...state,
      applications: [application, ...state.applications],
      audit: [
        audit(
          inTerritory
            ? `Website application ${application.number} received from ${application.name}.`
            : `Inquiry ${application.number} saved for ${application.name}. ZIP ${application.zip} is outside the service area.`,
        ),
        ...state.audit,
      ],
    },
    result: { ok: true, application, alreadyReceived: false },
  };
}

export function approveApplication(state: DemoState, applicationId: string): DemoState {
  const application = state.applications.find((item) => item.id === applicationId);
  if (!application || application.status !== "pending" || !application.inTerritory) return state;
  const now = new Date().toISOString();
  const customerId = nid("cus");
  const accountNumber = nextAccount(state.customers);
  const plan = planById(application.planId);
  const zipInfo = territoryForZip(application.zip);
  const customer: Customer = {
    id: customerId,
    accountNumber,
    name: application.name,
    type: plan.customerType,
    status: "active",
    email: application.email,
    phone: application.phone,
    emergencyContact: "",
    planId: application.planId,
    frequency: application.frequency,
    cartSize: application.cartSize,
    cartCount: application.cartCount,
    routeId: zipInfo?.day === "Friday" ? "route_friday" : null,
    autopay: false,
    createdAt: now,
  };
  const offset = state.customers.length;
  const workOrder: WorkOrder = {
    id: nid("wo"),
    number: nextNumber(state.workOrders.map((item) => item.number), "WO", 218),
    customerId,
    type: "Cart delivery",
    status: "scheduled",
    priority: "normal",
    instructions: `Deliver ${application.cartCount} x ${application.cartSize}-gal cart to ${application.line1}, ${application.city}.`,
    createdAt: now,
  };
  return {
    ...state,
    customers: [customer, ...state.customers],
    contacts: [
      ...state.contacts,
      {
        id: nid("con"),
        customerId,
        name: application.name,
        role: "Primary",
        phone: application.phone,
        email: application.email,
        primary: true,
      },
    ],
    properties: [
      ...state.properties,
      {
        id: nid("prop"),
        customerId,
        label: "Service",
        line1: application.line1,
        city: application.city,
        state: application.state,
        zip: application.zip,
        gateCode: "",
        instructions: "",
        inTerritory: true,
        lat: 30.11 + (offset % 5) * 0.004,
        lng: -97.32 + (offset % 4) * 0.004,
      },
    ],
    applications: state.applications.map((item) =>
      item.id === application.id ? { ...item, status: "approved", customerId } : item,
    ),
    workOrders: [workOrder, ...state.workOrders],
    statusHistory: [
      ...state.statusHistory,
      {
        id: nid("st"),
        customerId,
        from: "pending",
        to: "active",
        at: now,
        note: `Approved from ${application.number}. ${workOrder.number} opened for cart delivery.`,
      },
    ],
    audit: [
      audit(`Approved ${application.number}. Opened ${accountNumber} and ${workOrder.number} for cart delivery.`),
      ...state.audit,
    ],
  };
}

export function activateCustomer(state: DemoState, customerId: string): DemoState {
  const customer = state.customers.find((item) => item.id === customerId);
  if (!customer || customer.status !== "pending") return state;
  const now = new Date().toISOString();
  return {
    ...state,
    customers: state.customers.map((item) =>
      item.id === customerId ? { ...item, status: "active" } : item,
    ),
    statusHistory: [
      ...state.statusHistory,
      {
        id: nid("st"),
        customerId,
        from: "pending",
        to: "active",
        at: now,
        note: "Activated from the customer record.",
      },
    ],
    audit: [audit(`${customer.name} (${customer.accountNumber}) set to active.`), ...state.audit],
  };
}

export function addNote(state: DemoState, customerId: string, body: string): DemoState {
  const text = body.trim();
  if (!text) return state;
  const customer = state.customers.find((item) => item.id === customerId);
  return {
    ...state,
    notes: [
      {
        id: nid("note"),
        customerId,
        body: text,
        author: "Office",
        createdAt: new Date().toISOString(),
      },
      ...state.notes,
    ],
    audit: [audit(`Note added on ${customer?.accountNumber ?? "account"}.`), ...state.audit],
  };
}

export function applyCollection(
  state: DemoState,
  input: CollectionInput,
): { state: DemoState; result: CollectionResult } {
  const stop = state.stops.find((item) => item.id === input.stopId);
  if (!stop) return { state, result: { status: "missing", amountCents: 0 } };
  if (
    stop.collectionEventId ||
    state.charges.some((charge) => charge.clientEventId === input.clientEventId && charge.stopId === stop.id)
  ) {
    const existing = state.charges.find((charge) => charge.stopId === stop.id);
    return { state, result: { status: "duplicate", amountCents: existing?.amountCents ?? 0, chargeId: existing?.id } };
  }

  const customer = state.customers.find((item) => item.id === stop.customerId);
  const version = currentVersion(planById(customer?.planId ?? "plan_residential"));
  const now = new Date().toISOString();
  const noteBit = input.notes.trim() ? ` Note: ${input.notes.trim()}` : "";

  if (input.exception !== "none") {
    const status = input.exception;
    return {
      state: {
        ...state,
        stops: state.stops.map((item) =>
          item.id === stop.id
            ? { ...item, status, collectionEventId: input.clientEventId, completedAt: now }
            : item,
        ),
        audit: [
          audit(`Stop recorded as ${input.exception.replaceAll("_", " ")} for ${customer?.name ?? "customer"}.${noteBit}`),
          ...state.audit,
        ],
      },
      result: { status: "recorded", amountCents: 0 },
    };
  }

  const calc = calculateExtra({
    carts: input.carts,
    bags: input.bags,
    includedCarts: version.includedCarts,
    extraCartCents: version.extraCartCents,
    extraBagCents: version.extraBagCents,
  });

  let charges = state.charges;
  let chargeId: string | undefined;
  if (calc.amountCents > 0) {
    chargeId = nid("chg");
    const charge: ExtraCharge = {
      id: chargeId,
      customerId: stop.customerId,
      stopId: stop.id,
      status: "pending",
      carts: calc.carts,
      bags: calc.bags,
      includedCarts: version.includedCarts,
      extraCarts: calc.extraCarts,
      extraBags: calc.extraBags,
      amountCents: calc.amountCents,
      photoName: input.photoName,
      photoDataUrl: input.photoDataUrl,
      notes: input.notes.trim(),
      createdAt: now,
      clientEventId: input.clientEventId,
      planVersionId: version.id,
    };
    charges = [charge, ...charges];
  }

  return {
    state: {
      ...state,
      charges,
      stops: state.stops.map((item) =>
        item.id === stop.id
          ? {
              ...item,
              status: calc.amountCents > 0 ? "completed_with_extras" : "completed",
              collectionEventId: input.clientEventId,
              completedAt: now,
            }
          : item,
      ),
      audit: [
        audit(
          calc.amountCents > 0
            ? `Driver recorded ${calc.carts} carts and ${calc.bags} bags for ${customer?.name}. Pending extra ${formatCents(calc.amountCents)} using rate ${version.id}.${noteBit}`
            : `Driver recorded a standard collection for ${customer?.name ?? "customer"}.${noteBit}`,
        ),
        ...state.audit,
      ],
    },
    result: { status: "recorded", amountCents: calc.amountCents, chargeId },
  };
}

export function approveCharge(state: DemoState, chargeId: string): DemoState {
  const charge = state.charges.find((item) => item.id === chargeId);
  if (!charge || charge.status !== "pending") return state;
  const line: InvoiceItem = {
    id: nid("li"),
    description: extraDescription(charge),
    quantity: 1,
    unitAmountCents: charge.amountCents,
    amountCents: charge.amountCents,
    kind: "extra",
    chargeId: charge.id,
  };
  const open = state.invoices.find(
    (invoice) => invoice.customerId === charge.customerId && (invoice.status === "open" || invoice.status === "partial"),
  );
  const fallback = [...state.invoices].reverse().find((invoice) => invoice.customerId === charge.customerId);
  const target = open ?? fallback;
  let invoices = state.invoices;
  let invoiceId: string;
  let invoiceNumber: string;

  if (!target) {
    invoiceId = nid("inv");
    invoiceNumber = nextNumber(state.invoices.map((invoice) => invoice.number), "INV", 1048);
    const created: Invoice = {
      id: invoiceId,
      number: invoiceNumber,
      customerId: charge.customerId,
      status: "open",
      issuedOn: new Date().toISOString().slice(0, 10),
      dueOn: new Date().toISOString().slice(0, 10),
      items: [line],
    };
    invoices = [...invoices, created];
  } else {
    invoiceId = target.id;
    invoiceNumber = target.number;
    invoices = invoices.map((invoice) => {
      if (invoice.id !== target.id) return invoice;
      const items = [...invoice.items, line];
      return {
        ...invoice,
        items,
        status: statusForTotals(invoiceTotalCents({ items }), paidTowardCents(state.payments, invoice.id)),
      };
    });
  }

  return {
    ...state,
    invoices,
    charges: state.charges.map((item) =>
      item.id === charge.id ? { ...item, status: "approved", invoiceId } : item,
    ),
    audit: [
      audit(`Approved extra ${formatCents(charge.amountCents)} onto ${invoiceNumber}. ${line.description}.`),
      ...state.audit,
    ],
  };
}

export function rejectCharge(state: DemoState, chargeId: string): DemoState {
  const charge = state.charges.find((item) => item.id === chargeId);
  if (!charge || charge.status !== "pending") return state;
  const customer = state.customers.find((item) => item.id === charge.customerId);
  return {
    ...state,
    charges: state.charges.map((item) => (item.id === charge.id ? { ...item, status: "rejected" } : item)),
    audit: [audit(`Rejected extra ${formatCents(charge.amountCents)} for ${customer?.name ?? "customer"}. No invoice line was added.`), ...state.audit],
  };
}

export function applyPayment(state: DemoState, invoiceId: string, method: Payment["method"]): DemoState {
  const invoice = state.invoices.find((item) => item.id === invoiceId);
  if (!invoice) return state;
  const balance = invoiceBalanceCents(invoice, state.payments);
  if (balance <= 0) return state;
  const payment: Payment = {
    id: nid("pay"),
    customerId: invoice.customerId,
    invoiceId,
    amountCents: balance,
    method,
    createdAt: new Date().toISOString(),
    receiptNumber: nextNumber(state.payments.map((item) => item.receiptNumber), "RCPT", 1000),
    demo: true,
  };
  const payments = [...state.payments, payment];
  return {
    ...state,
    payments,
    invoices: state.invoices.map((item) =>
      item.id === invoice.id
        ? { ...item, status: statusForTotals(invoiceTotalCents(item), paidTowardCents(payments, item.id)) }
        : item,
    ),
    audit: [
      audit(
        `Demo ${method === "demo_card" ? "card" : "ACH"} payment ${payment.receiptNumber} for ${formatCents(balance)} on ${invoice.number}. No card number was stored.`,
      ),
      ...state.audit,
    ],
  };
}

export function toggleAutopay(state: DemoState, customerId: string): DemoState {
  const customer = state.customers.find((item) => item.id === customerId);
  if (!customer) return state;
  const autopay = !customer.autopay;
  return {
    ...state,
    customers: state.customers.map((item) => (item.id === customerId ? { ...item, autopay } : item)),
    audit: [audit(`${customer.accountNumber} AutoPay ${autopay ? "turned on" : "turned off"} (demo).`), ...state.audit],
  };
}

export function applyMessage(
  state: DemoState,
  input: { name: string; email: string; phone: string; topic: string; body: string },
): DemoState {
  return {
    ...state,
    messages: [
      {
        id: nid("msg"),
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        topic: input.topic,
        body: input.body.trim(),
        createdAt: new Date().toISOString(),
      },
      ...state.messages,
    ],
    audit: [audit(`Website message from ${input.name.trim()} about ${input.topic}.`), ...state.audit],
  };
}

export function isPastDue(invoice: Invoice, payments: Payment[], today = "2026-11-27"): boolean {
  return invoice.dueOn < today && invoiceBalanceCents(invoice, payments) > 0;
}

function extraDescription(charge: ExtraCharge): string {
  const parts: string[] = [];
  if (charge.extraCarts > 0) {
    parts.push(`${charge.extraCarts} extra cart${charge.extraCarts === 1 ? "" : "s"}`);
  }
  if (charge.extraBags > 0) {
    parts.push(`${charge.extraBags} extra bag${charge.extraBags === 1 ? "" : "s"}`);
  }
  return `Additional trash — ${parts.join(", ")}`;
}

function audit(message: string): AuditEvent {
  return { id: nid("aud"), at: new Date().toISOString(), message };
}

function nextAccount(customers: Customer[]): string {
  const nums = customers
    .map((customer) => Number(customer.accountNumber.replace(/\D/g, "")))
    .filter((value) => Number.isFinite(value));
  return `AS-${Math.max(1000, ...nums) + 1}`;
}

function nextNumber(values: string[], prefix: string, min: number): string {
  const nums = values.map((value) => Number(value.replace(/\D/g, ""))).filter((value) => Number.isFinite(value));
  const current = nums.length > 0 ? Math.max(min, ...nums) : min;
  return `${prefix}-${current + 1}`;
}
