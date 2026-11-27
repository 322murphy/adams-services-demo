import { ROUTE, territoryForZip } from "@/lib/catalog";
import type { Customer, Property, RouteStop, StopStatus } from "@/lib/types";

const PINS: Record<string, { x: number; y: number; label: "right" | "left" | "above" | "below" }> = {
  prop_cus_james: { x: 470, y: 310, label: "right" },
  prop_cus_elena: { x: 300, y: 338, label: "right" },
  prop_cus_maria: { x: 340, y: 230, label: "left" },
  prop_cus_grace: { x: 560, y: 200, label: "below" },
  prop_cus_pete: { x: 640, y: 72, label: "below" },
  prop_cus_robert: { x: 360, y: 155, label: "right" },
  prop_cus_linda: { x: 118, y: 168, label: "right" },
  prop_cus_otis: { x: 790, y: 340, label: "left" },
};

const ROADS: { name: string; x1: number; y1: number; x2: number; y2: number; labelX: number; labelY: number; rotate?: number }[] = [
  { name: "Chestnut", x1: 250, y1: 338, x2: 440, y2: 338, labelX: 248, labelY: 326 },
  { name: "Main St", x1: 330, y1: 310, x2: 640, y2: 310, labelX: 560, labelY: 298 },
  { name: "Pecan", x1: 230, y1: 230, x2: 470, y2: 230, labelX: 234, labelY: 218 },
  { name: "Pine", x1: 250, y1: 155, x2: 460, y2: 155, labelX: 400, labelY: 143 },
  { name: "SH 21", x1: 430, y1: 200, x2: 700, y2: 200, labelX: 620, labelY: 188 },
  { name: "River Rd", x1: 430, y1: 150, x2: 680, y2: 48, labelX: 500, labelY: 118, rotate: -24 },
];

type MapStop = {
  stop: RouteStop;
  customer?: Customer;
  property?: Property;
  x: number;
  y: number;
};

