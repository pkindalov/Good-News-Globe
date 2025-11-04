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
  return (import.meta as any).env?.VITE_NEWSAPI_KEY;
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
    // optionally restrict language to English: url.searchParams.set("language", "en");
  } else {
    url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.set("country", country || "us");
    url.searchParams.set("pageSize", "100");
  }

  url.searchParams.set("apiKey", key);

  const resp = await fetch(url.toString());
  const text = await resp.text();
  let body: any = text;
  try {
    body = JSON.parse(text);
  } catch (_) {}

  if (!resp.ok) {
    throw new Error(
      `NewsAPI ${resp.status} ${resp.statusText} — ${JSON.stringify(body)}`
    );
  }

  const raw = body.articles || [];
  const cutoff = Date.now() - Math.max(1, days) * 24 * 60 * 60 * 1000;

  const processed = raw
    .map((a: any) => {
      const title = a.title ?? "";
      const description = a.description ?? "";
      const publishedAt = a.publishedAt ?? new Date().toISOString();
      const textForScore = `${title} ${description}`;
      const score = sentiment.analyze(textForScore).score;
      return {
        title,
        description,
        url: a.url ?? "",
        source: a.source?.name ?? "",
        publishedAt,
        urlToImage: a.urlToImage ?? undefined,
        sentimentScore: score,
      } as NewsArticle;
    })
    .filter((a: any) => new Date(a.publishedAt).getTime() >= cutoff);

  // Final: Accept articles with score > POS_THRESHOLD and which don't look overtly negative
  const positives = processed.filter(
    (a) =>
      (a.sentimentScore ?? 0) > POS_THRESHOLD &&
      !looksOvertlyNegative(`${a.title} ${a.description}`)
  );

  return positives;
}

// helper mapping (simple)
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
    console.warn(
      "VITE_NEWSAPI_KEY not set — returning MOCK data. To fetch real news set VITE_NEWSAPI_KEY and restart dev server."
    );
    return MOCK.map((m) => ({
      ...m,
      sentimentScore: sentiment.analyze(m.title + " " + m.description).score,
    }));
  }

  try {
    return await fetchFromNewsApi(c, days);
  } catch (err: any) {
    console.error("newsService fetch error:", err);
    // fallback to mock so UI still responds
    return MOCK.map((m) => ({
      ...m,
      sentimentScore: sentiment.analyze(m.title + " " + m.description).score,
    }));
  }
};
