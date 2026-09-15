"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type CurrencyCode = "GBP" | "USD" | "EUR";

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
  flag: string;
  shortName: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyOption> = {
  GBP: {
    code: "GBP",
    symbol: "£",
    rate: 1.0,
    label: "United Kingdom (GBP £)",
    flag: "🇬🇧",
    shortName: "GB",
  },
  USD: {
    code: "USD",
    symbol: "$",
    rate: 1.28,
    label: "United States (USD $)",
    flag: "🇺🇸",
    shortName: "US",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    rate: 1.17,
    label: "European Union (EUR €)",
    flag: "🇪🇺",
    shortName: "EU",
  },
};

export const SUPPORTED_CURRENCIES: CurrencyOption[] = Object.values(CURRENCIES);

interface CurrencyContextType {
  currency: CurrencyOption;
  currencyCode: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInGBP: number, decimals?: number) => string;
  convertPrice: (amountInGBP: number) => number;
  availableCurrencies: CurrencyOption[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>("GBP");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("bhai_currency_v1") as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        setCurrencyCodeState(saved);
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    if (!CURRENCIES[code]) return;
    setCurrencyCodeState(code);
    try {
      localStorage.setItem("bhai_currency_v1", code);
      document.cookie = `bhai_currency=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch {
      // Ignore
    }
  }, []);

  const currency = CURRENCIES[currencyCode] || CURRENCIES.GBP;

  const convertPrice = useCallback(
    (amountInGBP: number) => {
      const rate = currency.rate;
      return Number((amountInGBP * rate).toFixed(2));
    },
    [currency.rate]
  );

  const formatPrice = useCallback(
    (amountInGBP: number, decimals = 2) => {
      if (typeof amountInGBP !== "number" || isNaN(amountInGBP)) return `${currency.symbol}0.00`;
      const converted = amountInGBP * currency.rate;
      return `${currency.symbol}${converted.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    },
    [currency.rate, currency.symbol]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyCode,
        setCurrency,
        formatPrice,
        convertPrice,
        availableCurrencies: Object.values(CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      currency: CURRENCIES.GBP,
      currencyCode: "GBP" as CurrencyCode,
      setCurrency: () => {},
      formatPrice: (amt: number, dec = 2) => `£${amt.toFixed(dec)}`,
      convertPrice: (amt: number) => amt,
      availableCurrencies: Object.values(CURRENCIES),
    };
  }
  return context;
}
