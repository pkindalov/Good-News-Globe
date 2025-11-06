import Sentiment from "sentiment";
import { NEGATIVE_WORDS } from "@/data/words";
import { MOCK_ARTICLES } from "@/data/articles";
import { NewsArticle } from "@/interfaces/news-article";
import { NewsApiResponse } from "@/types/news-api-response";
import { countryMap } from "@/data/countries";

const sentiment = new Sentiment();
const POS_THRESHOLD = 1; // sentiment score must be > this to be considered positive
const NEWS_API_URL = "https://newsapi.org/v2/everything";
const PROXY_URL = "/api/news";

function getKey(): string | undefined {
  return import.meta.env?.VITE_NEWSAPI_KEY;
}

// Optional client env flag: when true, always use the server proxy even in dev
const VITE_USE_SERVER_PROXY = import.meta.env?.VITE_USE_SERVER_PROXY === "true";

function looksOvertlyNegative(text: string) {
  const textLowercase = text.toLowerCase();
  return NEGATIVE_WORDS.some((word) => textLowercase.includes(word));
}

function countryToName(code: string) {
  return countryMap[code?.toLowerCase()] ?? undefined;
}

async function fetchFromNewsApi(country: string, days: number) {
  const countryName = countryToName(country) || country;
  const newsApiUrl = new URL(NEWS_API_URL);
  newsApiUrl.searchParams.set("q", `"${countryName}"`);
  newsApiUrl.searchParams.set("pageSize", "100");

  // decide whether to call direct NewsAPI (dev) or use server proxy (/api/news)
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const viteKey = getKey();
  const allowDirectDev = Boolean(
    isLocalhost && viteKey && !VITE_USE_SERVER_PROXY
  );

  // perform fetch
  let resp: Response;
  if (allowDirectDev) {
    newsApiUrl.searchParams.set("apiKey", viteKey!);
    resp = await fetch(newsApiUrl.toString());
  } else {
    const proxy = new URL(PROXY_URL, window.location.origin);
    proxy.searchParams.set("q", `"${countryName}"`);
    proxy.searchParams.set("pageSize", "100");
    resp = await fetch(proxy.toString());
  }

  const text = await resp.text();

  let body: unknown = text;
  try {
    body = JSON.parse(text) as NewsApiResponse;
  } catch (e) {
    console.error(
      "Failed to parse NewsAPI or proxy response as JSON:",
      String(e)
    );
  }

  let raw: unknown[] = [];
  if (typeof body === "object" && body !== null && "articles" in body) {
    const maybeArticles = (body as NewsApiResponse).articles;
    if (Array.isArray(maybeArticles)) {
      raw = maybeArticles;
    }
  }

  const cutoff = Date.now() - Math.max(1, days) * 24 * 60 * 60 * 1000;

  const processedNews = raw
    .map((item: unknown) => {
      if (typeof item !== "object" || item === null) return null;
      const article = item as Record<string, unknown>;

      const title = typeof article.title === "string" ? article.title : "";
      const description =
        typeof article.description === "string" ? article.description : "";
      const publishedAt =
        typeof article.publishedAt === "string"
          ? article.publishedAt
          : new Date().toISOString();
      const url = typeof article.url === "string" ? article.url : "";

      let sourceName = "";
      const src = article.source;
      if (typeof src === "object" && src !== null) {
        const maybeName = (src as Record<string, unknown>).name;
        if (typeof maybeName === "string") sourceName = maybeName;
      } else if (typeof src === "string") {
        sourceName = src;
      }

      const urlToImage =
        typeof article.urlToImage === "string" ? article.urlToImage : undefined;

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
      (news): news is NewsArticle =>
        news !== null && new Date(news.publishedAt).getTime() >= cutoff
    );

  const positivesNews = processedNews.filter(
    (news) =>
      (news.sentimentScore ?? 0) > POS_THRESHOLD &&
      !looksOvertlyNegative(`${news.title} ${news.description}`)
  );

  return positivesNews;
}

export const fetchNews = async (
  country: string,
  days: number
): Promise<NewsArticle[]> => {
  const countryLowercase = (country || "us").toLowerCase();
  const key = getKey();

  // If no VITE key (local) AND you don't have a proxy running, return mock
  // Note: even if VITE key exists, we may still prefer proxy (controlled above)
  if (!key && typeof window !== "undefined") {
    // quick fallback - attach sentimentScore so UI shows useful info
    return MOCK_ARTICLES.map((mockNews) => ({
      ...mockNews,
      sentimentScore: sentiment.analyze(
        mockNews.title + " " + mockNews.description
      ).score,
    }));
  }

  try {
    return await fetchFromNewsApi(countryLowercase, days);
  } catch (err) {
    console.error("newsService fetch error:", err);
    // fallback to mock so UI still responds
    return MOCK_ARTICLES.map((mockNews) => ({
      ...mockNews,
      sentimentScore: sentiment.analyze(
        mockNews.title + " " + mockNews.description
      ).score,
    }));
  }
};
