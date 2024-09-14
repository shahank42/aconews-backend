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
	pageSize: z.string().optional().default("3"),
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

		console.log(url.toString());

		// const res = await fetch(url.toString());
		// if (!res.ok) {
		// 	throw new Error(`API responded with status: ${res.status}`);
		// }

		// const data = (await res.json()) as GNewsResponse;

		const data = {
			articles: [
				{
					title: "Kronprinsessans son gripen igen",
					description:
						"Marius Borg Høiby, den skandalomsusade sonen till Norges kronprinsessa Mette-Marit, har gripits igen, rapporterar norska medier med hänvisning till Oslopolisen.",
					content:
						"Polisen uppger att en uppdatering i ärendet kommer under lördagen. Borg Høiby greps initialt den 4 augusti efter en incident i en lägenhet i Oslo.\nHan står anklagad för, och har erkänt, att han misshandlat sin flickvän och har belagts med kontaktförb... [567 chars]",
					url: "https://www.gp.se/nyheter/varlden/kronprinsessans-son-gripen-igen.a9ed5eb4-a853-5fad-9afb-513d0ea90ec8",
					image:
						"https://www.gp.se/images/og/a9ed5eb4-a853-5fad-9afb-513d0ea90ec8/images/1a_6oIJAa_S6KgjE9qO_zYW3CCSk-REGULAR.jpg",
					publishedAt: "2024-09-14T10:11:51Z",
					source: { name: "Göteborgs-Posten", url: "https://www.gp.se" },
				},
				{
					title:
						"Chi è Laura Loomer, la complottista che ha inventato la bufala degli immigrati che mangiano i gatti diventata la musa di Trump",
					description:
						"Complottista, attivista di ultra destra, detestata anche dai repubblicani più moderati",
					content:
						"NEW YORK - Donald Trump ha una nuova musa. Il movimento Maga una nuova nemica. E nel mondo iperbolico dei trumpiani americani le due cose possono coincidere. E avere lo stesso volto: quello di Laura Elizabeth Loomer, 31 anni, influencer di Tucson, Ar... [4046 chars]",
					url: "https://www.repubblica.it/esteri/2024/09/14/news/chi_e_laura_loomer_gatti_trump-423499779/",
					image:
						"https://www.repstatic.it/content/nazionale/img/2024/09/14/085918949-3d06a9b7-7419-4981-91fb-59d88df1e743.jpg",
					publishedAt: "2024-09-14T10:11:09Z",
					source: { name: "la Repubblica", url: "https://www.repubblica.it" },
				},
				{
					title:
						"GWS Giants v Brisbane Lions scores, results, fixtures, teams, tips, games, how to watch",
					description:
						"Follow along for all the major moments and post game reactions as the Giants and Lions fight for the last place in the final four.",
					content:
						"Our man Andrew Stafford says:\nAn action-packed few minutes here. Those old alarm bells were ringing for the Lions when Jesse Hogan did his best Fred Flintstone dance on his way in for the Giants' fifth goal, seeing the Giants out to a 21-point lead.\n... [362 chars]",
					url: "https://www.theage.com.au/sport/afl/afl-finals-2024-live-updates-gws-giants-brisbane-lions-face-off-in-knockout-semi-final-20240913-p5kaic.html",
					image:
						"https://static.ffx.io/images/$zoom_0.2481817143900991%2C$multiply_0.7554%2C$ratio_1.776846%2C$width_1059%2C$x_300%2C$y_27/t_crop_custom/q_86%2Cf_auto/t_theage_live_no_age_social_wm/800bf38a12e564323882de579d5341d1c9a9b34c",
					publishedAt: "2024-09-14T10:02:41Z",
					source: { name: "The Age", url: "https://www.theage.com.au" },
				},
				{
					title: "Här är långdistansvapnen som hotar Ryssland",
					description:
						"Med långdistansvapen skulle Ukraina kunna slå mot mål hundratals kilometer in i Ryssland och därmed försvaga fiendens anfallsförmåga.Här är robotarna som",
					content:
						"Du vet väl att du kan skapa ett gratiskonto på DN? Som inloggad kan du ta del av flera smarta funktioner.\nUkrainas president Volodymyr Zelenskyj har länge tryckt på för att Ukraina ska få använda amerikanska och brittiska långdistansvapen mot militär... [3287 chars]",
					url: "https://www.dn.se/varlden/har-ar-langdistansvapnen-som-hotar-ryssland-avgorande-for-effekten-pa-kriget/",
					image:
						"https://static.bonniernews.se/gcs/bilder/dn-mly/9029598f-7a6e-46d9-bd23-389b0c8db0fa.jpeg?interpolation=lanczos-none&fit=around%7C1024:576&crop=1024:h;center,top&output-quality=80",
					publishedAt: "2024-09-14T10:00:54Z",
					source: { name: "Dagens Nyheter", url: "https://www.dn.se" },
				},
				{
					title:
						"The moon might still have active volcanoes, China's Chang'e 5 sample-return probe reveals",
					description:
						"The moon might still have active volcanoes, China's Chang'e 5 sample-return probe reveals",
					content:
						"China's Chang's 5 return capsule with samples of the moon is seen after landing in Inner Mongolia, China, on Dec. 17, 2020.\nVolcanoes have erupted on the lunar surface within a geologically recent timespan, and the moon could still be volcanically ac... [6775 chars]",
					url: "https://www.livescience.com/space/the-moon/the-moon-might-still-have-active-volcanoes-china-s-chang-e-5-sample-return-probe-reveals",
					image:
						"https://cdn.mos.cms.futurecdn.net/KhbSc79no9m8Y72abNsH3f-1200-80.jpg",
					publishedAt: "2024-09-14T10:00:00Z",
					source: {
						name: "Livescience.com",
						url: "https://www.livescience.com",
					},
				},
				{
					title: "En vidéo - Comment se porte la biodiversité suisse?",
					description:
						"L'état de la biodiversité suisse est insatisfaisant, voire mauvais, selon plusieurs indicateurs suivis régulièrement sur différentes périodes. A l'approche de la votation sur l'initiative «biodiversité», on vous propose un tour d'horizon",
					content:
						"L'état de la biodiversité suisse est insatisfaisant, voire mauvais, selon plusieurs indicateurs suivis régulièrement sur différentes périodes. A l'approche de la votation sur l'initiative «biodiversité», on vous propose un tour d'horizon\nLe 22 septem... [1900 chars]",
					url: "https://www.letemps.ch/videos/actualite/en-video-comment-se-porte-la-biodiversite-suisse",
					image:
						"https://letemps-17455.kxcdn.com/photos/df066e99-d656-4229-b762-8b40e9d1f7ff/medium",
					publishedAt: "2024-09-14T09:51:16Z",
					source: { name: "Le Temps", url: "https://www.letemps.ch" },
				},
				{
					title:
						"After PTI, BNP-M claims lawmakers under pressure to vote for 'constitutional package'",
					description:
						"Mengal says Senator Qasim's house raided, intelligence agencies' cars patrolling his house; says Nasima Ehsaan's family, husband threatened.",
					content:
						"The chief of the Balochistan National Party-Mengal (BNP-M) Akhtar Mengal has claimed that two senators of his party were being 1pressurised to vote in favour of a highly anticipated constitutional package.\nThe constitutional package is a set of ... [3783 chars]",
					url: "https://www.dawn.com/news/1858941/after-pti-bnp-m-claims-lawmakers-under-pressure-to-vote-for-constitutional-package",
					image:
						"https://i.dawn.com/large/2024/09/14141656f8fba6c.jpg?r=144929",
					publishedAt: "2024-09-14T09:49:29Z",
					source: { name: "DAWN.com", url: "https://www.dawn.com" },
				},
				{
					title:
						"Che cosa rischia Matteo Salvini nel processo Open Arms: i reati contestati",
					description:
						"La pena prevista dall'articolo 605 del codice penale (reato più grave) è di reclusione da 3 a 15 anni",
					content:
						"di Redazione Online\nLa pena prevista dall'articolo 605 del codice penale (reato più grave) è di reclusione da 3 a 15 anni\nI reati contestati a Matteo Salvini sono sequestro di persona in danno di 147 persone migranti, trattenute illegittimamente a bo... [1030 chars]",
					url: "https://www.corriere.it/cronache/24_settembre_14/che-cosa-rischia-matteo-salvini-nel-processo-open-arms-i-reati-contestati-8e05c7d8-161f-4847-ac35-5ae044731xlk.shtml",
					image:
						"https://dimages2.corriereobjects.it/files/og_thumbnail/uploads/2024/09/14/66e557c106296.jpeg",
					publishedAt: "2024-09-14T09:38:09Z",
					source: {
						name: "Corriere della Sera",
						url: "https://www.corriere.it",
					},
				},
				{
					title: "Ukraine: Gegenoffensive in Kursk läuft an - was bleibt?",
					description:
						"Nachdem ukrainische Truppen Teile der russischen Region Kursk eingenommen haben, deutet sich jetzt die Gegenoffensive an. Militärexperte Wolfgang Richter beurteilt die Wirkung von Kiews Ablenkungsoffensive.",
					content:
						"Nachdem ukrainische Truppen Teile der russischen Region Kursk eingenommen haben, deutet sich jetzt die Gegenoffensive an. Militärexperte Wolfgang Richter beurteilt die Wirkung von Kiews Ablenkungsoffensive.\nKursk : Gegenoffensive läuft an: Was bleibt... [3303 chars]",
					url: "https://www.20min.ch/story/ukraine-gegenoffensive-in-kursk-laeuft-an-was-bleibt-103184691",
					image:
						"https://image.20min.ch/2024/09/14/27bbad70-85a2-4b2c-abaf-bc4f954153f5.jpeg?auto=format%2Ccompress%2Cenhance&fit=crop&w=1200&h=675&rect=0%2C0%2C3000%2C1673&crop=faces&s=19c40cd8089808b4868b9489a62d0c19",
					publishedAt: "2024-09-14T09:34:30Z",
					source: { name: "20 Minuten", url: "https://www.20min.ch" },
				},
				{
					title:
						"LIVE | Tientallen raketten afgevuurd op noorden Israël, brand uitgebroken",
					description:
						"Het Midden-Oosten staat al bijna een jaar onder hoogspanning na de bloedige terreuraanval van Hamas in Israël. Volg hier ons liveblog",
					content:
						"Het Midden-Oosten staat al bijna een jaar onder hoogspanning na de bloedige terreuraanval van Hamas in Israël. Hezbollah en andere door Iran gesteunde groepen bestoken dagelijks de Joodse staat en nog altijd zitten tal van gijzelaars vast in Gaza. Oo... [416 chars]",
					url: "https://www.telegraaf.nl/nieuws/38611645/live-tientallen-raketten-afgevuurd-op-noorden-israel-brand-uitgebroken",
					image:
						"https://www.telegraaf.nl/images/1200x630/filters:format(jpeg):quality(80)/cdn-kiosk-api.telegraaf.nl/730c3eb2-727c-11ef-b1ed-0642cc36895b.jpg",
					publishedAt: "2024-09-14T09:31:36Z",
					source: { name: "Telegraaf.nl", url: "https://www.telegraaf.nl" },
				},
				{
					title: "New AI model predicts breast cancer risk with high accuracy",
					description:
						"Researchers develop an AI system that can predict breast cancer risk up to five years in advance with 90% accuracy.",
					content:
						"A team of researchers from Stanford University has developed a new artificial intelligence model that can predict a woman's risk of developing breast cancer up to five years in advance with 90% accuracy. The model, which uses mammogram images and patient history data, outperforms current risk assessment tools and could lead to earlier detection and better outcomes for patients. [500 chars]",
					url: "https://www.sciencedaily.com/releases/2024/09/240914093000.htm",
					image:
						"https://www.sciencedaily.com/images/2024/09/240914093000_1_540x360.jpg",
					publishedAt: "2024-09-14T09:30:00Z",
					source: { name: "ScienceDaily", url: "https://www.sciencedaily.com" },
				},
				{
					title: "Global climate protests kick off ahead of UN summit",
					description:
						"Millions of people around the world join protests demanding urgent action on climate change before the UN Climate Action Summit.",
					content:
						"Millions of protesters in cities across the globe have taken to the streets to demand immediate action on climate change. The demonstrations, organized by various environmental groups, come just days before the UN Climate Action Summit in New York. Protesters are calling for world leaders to commit to more ambitious targets for reducing greenhouse gas emissions and transitioning to renewable energy sources. [450 chars]",
					url: "https://www.bbc.com/news/world-59277788",
					image:
						"https://ichef.bbci.co.uk/news/1024/branded_news/8754/production/_121234567_gettyimages-1235678901.jpg",
					publishedAt: "2024-09-14T09:25:00Z",
					source: { name: "BBC News", url: "https://www.bbc.com/news" },
				},
			],
		} as GNewsResponse;

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

export default app;
