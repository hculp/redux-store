import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_PRODUCTS } from '../graphql/queries';

import { useCartContext } from '../context/CartContext';
import { useProductsContext } from '../context/ProductsContext';

import Cart from '../components/Cart';

import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';

function Detail() {
  const { cart, updateCartQuantity, removeFromCart } = useCartContext();
  const { products, updateProducts } = useProductsContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({
  });

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    } else if (data) {
      updateProducts(data.products);
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get')
        .then(indexedProducts => updateProducts(indexedProducts));
    }
  }, [products, data, loading, id]);

  const addToCart = () => {
    const itemInCart = cart.find(cartItem => cartItem._id === id);
    if (itemInCart) {
      updateCartQuantity(id, parseInt(itemInCart.purchaseQuantity, 10) + 1);
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity, 10) + 1,
      });
    } else {
      addToCart({
        ...currentProduct, purchaseQuantity: 1
      });
      idbPromise('cart', 'put', {
        ...currentProduct, purchaseQuantity: 1
      });
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(currentProduct._id);
    idbPromise('cart', 'delete', {
      ...currentProduct
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
            <strong>Price:</strong>
            $
            {currentProduct.price}
            {' '}
            <button
              type="button"
              onClick={addToCart}
            >
              Add to Cart
            </button>
            <button
              type="button"
              disabled={!cart.find(p => p._id === currentProduct._id)}
              onClick={handleRemoveFromCart}
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
