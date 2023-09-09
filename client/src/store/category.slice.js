/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

// create initial state for category as an empty array and currentCategory as an empty string
const initialState = {
  categories: [],
  currentCategory: "",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // this action will trigger when the user clicks the category button in the nav bar to open the category drawer
    updateCategories(state, action) {
      state.categories = [...action.payload.categories];
    },
    // this action will trigger when the user clicks a specific category button in the nav bar
    updateCurrentCategory(state, action) {
      state.currentCategory = action.payload.currentCategory;
    },
  },
});

export const categoryActions = categorySlice.actions;

export default categorySlice.reducer;
