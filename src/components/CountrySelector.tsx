"use client";

import { useState } from "react";

export const countries = [
  { name: "Perú", flag: "🇵🇪", code: "+51" },
  { name: "Argentina", flag: "🇦🇷", code: "+54" },
  { name: "Bolivia", flag: "🇧🇴", code: "+591" },
  { name: "Chile", flag: "🇨🇱", code: "+56" },
  { name: "Colombia", flag: "🇨🇴", code: "+57" },
  { name: "Ecuador", flag: "🇪🇨", code: "+593" },
  { name: "Paraguay", flag: "🇵🇾", code: "+595" },
  { name: "Uruguay", flag: "🇺🇾", code: "+598" },
  { name: "Venezuela", flag: "🇻🇪", code: "+58" },
] as const;

export type Country = (typeof countries)[number];

type CountrySelectorProps = {
  value: Country;
  onChange: (country: Country) => void;
  ariaLabel?: string;
};

export function CountryFlag({ country }: { country: Country }) {
  const flagShapes: Record<string, React.ReactNode> = {
    "🇵🇪": (
      <>
        <rect width="8" height="16" fill="#d91023" />
        <rect x="8" width="8" height="16" fill="#fff" />
        <rect x="16" width="8" height="16" fill="#d91023" />
      </>
    ),
    "🇦🇷": (
      <>
        <rect width="24" height="16" fill="#74acdf" />
        <rect y="5.33" width="24" height="5.34" fill="#fff" />
        <circle cx="12" cy="8" r="1.5" fill="#f6b40e" />
      </>
    ),
    "🇧🇴": (
      <>
        <rect width="24" height="5.33" fill="#d52b1e" />
        <rect y="5.33" width="24" height="5.34" fill="#f9e300" />
        <rect y="10.67" width="24" height="5.33" fill="#007934" />
      </>
    ),
    "🇨🇱": (
      <>
        <rect width="24" height="16" fill="#fff" />
        <rect y="8" width="24" height="8" fill="#d52b1e" />
        <rect width="10" height="8" fill="#0039a6" />
        <path
          d="m5 1.5.7 2.1H8L6.15 4.9l.7 2.1L5 5.7 3.15 7l.7-2.1L2 3.6h2.3z"
          fill="#fff"
        />
      </>
    ),
    "🇨🇴": (
      <>
        <rect width="24" height="8" fill="#fcd116" />
        <rect y="8" width="24" height="4" fill="#003893" />
        <rect y="12" width="24" height="4" fill="#ce1126" />
      </>
    ),
    "🇪🇨": (
      <>
        <rect width="24" height="8" fill="#ffdd00" />
        <rect y="8" width="24" height="4" fill="#034ea2" />
        <rect y="12" width="24" height="4" fill="#ed1c24" />
        <circle cx="12" cy="8" r="2" fill="#9b6b43" />
      </>
    ),
    "🇵🇾": (
      <>
        <rect width="24" height="5.33" fill="#d52b1e" />
        <rect y="5.33" width="24" height="5.34" fill="#fff" />
        <rect y="10.67" width="24" height="5.33" fill="#0038a8" />
        <circle cx="12" cy="8" r="1.5" fill="#d52b1e" />
      </>
    ),
    "🇺🇾": (
      <>
        <rect width="24" height="16" fill="#fff" />
        <path
          d="M0 2h24v2H0zm0 4h24v2H0zm0 4h24v2H0zm0 4h24v2H0z"
          fill="#75aadb"
        />
        <rect width="10" height="8" fill="#fff" />
        <circle cx="5" cy="4" r="2" fill="#fcd116" />
      </>
    ),
    "🇻🇪": (
      <>
        <rect width="24" height="5.33" fill="#fcd116" />
        <rect y="5.33" width="24" height="5.34" fill="#003893" />
        <rect y="10.67" width="24" height="5.33" fill="#ce1126" />
        <path
          d="M7 8.2a1 1 0 0 0 1.5 0 1 1 0 0 0 1.5 0 1 1 0 0 0 1.5 0 1 1 0 0 0 1.5 0"
          fill="none"
          stroke="#fff"
          strokeWidth=".8"
        />
      </>
    ),
  };

  return (
    <svg
      className="flag-svg"
      viewBox="0 0 24 16"
      role="img"
      aria-label={`Bandera de ${country.name}`}
    >
      {flagShapes[country.flag]}
    </svg>
  );
}

export default function CountrySelector({
  value,
  onChange,
  ariaLabel = "Elegir país",
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="country-code">
      <CountryFlag country={value} />
      <button
        className="country-trigger"
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="country-code-value">{value.code}</span>
        <span className="country-chevron" aria-hidden="true">
          ⌄
        </span>
      </button>
      {open && (
        <div
          className="country-menu"
          role="listbox"
          aria-label="Países disponibles"
        >
          {countries.map((country) => (
            <button
              className="country-option"
              type="button"
              role="option"
              aria-selected={country.code === value.code}
              key={country.code}
              onClick={() => {
                onChange(country);
                setOpen(false);
              }}
            >
              <CountryFlag country={country} />
              <span>{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
