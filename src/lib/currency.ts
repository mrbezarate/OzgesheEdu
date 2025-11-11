import type { Language } from "@/components/providers/language-provider";

const localeMap: Record<Language, string> = {
  en: "en-US",
  ru: "ru-RU",
  kk: "kk-KZ",
};

export const USD_TO_KZT = 470;

export function formatKzt(amount: number, locale: Language = "en") {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function usdToKzt(amountUsd: number) {
  return Math.round(amountUsd * USD_TO_KZT);
}

export function formatUsdAsKzt(amountUsd: number, locale: Language = "en") {
  return formatKzt(usdToKzt(amountUsd), locale);
}
