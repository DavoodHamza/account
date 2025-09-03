import { createSlice } from "@reduxjs/toolkit";
const countrySlice = createSlice({
  name: "country",
  initialState: {
    countries: [],
  },

  reducers: {
    storeCountries: (state, action) => {
      state.countries = action.payload;
    },
    clearCountries: (state, action) => {
      state.countries = [];
    },
  },
});

export const { storeCountries, clearCountries } = countrySlice.actions;
export default countrySlice.reducer;
