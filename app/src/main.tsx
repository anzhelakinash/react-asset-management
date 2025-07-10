import React from "react";
import ReactDOM from "react-dom/client";
import { reportWebVitals } from "@tk/tk-webvitals";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store/store.ts";
import App from "./App.tsx";

import "./css/index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);

reportWebVitals();
