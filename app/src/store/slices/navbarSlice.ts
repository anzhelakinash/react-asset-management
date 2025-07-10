import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CurrentLocaleState {
  isOpen: boolean;
}

const initialState: CurrentLocaleState = {
  isOpen: false,
};

export const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    toggleNavbar: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { toggleNavbar } = navbarSlice.actions;
