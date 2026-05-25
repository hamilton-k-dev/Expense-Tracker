export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T12:00:00") : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function startOfMonth(month: number, year: number): Date {
  return new Date(year, month - 1, 1);
}

export function endOfMonth(month: number, year: number): Date {
  return new Date(year, month, 1);
}

export function getMonthLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleString("default", { month: "short" });
}

export function getLast6Months(): { month: number; year: number; label: string }[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { month: d.getMonth() + 1, year: d.getFullYear(), label: d.toLocaleString("default", { month: "short" }) };
  });
}
