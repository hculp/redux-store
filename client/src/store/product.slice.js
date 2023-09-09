/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateProducts(state, action) {
      state.products = [...action.payload.products];
    },
  },
});

export const productActions = productSlice.actions;

export default productSlice.reducer;
