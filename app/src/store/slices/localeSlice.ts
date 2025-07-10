import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  SupportedLocale,
  getDefaultLocale,
  isLocaleSupported,
} from "../../intl/messages";

interface CurrentLocaleState {
  value: SupportedLocale;
}

const initialState: CurrentLocaleState = {
  value: getDefaultLocale(),
};

export const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    selectLocale: (state, action: PayloadAction<string>) => {
      const locale = action.payload;

      if (isLocaleSupported(locale)) {
        state.value = locale;
      }
    },
  },
});

export const { selectLocale: selectLocale } = localeSlice.actions;
