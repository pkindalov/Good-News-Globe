import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CountrySelect from "./CountrySelect";

interface NewsFiltersProps {
  selectedCountry: string;
  selectedPeriod: string;
  onCountryChange: (country: string) => void;
  onPeriodChange: (period: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const periods = [
  { value: "1", label: "Last 24 hours" },
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last week" },
  { value: "14", label: "Last 2 weeks" },
  { value: "30", label: "Last month" },
];

export const NewsFilters = ({
  selectedCountry,
  selectedPeriod,
  onCountryChange,
  onPeriodChange,
  onSearch,
  isLoading,
}: NewsFiltersProps) => {
  return (
    <Card className="bg-gradient-primary border-0 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-primary-foreground flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Country
            </label>
            <CountrySelect
              value={selectedCountry}
              onChange={onCountryChange}
              placeholder="Type or pick a country..."
              className="max-w-md"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-primary-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Time Period
            </label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="bg-white/90 border-white/20 focus:ring-white/50">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onSearch}
            disabled={isLoading || !selectedCountry || !selectedPeriod}
            className="bg-white text-primary hover:bg-white/90 font-medium px-8 h-11"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Good News
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
