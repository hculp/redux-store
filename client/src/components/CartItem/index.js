/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import { useCartContext } from '../../context/CartContext';

import { idbPromise } from '../../utils/helpers';

function CartItem({ item }) {
  const { removeFromCart, updateCartQuantity } = useCartContext();

  const handleRemoveFromCart = itemToRemove => {
    removeFromCart(itemToRemove._id);
    idbPromise('cart', 'delete', {
      ...itemToRemove
    });
  };

  const onChange = e => {
    const { value } = e.target;
    if (value === '0') {
      removeFromCart(item._id);
      idbPromise('cart', 'delete', {
        ...item
      });
    } else {
      updateCartQuantity(item._id, parseInt(value, 10));
      idbPromise('cart', 'put', {
        ...item, purchaseQuantity: parseInt(value, 10)
      });
    }
  };

  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
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
            onClick={() => handleRemoveFromCart(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
