"""
Convierte data/sample_sales_data.csv (del proyecto sales-report-automator)
a JSON para el dashboard. Idioma de claves en inglés (convención JS).
Uso: python scripts/build_sample_data.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV = ROOT.parent / "sales-report-automator" / "data" / "sample_sales_data.csv"
OUT = ROOT / "src" / "data" / "sales.json"


def main() -> int:
    sys.path.insert(0, str((ROOT.parent / "sales-report-automator").resolve()))
    from validator import load_and_validate  # type: ignore

    valid, rejected, summary = load_and_validate(CSV)
    rows = [
        {
            "id": r["order_id"],
            "date": r["date"].strftime("%Y-%m-%d"),
            "month": r["date"].strftime("%Y-%m"),
            "product": r["product"],
            "category": r["category"],
            "region": r["region"],
            "seller": r["seller"],
            "customer": r["customer_email"],
            "quantity": int(r["quantity"]),
            "unitPrice": float(r["unit_price"]),
            "revenue": float(r["revenue"]),
        }
        for _, r in valid.iterrows()
    ]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedFrom": "sales-report-automator/data/sample_sales_data.csv",
        "summary": {
            "rowsRead": summary.total_rows,
            "rowsValid": summary.accepted_rows,
            "rowsRejected": summary.rejected_rows,
        },
        "rows": rows,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"OK: {len(rows)} filas -> {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
