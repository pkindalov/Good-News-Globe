// src/services/newsService.ts  (Vite only - corrected)
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

// simple positive-word scoring
const positiveWords = [
  "success",
  "breakthrough",
  "progress",
  "hope",
  "victory",
  "positive",
  "amazing",
  "wonderful",
  "great",
  "community",
];
function scoreText(text = "") {
  const t = text.toLowerCase();
  return positiveWords.reduce((s, w) => s + (t.includes(w) ? 1 : 0), 0);
}

// quick mocks so app never crashes
const MOCK: NewsArticle[] = [
  {
    title: "Mock: Scientists develop breakthrough",
    description: "Hopeful treatment shows promise",
    url: "#",
    source: "Mock",
    publishedAt: new Date().toISOString(),
    country: "United States",
    urlToImage: "",
  },
  {
    title: "Mock: Local community raises millions",
    description: "Amazing community effort",
    url: "#",
    source: "Mock",
    publishedAt: new Date().toISOString(),
    country: "Canada",
    urlToImage: "",
  },
];

// Vite-only: read key from import.meta.env.VITE_NEWSAPI_KEY
function getKey(): string | undefined {
  // NOTE: import.meta is available in Vite-built code
  // cast to any for TypeScript so we can read the env at runtime
  return (import.meta as any).env?.VITE_NEWSAPI_KEY;
}

async function fetchFromNewsApi(country: string, days: number) {
  const key = getKey();
  if (!key)
    throw new Error("Missing VITE_NEWSAPI_KEY (set in .env at project root)");

  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.searchParams.set("country", country || "us");
  url.searchParams.set("pageSize", "100");
  url.searchParams.set("apiKey", key);

  const resp = await fetch(url.toString());
  const text = await resp.text();
  let body: any = text;
  try {
    body = JSON.parse(text);
  } catch (_) {
    // not JSON
  }

  if (!resp.ok) {
    throw new Error(
      `NewsAPI ${resp.status} ${resp.statusText} — ${JSON.stringify(body)}`
    );
  }

  const raw = body.articles || [];
  const cutoff = Date.now() - Math.max(1, days) * 24 * 60 * 60 * 1000;

  return raw
    .map((a: any) => {
      const title = a.title ?? "";
      const description = a.description ?? "";
      const s = scoreText(title + " " + description);
      return {
        title,
        description,
        url: a.url ?? "",
        source: a.source?.name ?? "",
        publishedAt: a.publishedAt ?? new Date().toISOString(),
        urlToImage: a.urlToImage ?? undefined,
        sentimentScore: s,
      } as NewsArticle;
    })
    .filter(
      (a: any) =>
        new Date(a.publishedAt).getTime() >= cutoff && a.sentimentScore > 0
    );
}

export const fetchNews = async (
  country: string,
  days: number
): Promise<NewsArticle[]> => {
  const c = (country || "us").toLowerCase();
  const key = getKey();

  if (!key) {
    console.warn(
      "VITE_NEWSAPI_KEY not set — returning MOCK data. To enable real requests add VITE_NEWSAPI_KEY to .env and restart dev server."
    );
    return MOCK.map((m) => ({
      ...m,
      sentimentScore: scoreText(m.title + " " + m.description),
    }));
  }

  try {
    return await fetchFromNewsApi(c, days);
  } catch (err: any) {
    console.error("fetchNews -> API error:", err);
    // fallback so UI still works
    return MOCK.map((m) => ({
      ...m,
      sentimentScore: scoreText(m.title + " " + m.description),
    }));
  }
};
