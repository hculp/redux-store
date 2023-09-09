import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { QUERY_PRODUCTS } from '../../graphql/queries';

import { useProductsContext } from '../../context/ProductsContext';
import { useCategoriesContext } from '../../context/CategoriesContext';

import ProductItem from '../ProductItem';

import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  const { products, updateProducts } = useProductsContext();
  const { currentCategory } = useCategoriesContext();

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      updateProducts(data.products);
      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get')
        .then(savedProducts => updateProducts(savedProducts));
    }
  }, [data, loading]);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(product => product.category._id === currentCategory);
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
