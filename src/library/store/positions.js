import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getMethod } from "../api";

import { routes } from "../constant";

const initialState = {
  value: {
    positions:[
      {
        "dhanClientId": "1102593228",
        "tradingSymbol": "BANKNIFTY-Jul2024-52800-PE",
        "securityId": "55231",
        "positionType": "CLOSED",
        "exchangeSegment": "NSE_FNO",
        "productType": "MARGIN",
        "buyAvg": 470.63126,
        "costPrice": 470.63126,
        "buyQty": 480,
        "sellAvg": 475.85782,
        "sellQty": 480,
        "netQty": 0,
        "realizedProfit": 2508.75,
        "unrealizedProfit": 3271.1265,
        "rbiReferenceRate": 1,
        "multiplier": 1,
        "carryForwardBuyQty": 0,
        "carryForwardSellQty": 0,
        "carryForwardBuyValue": 0,
        "carryForwardSellValue": 0,
        "dayBuyQty": 480,
        "daySellQty": 480,
        "dayBuyValue": 225903,
        "daySellValue": 228411.75,
        "drvExpiryDate": "2024-07-10 14:30:00",
        "drvOptionType": "PUT",
        "drvStrikePrice": 52800,
        "crossCurrency": false
      },
      {
        "dhanClientId": "1102593228",
        "tradingSymbol": "BANKNIFTY-Jul2024-52600-PE",
        "securityId": "55227",
        "positionType": "OPEN",
        "exchangeSegment": "NSE_FNO",
        "productType": "MARGIN",
        "buyAvg": 396.13437,
        "costPrice": 396.13437,
        "buyQty": 240,
        "sellAvg": 395.725,
        "sellQty": 240,
        "netQty": 0,
        "realizedProfit": -9898.25,
        "unrealizedProfit": -572.06213,
        "rbiReferenceRate": 1,
        "multiplier": 1,
        "carryForwardBuyQty": 0,
        "carryForwardSellQty": 0,
        "carryForwardBuyValue": 0,
        "carryForwardSellValue": 0,
        "dayBuyQty": 240,
        "daySellQty": 240,
        "dayBuyValue": 95072.25,
        "daySellValue": 94974,
        "drvExpiryDate": "2024-07-10 14:30:00",
        "drvOptionType": "PUT",
        "drvStrikePrice": 52600,
        "crossCurrency": false
      },
      {
        "dhanClientId": "1102593228",
        "tradingSymbol": "BANKNIFTY-Jul2024-52200-CE",
        "securityId": "55214",
        "positionType": "CLOSED",
        "exchangeSegment": "NSE_FNO",
        "productType": "MARGIN",
        "buyAvg": 409.85455,
        "costPrice": 409.85455,
        "buyQty": 330,
        "sellAvg": 417.65454,
        "sellQty": 330,
        "netQty": 0,
        "realizedProfit": 2574,
        "unrealizedProfit": 733.3633,
        "rbiReferenceRate": 1,
        "multiplier": 1,
        "carryForwardBuyQty": 0,
        "carryForwardSellQty": 0,
        "carryForwardBuyValue": 0,
        "carryForwardSellValue": 0,
        "dayBuyQty": 330,
        "daySellQty": 330,
        "dayBuyValue": 135252,
        "daySellValue": 137826,
        "drvExpiryDate": "2024-07-10 14:30:00",
        "drvOptionType": "CALL",
        "drvStrikePrice": 52200,
        "crossCurrency": false
      }
    ],
  },
};

export const getPositions = createAsyncThunk(
  "positions",
  async () => {
    const response = await getMethod(routes.positions);
    return response;
  }
);

export const positionsSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {
  },
  extraReducers: {
    [getPositions.fulfilled]: (state, action) => {
      state.value.positions = action.payload;
    },
  },
});


export default positionsSlice.reducer;
