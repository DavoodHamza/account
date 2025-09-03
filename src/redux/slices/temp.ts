import { createSlice } from "@reduxjs/toolkit";
const TempSlice = createSlice({
  name: "temp",
  initialState: {
    productComposite: [],
  },
  reducers: {
    addCompsite: (state, action) => {
      state.productComposite = action.payload;
    },
  },
});

export const { addCompsite } = TempSlice.actions;
export default TempSlice.reducer;
