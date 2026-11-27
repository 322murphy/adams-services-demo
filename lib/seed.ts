import { ROUTE } from "@/lib/catalog";
import type {
  Application,
  AuditEvent,
  Contact,
  ContactMessage,
  Customer,
  DemoState,
  Invoice,
  Note,
  Payment,
  Property,
  RouteStop,
  StatusEvent,
  WorkOrder,
} from "@/lib/types";

const residential = {
  planId: "plan_residential",
  frequency: "weekly" as const,
  cartSize: "95" as const,
  cartCount: 1,
  routeId: ROUTE.id,
  autopay: false,
  emergencyContact: "",
  type: "residential" as const,
};

export function createSeed(): DemoState {
  const customers: Customer[] = [
    {
      ...residential,
      id: "cus_maria",
      accountNumber: "AS-1008",
      name: "Maria Gonzalez",
      status: "active",
      email: "maria.gonzalez@example.com",
      phone: "512-555-0108",
      emergencyContact: "Luis Gonzalez, 512-555-0190",
      createdAt: "2024-06-08T15:00:00.000Z",
    },
    {
      id: "cus_james",
      accountNumber: "AS-1014",
      name: "Whitaker Feed",
      type: "commercial",
      status: "active",
      email: "james.whitaker@example.com",
      phone: "512-555-0114",
      emergencyContact: "James Whitaker, 512-555-0115",
      planId: "plan_commercial",
      frequency: "weekly",
      cartSize: "95",
      cartCount: 1,
      routeId: ROUTE.id,
      autopay: true,
      createdAt: "2023-04-12T15:00:00.000Z",
    },
    {
      ...residential,
      id: "cus_elena",
      accountNumber: "AS-1011",
      name: "Elena Vasquez",
      status: "active",
      email: "elena.vasquez@example.com",
      phone: "512-555-0111",
      createdAt: "2024-02-02T15:00:00.000Z",
    },
    {
      ...residential,
      id: "cus_pete",
      accountNumber: "AS-1016",
      name: "Pete Nunn",
      status: "active",
      email: "pete.nunn@example.com",
      phone: "512-555-0116",
      cartSize: "65",
      createdAt: "2025-08-19T15:00:00.000Z",
    },
    {
      ...residential,
      id: "cus_grace",
      accountNumber: "AS-1018",
      name: "Grace Okonkwo",
      status: "active",
      email: "grace.okonkwo@example.com",
      phone: "512-555-0118",
      createdAt: "2025-11-03T15:00:00.000Z",
    },
    {
      ...residential,
      id: "cus_linda",
      accountNumber: "AS-1003",
      name: "Linda Chen",
      status: "suspended",
      email: "linda.chen@example.com",
      phone: "512-555-0103",
      routeId: null,
      createdAt: "2024-03-01T15:00:00.000Z",
    },
    {
      ...residential,
      id: "cus_robert",
      accountNumber: "AS-1021",
      name: "Robert Hale",
      status: "pending",
      email: "robert.hale@example.com",
      phone: "512-555-0121",
      cartSize: "65",
      routeId: null,
      createdAt: "2026-11-20T15:00:00.000Z",
    },
    {
      ...residential,
      id: "cus_otis",
      accountNumber: "AS-0994",
      name: "Otis Brewer",
      status: "canceled",
      email: "otis.brewer@example.com",
      phone: "512-555-0194",
      routeId: null,
      createdAt: "2022-09-01T15:00:00.000Z",
    },
    {
      ...residential,
      id: "cus_sam",
      accountNumber: "AS-0988",
      name: "Sam Ortega",
      status: "lead",
      email: "sam.ortega@example.com",
      phone: "512-555-0188",
      routeId: null,
      createdAt: "2026-11-18T15:00:00.000Z",
    },
  ];

  const contacts: Contact[] = customers.map((customer) => ({
    id: `con_${customer.id}`,
    customerId: customer.id,
    name: customer.id === "cus_james" ? "James Whitaker" : customer.name,
    role: "Primary",
    phone: customer.phone,
    email: customer.email,
    primary: true,
  }));
  contacts.push({
    id: "con_maria_2",
    customerId: "cus_maria",
    name: "Luis Gonzalez",
    role: "Spouse",
    phone: "512-555-0190",
    email: "luis.gonzalez@example.com",
    primary: false,
  });

  const properties: Property[] = [
    property("cus_maria", "184 Pecan Street", "Bastrop", "78602", "1842", "Blue cart at the curb. Close the gate.", 30.112, -97.318),
    property("cus_james", "410 Main Street", "Bastrop", "78602", "", "Dumpster on the alley side.", 30.111, -97.308),
    property("cus_elena", "902 Chestnut Street", "Bastrop", "78602", "", "Cart by the garage.", 30.105, -97.325),
    property("cus_pete", "88 River Road", "Red Rock", "78662", "0909", "Long driveway. Cart at the road.", 30.138, -97.288),
    property("cus_grace", "2400 State Highway 21", "Bastrop", "78602", "", "Do not block the mailbox.", 30.12, -97.3),
    property("cus_linda", "610 Live Oak", "Cedar Creek", "78621", "", "Account is suspended.", 30.098, -97.345),
    property("cus_robert", "1402 Pine Street", "Bastrop", "78612", "", "Cart not delivered yet.", 30.125, -97.33),
    property("cus_otis", "77 Magnolia", "Smithville", "78957", "", "Service canceled.", 30.09, -97.275),
    property("cus_sam", "1904 South Congress", "Austin", "78745", "", "Outside the service area.", 30.25, -97.75, false),
  ];

  const residentialBill = (id: string, number: string, customerId: string, issuedOn: string, dueOn: string, status: Invoice["status"], month: string): Invoice => ({
    id,
    number,
    customerId,
    status,
    issuedOn,
    dueOn,
    items: [
      {
        id: `${id}_svc`,
        description: `Residential weekly service — ${month}`,
        quantity: 1,
        unitAmountCents: 3200,
        amountCents: 3200,
        kind: "recurring",
      },
      {
        id: `${id}_fuel`,
        description: "Fuel and environmental",
        quantity: 1,
        unitAmountCents: 350,
        amountCents: 350,
        kind: "fee",
      },
    ],
  });

  const invoices: Invoice[] = [
    residentialBill("inv_1041", "INV-1041", "cus_maria", "2026-10-01", "2026-10-20", "paid", "Oct 2026"),
    residentialBill("inv_1048", "INV-1048", "cus_maria", "2026-11-01", "2026-12-05", "open", "Nov 2026"),
    {
      id: "inv_1044",
      number: "INV-1044",
      customerId: "cus_james",
      status: "paid",
      issuedOn: "2026-11-01",
      dueOn: "2026-11-20",
      items: [
        {
          id: "inv_1044_svc",
          description: "Commercial service — Nov 2026",
          quantity: 1,
          unitAmountCents: 12000,
          amountCents: 12000,
          kind: "recurring",
        },
        {
          id: "inv_1044_fuel",
          description: "Fuel and environmental",
          quantity: 1,
          unitAmountCents: 800,
          amountCents: 800,
          kind: "fee",
        },
      ],
    },
    residentialBill("inv_1042", "INV-1042", "cus_elena", "2026-11-01", "2026-11-20", "paid", "Nov 2026"),
    residentialBill("inv_1045", "INV-1045", "cus_pete", "2026-11-01", "2026-11-20", "paid", "Nov 2026"),
    residentialBill("inv_1046", "INV-1046", "cus_grace", "2026-11-01", "2026-11-20", "paid", "Nov 2026"),
    {
      id: "inv_1033",
      number: "INV-1033",
      customerId: "cus_linda",
      status: "open",
      issuedOn: "2026-10-01",
      dueOn: "2026-10-20",
      items: [
        { id: "inv_1033_sep", description: "Residential weekly service — Sep 2026", quantity: 1, unitAmountCents: 3200, amountCents: 3200, kind: "recurring" },
        { id: "inv_1033_sep_fuel", description: "Fuel and environmental — Sep", quantity: 1, unitAmountCents: 350, amountCents: 350, kind: "fee" },
        { id: "inv_1033_oct", description: "Residential weekly service — Oct 2026", quantity: 1, unitAmountCents: 3200, amountCents: 3200, kind: "recurring" },
        { id: "inv_1033_oct_fuel", description: "Fuel and environmental — Oct", quantity: 1, unitAmountCents: 350, amountCents: 350, kind: "fee" },
      ],
    },
  ];

  const payments: Payment[] = [
    payment("pay_1", "cus_maria", "inv_1041", 3550, "RCPT-1001", "2026-10-18T14:10:00.000Z"),
    payment("pay_2", "cus_james", "inv_1044", 12800, "RCPT-1002", "2026-11-04T15:00:00.000Z"),
    payment("pay_3", "cus_elena", "inv_1042", 3550, "RCPT-1003", "2026-11-06T15:22:00.000Z"),
    payment("pay_4", "cus_pete", "inv_1045", 3550, "RCPT-1004", "2026-11-07T18:04:00.000Z"),
    payment("pay_5", "cus_grace", "inv_1046", 3550, "RCPT-1005", "2026-11-08T13:40:00.000Z"),
  ];

  const stops: RouteStop[] = [
    { id: "stop_james", routeId: ROUTE.id, sequence: 1, customerId: "cus_james", propertyId: "prop_cus_james", status: "completed", collectionEventId: "evt_seed_james", completedAt: "2026-11-27T13:10:00.000Z" },
    { id: "stop_elena", routeId: ROUTE.id, sequence: 2, customerId: "cus_elena", propertyId: "prop_cus_elena", status: "completed", collectionEventId: "evt_seed_elena", completedAt: "2026-11-27T13:28:00.000Z" },
    { id: "stop_maria", routeId: ROUTE.id, sequence: 3, customerId: "cus_maria", propertyId: "prop_cus_maria", status: "scheduled" },
    { id: "stop_pete", routeId: ROUTE.id, sequence: 4, customerId: "cus_pete", propertyId: "prop_cus_pete", status: "scheduled" },
    { id: "stop_grace", routeId: ROUTE.id, sequence: 5, customerId: "cus_grace", propertyId: "prop_cus_grace", status: "scheduled" },
  ];

  const applications: Application[] = [
    {
      id: "app_dana",
      number: "APP-201",
      createdAt: "2026-11-26T16:12:00.000Z",
      status: "pending",
      name: "Dana Ruiz",
      email: "dana.ruiz@example.com",
      phone: "512-555-0177",
      line1: "418 Chestnut Street",
      city: "Bastrop",
      state: "TX",
      zip: "78602",
      planId: "plan_residential",
      frequency: "weekly",
      cartSize: "95",
      cartCount: 1,
      inTerritory: true,
    },
    {
      id: "app_chris",
      number: "APP-198",
      createdAt: "2026-11-24T19:40:00.000Z",
      status: "inquiry",
      name: "Chris Patel",
      email: "chris.patel@example.com",
      phone: "512-555-0164",
      line1: "1900 South First Street",
      city: "Austin",
      state: "TX",
      zip: "78704",
      planId: "plan_residential",
      frequency: "weekly",
      cartSize: "95",
      cartCount: 1,
      inTerritory: false,
    },
  ];

  const workOrders: WorkOrder[] = [
    {
      id: "wo_218",
      number: "WO-218",
      customerId: "cus_robert",
      type: "Cart delivery",
      status: "scheduled",
      priority: "normal",
      instructions: "Deliver one 65-gal cart to 1402 Pine Street before the first pickup.",
      createdAt: "2026-11-20T16:00:00.000Z",
    },
    {
      id: "wo_190",
      number: "WO-190",
      customerId: "cus_james",
      type: "Dumpster delivery",
      status: "completed",
      priority: "normal",
      instructions: "4-yard dumpster placed on the alley side.",
      createdAt: "2023-04-14T15:00:00.000Z",
    },
  ];

  const notes: Note[] = [
    {
      id: "note_maria",
      customerId: "cus_maria",
      body: "Dogs stay in the side yard. Close the gate on the way out.",
      author: "Office",
      createdAt: "2026-11-12T14:00:00.000Z",
    },
    {
      id: "note_james",
      customerId: "cus_james",
      body: "Call the store if the alley is blocked by a delivery truck.",
      author: "Office",
      createdAt: "2026-09-02T14:00:00.000Z",
    },
  ];

  const statusHistory: StatusEvent[] = [
    { id: "st_maria_1", customerId: "cus_maria", from: "pending", to: "active", at: "2024-06-08T15:00:00.000Z", note: "Cart delivered and route assigned." },
    { id: "st_linda_1", customerId: "cus_linda", from: "active", to: "suspended", at: "2026-10-20T16:00:00.000Z", note: "Suspended for an overdue balance." },
    { id: "st_robert_1", customerId: "cus_robert", from: "lead", to: "pending", at: "2026-11-20T15:00:00.000Z", note: "Waiting on cart delivery." },
    { id: "st_otis_1", customerId: "cus_otis", from: "active", to: "canceled", at: "2026-08-01T15:00:00.000Z", note: "Customer moved." },
  ];

  const messages: ContactMessage[] = [
    {
      id: "msg_helen",
      name: "Helen Brooks",
      email: "helen.brooks@example.com",
      phone: "512-555-0144",
      topic: "Bulk pickup",
      body: "Can you take a couch from 902 Chestnut next Friday?",
      createdAt: "2026-11-25T15:04:00.000Z",
    },
  ];

  const audit: AuditEvent[] = [
    { id: "aud_1", at: "2026-11-01T13:00:00.000Z", message: "November invoices posted for active accounts." },
    { id: "aud_2", at: "2026-10-18T14:10:00.000Z", message: "Payment RCPT-1001 posted to INV-1041." },
    { id: "aud_3", at: "2026-10-20T16:00:00.000Z", message: "Linda Chen suspended for an overdue balance." },
    { id: "aud_4", at: "2026-11-26T16:12:00.000Z", message: "Website application APP-201 received from Dana Ruiz." },
  ];

  return {
    version: 1,
    role: "public",
    customers,
    contacts,
    properties,
    applications,
    invoices,
    payments,
    charges: [],
    stops,
    workOrders,
    notes,
    statusHistory,
    audit,
    messages,
  };
}

function property(
  customerId: string,
  line1: string,
  city: string,
  zip: string,
  gateCode: string,
  instructions: string,
  lat: number,
  lng: number,
  inTerritory = true,
): Property {
  return {
    id: `prop_${customerId}`,
    customerId,
    label: "Service",
    line1,
    city,
    state: "TX",
    zip,
    gateCode,
    instructions,
    inTerritory,
    lat,
    lng,
  };
}

function payment(
  id: string,
  customerId: string,
  invoiceId: string,
  amountCents: number,
  receiptNumber: string,
  createdAt: string,
): Payment {
  return {
    id,
    customerId,
    invoiceId,
    amountCents,
    method: "demo_card",
    createdAt,
    receiptNumber,
    demo: true,
  };
}
