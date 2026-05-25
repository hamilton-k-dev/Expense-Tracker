"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type Locale, type TKey, getTranslations } from "@/lib/i18n";

type UserPreferencesContextValue = {
  currency: string;
  setCurrency: (c: string) => void;
  language: Locale;
  setLanguage: (l: Locale) => void;
  t: (key: TKey, vars?: Record<string, string>) => string;
};

const UserPreferencesContext = createContext<UserPreferencesContextValue>({
  currency: "USD",
  setCurrency: () => {},
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function UserPreferencesProvider({
  initialCurrency,
  initialLocale,
  children,
}: {
  initialCurrency: string;
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState(initialCurrency);
  const [language, setLanguageState] = useState<Locale>(initialLocale);

  // Sync if server prop changes (e.g. navigation after cookie update)
  useEffect(() => {
    setCurrencyState(initialCurrency);
  }, [initialCurrency]);

  useEffect(() => {
    setLanguageState(initialLocale);
  }, [initialLocale]);

  const setCurrency = useCallback((c: string) => setCurrencyState(c), []);

  const setLanguage = useCallback((l: Locale) => {
    setLanguageState(l);
    // Store in cookie (server can read) + localStorage (fallback)
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("language", l);
  }, []);

  const t = useCallback(
    (key: TKey, vars?: Record<string, string>) => getTranslations(language)(key, vars),
    [language]
  );

  return (
    <UserPreferencesContext.Provider value={{ currency, setCurrency, language, setLanguage, t }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  return useContext(UserPreferencesContext);
}
