import { themes } from "@tk/tk-themes";

export default {
  siteTitle: "Asset Management",
  api: {
    user: {
      baseUrl: String(import.meta.env.VITE_APP_URL ?? "http://127.0.0.1:8078/"),
      path: String(import.meta.env.VITE_API_USER_ENDPOINT ?? "/api/users/v1"),
    },
  },
  themes: {
    themes: themes,
    defaultTheme: "thyssenkruppLight",
  },
  translations: {
    supportedLocales: { en: true, de: true },
    defaultLocale: "en",
  },
  layout: {
    navbar: {
      position: "left",
      style: "style-1",
    },
  },
};