export function ServiceMap({
  variant,
  customers,
  properties,
  stops,
}: {
  variant: "route" | "territory";
  customers: Customer[];
  properties: Property[];
  stops: RouteStop[];
}) {
  const routeStops = mapStops(stops, customers, properties);
  const current = routeStops.find((item) => item.stop.status === "scheduled");
  const afterCurrent = current
    ? routeStops.find((item) => item.stop.sequence === current.stop.sequence + 1)
    : undefined;
  const legs = routeStops.slice(1).map((to, index) => {
    const from = routeStops[index];
    const currentSeq = current?.stop.sequence ?? Number.POSITIVE_INFINITY;
    const kind: "done" | "next" | "later" = to.stop.sequence < currentSeq ? "done" : to.stop.sequence === currentSeq ? "next" : "later";
    const bend = to.stop.sequence === 4 ? -42 : 0;
    return { from, to, kind, bend };
  });

  const territoryPins = properties
    .filter((property) => property.inTerritory && !stops.some((stop) => stop.propertyId === property.id))
    .map((property) => {
      const point = pointFor(property);
      const customer = customers.find((item) => item.id === property.customerId);
      const day = territoryForZip(property.zip)?.day ?? "Friday";
      return { property, customer, point, day };
    });

  const viewBox = variant === "route" ? "190 20 540 420" : "0 0 900 500";

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-card">
      {variant === "route" ? (
        <figcaption className="border-b border-line px-4 py-3 text-sm">
          {current && afterCurrent ? (
            <p>
              <span className="font-semibold text-brand">Next is stop {current.stop.sequence}, {current.customer?.name}.</span>{" "}
              {current.property?.line1}, {current.property?.city}. After that, head {compass(current, afterCurrent)} to stop {afterCurrent.stop.sequence} on {streetName(afterCurrent.property?.line1 ?? "")}, {afterCurrent.property?.city}.
            </p>
          ) : current ? (
            <p>
              <span className="font-semibold text-brand">Last stop is {current.stop.sequence}, {current.customer?.name}.</span>{" "}
              {current.property?.line1}, {current.property?.city}.
            </p>
          ) : (
            <p className="font-semibold">Every stop on {ROUTE.name} is recorded.</p>
          )}
        </figcaption>
      ) : (
        <figcaption className="border-b border-line px-4 py-3 text-sm text-muted">
          Wednesday is Smithville. Thursday is Elgin, Cedar Creek, McDade, and Paige. Friday is Bastrop and Red Rock. The numbered line is today&apos;s truck.
        </figcaption>
      )}
      <svg viewBox={viewBox} className="h-auto w-full bg-[#e7f0e4]" role="img" aria-label={variant === "route" ? "Friday route map" : "Service territory map"}>
        {variant === "territory" ? (
          <g>
            <path d="M16 24 L200 20 L214 210 L176 400 L20 370 Z" fill="#f6e4c4" stroke="#a16207" strokeWidth="2" />
            <path d="M230 40 L700 24 L740 150 L710 440 L260 428 L220 190 Z" fill="#d7e7d1" stroke="#3d5a40" strokeWidth="2" />
            <path d="M760 210 L880 190 L888 460 L748 470 L730 300 Z" fill="#d5e4f2" stroke="#2c5f8a" strokeWidth="2" />
            <text x="36" y="52" fontSize="13" fontWeight="700" fill="#8a5a12">THURSDAY</text>
            <text x="36" y="78" fontSize="12" fill="#6b5d4d">Elgin · 78621</text>
            <text x="36" y="128" fontSize="12" fill="#6b5d4d">Cedar Creek · 78621</text>
            <text x="36" y="250" fontSize="12" fill="#6b5d4d">McDade · 78650</text>
            <text x="36" y="300" fontSize="12" fill="#6b5d4d">Paige · 78659</text>
            <text x="300" y="70" fontSize="13" fontWeight="700" fill="#3d5a40">FRIDAY</text>
            <text x="770" y="242" fontSize="13" fontWeight="700" fill="#2c5f8a">WEDNESDAY</text>
            <text x="770" y="266" fontSize="12" fill="#6b5d4d">Smithville · 78957</text>
          </g>
        ) : (
          <path d="M230 40 L700 24 L740 150 L710 440 L260 428 L220 190 Z" fill="#d7e7d1" stroke="#5f7d55" />
        )}
        <path d="M270 412 C 380 396, 520 428, 690 408" fill="none" stroke="#8fb7d6" strokeWidth="12" strokeLinecap="round" />
        <text x="470" y="392" fontSize="11" fill="#3d6484">Colorado River</text>
        <text x="390" y="280" fontSize="22" fill="#3d5a40" opacity="0.28" fontWeight="700">BASTROP</text>
        <text x="500" y="46" fontSize="12" fill="#3d5a40" fontWeight="700">RED ROCK</text>
        {(variant === "route" ? ROADS.filter((road) => road.name !== "Pine") : ROADS).map((road) => (
          <g key={road.name}>
            <line x1={road.x1} y1={road.y1} x2={road.x2} y2={road.y2} stroke="#efe4cf" strokeWidth="14" strokeLinecap="round" />
            <line x1={road.x1} y1={road.y1} x2={road.x2} y2={road.y2} stroke="#d7c7a8" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
            <text
              x={road.labelX}
              y={road.labelY}
              fontSize="11"
              fill="#6b5d4d"
              transform={road.rotate ? `rotate(${road.rotate} ${road.labelX} ${road.labelY})` : undefined}
            >
              {road.name}
            </text>
          </g>
        ))}
        {legs.map((leg) => (
          <Leg key={`${leg.from.stop.id}-${leg.to.stop.id}`} leg={leg} />
        ))}
        {variant === "territory"
          ? territoryPins.map((pin) => (
              <g key={pin.property.id}>
                <circle cx={pin.point.x} cy={pin.point.y} r="6" fill={dayColor(pin.day)} stroke="#fffaf0" strokeWidth="2" />
                <text x={pin.point.x + 10} y={pin.point.y + 4} fontSize="11" fill="#17120d">
                  {pin.customer?.name.split(" ")[0]} · {streetName(pin.property.line1)}
                </text>
              </g>
            ))
          : null}
        {routeStops.map((item) => (
          <StopPin key={item.stop.id} item={item} current={item.stop.id === current?.stop.id} />
        ))}
        {variant === "route" ? (
          <g transform="translate(230 40)">
            <polygon points="8,0 14,16 8,12 2,16" fill="#17120d" />
            <text x="18" y="14" fontSize="11" fill="#17120d">N</text>
          </g>
        ) : null}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-4 py-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-[#1f3d2b]" /> Done</span>
        <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-brand" /> Next stop</span>
        <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full border border-ink bg-card" /> Still ahead</span>
        {variant === "territory" ? (
          <>
            <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-[#d5e4f2]" /> Wednesday</span>
            <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-[#f6e4c4]" /> Thursday</span>
            <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-[#d7e7d1]" /> Friday</span>
          </>
        ) : null}
        <span>Schematic streets. Not a live GPS feed.</span>
      </div>
    </figure>
  );
}

export function RouteTimeline({
  customers,
  properties,
  stops,
}: {
  customers: Customer[];
  properties: Property[];
  stops: RouteStop[];
}) {
  const rows = mapStops(stops, customers, properties);
  const currentId = rows.find((item) => item.stop.status === "scheduled")?.stop.id;

  return (
    <ol className="space-y-0">
      {rows.map((item, index) => {
        const current = item.stop.id === currentId;
        const done = item.stop.status !== "scheduled";
        return (
          <li key={item.stop.id} className="flex gap-3">
            <div className="flex w-8 flex-col items-center">
              <span
                className={
                  current
                    ? "flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
                    : done
                      ? "flex h-8 w-8 items-center justify-center rounded-full bg-[#1f3d2b] text-sm font-semibold text-white"
                      : "flex h-8 w-8 items-center justify-center rounded-full border border-ink bg-card text-sm font-semibold"
                }
              >
                {item.stop.sequence}
              </span>
              {index < rows.length - 1 ? <span className={`my-1 w-0.5 flex-1 ${done ? "bg-[#1f3d2b]" : "bg-line"}`} /> : null}
            </div>
            <div className={`mb-3 min-w-0 flex-1 rounded-lg border px-3 py-2 ${current ? "border-brand bg-card" : "border-line bg-card"}`}>
              <p className="font-semibold">{item.customer?.name}</p>
              <p className="text-sm text-muted">
                {item.property?.line1}, {item.property?.city}
              </p>
              {current ? <p className="text-xs font-semibold text-brand">Go here next</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Leg({ leg }: { leg: { from: MapStop; to: MapStop; kind: "done" | "next" | "later"; bend: number } }) {
  const color = leg.kind === "done" ? "#1f3d2b" : leg.kind === "next" ? "#b3141c" : "#8a8175";
  const width = leg.kind === "next" ? 5 : 3.5;
  const path = legPath(leg.from, leg.to, leg.bend);
  const arrow = path.point(0.55);
  const ahead = path.point(0.63);
  const angle = round1((Math.atan2(ahead.y - arrow.y, ahead.x - arrow.x) * 180) / Math.PI);
  return (
    <g>
      <path d={path.d} fill="none" stroke="#fffaf0" strokeWidth={width + 5} strokeLinecap="round" />
      <path
        d={path.d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={leg.kind === "later" ? "7 6" : undefined}
        strokeLinecap="round"
      />
      <polygon points="0,-5 12,0 0,5" fill={color} transform={`translate(${round1(arrow.x)} ${round1(arrow.y)}) rotate(${angle})`} />
    </g>
  );
}

function StopPin({ item, current }: { item: MapStop; current: boolean }) {
  const done = item.stop.status !== "scheduled";
  const fill = current ? "#b3141c" : done ? "#1f3d2b" : "#fffaf0";
  const ink = current || done ? "#fffaf0" : "#17120d";
  const label = `${item.stop.sequence} · ${shortStreet(item.property?.line1 ?? "Stop")}`;
  const width = label.length * 6.6 + 14;
  const anchor = PINS[item.property?.id ?? ""]?.label ?? "right";
  const rect = anchor === "left"
    ? { x: item.x - width - 18, y: item.y - 10, textX: item.x - 25, textY: item.y + 3, anchor: "end" as const }
    : anchor === "above"
      ? { x: item.x - width / 2, y: item.y - 36, textX: item.x, textY: item.y - 23, anchor: "middle" as const }
      : anchor === "below"
        ? { x: item.x - width / 2, y: item.y + 18, textX: item.x, textY: item.y + 31, anchor: "middle" as const }
        : { x: item.x + 18, y: item.y - 10, textX: item.x + 25, textY: item.y + 3, anchor: "start" as const };
  return (
    <g>
      {current ? <circle cx={item.x} cy={item.y} r="18" fill="none" stroke="#b3141c" strokeWidth="3" /> : null}
      <circle cx={item.x} cy={item.y} r="13" fill={fill} stroke="#17120d" strokeWidth="1.5" />
      <text x={item.x} y={item.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>
        {item.stop.sequence}
      </text>
      <rect x={rect.x} y={rect.y} width={width} height={18} rx="4" fill="#fffaf0" stroke="#e0d2b9" />
      <text x={rect.textX} y={rect.textY} fontSize="11" fill="#17120d" textAnchor={rect.anchor}>
        {label}
      </text>
      <title>{`${item.stop.sequence}. ${item.customer?.name ?? "Stop"}, ${item.property?.line1 ?? ""}, ${statusLabel(item.stop.status)}`}</title>
    </g>
  );
}

function mapStops(stops: RouteStop[], customers: Customer[], properties: Property[]): MapStop[] {
  return [...stops]
    .sort((a, b) => a.sequence - b.sequence)
    .map((stop) => {
      const property = properties.find((item) => item.id === stop.propertyId);
      const point = property ? pointFor(property) : { x: 480, y: 240 };
      return {
        stop,
        customer: customers.find((item) => item.id === stop.customerId),
        property,
        x: point.x,
        y: point.y,
      };
    });
}

function pointFor(property: Property) {
  const fixed = PINS[property.id];
  if (fixed) return fixed;
  const day = territoryForZip(property.zip)?.day ?? "Friday";
  const base = day === "Thursday" ? { x: 120, y: 210 } : day === "Wednesday" ? { x: 800, y: 360 } : { x: 460, y: 250 };
  let hash = 0;
  for (const char of property.id) hash = (hash + char.charCodeAt(0)) % 97;
  return { x: base.x + (hash % 5) * 16, y: base.y + (hash % 3) * 18 };
}

function streetName(line1: string) {
  return line1.replace(/^\d+\s+/, "") || line1;
}

function shortStreet(line1: string) {
  return streetName(line1).replace("State Highway", "SH").replace(" Street", "").replace(" Road", "");
}

function legPath(from: MapStop, to: MapStop, bend: number) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = round1(mx + (-dy / len) * bend);
  const cy = round1(my + (dx / len) * bend);
  const curved = bend !== 0;
  return {
    d: curved ? `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}` : `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
    point(t: number) {
      if (!curved) return pointAlong(from.x, from.y, to.x, to.y, t);
      const u = 1 - t;
      return {
        x: round1(u * u * from.x + 2 * u * t * cx + t * t * to.x),
        y: round1(u * u * from.y + 2 * u * t * cy + t * t * to.y),
      };
    },
  };
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function compass(from: MapStop, to: MapStop) {
  const dx = to.x - from.x;
  const dy = from.y - to.y;
  const angle = Math.atan2(dy, dx);
  const dirs = ["east", "northeast", "north", "northwest", "west", "southwest", "south", "southeast"];
  const index = Math.round(angle / (Math.PI / 4));
  return dirs[(index + 8) % 8];
}

function pointAlong(x1: number, y1: number, x2: number, y2: number, t: number) {
  return { x: round1(x1 + (x2 - x1) * t), y: round1(y1 + (y2 - y1) * t) };
}

function dayColor(day: string) {
  if (day === "Wednesday") return "#2c5f8a";
  if (day === "Thursday") return "#a16207";
  return "#1f3d2b";
}

function statusLabel(status: StopStatus) {
  if (status === "scheduled") return "still ahead";
  if (status === "completed" || status === "completed_with_extras") return "done";
  return status.replaceAll("_", " ");
}
