// src/pages/Index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { NewsFilters } from "@/components/NewsFilters";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { fetchNews, type NewsArticle } from "@/services/newsService";

import { useToast } from "@/hooks/use-toast";

import { Sparkles, Heart, Globe } from "lucide-react";

const DEFAULT_PAGE_SIZE = 9; // 3 columns x 3 rows by default

const Index: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const { toast } = useToast();

  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  // reset to page 1 when articles or pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [articles, pageSize]);

  const handleSearch = async () => {
    if (!selectedCountry || !selectedPeriod) return;

    setLoading(true);

    try {
      const newsData = await fetchNews(
        selectedCountry,
        parseInt(selectedPeriod, 10)
      );
      setArticles(newsData);
      setCurrentPage(1); // ensure we show first page of new results

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

  const totalArticles = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const pagedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return articles.slice(start, start + pageSize);
  }, [articles, currentPage, pageSize]);

  const showingFrom =
    totalArticles === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(
    totalArticles,
    (currentPage - 1) * pageSize + pageSize
  );

  // small page button component
  const PageButton: React.FC<{
    page: number;
    active?: boolean;
    onClick: (p: number) => void;
  }> = ({ page, active, onClick }) => (
    <button
      onClick={() => onClick(page)}
      aria-current={active ? "page" : undefined}
      className={`px-3 py-1 rounded-md text-sm ${
        active
          ? "bg-primary text-white"
          : "bg-card border border-border/30 hover:bg-accent/10"
      }`}
    >
      {page}
    </button>
  );

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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="text-center md:text-left space-y-2">
                <div className="flex items-center gap-2 text-success">
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">
                    {totalArticles} positive news articles found
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {showingFrom}–{showingTo}
                  </span>{" "}
                  of <span className="font-medium">{totalArticles}</span>
                </p>
              </div>

              {/* pagination controls + pageSize selector */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">
                  Per page
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                  className="border border-border/30 bg-card px-2 py-1 rounded-md text-sm"
                >
                  {[6, 9, 12, 18].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {pagedArticles.map((article, index) => (
                <div
                  key={`${article.url}-${index}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-3 mt-4"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-card border border-border/30 hover:bg-accent/10 disabled:opacity-50 text-sm"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-card border border-border/30 hover:bg-accent/10 disabled:opacity-50 text-sm"
                >
                  Prev
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    // show a window of pages
                    if (page < currentPage - 2 || page > currentPage + 2)
                      return null;
                    return (
                      <PageButton
                        key={page}
                        page={page}
                        active={page === currentPage}
                        onClick={(p) => setCurrentPage(p)}
                      />
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-card border border-border/30 hover:bg-accent/10 disabled:opacity-50 text-sm"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-card border border-border/30 hover:bg-accent/10 disabled:opacity-50 text-sm"
                >
                  Last
                </button>
              </nav>
            )}
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
