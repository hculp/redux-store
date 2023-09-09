/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useDispatch } from 'react-redux';

import { cartActions } from '../../store/cart.slice';

import { idbPromise } from '../../utils/helpers';

function CartItem({ item }) {
  const dispatch = useDispatch();

  const removeFromCart = itemToRemove => {
    // dispatch the removeFromCart action with the data from the idbPromise
    dispatch(
      cartActions.removeFromCart({
        _id: itemToRemove._id,
      })
    );
    idbPromise('cart', 'delete', {
      ...itemToRemove,
    });
  };

  const onChange = e => {
    const { value } = e.target;
    if (value === '0') {
      // dispatch the removeFromCart action with the data from the idbPromise
      dispatch(
        cartActions.removeFromCart({
          _id: item._id,
        })
      );
      idbPromise('cart', 'delete', {
        ...item,
      });
    } else {
      // dispatch the updateCartQuantity action with the data from the idbPromise
      dispatch(
        cartActions.updateCartQuantity({
          _id: item._id,
          purchaseQuantity: parseInt(value, 10),
        })
      );
      idbPromise('cart', 'put', {
        ...item,
        purchaseQuantity: parseInt(value, 10),
      });
    }
  };

  return (
    <div className="flex-row">
      <div>
        <img src={`/images/${item.image}`} alt="" />
      </div>
      <div>
        <div>
          {item.name}
          , $
          {item.price}
        </div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
