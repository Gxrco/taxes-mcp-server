import type { Product, TaxCalculationResult, TaxCategory, BatchTaxResponse } from './types.js';

export class TaxCalculator {
  private readonly taxCategories: Map<string, TaxCategory> = new Map([
    ['food', { name: 'food', rate: 0.05, description: 'Food and beverages' }],
    ['electronics', { name: 'electronics', rate: 0.08, description: 'Electronic devices and accessories' }],
    ['clothing', { name: 'clothing', rate: 0.06, description: 'Apparel and accessories' }],
    ['books', { name: 'books', rate: 0.00, description: 'Books and educational materials' }],
    ['medicine', { name: 'medicine', rate: 0.00, description: 'Medical supplies and medications' }],
    ['luxury', { name: 'luxury', rate: 0.15, description: 'Luxury items and jewelry' }],
    ['automotive', { name: 'automotive', rate: 0.10, description: 'Automotive parts and accessories' }],
    ['home', { name: 'home', rate: 0.07, description: 'Home and garden items' }],
    ['sports', { name: 'sports', rate: 0.08, description: 'Sports and recreation equipment' }],
    ['other', { name: 'other', rate: 0.08, description: 'Miscellaneous items' }]
  ]);

  calculateTaxForProduct(product: Product): TaxCalculationResult {
    const normalizedCategory = product.category.toLowerCase().trim();
    const categoryInfo = this.taxCategories.get(normalizedCategory) || this.taxCategories.get('other') as TaxCategory;

    const taxAmount = product.price * categoryInfo.rate;
    const totalWithTax = product.price + taxAmount;

    return {
      product,
      taxRate: categoryInfo.rate,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalWithTax: Math.round(totalWithTax * 100) / 100,
      appliedCategory: categoryInfo.name
    };
  }

  calculateBatchTax(products: Product[]): BatchTaxResponse {
    const results = products.map(product => this.calculateTaxForProduct(product));

    const summary = results.reduce((acc, result) => ({
      totalProducts: acc.totalProducts + 1,
      totalPrice: acc.totalPrice + result.product.price,
      totalTax: acc.totalTax + result.taxAmount,
      totalWithTax: acc.totalWithTax + result.totalWithTax
    }), {
      totalProducts: 0,
      totalPrice: 0,
      totalTax: 0,
      totalWithTax: 0
    });

    summary.totalPrice = Math.round(summary.totalPrice * 100) / 100;
    summary.totalTax = Math.round(summary.totalTax * 100) / 100;
    summary.totalWithTax = Math.round(summary.totalWithTax * 100) / 100;

    return { results, summary };
  }

  getAvailableCategories(): TaxCategory[] {
    return Array.from(this.taxCategories.values());
  }

  getTaxRateForCategory(category: string): number {
    const normalizedCategory = category.toLowerCase().trim();
    const categoryInfo = this.taxCategories.get(normalizedCategory) || this.taxCategories.get('other') as TaxCategory;
    return categoryInfo.rate;
  }
}