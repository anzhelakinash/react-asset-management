import "./css/App.css";
import { IntlProvider } from "react-intl";

// TK libraries
import { TkThemeProvider } from "@tk/tk-themes";

// MUI font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { getMessages } from "./intl/messages";
import { AuthProvider } from "./api/auth/TkAuthService";
import Router from "./components/router/Router";
import { useAppSelector } from "./hooks/useAppSelector";

function App() {
  const theme = useAppSelector((state) => state.theme.value);
  const locale = useAppSelector((state) => state.language.value);

  const messages = getMessages(locale);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <TkThemeProvider currentThemeName={theme}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </TkThemeProvider>
    </IntlProvider>
  );
}

export default App;
