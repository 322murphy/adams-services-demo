export type Role = "public" | "office" | "customer" | "driver";

export type CustomerStatus =
  | "lead"
  | "pending"
  | "active"
  | "hold"
  | "suspended"
  | "canceled"
  | "archived";

export type CustomerType = "residential" | "commercial";

export type Customer = {
  id: string;
  accountNumber: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  email: string;
  phone: string;
  emergencyContact: string;
  planId: string;
  frequency: "weekly" | "biweekly";
  cartSize: "35" | "65" | "95";
  cartCount: number;
  routeId: string | null;
  autopay: boolean;
  createdAt: string;
};

export type Contact = {
  id: string;
  customerId: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  primary: boolean;
};

export type Property = {
  id: string;
  customerId: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  gateCode: string;
  instructions: string;
  inTerritory: boolean;
  lat: number;
  lng: number;
};

export type PlanVersion = {
  id: string;
  version: number;
  effectiveDate: string;
  basePriceCents: number;
  extraCartCents: number;
  extraBagCents: number;
  deliveryFeeCents: number;
  fuelFeeCents: number;
  includedCarts: number;
};

export type ServicePlan = {
  id: string;
  name: string;
  description: string;
  customerType: CustomerType;
  billingFrequency: "monthly";
  collectionFrequency: "weekly";
  cartSizes: string[];
  versions: PlanVersion[];
};

export type ApplicationStatus = "pending" | "approved" | "inquiry";

export type ApplicationDraft = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  planId: string;
  frequency: "weekly" | "biweekly";
  cartSize: "35" | "65" | "95";
  cartCount: number;
};

export type Application = ApplicationDraft & {
  id: string;
  number: string;
  createdAt: string;
  status: ApplicationStatus;
  inTerritory: boolean;
  customerId?: string;
};

export type InvoiceStatus = "open" | "paid" | "partial" | "void";

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitAmountCents: number;
  amountCents: number;
  kind: "recurring" | "extra" | "fee" | "delivery" | "credit";
  chargeId?: string;
};

export type Invoice = {
  id: string;
  number: string;
  customerId: string;
  status: InvoiceStatus;
  issuedOn: string;
  dueOn: string;
  items: InvoiceItem[];
};

export type Payment = {
  id: string;
  customerId: string;
  invoiceId: string;
  amountCents: number;
  method: "demo_card" | "demo_ach";
  createdAt: string;
  receiptNumber: string;
  demo: true;
};

export type ExtraCharge = {
  id: string;
  customerId: string;
  stopId: string;
  status: "pending" | "approved" | "rejected";
  carts: number;
  bags: number;
  includedCarts: number;
  extraCarts: number;
  extraBags: number;
  amountCents: number;
  photoName: string;
  photoDataUrl: string;
  notes: string;
  createdAt: string;
  clientEventId: string;
  invoiceId?: string;
  planVersionId: string;
};

export type StopStatus =
  | "scheduled"
  | "completed"
  | "completed_with_extras"
  | "cart_not_out"
  | "blocked"
  | "missed";

export type RouteStop = {
  id: string;
  routeId: string;
  sequence: number;
  customerId: string;
  propertyId: string;
  status: StopStatus;
  collectionEventId?: string;
  completedAt?: string;
};

export type WorkOrder = {
  id: string;
  number: string;
  customerId: string;
  type: string;
  status: "open" | "scheduled" | "completed";
  priority: "normal" | "high";
  instructions: string;
  createdAt: string;
};

export type Note = {
  id: string;
  customerId: string;
  body: string;
  author: string;
  createdAt: string;
};

export type StatusEvent = {
  id: string;
  customerId: string;
  from: string;
  to: string;
  at: string;
  note: string;
};

export type AuditEvent = {
  id: string;
  at: string;
  message: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  body: string;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  number: string;
  vin: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  type: string;
  capacity: string;
  mileage: number;
  status: "in service" | "maintenance" | "out of service";
  insuranceExpires: string;
  driver: string;
};

export type EquipmentItem = {
  id: string;
  code: string;
  type: string;
  size: string;
  status: "available" | "assigned" | "pending delivery" | "damaged";
  customerId: string | null;
  condition: string;
};

export type DemoState = {
  version: 1;
  role: Role;
  customers: Customer[];
  contacts: Contact[];
  properties: Property[];
  applications: Application[];
  invoices: Invoice[];
  payments: Payment[];
  charges: ExtraCharge[];
  stops: RouteStop[];
  workOrders: WorkOrder[];
  notes: Note[];
  statusHistory: StatusEvent[];
  audit: AuditEvent[];
  messages: ContactMessage[];
};

export type CollectionInput = {
  stopId: string;
  carts: number;
  bags: number;
  notes: string;
  photoName: string;
  photoDataUrl: string;
  clientEventId: string;
  exception: "none" | "cart_not_out" | "blocked" | "missed";
};

export type CollectionResult = {
  status: "recorded" | "duplicate" | "missing";
  amountCents: number;
  chargeId?: string;
};

export type ApplicationResult =
  | { ok: true; application: Application; alreadyReceived: boolean }
  | { ok: false; reason: string };
