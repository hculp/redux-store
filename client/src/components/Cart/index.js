/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLazyQuery } from "@apollo/client";
// import the useDispatch and useSelector hooks from react-redux to handle store actions and state
import { useDispatch, useSelector } from "react-redux";

import { QUERY_CHECKOUT } from "../../graphql/queries";
// import the cart actions from the redux store
import { cartActions } from "../../store/cart.slice";

import CartItem from "../CartItem";

import { idbPromise } from "../../utils/helpers";
import Auth from "../../utils/auth";

import "./style.css";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

function Cart() {
  // initialize the dispatch function and the cart and cartOpen state variables from the redux store
  const dispatch = useDispatch();
  const { cart, cartOpen } = useSelector((state) => state.cart);
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({
          sessionId: data.checkout.session,
        });
      });
    }
  }, [data]);

  useEffect(() => {
    // Solution for double rendering from react docs
    // https://beta.reactjs.org/learn/synchronizing-with-effects#fetching-data
    let ignore = false;
    async function getCart() {
      const savedCart = await idbPromise("cart", "get");
      if (!ignore) {
        // dispatch the addMultipleToCart action with the data from the idbPromise
        dispatch(
          cartActions.addMultipleToCart({
            products: [...savedCart],
          })
        );
      }
    }

    if (cart.length === 0) {
      getCart();
    }

    return () => {
      ignore = true;
    };
  }, [cart.length]);

  // a toggleCart function that dispatches the toggleCart action
  function toggleCart() {
    dispatch(cartActions.toggleCart());
  }

  function calculateTotal() {
    let sum = 0;
    cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];

    cart.forEach((item) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: {
        products: productIds,
      },
    });
  }

  if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {cart.length ? (
        <div>
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button type="button" onClick={submitCheckout}>
                Checkout
              </button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven&apos;t added anything to your cart yet!
        </h3>
      )}
    </div>
  );
}

export default Cart;
