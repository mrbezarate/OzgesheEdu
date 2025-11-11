"use client";

import { startTransition, useEffect, createContext, useContext, useMemo, useState } from "react";

export type Language = "en" | "ru" | "kk";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = "ozgesheedu-lang";

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ru" || stored === "en" || stored === "kk") {
      startTransition(() => {
        setLanguage(stored);
      });
    }
  }, []);

  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const value = useMemo(() => ({ language, setLanguage: updateLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};
