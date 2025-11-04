// src/pages/Index.tsx
import React, { useState, useEffect } from "react";
import { NewsCard } from "@/components/NewsCard";
import { NewsFilters } from "@/components/NewsFilters";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Import our service that fetches news data and the NewsArticle type
import { fetchNews, type NewsArticle } from "@/services/newsService";

import { useToast } from "@/hooks/use-toast";

import { Sparkles, Heart, Globe } from "lucide-react";

const Index: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const { toast } = useToast();

  useEffect(() => {
    const getUserCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (data.country_code) {
          setSelectedCountry(data.country_code.toLowerCase());
          return;
        }

        setSelectedCountry("us");
      } catch (error) {
        setSelectedCountry("us");
      }
    };

    getUserCountry();
  }, []);

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
      console.error("Index handleSearch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again.",
        variant: "destructive",
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
            selectedCountry={selectedCountry}
            selectedPeriod={selectedPeriod}
            onCountryChange={setSelectedCountry}
            onPeriodChange={setSelectedPeriod}
            onSearch={handleSearch}
            isLoading={loading}
          />
        </div>

        {loading && <LoadingSpinner />}

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
