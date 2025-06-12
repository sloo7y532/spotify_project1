import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedPlan: null as string | null,
};

const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    selectPlan(state, action: PayloadAction<string>) {
      state.selectedPlan = action.payload;
    },
  },
});

export const { selectPlan } = premiumSlice.actions;
export default premiumSlice.reducer;
