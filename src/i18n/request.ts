import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import type { Translations } from "./types";

const localeModules: Record<string, () => Promise<{ default: Translations }>> = {
  de: () => import("./locales/de"),
  en: () => import("./locales/en"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "de" | "en")) {
    locale = routing.defaultLocale;
  }

  const messages = (await localeModules[locale]()).default;

  return {
    locale,
    messages,
  };
});
