const analyzeSentiment = (
  text: string
): "positive" | "neutral" | "negative" => {
  // List of words that indicate POSITIVE news
  const positiveWords = [
    "success",
    "achievement",
    "breakthrough",
    "progress",
    "improvement",
    "growth",
    "solution",
    "innovation",
    "recovery",
    "hope",
    "celebration",
    "victory",
    "positive",
    "beneficial",
    "excellent",
    "amazing",
    "wonderful",
    "great",
    "helping",
    "support",
    "unity",
    "peace",
    "cooperation",
    "collaboration",
    "milestone",
    "advancement",
    "discovery",
    "cure",
    "healing",
    "charity",
    "volunteer",
    "community",
    "environmental",
    "sustainability",
    "renewable",
  ];

  // List of words that indicate NEGATIVE news
  const negativeWords = [
    "crisis",
    "disaster",
    "conflict",
    "war",
    "violence",
    "crime",
    "death",
    "tragedy",
    "failure",
    "collapse",
    "decline",
    "recession",
    "unemployment",
    "poverty",
    "scandal",
    "corruption",
    "fraud",
    "terrorist",
    "attack",
    "threat",
    "danger",
    "risk",
    "problem",
  ];

  const textLower = text.toLowerCase();

  const positiveCount = positiveWords.reduce(
    (count, word) => count + (textLower.includes(word) ? 1 : 0),
    0
  );

  const negativeCount = negativeWords.reduce(
    (count, word) => count + (textLower.includes(word) ? 1 : 0),
    0
  );

  if (positiveCount > negativeCount && positiveCount > 0) {
    return "positive";
  } else if (negativeCount > positiveCount) {
    return "negative";
  }

  return "neutral";
};

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  country: string;
  sentiment: "positive" | "neutral" | "negative";
  urlToImage?: string;
}

export const fetchNews = async (
  country: string,
  days: number
): Promise<NewsArticle[]> => {
  const toDate = new Date(); // Today
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const mockArticles = [
    {
      title: "Scientists Develop Breakthrough Treatment for Rare Disease",
      description:
        "Researchers at a leading university have successfully developed a new treatment that shows remarkable results in treating a rare genetic condition, offering hope to thousands of patients worldwide.",
      url: "https://example.com/news1",
      source: "Health Today",
      publishedAt: new Date(
        Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
      ).toISOString(),
      urlToImage:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      countryCode: "us",
    },
    {
      title: "Local Community Raises Record Amount for Children's Hospital",
      description:
        "A grassroots fundraising campaign has exceeded all expectations, raising over $2 million for the new children's wing at the local hospital, demonstrating incredible community spirit.",
      url: "https://example.com/news2",
      source: "Community News",
      publishedAt: new Date(
        Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
      ).toISOString(),
      urlToImage:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=400&fit=crop",
      countryCode: "ca",
    },
    {
      title: "Renewable Energy Project Powers Entire City",
      description:
        "A innovative solar and wind energy initiative has successfully provided 100% renewable power to a major metropolitan area, marking a significant milestone in sustainable energy.",
      url: "https://example.com/news3",
      source: "Green Energy Report",
      publishedAt: new Date(
        Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
      ).toISOString(),
      urlToImage:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop",
      countryCode: "de",
    },
    {
      title:
        "International Cooperation Leads to Environmental Protection Success",
      description:
        "Multiple countries have joined forces in an unprecedented conservation effort that has resulted in the protection of critical wildlife habitats and the recovery of endangered species.",
      url: "https://example.com/news4",
      source: "Environment Watch",
      publishedAt: new Date(
        Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
      ).toISOString(),
      urlToImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
      countryCode: "se",
    },
    {
      title: "Students Create App to Help Elderly Stay Connected",
      description:
        "A group of high school students has developed a user-friendly mobile application that helps elderly residents stay connected with family and access community services more easily.",
      url: "https://example.com/news5",
      source: "Tech Innovation",
      publishedAt: new Date(
        Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
      ).toISOString(),
      urlToImage:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop",
      countryCode: "bg",
    },
    {
      title: "Bulgarian Researchers Achieve Breakthrough in Green Tech",
      description:
        "Scientists in Sofia unveil an innovative method to recycle plastics efficiently, boosting Bulgaria's circular economy and cutting emissions.",
      url: "https://example.com/news-bg-green-tech",
      source: "Sofia Science Daily",
      publishedAt: new Date(
        Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
      ).toISOString(),
      urlToImage:
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&h=400&fit=crop",
      countryCode: "bg",
    },
  ];

  const countryNames: { [key: string]: string } = {
    us: "United States",
    gb: "United Kingdom",
    ca: "Canada",
    au: "Australia",
    de: "Germany",
    fr: "France",
    it: "Italy",
    es: "Spain",
    nl: "Netherlands",
    se: "Sweden",
    no: "Norway",
    jp: "Japan",
    kr: "South Korea",
    sg: "Singapore",
    bg: "Bulgaria",
  };

  const articles: NewsArticle[] = mockArticles
    .filter((article) => article.countryCode === country)
    .map(({ countryCode, ...rest }) => ({
      ...rest,
      country: countryNames[countryCode] || countryCode,
      sentiment: analyzeSentiment(rest.title + " " + rest.description),
    }));

  return articles.filter((article) => article.sentiment === "positive");
};
