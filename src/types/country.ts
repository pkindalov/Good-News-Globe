export type Country = { code: string; name: string };

export type CountryProps = {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  className?: string;
};
