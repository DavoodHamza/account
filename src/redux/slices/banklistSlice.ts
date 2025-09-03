import { createSlice } from "@reduxjs/toolkit";
const bankllistSlice = createSlice({
  name: "bankllist",
  initialState: {
    bankllist: [],
  },

  reducers: {
    storeBankList: (state, action) => {
      state.bankllist = action.payload;
    },
    clearBankList: (state, action) => {
      state.bankllist = [];
    },
  },
});

export const { storeBankList, clearBankList } = bankllistSlice.actions;
export default bankllistSlice.reducer;
