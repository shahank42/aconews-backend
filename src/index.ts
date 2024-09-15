import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import type { GNewsResponse } from "./types";
import { paginateResults } from "./utils/pagination";

type Bindings = {
	GNEWS_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

const NewsQuerySchema = z.object({
	category: z.string(),
	country: z.string(),
	language: z.string(),
	page: z.string().optional().default("1"),
	pageSize: z.string().optional().default("4"),
});

app.get("/news", async (c) => {
	try {
		const result = NewsQuerySchema.safeParse(c.req.query());
		if (!result.success) {
			return c.json({ error: "Invalid query parameters" }, 400);
		}

		const { category, country, language, page, pageSize } = result.data;

		const url = new URL("https://gnews.io/api/v4/top-headlines");
		const params = {
			apikey: c.env.GNEWS_API_KEY,
			category,
			lang: language,
			country,
		};
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.append(key, value);
		}

		const res = await fetch(url.toString());
		if (!res.ok) {
			throw new Error(`API responded with status: ${res.status}`);
		}

		const data = (await res.json()) as GNewsResponse;

		const { paginatedItems: paginatedArticles, ...paginationInfo } =
			paginateResults(
				data.articles,
				Number.parseInt(page),
				Number.parseInt(pageSize),
			);

		return c.json({
			articles: paginatedArticles,
			...paginationInfo,
		});
	} catch (error) {
		console.error("News fetch from GNews failed:", error);
		return c.json(
			{ status: "ERROR", message: "News fetch from GNews failed" },
			500,
		);
	}
});

const SearchQuerySchema = z.object({
	query: z.string(),
	country: z.string().optional(),
	language: z.string().optional(),
	page: z.string().optional().default("1"),
	pageSize: z.string().optional().default("4"),
});

app.get("/search", async (c) => {
	try {
		const result = SearchQuerySchema.safeParse(c.req.query());
		if (!result.success) {
			return c.json({ error: "Invalid query parameters" }, 400);
		}

		console.log(result.data);

		const { query, country, language, page, pageSize } = result.data;

		const url = new URL("https://gnews.io/api/v4/search");
		const params = {
			apikey: c.env.GNEWS_API_KEY,
			q: query,
			lang: language,
			country,
		};
		for (const [key, value] of Object.entries(params)) {
			if (value) {
				url.searchParams.append(key, value);
			}
		}

		console.log(url.toString());

		const res = await fetch(url.toString());
		if (!res.ok) {
			throw new Error(`API responded with status: ${res.status}`);
		}

		const data = (await res.json()) as GNewsResponse;

		const { paginatedItems: paginatedArticles, ...paginationInfo } =
			paginateResults(
				data.articles,
				Number.parseInt(page),
				Number.parseInt(pageSize),
			);

		return c.json({
			articles: paginatedArticles,
			...paginationInfo,
		});
	} catch (error) {
		console.error("News search from GNews failed:", error);
		return c.json(
			{ status: "ERROR", message: "News search from GNews failed" },
			500,
		);
	}
});

export default app;
