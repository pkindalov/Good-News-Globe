// ==================== SENTIMENT ANALYSIS ====================
// This function determines if a news article is positive, neutral, or negative
// In a real app, you'd use an AI API like OpenAI, but this is a simple version

const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
  // List of words that indicate POSITIVE news
  const positiveWords = [
    'success', 'achievement', 'breakthrough', 'progress', 'improvement', 'growth',
    'solution', 'innovation', 'recovery', 'hope', 'celebration', 'victory',
    'positive', 'beneficial', 'excellent', 'amazing', 'wonderful', 'great',
    'helping', 'support', 'unity', 'peace', 'cooperation', 'collaboration',
    'milestone', 'advancement', 'discovery', 'cure', 'healing', 'charity',
    'volunteer', 'community', 'environmental', 'sustainability', 'renewable'
  ];
  
  // List of words that indicate NEGATIVE news
  const negativeWords = [
    'crisis', 'disaster', 'conflict', 'war', 'violence', 'crime',
    'death', 'tragedy', 'failure', 'collapse', 'decline', 'recession',
    'unemployment', 'poverty', 'scandal', 'corruption', 'fraud',
    'terrorist', 'attack', 'threat', 'danger', 'risk', 'problem'
  ];

  // Convert text to lowercase so "Success" and "success" both match
  const textLower = text.toLowerCase();
  
  // Count how many positive words appear in the text
  // .reduce() is like a loop that adds up numbers
  // For each word, if it's in the text, add 1 to count, otherwise add 0
  const positiveCount = positiveWords.reduce((count, word) => 
    count + (textLower.includes(word) ? 1 : 0), 0);
  
  // Count how many negative words appear in the text
  const negativeCount = negativeWords.reduce((count, word) => 
    count + (textLower.includes(word) ? 1 : 0), 0);

  // Decide sentiment based on which word type appears more
  if (positiveCount > negativeCount && positiveCount > 0) {
    return 'positive';  // More positive words = positive news
  } else if (negativeCount > positiveCount) {
    return 'negative';  // More negative words = negative news
  }
  
  return 'neutral';  // Equal or no emotional words = neutral
};

// ==================== TYPESCRIPT INTERFACE ====================
// This defines what a NewsArticle object looks like
// It's like a blueprint that says "these are the properties every article must have"

export interface NewsArticle {
  title: string;           // Article headline (text)
  description: string;     // Short summary (text)
  url: string;            // Link to full article (text)
  source: string;         // Who published it (text)
  publishedAt: string;    // When published (date as text)
  country: string;        // Which country (text)
  sentiment: 'positive' | 'neutral' | 'negative';  // Article mood (one of 3 options)
  urlToImage?: string;    // Image URL (optional - ? means might not exist)
}

// ==================== MAIN FUNCTION ====================
// This function fetches news articles for a specific country and time period
// "export" means other files can import and use this function
// "async" means this function can wait for things (like API calls)
// Promise<NewsArticle[]> means it will eventually return an array of NewsArticle objects

export const fetchNews = async (country: string, days: number): Promise<NewsArticle[]> => {
  // In a real app, you would call a news API like NewsAPI.org here
  // For this demo, we're using hardcoded sample articles
  
  // These variables would be used to filter by date in a real API
  const toDate = new Date();  // Today
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);  // X days ago
  
  // Simulate a delay like a real API would have
  // Wait 2 seconds (2000 milliseconds) before continuing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // ========== MOCK/SAMPLE DATA ==========
  // In a real app, these would come from a news API
  // Each object represents one news article
  const mockArticles = [
    {
      title: "Scientists Develop Breakthrough Treatment for Rare Disease",
      description: "Researchers at a leading university have successfully developed a new treatment that shows remarkable results in treating a rare genetic condition, offering hope to thousands of patients worldwide.",
      url: "https://example.com/news1",
      source: "Health Today",
      publishedAt: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000).toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      countryCode: "us",
    },
    {
      title: "Local Community Raises Record Amount for Children's Hospital",
      description: "A grassroots fundraising campaign has exceeded all expectations, raising over $2 million for the new children's wing at the local hospital, demonstrating incredible community spirit.",
      url: "https://example.com/news2",
      source: "Community News",
      publishedAt: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000).toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=400&fit=crop",
      countryCode: "ca",
    },
    {
      title: "Renewable Energy Project Powers Entire City",
      description: "A innovative solar and wind energy initiative has successfully provided 100% renewable power to a major metropolitan area, marking a significant milestone in sustainable energy.",
      url: "https://example.com/news3",
      source: "Green Energy Report",
      publishedAt: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000).toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop",
      countryCode: "de",
    },
    {
      title: "International Cooperation Leads to Environmental Protection Success",
      description: "Multiple countries have joined forces in an unprecedented conservation effort that has resulted in the protection of critical wildlife habitats and the recovery of endangered species.",
      url: "https://example.com/news4",
      source: "Environment Watch",
      publishedAt: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000).toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
      countryCode: "se",
    },
    {
      title: "Students Create App to Help Elderly Stay Connected",
      description: "A group of high school students has developed a user-friendly mobile application that helps elderly residents stay connected with family and access community services more easily.",
      url: "https://example.com/news5",
      source: "Tech Innovation",
      publishedAt: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000).toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop",
      countryCode: "bg",
    },
    {
      title: "Bulgarian Researchers Achieve Breakthrough in Green Tech",
      description: "Scientists in Sofia unveil an innovative method to recycle plastics efficiently, boosting Bulgaria's circular economy and cutting emissions.",
      url: "https://example.com/news-bg-green-tech",
      source: "Sofia Science Daily",
      publishedAt: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000).toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&h=400&fit=crop",
      countryCode: "bg",
    },
  ];

  // ========== COUNTRY CODE MAPPING ==========
  // Convert short codes (like "us", "bg") to full country names
  // [key: string]: string means "object with string keys and string values"
  const countryNames: { [key: string]: string } = {
    us: 'United States',
    gb: 'United Kingdom',
    ca: 'Canada',
    au: 'Australia',
    de: 'Germany',
    fr: 'France',
    it: 'Italy',
    es: 'Spain',
    nl: 'Netherlands',
    se: 'Sweden',
    no: 'Norway',
    jp: 'Japan',
    kr: 'South Korea',
    sg: 'Singapore',
    bg: 'Bulgaria',
  };

  // ========== PROCESS ARTICLES ==========
  // Transform the mock articles into proper NewsArticle objects
  const articles: NewsArticle[] = mockArticles
    // Step 1: Keep only articles from the selected country
    // .filter() creates a new array with only items that pass the test
    .filter((article) => article.countryCode === country)
    
    // Step 2: Transform each article
    // .map() creates a new array by transforming each item
    .map(({ countryCode, ...rest }) => ({
      // ...rest spreads all properties except countryCode
      ...rest,
      // Convert country code ("bg") to full name ("Bulgaria")
      country: countryNames[countryCode] || countryCode,
      // Analyze if article is positive/negative/neutral
      sentiment: analyzeSentiment(rest.title + ' ' + rest.description),
    }));

  // ========== FINAL FILTER ==========
  // Only return articles that are positive
  // This is the key part - we only show good news!
  return articles.filter(article => article.sentiment === 'positive');
};