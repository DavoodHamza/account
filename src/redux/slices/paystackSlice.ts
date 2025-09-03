import { createSlice } from "@reduxjs/toolkit";
const paystackSlice = createSlice({
  name: "language",
  initialState: {
    data: {},
  },

  reducers: {
    storePaystackData: (state, action) => {
      state.data = action.payload;
    },
    clearPaystack: (state, action) => {
      state.data = {};
    },
  },
});

export const { storePaystackData, clearPaystack } = paystackSlice.actions;
export default paystackSlice.reducer;
