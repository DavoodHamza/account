import { createSlice } from "@reduxjs/toolkit";
const businessCategorySlice = createSlice({
  name: "businessCategory",
  initialState: {
    businessCategories: [],
  },

  reducers: {
    storeBusinessCategory: (state, action) => {
      state.businessCategories = action.payload;
    },
    clearBusinessCategory: (state, action) => {
      state.businessCategories = [];
    },
  },
});

export const { storeBusinessCategory, clearBusinessCategory } =
  businessCategorySlice.actions;
export default businessCategorySlice.reducer;
