/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

// create initial state for cart as an empty array and cartOpen as false
const initialState = {
  cart: [],
  cartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  // Slice reducers here
  reducers: {
    // this action will trigger when the user clicks the cart button to open the cart drawer
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
    },
    // this action will trigger when the user clicks the add to cart button on a product card
    addToCart(state, action) {
      state.cartOpen = true;
      state.cart = [...state.cart, action.payload.product];
    },
    // this action will trigger when the user clicks the add to cart button on the single product page to add multiple items of the same product to the cart
    addMultipleToCart(state, action) {
      state.cart = [...state.cart, ...action.payload.products];
    },
    // this action will trigger when the user changes the quantity of an item in the cart
    updateCartQuantity(state, action) {
      state.cartOpen = true;
      state.cart = state.cart.map((product) => {
        if (action.payload._id === product._id) {
          product.purchaseQuantity = action.payload.purchaseQuantity;
        }
        return product;
      });
    },
    // this action will trigger when the user clicks the delete button on an item in the cart
    removeFromCart(state, action) {
      const newState = state.cart.filter(
        (product) => product._id !== action.payload._id
      );
      state.cartOpen = newState.length > 0;
      state.cart = newState;
    },
    // this action will trigger when the user clicks the clear cart button in the cart drawer
    clearCart(state) {
      state.cartOpen = false;
      state.cart = [];
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
