import { NewsArticle } from "@/interfaces/news-article";

export const MOCK_ARTICLES: NewsArticle[] = [
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
