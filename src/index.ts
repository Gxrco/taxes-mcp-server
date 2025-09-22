import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TaxCalculator } from './tax-calculator.js';
import type { Product } from './types.js';

const taxCalculator = new TaxCalculator();

export class TaxMCP extends McpAgent {
	server = new McpServer({
		name: "tax-calculator-server",
		version: "1.0.0",
	});

	async init() {
		// Calculate tax for a single product
		this.server.tool(
			"calculate_tax",
			{
				name: z.string().describe("Product name"),
				category: z.string().describe("Product category (food, electronics, clothing, books, medicine, luxury, automotive, home, sports, other)"),
				price: z.number().min(0).describe("Product price in USD"),
			},
			async ({ name, category, price }) => {
				try {
					const product: Product = { name, category, price };
					const result = taxCalculator.calculateTaxForProduct(product);

					return {
						content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
					};
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [{ type: "text", text: `Error: ${errorMessage}` }],
						isError: true,
					};
				}
			},
		);

		// Calculate taxes for multiple products
		this.server.tool(
			"calculate_batch_tax",
			{
				products: z.array(z.object({
					name: z.string(),
					category: z.string(),
					price: z.number().min(0),
				})).describe("Array of products to calculate taxes for"),
			},
			async ({ products }) => {
				try {
					const result = taxCalculator.calculateBatchTax(products);

					return {
						content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
					};
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [{ type: "text", text: `Error: ${errorMessage}` }],
						isError: true,
					};
				}
			},
		);

		// List all available tax categories
		this.server.tool(
			"list_tax_categories",
			{},
			async () => {
				try {
					const categories = taxCalculator.getAvailableCategories();

					return {
						content: [{ type: "text", text: JSON.stringify(categories, null, 2) }],
					};
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [{ type: "text", text: `Error: ${errorMessage}` }],
						isError: true,
					};
				}
			},
		);

		// Get tax rate for a specific category
		this.server.tool(
			"get_tax_rate",
			{
				category: z.string().describe("Category name to get tax rate for"),
			},
			async ({ category }) => {
				try {
					const rate = taxCalculator.getTaxRateForCategory(category);

					return {
						content: [{ type: "text", text: JSON.stringify({ category, taxRate: rate }, null, 2) }],
					};
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					return {
						content: [{ type: "text", text: `Error: ${errorMessage}` }],
						isError: true,
					};
				}
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return TaxMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return TaxMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Tax Calculator MCP Server - Not found", { status: 404 });
	},
};
