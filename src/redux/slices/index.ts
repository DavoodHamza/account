import { combineReducers } from "@reduxjs/toolkit";
import UserSlice from "./userSlice";
import businessCategorySlice from "./businessCategorySlice";
import countriesSlice from "./countriesSlice";
import banklistSlice from "./banklistSlice";
import useBankSlice from "./useBank";
import languageSlice from "./languageSlice";
import retailExpress from "./retailExpress";
import endofyearSlice from "./endofyearSlice";
import TempSlice from "./temp";
import paystackSlice from "./paystackSlice";

const Slices = combineReducers({
  User: UserSlice,
  Businesscategory: businessCategorySlice,
  Country: countriesSlice,
  banklist: banklistSlice,
  usebank: useBankSlice,
  language: languageSlice,
  retailExpress: retailExpress,
  endofyear: endofyearSlice,
  temp:TempSlice,
  paystack:paystackSlice,
});
export default Slices;
