import type { Filters, Sale } from "../types";

export function filterSales(rows: Sale[], f: Filters): Sale[] {
  const q = f.q.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (f.category === "" || r.category === f.category) &&
      (f.region === "" || r.region === f.region) &&
      (q === "" ||
        r.product.toLowerCase().includes(q) ||
        r.seller.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q)),
  );
}

export interface Kpis {
  revenue: number;
  orders: number;
  units: number;
  avgTicket: number;
}

export function computeKpis(rows: Sale[]): Kpis {
  const revenue = rows.reduce((s, r) => s + r.revenue, 0);
  const orders = new Set(rows.map((r) => r.id)).size;
  const units = rows.reduce((s, r) => s + r.quantity, 0);
  const avgTicket = rows.length ? revenue / rows.length : 0;
  return { revenue, orders, units, avgTicket };
}

export function byMonth(rows: Sale[]) {
  const map = new Map<string, { revenue: number; units: number; orders: Set<string> }>();
  for (const r of rows) {
    const cur = map.get(r.month) ?? { revenue: 0, units: 0, orders: new Set<string>() };
    cur.revenue += r.revenue;
    cur.units += r.quantity;
    cur.orders.add(r.id);
    map.set(r.month, cur);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month,
      ingresos: Math.round(v.revenue * 100) / 100,
      unidades: v.units,
      ordenes: v.orders.size,
    }));
}

export function byTop(rows: Sale[], key: "product" | "category" | "region" | "seller", n = 8) {
  const map = new Map<string, number>();
  for (const r of rows) map.set(r[key], (map.get(r[key]) ?? 0) + r.revenue);
  return [...map.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([name, ingresos]) => ({ name, ingresos: Math.round(ingresos * 100) / 100 }));
}

export function fmtMoney(n: number): string {
  return `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fmtNum(n: number): string {
  return n.toLocaleString("es-MX");
}
