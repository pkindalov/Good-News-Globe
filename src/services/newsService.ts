// src/services/newsService.ts  (Vite + sentiment)
import Sentiment from "sentiment";
import { NEGATIVE_WORDS } from "@/data/words";
import { MOCK_ARTICLES } from "@/data/articles";
import { NewsArticle } from "@/interfaces/news-article";
import { NewsApiResponse } from "@/types/news-api-response";

const sentiment = new Sentiment();

// Tweak these values to be more/less strict
const POS_THRESHOLD = 1; // sentiment score must be > this to be considered positive
function getKey(): string | undefined {
  return import.meta.env?.VITE_NEWSAPI_KEY;
}

function looksOvertlyNegative(text: string) {
  const textLowercase = text.toLowerCase();
  return NEGATIVE_WORDS.some((word) => textLowercase.includes(word));
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

  const processedNews = raw
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
  const countryLowercase = (country || "us").toLowerCase();
  const key = getKey();

  if (!key) {
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
