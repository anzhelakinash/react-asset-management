import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./slices/themeSlice";
import { localeSlice } from "./slices/localeSlice";
import { navbarSlice } from "./slices/navbarSlice";
import assetReducer from "./slices/assetSlice";
import userReducer from "./slices/userSlice";


export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    language: localeSlice.reducer,
    navbar: navbarSlice.reducer,
    assets: assetReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
