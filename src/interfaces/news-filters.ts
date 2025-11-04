export interface NewsFilter {
  selectedCountry: string;
  selectedPeriod: string;
  onCountryChange: (country: string) => void;
  onPeriodChange: (period: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}
