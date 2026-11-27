const chicago: Intl.DateTimeFormatOptions = { timeZone: "America/Chicago" };

export function formatCents(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(Math.trunc(cents));
  const dollars = Math.floor(abs / 100);
  const rem = abs % 100;
  const body = `$${dollars.toLocaleString("en-US")}.${rem.toString().padStart(2, "0")}`;
  return negative ? `-${body}` : body;
}

export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    ...chicago,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDay(value: string): string {
  const iso = value.length === 10 ? `${value}T12:00:00Z` : value;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    ...chicago,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function titleCase(value: string): string {
  return value.replaceAll("_", " ");
}
