// Import pre-made card components from our UI library
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Import icons we'll use in the card
import { ExternalLink, Calendar, MapPin } from "lucide-react";

// TYPESCRIPT INTERFACE - This defines what a NewsArticle object looks like
// It's like a blueprint that says "these are the properties every article must have"
interface NewsArticle {
  title: string;           // Article headline (text)
  description: string;     // Short summary (text)
  url: string;            // Link to full article (text)
  source: string;         // Who published it (text)
  publishedAt: string;    // When it was published (text/date)
  country: string;        // Which country (text)
  sentiment: 'positive' | 'neutral' | 'negative';  // Mood of article (one of these 3 options)
  urlToImage?: string;    // Image URL (text, optional - the ? means it might not exist)
}

// PROPS INTERFACE - Defines what data this component needs to receive
// "Props" = properties passed from parent component to child component
interface NewsCardProps {
  article: NewsArticle;  // This component needs one article object
}

// COMPONENT - A reusable piece of UI that displays one news article
// The { article } syntax "destructures" the props (unpacks the article from props.article)
export const NewsCard = ({ article }: NewsCardProps) => {
  
  // HELPER FUNCTION - Converts date from "2024-01-15" format to "Jan 15, 2024"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',   // "Jan" instead of "January"
      day: 'numeric',   // "15" 
      year: 'numeric'   // "2024"
    });
  };

  // RENDER - Build the card HTML structure
  return (
    // Main card container - "group" lets us trigger hover effects on child elements
    <Card className="group h-full transition-all duration-300 hover:shadow-hover hover:-translate-y-1 bg-card shadow-card border-0">
      
      {/* IMAGE - Only show if article has an image */}
      {/* The && means "if article.urlToImage exists, then show this div" */}
      {article.urlToImage && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      
      {/* HEADER - Badge and title */}
      <CardHeader className="pb-3">
        {/* Top row: badge and country */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
            Positive News
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {article.country}
          </div>
        </div>
        
        {/* Article title - changes color on hover */}
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </CardHeader>

      {/* CONTENT - Article description */}
      <CardContent className="pt-0 pb-4">
        {/* line-clamp-3 limits text to 3 lines with "..." at the end */}
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {article.description}
        </p>
      </CardContent>

      {/* FOOTER - Date, source, and read more link */}
      <CardFooter className="pt-0 flex items-center justify-between">
        {/* Left side: date and source */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(article.publishedAt)}</span>
          <span>•</span>
          <span className="font-medium">{article.source}</span>
        </div>
        
        {/* Right side: link to full article */}
        {/* target="_blank" opens in new tab */}
        {/* rel="noopener noreferrer" is for security */}
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
        >
          Read more
          <ExternalLink className="w-3 h-3" />
        </a>
      </CardFooter>
    </Card>
  );
};