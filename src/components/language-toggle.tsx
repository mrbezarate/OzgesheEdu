"use client";

import { Button } from "@/components/ui/button";
import { useLanguage, Language } from "@/components/providers/language-provider";

const options: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "kk", label: "KZ" },
];

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 p-1">
      {options.map((option) => (
        <Button
          key={option.code}
          type="button"
          variant={language === option.code ? "default" : "ghost"}
          className="h-7 px-3 text-xs"
          onClick={() => setLanguage(option.code)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
