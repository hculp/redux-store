import React, {
  createContext,
  useContext,
  useState,
  useMemo
} from 'react';

export const ProductsContext = createContext();

export const useProductsContext = () => useContext(ProductsContext);

const initialState = {
  products: [],
};

export default function ProductsContextProvider({ children }) {
  const [productsState, setProductsState] = useState(initialState);

  function updateProducts(newProducts) {
    setProductsState({
      ...newProducts, products: newProducts
    });
  }

  const value = useMemo(() => ({
    ...productsState,
    updateProducts
  }), [productsState]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
