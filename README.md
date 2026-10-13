# 📊 Sales Dashboard — React + Vite + Recharts

Dashboard interactivo de ventas en **React + TypeScript**, con KPIs en vivo,
4 gráficos (línea mensual, pie de categorías, top productos, ventas por
región), búsqueda instantánea, filtros y tabla detallada. Tema oscuro
responsive.

![React](https://img.shields.io/badge/react-18-61dafb)
![TypeScript](https://img.shields.io/badge/TS-strict-3178c6)
![Vite](https://img.shields.io/badge/vite-5-646cff)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Qué demuestra

| Área | Detalle |
|---|---|
| **TypeScript estricto** | `strict: true`, tipos de dominio (`Sale`, `Dataset`, `Filters`) |
| **Gráficos con Recharts** | Line/Pie/Bar + tooltips formateados en MXN |
| **Estado y memoización** | `useMemo` para filtrar y agregar sin recalcular de más |
| **Pipeline de datos integrado** | El dataset demo se genera desde el CSV del proyecto `sales-report-automator` (misma figura: $165,251.44 en KPIs en ambos) |
| **UX** | Búsqueda con debounce-free render, filtros por categoría/región, tabla con límite visible |
| **Build limpio** | 0 errores de consola en runtime, verificado en Chrome |

---

## 🚀 Inicio rápido

```bash
cd sales-dashboard-web
npm install
npm run dev        # http://localhost:5173
```

Producción:

```bash
npm run build      # → dist/
npm run preview    # sirve dist en http://localhost:4173
```

---

## 🗂️ Estructura

```
sales-dashboard-web/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── scripts/
│   └── build_sample_data.py   # CSV del informe de ventas → JSON
├── src/
│   ├── main.tsx
│   ├── App.tsx                # Layout + gráficos + tabla
│   ├── types.ts               # Tipos del dominio
│   ├── styles.css             # Tema oscuro responsive
│   ├── analytics/
│   │   └── analytics.ts       # KPIs + agregaciones puras
│   └── data/
│       ├── sample.ts          # Loader del dataset
│       └── sales.json         # 130 transacciones válidas
├── LICENSE
└── README.md
```

---

## 📡 Origen de los datos

`scripts/build_sample_data.py` lee
`../sales-report-automator/data/sample_sales_data.csv` (140 filas), aplica el
**mismo validador** del reporteador Python y exporta las 130 filas válidas a
`src/data/sales.json`.

```bash
python scripts/build_sample_data.py
```

| KPI | Valor (dashboard ≡ Excel del reporteador) |
|---|---|
| Ingresos totales | $165,251.44 |
| Órdenes únicas | 130 |
| Unidades | 758 |
| Ticket medio | $1,271.16 |

Los filtros reducen KPIs y gráficos en tiempo real.

---

## 📈 Capturas de las métricas incluidas

- **Serie mensual**: ingresos enero→diciembre 2024
- **Pie de categorías**: participación de 8 categorías
- **Top 6 productos**: ranking horizontal por ingresos
- **Regiones**: barras verticales
- **Tabla**: últimas 25 transacciones filtradas

---

## 📜 Licencia

MIT — ver [LICENSE](LICENSE).
