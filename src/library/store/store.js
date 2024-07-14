import { configureStore } from "@reduxjs/toolkit";

// reducers
import SideBarReducer from "./sidebar";
import ToastReducer from "./toast";
import AuthenticationReducer from "./authentication";
import positions from "./positions";
import order from "./order";

export const store = configureStore({
  reducer: {
    sidebar: SideBarReducer,
    toast: ToastReducer,
    authentication: AuthenticationReducer,
    positions:positions,
    order:order,
  },
});
