import { createSlice } from "@reduxjs/toolkit";
const useBankSlice = createSlice({
  name: "usebank",
  initialState: {
    usebank: [],
  },

  reducers: {
    storeUseBank: (state, action) => {
      state.usebank = action.payload;
    },
    clearUseBank: (state, action) => {
      state.usebank = [];
    },
  },
});

export const { storeUseBank, clearUseBank } = useBankSlice.actions;
export default useBankSlice.reducer;
