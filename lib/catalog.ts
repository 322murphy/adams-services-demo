import type { EquipmentItem, ServicePlan, Vehicle } from "@/lib/types";

export const SAMPLE_DAY = "2026-11-27";
export const SAMPLE_DAY_LABEL = "Friday, November 27, 2026";

export const COMPANY = {
  name: "Adams Services",
  phoneDisplay: "512-718-1555",
  phoneHref: "tel:+15127181555",
  city: "Bastrop, Texas",
  hours: "Monday–Friday, 7:00 a.m. to 5:00 p.m.",
};

export const MARIA_ID = "cus_maria";
export const MARIA_INVOICE_ID = "inv_1048";
export const MARIA_STOP_ID = "stop_maria";
export const RESIDENTIAL_PLAN_ID = "plan_residential";
export const COMMERCIAL_PLAN_ID = "plan_commercial";

export const ROUTE = {
  id: "route_friday",
  name: "Friday Bastrop",
  day: "Friday",
  dateLabel: SAMPLE_DAY_LABEL,
  driverName: "Carlos Reyes",
  truckNumber: "12",
};

export const TERRITORY: { zip: string; city: string; day: string }[] = [
  { zip: "78602", city: "Bastrop", day: "Friday" },
  { zip: "78612", city: "Bastrop", day: "Friday" },
  { zip: "78662", city: "Red Rock", day: "Friday" },
  { zip: "78621", city: "Elgin / Cedar Creek", day: "Thursday" },
  { zip: "78650", city: "McDade", day: "Thursday" },
  { zip: "78659", city: "Paige", day: "Thursday" },
  { zip: "78957", city: "Smithville", day: "Wednesday" },
];

export function territoryForZip(zip: string) {
  const cleaned = zip.trim().slice(0, 5);
  return TERRITORY.find((row) => row.zip === cleaned) ?? null;
}

export const PLANS: ServicePlan[] = [
  {
    id: RESIDENTIAL_PLAN_ID,
    name: "Residential weekly",
    description: "Curbside household trash. One cart is included. Extra carts and bags use the current rate version.",
    customerType: "residential",
    billingFrequency: "monthly",
    collectionFrequency: "weekly",
    cartSizes: ["35", "65", "95"],
    versions: [
      {
        id: "rate_res_v1",
        version: 1,
        effectiveDate: "2025-01-01",
        basePriceCents: 3000,
        extraCartCents: 800,
        extraBagCents: 400,
        deliveryFeeCents: 2500,
        fuelFeeCents: 300,
        includedCarts: 1,
      },
      {
        id: "rate_res_v2",
        version: 2,
        effectiveDate: "2026-01-01",
        basePriceCents: 3200,
        extraCartCents: 1000,
        extraBagCents: 500,
        deliveryFeeCents: 2500,
        fuelFeeCents: 350,
        includedCarts: 1,
      },
    ],
  },
  {
    id: COMMERCIAL_PLAN_ID,
    name: "Commercial monthly",
    description: "Carts or a small dumpster for shops and offices inside the service area.",
    customerType: "commercial",
    billingFrequency: "monthly",
    collectionFrequency: "weekly",
    cartSizes: ["95"],
    versions: [
      {
        id: "rate_com_v1",
        version: 1,
        effectiveDate: "2025-01-01",
        basePriceCents: 11000,
        extraCartCents: 1200,
        extraBagCents: 500,
        deliveryFeeCents: 7500,
        fuelFeeCents: 600,
        includedCarts: 2,
      },
      {
        id: "rate_com_v2",
        version: 2,
        effectiveDate: "2026-01-01",
        basePriceCents: 12000,
        extraCartCents: 1500,
        extraBagCents: 500,
        deliveryFeeCents: 7500,
        fuelFeeCents: 800,
        includedCarts: 2,
      },
    ],
  },
];

export function planById(id: string): ServicePlan {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[0];
}

export function currentVersion(plan: ServicePlan) {
  return plan.versions.reduce((latest, item) => (item.version > latest.version ? item : latest));
}

export const VEHICLES: Vehicle[] = [
  {
    id: "veh_12",
    number: "12",
    vin: "1FVACWFC5MH123456",
    plate: "TX-K4821",
    year: 2021,
    make: "Freightliner",
    model: "M2",
    type: "Side loader",
    capacity: "25 yd",
    mileage: 84220,
    status: "in service",
    insuranceExpires: "2027-03-01",
    driver: "Carlos Reyes",
  },
  {
    id: "veh_7",
    number: "7",
    vin: "1FVACWFC8LH654321",
    plate: "TX-M1904",
    year: 2019,
    make: "Freightliner",
    model: "M2",
    type: "Rear loader",
    capacity: "20 yd",
    mileage: 120440,
    status: "maintenance",
    insuranceExpires: "2026-12-15",
    driver: "Unassigned",
  },
];

export const EQUIPMENT: EquipmentItem[] = [
  {
    id: "eq_4412",
    code: "C-4412",
    type: "Trash cart",
    size: "95 gal",
    status: "assigned",
    customerId: MARIA_ID,
    condition: "Good",
  },
  {
    id: "eq_2280",
    code: "C-2280",
    type: "Recycling cart",
    size: "65 gal",
    status: "assigned",
    customerId: MARIA_ID,
    condition: "Good",
  },
  {
    id: "eq_4418",
    code: "C-4418",
    type: "Trash cart",
    size: "95 gal",
    status: "available",
    customerId: null,
    condition: "Good",
  },
  {
    id: "eq_3301",
    code: "C-3301",
    type: "Trash cart",
    size: "65 gal",
    status: "pending delivery",
    customerId: "cus_robert",
    condition: "New",
  },
  {
    id: "eq_d19",
    code: "D-19",
    type: "Dumpster",
    size: "4 yd",
    status: "assigned",
    customerId: "cus_james",
    condition: "Good",
  },
];

export function projectPoint(lat: number, lng: number) {
  const minLat = 30.07;
  const maxLat = 30.16;
  const minLng = -97.36;
  const maxLng = -97.27;
  const x = ((lng - minLng) / (maxLng - minLng)) * 340 + 30;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 200 + 30;
  const inside = x >= 16 && x <= 384 && y >= 16 && y <= 244;
  return { x, y, inside };
}
