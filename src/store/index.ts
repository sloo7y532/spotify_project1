import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import musicReducer from "./slices/musicSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    music: musicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
