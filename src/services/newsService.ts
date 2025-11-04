// src/services/newsService.ts  (Vite + sentiment)
import Sentiment from "sentiment";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  country?: string;
  sentimentScore?: number;
  urlToImage?: string;
}

const sentiment = new Sentiment();

// Tweak these values to be more/less strict
const POS_THRESHOLD = 1; // sentiment score must be > this to be considered positive
const NEGATIVE_WORDS = [
  "crisis",
  "disaster",
  "conflict",
  "war",
  "violence",
  "death",
  "tragedy",
  "attack",
  "murder",
  "kill",
  "died",
  "dead",
  "fraud",
  "scandal",
  "fear",
  "abuse",
  "suicide",
  "suffers",
  "illness",
  "disease",
  "missing",
  "feared",
];

// small mocks so UI never dies
const MOCK: NewsArticle[] = [
  {
    title: "Mock: Scientists develop breakthrough",
    description: "Hopeful treatment shows promise",
    url: "#",
    source: "Mock",
    publishedAt: new Date().toISOString(),
    country: "United States",
  },
  {
    title: "Mock: Local community raises millions",
    description: "Amazing community effort",
    url: "#",
    source: "Mock",
    publishedAt: new Date().toISOString(),
    country: "Canada",
  },
];

// Vite-only key
function getKey(): string | undefined {
  return import.meta.env?.VITE_NEWSAPI_KEY;
}

function looksOvertlyNegative(text: string) {
  const t = text.toLowerCase();
  return NEGATIVE_WORDS.some((w) => t.includes(w));
}

async function fetchFromNewsApi(country: string, days: number) {
  const key = getKey();
  if (!key) throw new Error("Missing VITE_NEWSAPI_KEY (set in .env)");

  // Optional: For small countries with sparse 'top-headlines', use /everything with q=country name
  // Set this to true to try the everything endpoint for countries that return few headlines.
  const USE_EVERYTHING_FOR_COUNTRY = true;

  let url: URL;
  if (USE_EVERYTHING_FOR_COUNTRY) {
    // Search for the country's name in article text (more hits, but noisier)
    const countryName = countryToName(country) || country;
    url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", `"${countryName}"`);
    url.searchParams.set("pageSize", "100");
  } else {
    url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.set("country", country || "us");
    url.searchParams.set("pageSize", "100");
  }

  url.searchParams.set("apiKey", key);

  const resp = await fetch(url.toString());
  const text = await resp.text();

  type NewsApiResponse = { articles?: unknown };

  let body: unknown = text;
  try {
    body = JSON.parse(text) as NewsApiResponse;
  } catch (e) {
    console.error("Failed to parse NewsAPI response as JSON:", String(e));
  }

  let raw: unknown[] = [];
  if (typeof body === "object" && body !== null && "articles" in body) {
    const maybeArticles = (body as NewsApiResponse).articles;
    if (Array.isArray(maybeArticles)) {
      raw = maybeArticles;
    }
  }

  const cutoff = Date.now() - Math.max(1, days) * 24 * 60 * 60 * 1000;

  const processed = raw
    .map((item: unknown) => {
      // skip non-objects early
      if (typeof item !== "object" || item === null) return null;

      const a = item as Record<string, unknown>;

      const title = typeof a.title === "string" ? a.title : "";
      const description =
        typeof a.description === "string" ? a.description : "";
      const publishedAt =
        typeof a.publishedAt === "string"
          ? a.publishedAt
          : new Date().toISOString();

      const url = typeof a.url === "string" ? a.url : "";

      let sourceName = "";
      const src = a.source;
      if (typeof src === "object" && src !== null) {
        const maybeName = (src as Record<string, unknown>).name;
        if (typeof maybeName === "string") sourceName = maybeName;
      } else if (typeof src === "string") {
        sourceName = src;
      }

      const urlToImage =
        typeof a.urlToImage === "string" ? a.urlToImage : undefined;

      const textForScore = `${title} ${description}`;
      const score = sentiment.analyze(textForScore).score;

      return {
        title,
        description,
        url,
        source: sourceName,
        publishedAt,
        urlToImage,
        sentimentScore: score,
      } as NewsArticle;
    })
    .filter(
      (x): x is NewsArticle =>
        x !== null && new Date(x.publishedAt).getTime() >= cutoff
    );

  const positives = processed.filter(
    (a) =>
      (a.sentimentScore ?? 0) > POS_THRESHOLD &&
      !looksOvertlyNegative(`${a.title} ${a.description}`)
  );

  return positives;
}

function countryToName(code: string) {
  const map: Record<string, string> = {
    us: "United States",
    gb: "United Kingdom",
    ca: "Canada",
    de: "Germany",
    fr: "France",
    bg: "Bulgaria",
    se: "Sweden",
  };
  return map[code?.toLowerCase()] ?? undefined;
}

export const fetchNews = async (
  country: string,
  days: number
): Promise<NewsArticle[]> => {
  const c = (country || "us").toLowerCase();
  const key = getKey();

  if (!key) {
    return MOCK.map((m) => ({
      ...m,
      sentimentScore: sentiment.analyze(m.title + " " + m.description).score,
    }));
  }

  try {
    return await fetchFromNewsApi(c, days);
  } catch (err) {
    console.error("newsService fetch error:", err);
    // fallback to mock so UI still responds
    return MOCK.map((m) => ({
      ...m,
      sentimentScore: sentiment.analyze(m.title + " " + m.description).score,
    }));
  }
};
