import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
// import the useDispatch and useSelector hooks from react-redux to handle store actions and state
import { useDispatch, useSelector } from 'react-redux';

import { QUERY_PRODUCTS } from '../../graphql/queries';

// import the product actions from the redux store
import { productActions } from '../../store/product.slice';

import ProductItem from '../ProductItem';

import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);
  const { currentCategory } = useSelector(state => state.categories);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      // dispatch the updateProducts action with the data from queried products
      dispatch(
        productActions.updateProducts({
          products: data.products,
        })
      );

      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then(savedProducts => {
        // dispatch the updateProducts action with the data from the idbPromise
        dispatch(
          productActions.updateProducts({
            products: savedProducts,
          })
        );
      });
    }
    // add dispatch to the dependency array so that state changees call useEffect again
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(
      product => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map(product => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven&apos;t added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
