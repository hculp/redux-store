import React, {
  createContext,
  useContext,
  useState,
  useMemo
} from 'react';

export const CategoriesContext = createContext();

export const useCategoriesContext = () => useContext(CategoriesContext);

const initialState = {
  categories: [],
  currentCategory: '',
};

export default function CategoriesContextProvider({ children }) {
  const [categoriesState, setCategoriesState] = useState(initialState);

  function updateCategories(categories) {
    setCategoriesState({
      ...categoriesState,
      categories
    });
  }

  function updateCurrentCategory(category) {
    setCategoriesState({
      ...categoriesState,
      currentCategory: category
    });
  }

  const value = useMemo(() => ({
    ...categoriesState,
    updateCategories,
    updateCurrentCategory
  }), [categoriesState]);

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}
