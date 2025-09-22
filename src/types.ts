export interface Product {
  name: string;
  category: string;
  price: number;
}

export interface TaxCalculationResult {
  product: Product;
  taxRate: number;
  taxAmount: number;
  totalWithTax: number;
  appliedCategory: string;
}

export interface TaxCategory {
  name: string;
  rate: number;
  description: string;
}

export interface BatchTaxRequest {
  products: Product[];
}

export interface BatchTaxResponse {
  results: TaxCalculationResult[];
  summary: {
    totalProducts: number;
    totalPrice: number;
    totalTax: number;
    totalWithTax: number;
  };
}