export interface Sale {
  id: string;
  date: string;
  month: string;
  product: string;
  category: string;
  region: string;
  seller: string;
  customer: string;
  quantity: number;
  unitPrice: number;
  revenue: number;
}

export interface Dataset {
  generatedFrom: string;
  summary: {
    rowsRead: number;
    rowsValid: number;
    rowsRejected: number;
  };
  rows: Sale[];
}

export interface Filters {
  category: string;
  region: string;
  q: string;
}
