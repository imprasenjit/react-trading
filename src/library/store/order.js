import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getMethod, postMethod } from "../api";

import { routes } from "../constant";

const initialState = {
  values: []
};

export const getOrders = createAsyncThunk(
  "orders",
  async () => {
    const response = await getMethod(routes.orders);
    return response;
  }
);
export const placeOrder = createAsyncThunk(
  "orders",
  async (orderObj) => {
    const response = await postMethod(routes.orders,orderObj);
    return response;
  }
);

export const positionsSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
  },
  extraReducers: {
    [getOrders.fulfilled]: (state, action) => {
      state.values= action.payload;
    },
  },
});


export default positionsSlice.reducer;
