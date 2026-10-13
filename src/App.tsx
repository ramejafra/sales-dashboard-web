import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataset } from "./data/sample";
import {
  byMonth,
  byTop,
  computeKpis,
  filterSales,
  fmtMoney,
  fmtNum,
} from "./analytics/analytics";
import type { Filters } from "./types";

const PALETTE = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9", "#ec4899", "#14b8a6"];

export default function App() {
  const [filters, setFilters] = useState<Filters>({ category: "", region: "", q: "" });
  const rows = useMemo(() => filterSales(dataset.rows, filters), [filters]);

  const kpis = useMemo(() => computeKpis(rows), [rows]);
  const monthly = useMemo(() => byMonth(rows), [rows]);
  const topProducts = useMemo(() => byTop(rows, "product", 6), [rows]);
  const categories = useMemo(() => byTop(rows, "category", 8), [rows]);
  const regions = useMemo(() => byTop(rows, "region", 8), [rows]);

  const categoriesList = useMemo(
    () => [...new Set(dataset.rows.map((r) => r.category))].sort(),
    [],
  );
  const regionsList = useMemo(
    () => [...new Set(dataset.rows.map((r) => r.region))].sort(),
    [],
  );

  const set = (k: keyof Filters) => (v: string) =>
    setFilters((f) => ({ ...f, [k]: v }));

  return (
    <div className="layout">
      <header className="topbar">
        <div>
          <h1>📊 Sales Dashboard</h1>
          <p className="subtitle">
            {fmtNum(rows.length)} transacciones ·{" "}
            <span className="muted">
              demo generado desde <code>sample_sales_data.csv</code>
            </span>
          </p>
        </div>
        <div className="filters">
          <input
            placeholder="🔍 producto, vendedor, cliente…"
            value={filters.q}
            onChange={(e) => set("q")(e.target.value)}
          />
          <select value={filters.category} onChange={(e) => set("category")(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={filters.region} onChange={(e) => set("region")(e.target.value)}>
            <option value="">Todas las regiones</option>
            {regionsList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      <section className="kpis">
        <KpiCard title="Ingresos totales" value={fmtMoney(kpis.revenue)} accent="#2563eb" />
        <KpiCard title="Órdenes únicas" value={fmtNum(kpis.orders)} accent="#10b981" />
        <KpiCard title="Unidades vendidas" value={fmtNum(kpis.units)} accent="#f59e0b" />
        <KpiCard title="Ticket medio" value={fmtMoney(kpis.avgTicket)} accent="#8b5cf6" />
      </section>

      <section className="grid-2">
        <Card title="Ingresos por mes">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthly} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number) => fmtMoney(v)}
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="ingresos" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Categorías (pie)">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categories} dataKey="ingresos" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {categories.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => fmtMoney(v)}
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top 6 productos por ingresos">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={90} />
              <Tooltip
                formatter={(v: number) => fmtMoney(v)}
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
              />
              <Bar dataKey="ingresos" radius={[0, 6, 6, 0]}>
                {topProducts.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Ventas por región">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regions} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number) => fmtMoney(v)}
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
              />
              <Bar dataKey="ingresos" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>

      <Card title="Detalle de transacciones" className="full">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th><th>Pedido</th><th>Producto</th><th>Categoría</th>
                <th>Región</th><th>Vendedor</th><th>Unid.</th><th>Precio</th><th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 25).map((r) => (
                <tr key={`${r.id}-${r.product}`}>
                  <td>{r.date}</td>
                  <td><code>{r.id}</code></td>
                  <td>{r.product}</td>
                  <td>{r.category}</td>
                  <td>{r.region}</td>
                  <td>{r.seller}</td>
                  <td>{fmtNum(r.quantity)}</td>
                  <td>{fmtMoney(r.unitPrice)}</td>
                  <td className="strong">{fmtMoney(r.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 25 && (
            <p className="muted table-note">Mostrando 25 de {fmtNum(rows.length)} filas…</p>
          )}
          {rows.length === 0 && <p className="muted">Sin resultados con estos filtros.</p>}
        </div>
      </Card>

      <footer className="footer muted">
        React + Vite + Recharts · dataset coherente con el proyecto{" "}
        <code>sales-report-automator</code> del portafolio.
      </footer>
    </div>
  );
}

function KpiCard({ title, value, accent }: { title: string; value: string; accent: string }) {
  return (
    <div className="kpi">
      <span className="kpi-title">{title}</span>
      <span className="kpi-value" style={{ color: accent }}>{value}</span>
    </div>
  );
}

function Card({ title, children, className = "" }: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card ${className}`}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
