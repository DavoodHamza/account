import { createSlice } from "@reduxjs/toolkit";
function updateObject(obj1: any, obj2: any) {
  return { ...obj1, ...obj2 };
}
const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    baseUrl: "",
    user: {},
    token: null,
    auth: false,
    admin: false,
    affiliationCode: "",
    isSalesPerson: false,
    signUpDetails: {
      firstname: "",
      lastname: "",
      password: "",
      country_code: "",
      countryid: "",
      remember: "",
      email: "",
      image: "",
      phonenumber: "",
      mobileverified: 1,
      emailverified: 0,
      status: 1,
      seletedCountry: {},
    },
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.auth = true;
    },
    superAdminLogin: (state, action) => {
      state.user = action.payload;
      state.admin = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setBaseUrl: (state, action) => {
      state.baseUrl = action.payload;
    },
    update: (state, action) => { 
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = {};
      state.auth = false;
      state.admin = false;
      state.token = null;
      state.isSalesPerson = false;
    },
    addSignUpDetails: (state, action) => {
      state.signUpDetails = updateObject(state.signUpDetails, action.payload);
    },
    setAffiliationCode: (state, action) => {
      state.affiliationCode = action.payload;
    },
    salesPersonLogin: (state, action) => {
      state.user = action.payload;
      state.isSalesPerson = true;
    },
  },
});

export const {
  login,
  setToken,
  logout,
  update,
  addSignUpDetails,
  setBaseUrl,
  superAdminLogin,
  setAffiliationCode,
  salesPersonLogin,
} = AuthSlice.actions;
export default AuthSlice.reducer;
