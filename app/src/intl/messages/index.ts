import { tkDefaultMessages } from "@tk/tk-intl";
import de from "./languages/de";
import en from "./languages/en";
import config from "../../config/config";

type SupportedLocale = keyof typeof config.translations.supportedLocales;
interface Language {
  languageName: string;
  flag: string;
}

const messages = {
  ...tkDefaultMessages, // Load default translations for all languages
  de, // Overwrite German translations
  en, // Overwrite English translations
};

function getDefaultLocale() {
  return config.translations.defaultLocale as SupportedLocale;
}

function getMessages(locale: string) {
  let chosenLocale;

  if (isLocaleSupported(locale)) {
    chosenLocale = locale;
  } else {
    chosenLocale = config.translations.defaultLocale as SupportedLocale;
  }

  return messages[chosenLocale];
}

function getAllLanguages(): Record<string, Language> {
  const output: Record<string, Language> = {};

  for (const locale in messages) {
    if (!isLocaleSupported(locale)) continue;

    output[locale] = {
      languageName: messages[locale].languageName,
      flag: messages[locale].flag,
    };
  }

  return output;
}

function isLocaleSupported(locale: string): locale is SupportedLocale {
  return isLocaleInMessages(locale) && isLocaleInSupported(locale);
}

function isLocaleInMessages(locale: string) {
  return locale in messages;
}

function isLocaleInSupported(locale: string) {
  return locale in config.translations.supportedLocales;
}

export {
  messages,
  getMessages,
  getAllLanguages,
  isLocaleSupported,
  getDefaultLocale,
  type SupportedLocale,
};
