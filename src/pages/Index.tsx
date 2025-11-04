import { useState, useEffect } from "react";
import { NewsCard } from "@/components/NewsCard";
import { NewsFilters } from "@/components/NewsFilters";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Import our service that fetches news data and the NewsArticle type
import { fetchNews, type NewsArticle } from "@/services/newsService";

import { useToast } from "@/hooks/use-toast";

import { Sparkles, Heart, Globe } from "lucide-react";

const Index = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const { toast } = useToast();

  // ========== AUTO-DETECT USER'S COUNTRY ==========
  // useEffect runs code when the component first appears on screen
  // The empty [] at the end means "run this only once when page loads"
  useEffect(() => {
    const getUserCountry = async () => {
      try {
        // Call API to get user's location info based on their IP
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json(); // Convert response to JavaScript object

        if (data.country_code) {
          //(bg, us, de)
          setSelectedCountry(data.country_code.toLowerCase());
          return;
        }

        setSelectedCountry("us");
      } catch (error) {
        // If anything goes wrong (no internet, API down), default to US
        setSelectedCountry("us");
      }
    };

    getUserCountry();
  }, []); // Empty array = only run once when component first loads

  const handleSearch = async () => {
    if (!selectedCountry || !selectedPeriod) return;

    setLoading(true);

    try {
      const newsData = await fetchNews(
        selectedCountry,
        parseInt(selectedPeriod)
      );
      setArticles(newsData);

      if (newsData.length === 0) {
        toast({
          title: "No positive news found",
          description:
            "Try adjusting your filters or selecting a different time period.",
        });
        return;
      }

      toast({
        title: "Success!",
        description: `Found ${newsData.length} positive news articles.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again.",
        variant: "destructive", // Makes toast red/warning style
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Good News Today
            </h1>
          </div>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Discover positive, uplifting news from around the world. Stay
            informed about the good things happening in your chosen country.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <NewsFilters
            selectedCountry={selectedCountry} // Pass current country
            selectedPeriod={selectedPeriod} // Pass current period
            onCountryChange={setSelectedCountry} // Function to update country
            onPeriodChange={setSelectedPeriod} // Function to update period
            onSearch={handleSearch} // Function to fetch news
            isLoading={loading} // Tell if we're loading
          />
        </div>

        {loading && <LoadingSpinner />}

        {/* Only show if: NOT loading AND we have articles */}
        {!loading && articles.length > 0 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-success">
                <Heart className="w-5 h-5" />
                <span className="font-semibold">
                  {articles.length} positive news articles found
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Spreading positivity one story at a time
              </p>
            </div>

            {/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {articles.map((article, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show if: NOT loading AND no articles AND user has selected filters */}
        {!loading &&
          articles.length === 0 &&
          selectedCountry &&
          selectedPeriod && (
            <div className="text-center py-16 space-y-4 animate-fade-in">
              <div className="p-4 bg-accent/50 rounded-full w-fit mx-auto">
                <Globe className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Ready to discover good news?
                </h3>
                <p className="text-muted-foreground">
                  Select your preferences above and click "Find Good News" to
                  get started.
                </p>
              </div>
            </div>
          )}
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Bringing you the brightest news from around the world 🌟
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
