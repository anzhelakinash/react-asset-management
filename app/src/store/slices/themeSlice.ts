import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import config from "../../config/config";

interface CurrentThemeState {
  value: string;
}

const initialState: CurrentThemeState = {
  value: config.themes.defaultTheme,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    selectTheme: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { selectTheme } = themeSlice.actions;
