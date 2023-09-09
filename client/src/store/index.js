import { configureStore } from "@reduxjs/toolkit";

import productSlice from "./product.slice";
import categorySlice from "./category.slice";
import cartSlice from "./cart.slice";

const store = configureStore({
  reducer: {
    products: productSlice,
    categories: categorySlice,
    cart: cartSlice,
  },
});

export default store;
