import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
// import the useDispatch and useSelector hooks from react-redux to handle store actions and state
import { useDispatch, useSelector } from "react-redux";

import { QUERY_PRODUCTS } from "../graphql/queries";

// import the cart and product actions from the redux store
import { cartActions } from "../store/cart.slice";
import { productActions } from "../store/product.slice";

import Cart from "../components/Cart";

import { idbPromise } from "../utils/helpers";
import spinner from "../assets/spinner.gif";

function Detail() {
  // initialize dispatch and selector hooks
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const productState = useSelector((state) => state.products);
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // destructure cart and products from the global state
  const { cart } = cartState;
  const { products } = productState;

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    } else if (data) {
      // dispatch the updateProducts action with the data from the query
      dispatch(
        productActions.updateProducts({
          products: data.products,
        })
      );

      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
    } else if (!loading) {
      idbPromise("products", "get").then((indexedProducts) => {
        // dispatch the updateProducts action with the data from the idbPromise
        dispatch(
          productActions.updateProducts({
            products: indexedProducts,
          })
        );
      });
    }
    // add products, data, loading, dispatch, and id to the dependency array
    // when the values of these variables change, the useEffect callback function will run again
    // dispatch is added to the dependency array because it is handling our store actions
  }, [products, data, loading, dispatch, id]);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      // dispatch the updateCartQuantity action with the id and purchaseQuantity of item in the cart
      dispatch(
        cartActions.updateCartQuantity({
          _id: id,
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity, 10) + 1,
        })
      );

      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity, 10) + 1,
      });
    } else {
      // dispatch the addToCart action with the currentProduct and a purchaseQuantity of 1
      dispatch(
        cartActions.addToCart({
          product: {
            ...currentProduct,
            purchaseQuantity: 1,
          },
        })
      );
      idbPromise("cart", "put", {
        ...currentProduct,
        purchaseQuantity: 1,
      });
    }
  };

  const removeFromCart = () => {
    // dispatch the removeFromCart action with the id of the currentProduct
    dispatch(
      cartActions.removeFromCart({
        _id: currentProduct._id,
      })
    );
    idbPromise("cart", "delete", {
      ...currentProduct,
    });
  };

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{" "}
            <button type="button" onClick={addToCart}>
              Add to Cart
            </button>
            <button
              type="button"
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
