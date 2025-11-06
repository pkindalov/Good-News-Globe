import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, MapPin } from "lucide-react";
import { NewsArticle as ServiceNewsArticle } from "@/interfaces/news-article";

type NewsArticle = ServiceNewsArticle & {
  sentiment?: "positive" | "neutral" | "negative";
};

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const sentimentLabel =
    article.sentiment ??
    (typeof article.sentimentScore === "number"
      ? article.sentimentScore > 0
        ? "positive"
        : article.sentimentScore < 0
        ? "negative"
        : "neutral"
      : "positive");

  const badgeClass =
    sentimentLabel === "positive"
      ? "badge-mint"
      : sentimentLabel === "negative"
      ? "bg-destructive/10 text-destructive"
      : "badge-peach";

  const badgeText =
    sentimentLabel.charAt(0).toUpperCase() + sentimentLabel.slice(1) + " News";

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-hover hover:-translate-y-1 bg-card shadow-card border-0">
      {article.urlToImage && (
        <div className="rounded-t-lg overflow-hidden">
          <div className="h-1 bg-sand"></div>
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className={badgeClass}>
            {badgeText}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {article.country ?? ""}
          </div>
        </div>

        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {article.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(article.publishedAt)}</span>
          <span>•</span>
          <span className="font-medium">{article.source}</span>
        </div>

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

export default NewsCard;
