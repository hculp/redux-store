import React from "react";
import { Link } from "react-router-dom";
// import the redux useDispatch and useSelector hooks
import { useDispatch, useSelector } from "react-redux";
// import the cart actions from the redux store
import { cartActions } from "../../store/cart.slice";

import { pluralize, idbPromise } from "../../utils/helpers";

function ProductItem(item) {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const { image, name, _id, price, quantity } = item;

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);
    if (itemInCart) {
      // dispatch the addToCart action with the data from itemInCart
      dispatch(
        cartActions.addToCart({
          _id,
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity, 10) + 1,
        })
      );
      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity, 10) + 1,
      });
    } else {
      // dispatch the addToCart action with the data from item
      dispatch(
        cartActions.addToCart({
          product: {
            ...item,
            purchaseQuantity: 1,
          },
        })
      );
      idbPromise("cart", "put", {
        ...item,
        purchaseQuantity: 1,
      });
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img alt={name} src={`/images/${image}`} />
        <p>{name}</p>
      </Link>
      <div>
        <div>
          {quantity} {pluralize("item", quantity)} in stock
        </div>
        <span>${price}</span>
      </div>
      <button type="button" onClick={addToCart}>
        Add to cart
      </button>
    </div>
  );
}

export default ProductItem;
