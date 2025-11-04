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
