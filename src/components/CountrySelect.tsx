// src/components/CountrySelect.tsx
import React, { useMemo, useState } from "react";
import { Combobox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { SORTED_COUNTRIES } from "@/data/countries";

export type Country = { code: string; name: string };

type Props = {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  className?: string;
};

export const CountrySelect: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Type to search countries...",
  className = "",
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return SORTED_COUNTRIES;
    const queryLowercase = query.toLowerCase();
    return SORTED_COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(queryLowercase) ||
        country.code.toLowerCase().includes(queryLowercase)
    );
  }, [query]);

  const selectedObj =
    SORTED_COUNTRIES.find((country) => country.code === value) ?? null;

  return (
    <Combobox
      value={selectedObj}
      onChange={(country) => onChange(country?.code ?? "")}
      nullable
    >
      <div className={`relative ${className}`}>
        <div className="relative w-full">
          <div className="flex items-center rounded-md bg-card border border-border/30 px-3 py-2">
            {selectedObj ? (
              <span
                className={`fi fi-${selectedObj.code.toLowerCase()} text-lg mr-3`}
                aria-hidden="true"
              />
            ) : (
              <span className="w-6 mr-3" />
            )}

            <Combobox.Input
              className="flex-1 bg-transparent outline-none border-none placeholder:text-muted-foreground"
              displayValue={(c: Country | null) =>
                c ? `${c.name} (${c.code.toUpperCase()})` : ""
              }
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                selectedObj
                  ? `${selectedObj.name} (${selectedObj.code.toUpperCase()})`
                  : placeholder
              }
            />

            <Combobox.Button className="ml-3">
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </Combobox.Button>
          </div>
        </div>

        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-card/95 backdrop-blur-sm border border-border/30 py-1 shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No countries match “{query}”
            </div>
          ) : (
            filtered.map((c) => {
              const code = c.code.toLowerCase();
              return (
                <Combobox.Option
                  key={c.code}
                  value={c}
                  className={({ active }) =>
                    `flex items-center justify-between px-3 py-2 cursor-pointer text-sm ${
                      active ? "bg-accent/20" : "bg-transparent"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span
                          className={`fi fi-${code} text-xl`}
                          aria-hidden="true"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{c.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({c.code.toUpperCase()})
                            </span>
                          </div>
                        </div>
                      </div>
                      {selected && <Check className="w-4 h-4 text-success" />}
                    </>
                  )}
                </Combobox.Option>
              );
            })
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default CountrySelect;
