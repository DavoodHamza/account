import { createSlice } from "@reduxjs/toolkit";
const languageSlice = createSlice({
  name: "language",
  initialState: {
    direction: "LTR",
  },

  reducers: {
    storeDirection: (state, action) => {
      state.direction = action.payload;
    },
  },
});

export const { storeDirection } = languageSlice.actions;
export default languageSlice.reducer;