import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import type { GNewsResponse } from "./types";

type Bindings = {
	GNEWS_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

const NewsQuerySchema = z.object({
	category: z.string(),
	country: z.string(),
	language: z.string(),
	max: z.string(),
});

app.get("/news", async (c) => {
	try {
		const result = NewsQuerySchema.safeParse(c.req.query());
		if (!result.success) {
			return c.json({ error: "Invalid query parameters" }, 400);
		}

		const { category, country, language, max } = result.data;

		const url = new URL("https://gnews.io/api/v4/top-headlines");
		const params = {
			apikey: c.env.GNEWS_API_KEY,
			category,
			lang: language,
			country,
			max,
		};
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.append(key, value);
		}

		const res = await fetch(url.toString());
		if (!res.ok) {
			throw new Error(`API responded with status: ${res.status}`);
		}

		const data = (await res.json()) as GNewsResponse;
		return c.json(data.articles);
	} catch (error) {
		console.error("News fetch from GNews failed:", error);
		return c.json(
			{ status: "ERROR", message: "News fetch from GNews failed" },
			500,
		);
	}
});

export default app;
