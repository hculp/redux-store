import React, {
  createContext,
  useContext,
  useState,
  useMemo
} from 'react';

export const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

const initialState = {
  cart: [],
  cartOpen: false
};

export default function CartContextProvider({ children }) {
  const [cartState, setCartState] = useState(initialState);

  function toggleCart() {
    setCartState({
      ...cartState,
      cartOpen: !cartState.cartOpen
    });
  }

  function addToCart(product) {
    setCartState({
      ...cartState,
      cartOpen: true,
      cart: [...cartState.cart, product]
    });
  }

  function addMultipleToCart(products) {
    setCartState({
      ...cartState,
      cart: [...cartState.cart, ...products]
    });
  }

  function updateCartQuantity(_id, quantity) {
    setCartState({
      ...cartState,
      cart: cartState.cart.map(product => {
        if (product._id === _id) {
          // eslint-disable-next-line no-param-reassign
          product.purchaseQuantity = quantity;
        }
        return product;
      })
    });
  }

  function removeCartProduct(_id) {
    setCartState({
      ...cartState,
      cartOpen: cartState.cart.length > 1,
      cart: cartState.cart.filter(product => product._id !== _id)
    });
  }

  function clearCart() {
    setCartState({
      ...cartState,
      cartOpen: false,
      cart: []
    });
  }

  const value = useMemo(() => ({
    ...cartState,
    toggleCart,
    addToCart,
    addMultipleToCart,
    updateCartQuantity,
    removeCartProduct,
    clearCart
  }), [cartState]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
