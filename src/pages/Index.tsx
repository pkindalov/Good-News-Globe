// ==================== IMPORTS ====================
// React imports - useState and useEffect are "hooks" that add special features
import { useState, useEffect } from "react";

// Import our custom components (reusable pieces of UI)
import { NewsCard } from "@/components/NewsCard";
import { NewsFilters } from "@/components/NewsFilters";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Import our service that fetches news data and the NewsArticle type
import { fetchNews, type NewsArticle } from "@/services/newsService";

// Import toast notifications (those little popup messages)
import { useToast } from "@/hooks/use-toast";

// Import icons from lucide-react library
import { Sparkles, Heart, Globe } from "lucide-react";

// ==================== MAIN COMPONENT ====================
// This is the main page of our app
const Index = () => {
  
  // ========== STATE MANAGEMENT ==========
  // Think of "state" as the component's memory that React watches
  // When state changes, React automatically re-renders the page
  
  // articles: stores our list of news articles (starts as empty array)
  // setArticles: function to update the articles array
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  
  // loading: tracks if we're currently fetching news (true/false)
  const [loading, setLoading] = useState(false);
  
  // selectedCountry: which country's news to show (starts empty, will auto-detect)
  const [selectedCountry, setSelectedCountry] = useState("");
  
  // selectedPeriod: how many days back to search (starts with "7" days)
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  
  // toast: function to show notification messages to the user
  const { toast } = useToast();

  // ========== AUTO-DETECT USER'S COUNTRY ==========
  // useEffect runs code when the component first appears on screen
  // The empty [] at the end means "run this only once when page loads"
  useEffect(() => {
    // This is an async function - it can wait for things
    const getUserCountry = async () => {
      try {
        // Call API to get user's location info based on their IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json(); // Convert response to JavaScript object
        
        // If we got a country code, use it
        if (data.country_code) {
          // Convert to lowercase (bg, us, de) and save to state
          setSelectedCountry(data.country_code.toLowerCase());
        } else {
          // If no country code, default to United States
          setSelectedCountry("us");
        }
      } catch (error) {
        // If anything goes wrong (no internet, API down), default to US
        setSelectedCountry("us");
      }
    };

    // Actually run the function we just defined
    getUserCountry();
  }, []); // Empty array = only run once when component first loads

  // ========== SEARCH FUNCTION ==========
  // This function runs when the user clicks the "Find Good News" button
  const handleSearch = async () => {
    // Guard clause: if country or period not selected, don't do anything
    if (!selectedCountry || !selectedPeriod) return;
    
    // Step 1: Show the loading spinner
    setLoading(true);
    
    try {
      // Step 2: Fetch news from our service
      // parseInt converts "7" (string) to 7 (number)
      const newsData = await fetchNews(selectedCountry, parseInt(selectedPeriod));
      
      // Step 3: Save the articles we got into state
      setArticles(newsData);
      
      // Step 4: Show a notification to the user
      if (newsData.length === 0) {
        // No articles found - show helpful message
        toast({
          title: "No positive news found",
          description: "Try adjusting your filters or selecting a different time period.",
        });
      } else {
        // Articles found - celebrate!
        toast({
          title: "Success!",
          description: `Found ${newsData.length} positive news articles.`,
        });
      }
    } catch (error) {
      // Step 5: If something went wrong, show error message
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again.",
        variant: "destructive", // Makes toast red/warning style
      });
    } finally {
      // Step 6: Always hide the loading spinner at the end
      // "finally" runs whether we succeeded or failed
      setLoading(false);
    }
  };

  // ========== RENDER (WHAT SHOWS ON SCREEN) ==========
  // JSX looks like HTML but it's actually JavaScript
  // Anything inside { } is JavaScript code
  return (
    <div className="min-h-screen bg-gradient-background">
      
      {/* ===== HEADER ===== */}
      {/* sticky top-0 makes header stick to top when scrolling */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Logo and title */}
          <div className="flex items-center justify-center gap-3 mb-2">
            {/* Icon with gradient background */}
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {/* Main title with gradient text effect */}
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Good News Today
            </h1>
          </div>
          {/* Subtitle/description */}
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Discover positive, uplifting news from around the world. Stay informed about the good things happening in your chosen country.
          </p>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* ===== FILTERS SECTION ===== */}
        {/* This component lets users choose country and time period */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <NewsFilters
            selectedCountry={selectedCountry}      // Pass current country
            selectedPeriod={selectedPeriod}        // Pass current period
            onCountryChange={setSelectedCountry}   // Function to update country
            onPeriodChange={setSelectedPeriod}     // Function to update period
            onSearch={handleSearch}                // Function to fetch news
            isLoading={loading}                    // Tell if we're loading
          />
        </div>

        {/* ===== LOADING SPINNER ===== */}
        {/* The && operator means "if loading is true, show LoadingSpinner" */}
        {loading && <LoadingSpinner />}

        {/* ===== NEWS RESULTS ===== */}
        {/* Only show if: NOT loading AND we have articles */}
        {!loading && articles.length > 0 && (
          <div className="space-y-6 animate-slide-up">
            {/* Success message showing how many articles found */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-success">
                <Heart className="w-5 h-5" />
                <span className="font-semibold">
                  {/* { } lets us insert JavaScript - shows article count */}
                  {articles.length} positive news articles found
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Spreading positivity one story at a time
              </p>
            </div>

            {/* Grid of news cards */}
            {/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Loop through each article and create a card */}
              {/* .map() creates a new element for each item in the array */}
              {articles.map((article, index) => (
                // key={index} helps React track which items changed
                // Style with delay creates staggered animation effect
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {/* Show if: NOT loading AND no articles AND user has selected filters */}
        {!loading && articles.length === 0 && selectedCountry && selectedPeriod && (
          <div className="text-center py-16 space-y-4 animate-fade-in">
            {/* Globe icon */}
            <div className="p-4 bg-accent/50 rounded-full w-fit mx-auto">
              <Globe className="w-8 h-8 text-accent-foreground" />
            </div>
            {/* Helpful message */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Ready to discover good news?</h3>
              <p className="text-muted-foreground">
                Select your preferences above and click "Find Good News" to get started.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
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

// ==================== EXPORT ====================
// Export so other files can import and use this component
export default Index;
