import { createSlice } from "@reduxjs/toolkit";
const endofyearSlice = createSlice({
  name: "endofyear",
  initialState: {
    process1: true,
    process2: true,
    process3: true,
    process4: true,
    process5: true,
    progress: 0,
    newAdminId: null,
    data:{}
  },

  reducers: {
    updateprogress1: (state, action) => {
      state.process1 = action.payload;
      state.progress = 20;
    },
    updateprogress2: (state, action) => {
      state.process2 = action.payload;
      state.progress = 40;
    },
    updateprogress3: (state, action) => {
      state.process3 = action.payload;
      state.progress = 60;
    },
    updateprogress4: (state, action) => {
      state.process4 = action.payload;
      state.progress = 80;
    },
    updateprogress5: (state, action) => {
      state.process5 = action.payload;
      state.progress = 90;
    },
    completeprogress: (state, action) => {
      state.progress = 100;
    },
    setNewAdminId: (state, action) => {
      state.newAdminId = action.payload;
    },
    setResponse: (state, action) => {
      state.data = action.payload;
    },

    clearendofyear: (state, action) => {
      state.process1 = true;
      state.process2 = true;
      state.process3 = true;
      state.process4 = true;
      state.process5 = true;
      state.progress = 0;
      state.newAdminId = null;
    },
  },
});

export const {
  updateprogress1,
  updateprogress2,
  updateprogress3,
  updateprogress4,
  updateprogress5,
  setNewAdminId,
  setResponse,
  completeprogress,
  clearendofyear,
} = endofyearSlice.actions;
export default endofyearSlice.reducer;
